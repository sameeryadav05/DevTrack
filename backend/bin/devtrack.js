#!/usr/bin/env node
const path = require("path");
const dotenv = require("dotenv");

// Preserve user's working directory
const originalCwd = process.cwd();

// Resolve backend directory
const backendDir = path.resolve(__dirname, "..");

// Expose backend directory
process.env.DEVTRACK_BACKEND_DIR = backendDir;

// Load environment variables
dotenv.config({
  path: path.join(backendDir, ".env"),
});

// Load backend entry
require(path.join(backendDir, "index.js"));
