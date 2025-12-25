const { Repository } = require('../models/repo.model.js');
const { Commit } = require('../models/commit.model.js');
const { ExpressError } = require('../utils/ExpressError.js');
const { WrapAsync } = require('../utils/WrapAsync.js');
const { supabase } = require('../config/supabaseClient.js');
const { v4: uuidv4 } = require('uuid');

const bucketName = 'commits';

// Initialize repository (create .devtrack structure)
const initRepo = WrapAsync(async (req, res) => {
    const { repoId } = req.params;
    const userId = req.user.id;

    const repo = await Repository.findById(repoId);
    if (!repo) {
        throw new ExpressError(404, "Repository not found");
    }

    if (repo.owner.toString() !== userId) {
        throw new ExpressError(403, "You don't have permission to initialize this repository");
    }

    // Check if already initialized
    if (repo.initialized) {
        return res.status(200).json({ message: "Repository already initialized", repoId: repo._id });
    }

    repo.initialized = true;
    await repo.save();

    res.status(200).json({ message: "Repository initialized successfully", repoId: repo._id });
});

// Add files to staging
const addFiles = WrapAsync(async (req, res) => {
    const { repoId } = req.params;
    const { files } = req.body; // Array of {filename, content}
    const userId = req.user.id;

    if (!files || !Array.isArray(files) || files.length === 0) {
        throw new ExpressError(400, "Files array is required");
    }

    const repo = await Repository.findById(repoId);
    if (!repo) {
        throw new ExpressError(404, "Repository not found");
    }

    if (repo.owner.toString() !== userId) {
        throw new ExpressError(403, "You don't have permission to add files to this repository");
    }

    // Store staged files in repository (or create a staging area)
    if (!repo.stagedFiles) {
        repo.stagedFiles = [];
    }

    // Add or update files in staging
    files.forEach(file => {
        const existingIndex = repo.stagedFiles.findIndex(f => f.filename === file.filename);
        if (existingIndex >= 0) {
            repo.stagedFiles[existingIndex] = file;
        } else {
            repo.stagedFiles.push(file);
        }
    });

    await repo.save();

    res.status(200).json({ 
        message: `${files.length} file(s) added to staging area`,
        stagedFiles: repo.stagedFiles 
    });
});

// Commit staged files
const commitFiles = WrapAsync(async (req, res) => {
    const { repoId } = req.params;
    const { message } = req.body;
    const userId = req.user.id;

    if (!message || !message.trim()) {
        throw new ExpressError(400, "Commit message is required");
    }

    const repo = await Repository.findById(repoId);
    if (!repo) {
        throw new ExpressError(404, "Repository not found");
    }

    if (repo.owner.toString() !== userId) {
        throw new ExpressError(403, "You don't have permission to commit to this repository");
    }

    if (!repo.stagedFiles || repo.stagedFiles.length === 0) {
        throw new ExpressError(400, "No files staged for commit");
    }

    const commitId = uuidv4();
    const commit = new Commit({
        commitId,
        message: message.trim(),
        repository: repoId,
        author: userId,
        files: repo.stagedFiles.map(f => ({
            filename: f.filename,
            content: f.content,
            path: f.path || f.filename
        })),
        date: new Date()
    });

    await commit.save();

    // Clear staged files
    repo.stagedFiles = [];
    await repo.save();

    res.status(201).json({
        message: "Commit created successfully",
        commit: {
            commitId: commit.commitId,
            message: commit.message,
            date: commit.date,
            filesCount: commit.files.length
        }
    });
});

// Get commit log
const getCommitLog = WrapAsync(async (req, res) => {
    const { repoId } = req.params;

    const repo = await Repository.findById(repoId);
    if (!repo) {
        throw new ExpressError(404, "Repository not found");
    }

    const commits = await Commit.find({ repository: repoId })
        .populate('author', 'username email')
        .sort({ date: -1 });

    res.status(200).json({
        commits: commits.map(commit => ({
            commitId: commit.commitId,
            message: commit.message,
            date: commit.date,
            author: commit.author,
            filesCount: commit.files.length
        }))
    });
});

