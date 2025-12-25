const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const REPO_DIR = '.devtrack';
const CONFIG_FILE = 'config.json';
const STAGING_DIR = 'staging';
const COMMITS_DIR = 'commits';
const HEAD_FILE = 'HEAD';

async function getRepoPath() {
    // Use the original working directory, not the backend directory
    const currentDir = process.cwd();
    
    // If we're in the backend directory, that's wrong - user should be in their project
    if (currentDir.includes('backend') && currentDir.endsWith('backend')) {
        // This shouldn't happen, but if it does, warn the user
        return null;
    }
    
    const repoPath = path.join(currentDir, REPO_DIR);
    
    // Check if we're in a repo
    try {
        await fs.access(repoPath);
        return repoPath;
    } catch {
        // Not in a repo, return null
        return null;
    }
}

async function findRepoPath() {
    // Get current working directory (should be user's project directory)
    let currentDir = process.cwd();
    
    // Safety check - don't allow operations in backend directory
    if (currentDir.includes('backend') && (currentDir.endsWith('backend') || currentDir.endsWith('backend\\'))) {
        return null;
    }
    
    const root = path.parse(currentDir).root;
    
    while (currentDir !== root) {
        const repoPath = path.join(currentDir, REPO_DIR);
        try {
            await fs.access(repoPath);
            return repoPath;
        } catch {
            currentDir = path.dirname(currentDir);
        }
    }
    
    return null;
}

async function initRepo() {
    // Get current working directory (should be user's project directory)
    const currentDir = process.cwd();
    
    // Safety check - don't initialize in backend directory
    if (currentDir.includes('backend') && (currentDir.endsWith('backend') || currentDir.endsWith('backend\\'))) {
        throw new Error('Cannot initialize repository in the backend directory. Please run this command in your project directory.');
    }
    
    const repoPath = path.join(currentDir, REPO_DIR);
    
    try {
        await fs.mkdir(repoPath, { recursive: true });
        await fs.mkdir(path.join(repoPath, STAGING_DIR), { recursive: true });
        await fs.mkdir(path.join(repoPath, COMMITS_DIR), { recursive: true });
        
        const config = {
            repoId: null,
            remote: null,
            initialized: true,
            createdAt: new Date().toISOString()
        };
        
        await fs.writeFile(
            path.join(repoPath, CONFIG_FILE),
            JSON.stringify(config, null, 2)
        );
        
        await fs.writeFile(
            path.join(repoPath, HEAD_FILE),
            'master'
        );
        
        return repoPath;
    } catch (error) {
        throw new Error(`Failed to initialize repository: ${error.message}`);
    }
}

async function getConfig() {
    const repoPath = await findRepoPath();
    if (!repoPath) {
        return null;
    }
    
    try {
        const configPath = path.join(repoPath, CONFIG_FILE);
        const data = await fs.readFile(configPath, 'utf-8');
        return JSON.parse(data);
    } catch {
        return null;
    }
}

async function saveConfig(config) {
    const repoPath = await findRepoPath();
    if (!repoPath) {
        throw new Error('Not in a repository. Run "devtrack init" first.');
    }
    
    const configPath = path.join(repoPath, CONFIG_FILE);
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));
}

async function setRemote(remoteUrl) {
    const config = await getConfig();
    if (!config) {
        throw new Error('Not in a repository. Run "devtrack init" first.');
    }
    
    // Extract repo ID from URL or use as-is
    let repoId = remoteUrl;
    if (remoteUrl.includes('/repo/')) {
        repoId = remoteUrl.split('/repo/')[1].split('/')[0];
    }
    
    config.remote = repoId;
    await saveConfig(config);
    return repoId;
}

async function getRemote() {
    const config = await getConfig();
    return config?.remote || null;
}

