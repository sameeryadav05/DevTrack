const express = require('express');
const { auth } = require('../middleware/auth.js');
const {
    initRepo,
    addFiles,
    commitFiles,
    getCommitLog,
    pushCommits,
    pullCommits,
    getStagedFiles
} = require('../controllers/vcController.js');

const vcRouter = express.Router();

// All routes require authentication
vcRouter.use(auth);

// Initialize repository
vcRouter.post('/repo/:repoId/init', initRepo);

// Add files to staging
vcRouter.post('/repo/:repoId/add', addFiles);

// Get staged files
vcRouter.get('/repo/:repoId/staged', getStagedFiles);

// Commit staged files
vcRouter.post('/repo/:repoId/commit', commitFiles);

// Get commit log
vcRouter.get('/repo/:repoId/log', getCommitLog);

// Push commits
vcRouter.post('/repo/:repoId/push', pushCommits);

// Pull commits
vcRouter.post('/repo/:repoId/pull', pullCommits);

module.exports = { vcRouter };