// Push commits to Supabase
const pushCommits = WrapAsync(async (req, res) => {
    const { repoId } = req.params;
    const userId = req.user.id;

    const repo = await Repository.findById(repoId);
    if (!repo) {
        throw new ExpressError(404, "Repository not found");
    }

    if (repo.owner.toString() !== userId) {
        throw new ExpressError(403, "You don't have permission to push to this repository");
    }

    const commits = await Commit.find({ repository: repoId });

    if (commits.length === 0) {
        return res.status(200).json({ message: "No commits to push" });
    }

    let uploadedCount = 0;
    let errorCount = 0;

    for (const commit of commits) {
        for (const file of commit.files) {
            try {
                const filePath = `${repoId}/${commit.commitId}/${file.filename}`;
                const fileBuffer = Buffer.from(file.content, 'utf-8');

                const { data, error } = await supabase.storage
                    .from(bucketName)
                    .upload(filePath, fileBuffer, { upsert: true });

                if (error) {
                    console.error(`Failed to upload ${file.filename}:`, error.message);
                    errorCount++;
                } else {
                    uploadedCount++;
                }
            } catch (err) {
                console.error(`Error uploading ${file.filename}:`, err.message);
                errorCount++;
            }
        }
    }

    res.status(200).json({
        message: "Push completed",
        uploaded: uploadedCount,
        errors: errorCount,
        totalCommits: commits.length
    });
});

// Pull commits from Supabase
const pullCommits = WrapAsync(async (req, res) => {
    const { repoId } = req.params;
    const userId = req.user.id;

    const repo = await Repository.findById(repoId);
    if (!repo) {
        throw new ExpressError(404, "Repository not found");
    }

    if (repo.owner.toString() !== userId) {
        throw new ExpressError(403, "You don't have permission to pull from this repository");
    }

    try {
        // List all files in the repository folder
        const { data: files, error: listError } = await supabase.storage
            .from(bucketName)
            .list(repoId, { limit: 1000 });

        if (listError) {
            throw new ExpressError(500, `Failed to list files: ${listError.message}`);
        }

        if (!files || files.length === 0) {
            return res.status(200).json({ message: "No commits found in remote storage" });
        }

        // Get all commit directories
        const commitDirs = files.filter(f => !f.metadata); // Directories don't have metadata

        let pulledCount = 0;

        for (const commitDir of commitDirs) {
            const commitPath = `${repoId}/${commitDir.name}`;
            
            // List files in this commit directory
            const { data: commitFiles, error: commitListError } = await supabase.storage
                .from(bucketName)
                .list(commitPath, { limit: 1000 });

            if (commitListError) continue;

            // Check if commit already exists
            const existingCommit = await Commit.findOne({ 
                commitId: commitDir.name,
                repository: repoId 
            });

            if (existingCommit) continue; // Skip if already exists

            // Download files and create commit
            const commitFilesData = [];
            for (const file of commitFiles) {
                if (file.metadata) { // It's a file
                    const filePath = `${commitPath}/${file.name}`;
                    const { data: fileData, error: downloadError } = await supabase.storage
                        .from(bucketName)
                        .download(filePath);

                    if (!downloadError && fileData) {
                        const content = await fileData.text();
                        commitFilesData.push({
                            filename: file.name,
                            content: content,
                            path: file.name
                        });
                    }
                }
            }

            if (commitFilesData.length > 0) {
                // Create commit (you might want to store commit message separately)
                const commit = new Commit({
                    commitId: commitDir.name,
                    message: `Pulled from remote - ${commitDir.name}`,
                    repository: repoId,
                    author: userId,
                    files: commitFilesData,
                    date: new Date(commitDir.created_at || new Date())
                });

                await commit.save();
                pulledCount++;
            }
        }

        res.status(200).json({
            message: "Pull completed",
            pulledCommits: pulledCount
        });
    } catch (error) {
        throw new ExpressError(500, `Failed to pull: ${error.message}`);
    }
});

// Get staged files
const getStagedFiles = WrapAsync(async (req, res) => {
    const { repoId } = req.params;

    const repo = await Repository.findById(repoId);
    if (!repo) {
        throw new ExpressError(404, "Repository not found");
    }

    res.status(200).json({
        stagedFiles: repo.stagedFiles || []
    });
});

module.exports = {
    initRepo,
    addFiles,
    commitFiles,
    getCommitLog,
    pushCommits,
    pullCommits,
    getStagedFiles
};

