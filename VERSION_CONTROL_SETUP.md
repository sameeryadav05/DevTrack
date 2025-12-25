# Version Control System - Complete Setup

## Overview
This document explains the complete version control system integration between frontend and backend.

## Backend API Endpoints

All version control endpoints are under `/repo/:repoId/` and require authentication.

### 1. Initialize Repository
- **POST** `/repo/:repoId/init`
- Initializes a repository for version control
- Sets `initialized: true` on the repository

### 2. Add Files to Staging
- **POST** `/repo/:repoId/add`
- Body: `{ files: [{ filename: string, content: string, path: string }] }`
- Adds files to the staging area

### 3. Get Staged Files
- **GET** `/repo/:repoId/staged`
- Returns all files currently in staging

### 4. Commit Staged Files
- **POST** `/repo/:repoId/commit`
- Body: `{ message: string }`
- Creates a commit with all staged files
- Clears the staging area

### 5. Get Commit Log
- **GET** `/repo/:repoId/log`
- Returns all commits for the repository

### 6. Push Commits
- **POST** `/repo/:repoId/push`
- Uploads all commits to Supabase storage

### 7. Pull Commits
- **POST** `/repo/:repoId/pull`
- Downloads commits from Supabase storage

## Frontend Usage

### Repository Detail Page
Navigate to `/repo/:repoId` to access the version control interface.

**Features:**
1. **Initialize Repository** - First step to enable version control
2. **Add File Tab** - Add new files to staging
3. **Staged Files Tab** - View and commit staged files
4. **Commits Tab** - View commit history
5. **Push/Pull Buttons** - Sync with remote storage

### Workflow
1. Create a repository (or navigate to existing one)
2. Click "Initialize Repository" if not already initialized
3. Go to "Add File" tab and add files
4. Go to "Staged Files" tab and commit with a message
5. Use "Push" to upload to Supabase
6. Use "Pull" to download from Supabase

## Database Models

### Commit Model
- `commitId`: Unique identifier (UUID)
- `message`: Commit message
- `repository`: Reference to Repository
- `author`: Reference to User
- `files`: Array of file objects
- `date`: Commit timestamp

### Repository Model (Updated)
- Added `initialized`: Boolean flag
- Added `stagedFiles`: Array of staged file objects

## Notes

- All endpoints require authentication via Bearer token
- Only repository owners can perform version control operations
- Commits are stored in MongoDB
- Files are uploaded to Supabase storage bucket named "commits"
- The system supports multiple files per commit

