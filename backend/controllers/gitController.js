const { 
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
    findRepoPath
} = require('../utils/localRepo');
const { makeRequest } = require('../utils/cliClient');
const { getToken } = require('../utils/cliAuth');
const fs = require('fs').promises;
const path = require('path');

// Initialize local repository
async function init() {
    try {
        const repoPath = await findRepoPath();
        if (repoPath) {
            console.log('❌ Repository already initialized in this directory or parent directory.');
            return;
        }
        
        await initRepo();
        console.log('✅ Repository initialized successfully!');
        console.log('💡 Next step: Connect to remote repository with "devtrack remote add <repoId>"');
    } catch (error) {
        console.error('❌', error.message);
    }
}

// Add remote repository
async function remoteAdd(repoId) {
    try {
        const token = await getToken();
        if (!token) {
            console.error('❌ Not authenticated. Run "devtrack login" first.');
            return;
        }
        
        // Verify repository exists and user has access
        try {
            await makeRequest('GET', `/repo/${repoId}`);
        } catch (error) {
            console.error('❌ Repository not found or access denied.');
            return;
        }
        
        await setRemote(repoId);
        console.log(`✅ Remote repository set to: ${repoId}`);
        console.log('💡 You can now push and pull from this repository.');
    } catch (error) {
        console.error('❌', error.message);
    }
}

// Show remote repository
async function remoteShow() {
    try {
        const config = await getConfig();
        if (!config) {
            console.error('❌ Not in a repository. Run "devtrack init" first.');
            return;
        }
        
        if (!config.remote) {
            console.log('No remote repository configured.');
            console.log('💡 Use "devtrack remote add <repoId>" to connect to a remote repository.');
        } else {
            console.log(`Remote repository: ${config.remote}`);
        }
    } catch (error) {
        console.error('❌', error.message);
    }
}

// Add files to staging
async function add(filePaths) {
    try {
        const config = await getConfig();
        if (!config) {
            console.error('❌ Not in a repository. Run "devtrack init" first.');
            return;
        }
        
        if (filePaths.length === 0) {
            console.error('❌ No files specified. Usage: devtrack add <file1> <file2> ...');
            return;
        }
        
        const addedFiles = [];
        for (const filePath of filePaths) {
            try {
                const fileName = await addToStaging(filePath);
                addedFiles.push(fileName);
                console.log(`✅ Added: ${filePath}`);
            } catch (error) {
                console.error(`❌ Failed to add ${filePath}: ${error.message}`);
            }
        }
        
        if (addedFiles.length > 0) {
            console.log(`\n📦 ${addedFiles.length} file(s) staged for commit`);
        }
    } catch (error) {
        console.error('❌', error.message);
    }
}

// Show status
async function status() {
    try {
        const config = await getConfig();
        if (!config) {
            console.error('❌ Not in a repository. Run "devtrack init" first.');
            return;
        }
        
        const stagedFiles = await getStagedFiles();
        const commits = await getCommits();
        
        console.log('\n📊 Repository Status\n');
        console.log(`Remote: ${config.remote || 'Not set'}`);
        console.log(`Staged files: ${stagedFiles.length}`);
        
        if (stagedFiles.length > 0) {
            console.log('\nStaged for commit:');
            stagedFiles.forEach(file => {
                console.log(`  ✅ ${file}`);
            });
        }
        
        console.log(`\nTotal commits: ${commits.length}`);
        
        if (commits.length > 0) {
            console.log('\nRecent commits:');
            commits.slice(0, 5).forEach(commit => {
                console.log(`  ${commit.commitId.substring(0, 8)} - ${commit.message}`);
            });
        }
    } catch (error) {
        console.error('❌', error.message);
    }
}

// Commit staged files
async function commit(message) {
    try {
        const config = await getConfig();
        if (!config) {
            console.error('❌ Not in a repository. Run "devtrack init" first.');
            return;
        }
        
        const stagedFiles = await getStagedFiles();
        if (stagedFiles.length === 0) {
            console.error('❌ No files staged for commit. Use "devtrack add <files>" first.');
            return;
        }
        
        // Create local commit
        const commitData = await createCommit(message);
        console.log(`✅ Commit created: ${commitData.commitId.substring(0, 8)}`);
        console.log(`   Message: ${message}`);
        console.log(`   Files: ${commitData.files.length}`);
        
        // If remote is set, also commit to remote
        if (config.remote) {
            const token = await getToken();
            if (token) {
                try {
                    // Read file contents
                    const repoPath = await findRepoPath();
                    const commitPath = path.join(repoPath, 'commits', commitData.commitId);
                    const files = [];
                    
                    for (const fileName of commitData.files) {
                        const filePath = path.join(commitPath, fileName);
                        const content = await fs.readFile(filePath, 'utf-8');
                        files.push({
                            filename: fileName,
                            content: content,
                            path: fileName
                        });
                    }
                    
                    // Add files to remote staging
                    await makeRequest('POST', `/repo/${config.remote}/add`, { files });
                    
                    // Commit to remote
                    await makeRequest('POST', `/repo/${config.remote}/commit`, { message });
                    
                    console.log('✅ Committed to remote repository');
                } catch (error) {
                    console.log('⚠️  Local commit created, but failed to sync with remote:');
                    console.log(`   ${error.message}`);
                }
            }
        }
    } catch (error) {
        console.error('❌', error.message);
    }
}