async function addToStaging(filePath) {
    const repoPath = await findRepoPath();
    if (!repoPath) {
        throw new Error('Not in a repository. Run "devtrack init" first.');
    }
    
    // Get current working directory (should be user's project directory)
    const currentDir = process.cwd();
    
    // Safety check
    if (currentDir.includes('backend') && (currentDir.endsWith('backend') || currentDir.endsWith('backend\\'))) {
        throw new Error('Cannot add files from backend directory. Please run this command in your project directory.');
    }
    
    const fullPath = path.resolve(currentDir, filePath);
    
    // Check if file exists
    try {
        await fs.access(fullPath);
    } catch {
        throw new Error(`File not found: ${filePath}`);
    }
    
    const fileName = path.basename(filePath);
    const stagingPath = path.join(repoPath, STAGING_DIR, fileName);
    
    try {
        await fs.copyFile(fullPath, stagingPath);
        return fileName;
    } catch (error) {
        throw new Error(`Failed to add file: ${error.message}`);
    }
}

async function getStagedFiles() {
    const repoPath = await findRepoPath();
    if (!repoPath) {
        return [];
    }
    
    try {
        const stagingPath = path.join(repoPath, STAGING_DIR);
        const files = await fs.readdir(stagingPath);
        return files.filter(f => f !== '.gitkeep');
    } catch {
        return [];
    }
}

async function createCommit(message) {
    const repoPath = await findRepoPath();
    if (!repoPath) {
        throw new Error('Not in a repository. Run "devtrack init" first.');
    }
    
    const stagingPath = path.join(repoPath, STAGING_DIR);
    const commitsPath = path.join(repoPath, COMMITS_DIR);
    
    const stagedFiles = await getStagedFiles();
    if (stagedFiles.length === 0) {
        throw new Error('No files staged for commit');
    }
    
    const commitId = uuidv4();
    const commitDir = path.join(commitsPath, commitId);
    await fs.mkdir(commitDir, { recursive: true });
    
    // Copy files from staging to commit
    for (const file of stagedFiles) {
        await fs.copyFile(
            path.join(stagingPath, file),
            path.join(commitDir, file)
        );
    }
    
    // Create commit metadata
    const commitData = {
        commitId,
        message,
        date: new Date().toISOString(),
        files: stagedFiles
    };
    
    await fs.writeFile(
        path.join(commitDir, 'commit.json'),
        JSON.stringify(commitData, null, 2)
    );
    
    // Clear staging area
    for (const file of stagedFiles) {
        await fs.unlink(path.join(stagingPath, file));
    }
    
    // Update HEAD
    await fs.writeFile(
        path.join(repoPath, HEAD_FILE),
        commitId
    );
    
    return commitData;
}

async function getCommits() {
    const repoPath = await findRepoPath();
    if (!repoPath) {
        return [];
    }
    
    try {
        const commitsPath = path.join(repoPath, COMMITS_DIR);
        const commits = [];
        const dirs = await fs.readdir(commitsPath, { withFileTypes: true });
        
        for (const dir of dirs) {
            if (dir.isDirectory()) {
                const commitFile = path.join(commitsPath, dir.name, 'commit.json');
                try {
                    const data = await fs.readFile(commitFile, 'utf-8');
                    commits.push(JSON.parse(data));
                } catch {
                    // Skip invalid commits
                }
            }
        }
        
        return commits.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch {
        return [];
    }
}

async function getCommit(commitId) {
    const repoPath = await findRepoPath();
    if (!repoPath) {
        throw new Error('Not in a repository.');
    }
    
    const commitPath = path.join(repoPath, COMMITS_DIR, commitId);
    try {
        const data = await fs.readFile(path.join(commitPath, 'commit.json'), 'utf-8');
        return JSON.parse(data);
    } catch {
        throw new Error(`Commit ${commitId} not found`);
    }
}

module.exports = {
    getRepoPath,
    findRepoPath,
    initRepo,
    getConfig,
    saveConfig,
    setRemote,
    getRemote,
    addToStaging,
    getStagedFiles,
    createCommit,
    getCommits,
    getCommit,
    REPO_DIR
};

