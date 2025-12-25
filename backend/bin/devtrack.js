#!/usr/bin/env node

/**
 * DevTrack CLI Entry Point
 * This file allows the CLI to be run as a global command
 */

// CRITICAL: Preserve the user's current working directory
// The user should be in their project directory, NOT the backend directory
const originalCwd = process.cwd();

// Find the backend directory (where index.js is located)
const path = require('path');
const backendDir = path.resolve(__dirname, '..');

// Store backend dir in env for modules that need it
process.env.DEVTRACK_BACKEND_DIR = backendDir;

// Load dotenv from backend directory BEFORE loading index.js
const dotenv = require('dotenv');
const dotenvPath = path.join(backendDir, '.env');
dotenv.config({ path: dotenvPath });

// Now load the main index.js
// Note: We do NOT change directory, so process.cwd() remains the user's project directory
require(path.join(backendDir, 'index.js'));