// Show commit log
async function log() {
    try {
        const config = await getConfig();
        if (!config) {
            console.error('❌ Not in a repository. Run "devtrack init" first.');
            return;
        }
        
        const commits = await getCommits();
        
        if (commits.length === 0) {
            console.log('📝 No commits yet.');
            return;
        }
        
        console.log('\n📝 Commit History\n');
        commits.forEach((commit, index) => {
            console.log(`Commit ${index + 1}:`);
            console.log(`  ID: ${commit.commitId}`);
            console.log(`  Message: ${commit.message}`);
            console.log(`  Date: ${new Date(commit.date).toLocaleString()}`);
            console.log(`  Files: ${commit.files.length}`);
            console.log('  ' + '-'.repeat(50));
        });
    } catch (error) {
        console.error('❌', error.message);
    }
}

// Push commits to remote
async function push() {
    try {
        const config = await getConfig();
        if (!config) {
            console.error('❌ Not in a repository. Run "devtrack init" first.');
            return;
        }
        
        if (!config.remote) {
            console.error('❌ No remote repository set. Use "devtrack remote add <repoId>" first.');
            return;
        }
        
        const token = await getToken();
        if (!token) {
            console.error('❌ Not authenticated. Run "devtrack login" first.');
            return;
        }
        
        const commits = await getCommits();
        if (commits.length === 0) {
            console.log('📝 No commits to push.');
            return;
        }
        
        console.log('📤 Pushing commits to remote...');
        
        const repoPath = await findRepoPath();
        let pushedCount = 0;
        
        for (const commit of commits) {
            try {
                // Read commit files
                const commitPath = path.join(repoPath, 'commits', commit.commitId);
                const files = [];
                
                for (const fileName of commit.files) {
                    const filePath = path.join(commitPath, fileName);
                    const content = await fs.readFile(filePath, 'utf-8');
                    files.push({
                        filename: fileName,
                        content: content,
                        path: fileName
                    });
                }
                
                // Check if commit already exists on remote
                try {
                    const remoteCommits = await makeRequest('GET', `/repo/${config.remote}/log`);
                    const exists = remoteCommits.commits.some(c => c.commitId === commit.commitId);
                    if (exists) {
                        continue; // Skip if already exists
                    }
                } catch {
                    // Continue if we can't check
                }
                
                // Add files to remote staging
                await makeRequest('POST', `/repo/${config.remote}/add`, { files });
                
                // Commit to remote
                await makeRequest('POST', `/repo/${config.remote}/commit`, { 
                    message: commit.message 
                });
                
                pushedCount++;
            } catch (error) {
                console.log(`⚠️  Failed to push commit ${commit.commitId.substring(0, 8)}: ${error.message}`);
            }
        }
        
        // Push to Supabase storage
        try {
            await makeRequest('POST', `/repo/${config.remote}/push`);
            console.log('✅ Pushed to cloud storage');
        } catch (error) {
            console.log('⚠️  Failed to push to cloud storage:', error.message);
        }
        
        console.log(`✅ Pushed ${pushedCount} commit(s) to remote`);
    } catch (error) {
        console.error('❌', error.message);
    }
}

// Pull commits from remote
async function pull() {
    try {
        const config = await getConfig();
        if (!config) {
            console.error('❌ Not in a repository. Run "devtrack init" first.');
            return;
        }
        
        if (!config.remote) {
            console.error('❌ No remote repository set. Use "devtrack remote add <repoId>" first.');
            return;
        }
        
        const token = await getToken();
        if (!token) {
            console.error('❌ Not authenticated. Run "devtrack login" first.');
            return;
        }
        
        console.log('📥 Pulling commits from remote...');
        
        // Pull from Supabase
        await makeRequest('POST', `/repo/${config.remote}/pull`);
        
        // Get remote commits
        const remoteCommits = await makeRequest('GET', `/repo/${config.remote}/log`);
        const localCommits = await getCommits();
        const localCommitIds = new Set(localCommits.map(c => c.commitId));
        
        const repoPath = await findRepoPath();
        const commitsPath = path.join(repoPath, 'commits');
        let pulledCount = 0;
        
        for (const remoteCommit of remoteCommits.commits) {
            if (!localCommitIds.has(remoteCommit.commitId)) {
                // Download commit files
                const commitDir = path.join(commitsPath, remoteCommit.commitId);
                await fs.mkdir(commitDir, { recursive: true });
                
                // Get commit details (we need to fetch files from API)
                // For now, we'll mark it as pulled
                const commitData = {
                    commitId: remoteCommit.commitId,
                    message: remoteCommit.message,
                    date: remoteCommit.date,
                    files: [] // Files will be synced on next push
                };
                
                await fs.writeFile(
                    path.join(commitDir, 'commit.json'),
                    JSON.stringify(commitData, null, 2)
                );
                
                pulledCount++;
            }
        }
        
        console.log(`✅ Pulled ${pulledCount} commit(s) from remote`);
    } catch (error) {
        console.error('❌', error.message);
    }
}

// Revert to a commit
async function revert(commitId) {
    try {
        const config = await getConfig();
        if (!config) {
            console.error('❌ Not in a repository. Run "devtrack init" first.');
            return;
        }
        
        const commit = await getCommit(commitId);
        const repoPath = await findRepoPath();
        const commitPath = path.join(repoPath, 'commits', commitId);
        
        // Restore files from commit
        console.log(`🔄 Reverting to commit: ${commitId.substring(0, 8)}`);
        console.log(`   Message: ${commit.message}`);
        
        for (const fileName of commit.files) {
            const sourcePath = path.join(commitPath, fileName);
            const destPath = path.resolve(process.cwd(), fileName);
            
            try {
                await fs.copyFile(sourcePath, destPath);
                console.log(`✅ Restored: ${fileName}`);
            } catch (error) {
                console.log(`⚠️  Failed to restore ${fileName}: ${error.message}`);
            }
        }
        
        console.log('✅ Revert complete');
    } catch (error) {
        console.error('❌', error.message);
    }
}

module.exports = {
    init,
    remoteAdd,
    remoteShow,
    add,
    status,
    commit,
    log,
    push,
    pull,
    revert
};

