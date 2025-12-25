#!/usr/bin/env node

/**
 * DevTrack CLI Entry Point
 * This file allows the CLI to be run as a global command
 */

// Set the working directory to the backend folder
const path = require('path');
const fs = require('fs');

// Find the backend directory (where index.js is located)
const backendDir = __dirname.replace(/[\\/]bin$/, '');
process.chdir(backendDir);

// Now require the main index.js
require('../index.js');

