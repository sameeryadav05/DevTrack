const readline = require('readline');
const axios = require('axios');
const { setToken, setRepoId, getToken, clearConfig } = require('../utils/cliAuth');
const { makeRequest } = require('../utils/cliClient');
const fs = require('fs').promises;
const path = require('path');

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000';

function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }));
}

async function login() {
    try {
        const email = await askQuestion('Email: ');
        const password = await askQuestion('Password: ');
        
        const response = await axios.post(`${API_BASE_URL}/login`, {
            email,
            password
        });

        if (response.data.token) {
            await setToken(response.data.token);
            console.log('✅ Logged in successfully!');
            console.log(`Welcome, ${response.data.userData.username}!`);
        } else {
            console.log('❌ Login failed:', response.data.message);
        }
    } catch (error) {
        if (error.response) {
            console.error('❌ Login failed:', error.response.data.message);
        } else {
            console.error('❌ Error:', error.message);
        }
    }
}

async function logout() {
    await clearConfig();
    console.log('✅ Logged out successfully!');
}

async function setRepo(repoId) {
    await setRepoId(repoId);
    console.log(`✅ Repository set to: ${repoId}`);
}

async function init(repoId) {
    try {
        const result = await makeRequest('POST', `/repo/${repoId}/init`);
        console.log('✅', result.message);
    } catch (error) {
        console.error('❌', error.message);
    }
}

async function addFiles(repoId, filePaths) {
    try {
        const files = [];
        
        for (const filePath of filePaths) {
            const fullPath = path.resolve(process.cwd(), filePath);
            const content = await fs.readFile(fullPath, 'utf-8');
            const filename = path.basename(filePath);
            
            files.push({
                filename,
                content,
                path: filePath
            });
        }

        const result = await makeRequest('POST', `/repo/${repoId}/add`, { files });
        console.log('✅', result.message);
    } catch (error) {
        console.error('❌', error.message);
    }
}

async function commit(repoId, message) {
    try {
        const result = await makeRequest('POST', `/repo/${repoId}/commit`, { message });
        console.log('✅', result.message);
        console.log(`   Commit ID: ${result.commit.commitId}`);
    } catch (error) {
        console.error('❌', error.message);
    }
}

async function log(repoId) {
    try {
        const result = await makeRequest('GET', `/repo/${repoId}/log`);
        const commits = result.commits || [];
        
        if (commits.length === 0) {
            console.log('📝 No commits found.');
            return;
        }

        console.log('\n📝 Commit History:\n');
        commits.forEach((commit, index) => {
            console.log(`Commit ${index + 1}:`);
            console.log(`  ID: ${commit.commitId}`);
            console.log(`  Message: ${commit.message}`);
            console.log(`  Author: ${commit.author?.username || 'Unknown'}`);
            console.log(`  Date: ${new Date(commit.date).toLocaleString()}`);
            console.log(`  Files: ${commit.filesCount}`);
            console.log('  ' + '-'.repeat(50));
        });
    } catch (error) {
        console.error('❌', error.message);
    }
}

async function push(repoId) {
    try {
        console.log('📤 Pushing commits to remote...');
        const result = await makeRequest('POST', `/repo/${repoId}/push`);
        console.log('✅', result.message);
        console.log(`   Uploaded: ${result.uploaded} files`);
        if (result.errors > 0) {
            console.log(`   Errors: ${result.errors}`);
        }
    } catch (error) {
        console.error('❌', error.message);
    }
}

async function pull(repoId) {
    try {
        console.log('📥 Pulling commits from remote...');
        const result = await makeRequest('POST', `/repo/${repoId}/pull`);
        console.log('✅', result.message);
        console.log(`   Pulled: ${result.pulledCommits} commits`);
    } catch (error) {
        console.error('❌', error.message);
    }
}

async function status(repoId) {
    try {
        const stagedResult = await makeRequest('GET', `/repo/${repoId}/staged`);
        const logResult = await makeRequest('GET', `/repo/${repoId}/log`);
        
        const stagedFiles = stagedResult.stagedFiles || [];
        const commits = logResult.commits || [];
        
        console.log('\n📊 Repository Status:\n');
        console.log(`Staged files: ${stagedFiles.length}`);
        if (stagedFiles.length > 0) {
            stagedFiles.forEach(file => {
                console.log(`  - ${file.filename}`);
            });
        }
        console.log(`Total commits: ${commits.length}`);
    } catch (error) {
        console.error('❌', error.message);
    }
}

module.exports = {
    login,
    logout,
    setRepo,
    init,
    addFiles,
    commit,
    log,
    push,
    pull,
    status
};

