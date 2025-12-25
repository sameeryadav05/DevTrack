# CLI and Frontend Sync Guide

## Overview
The CLI now syncs with the backend API, so all operations (push, pull, commit, etc.) are reflected in the frontend dashboard in real-time, just like GitHub!

## Setup

### 1. Login to CLI
First, authenticate with the CLI:
```bash
node index.js login
```

Enter your email and password. Your token will be saved in `~/.devtrack/config.json`.

### 2. Set Repository
Before using commands, set the repository you want to work with:
```bash
node index.js repo <repositoryId>
```

You can find the repository ID from the frontend dashboard URL: `/repo/<repositoryId>`

## CLI Commands

All commands now sync with the backend API:

### Initialize Repository
```bash
node index.js init [repoId]
```
Initializes the repository for version control. If repoId is not provided, uses the currently set repo.

### Add Files
```bash
node index.js add file1.js file2.js
```
Adds files to staging area. Files are read from current directory and sent to backend.

### Commit
```bash
node index.js commit "Your commit message"
```
Commits all staged files. The commit is stored in MongoDB and visible in frontend.

### Push
```bash
node index.js push
```
Pushes all commits to Supabase storage. Frontend will show updated commits.

### Pull
```bash
node index.js pull
```
Pulls commits from Supabase storage. New commits appear in frontend.

### Log
```bash
node index.js log
```
Shows commit history. Same data as shown in frontend.

### Status
```bash
node index.js status
```
Shows current repository status: staged files and commit count.

### Logout
```bash
node index.js logout
```
Clears authentication token.

## Workflow Example

1. **Login:**
   ```bash
   node index.js login
   ```

2. **Set Repository:**
   ```bash
   node index.js repo 507f1f77bcf86cd799439011
   ```

3. **Initialize:**
   ```bash
   node index.js init
   ```

4. **Add Files:**
   ```bash
   node index.js add app.js index.html
   ```

5. **Commit:**
   ```bash
   node index.js commit "Initial commit"
   ```

6. **Push:**
   ```bash
   node index.js push
   ```

7. **Check Frontend:**
   - Go to `http://localhost:5173/repo/507f1f77bcf86cd799439011`
   - You'll see the commit in the "Commits" tab!

## How It Works

1. **Authentication:** CLI stores JWT token in `~/.devtrack/config.json`
2. **API Calls:** All commands make HTTP requests to backend API
3. **Database Sync:** Commits are stored in MongoDB
4. **Real-time Updates:** Frontend fetches from same database
5. **Storage Sync:** Push/Pull syncs with Supabase storage

## Configuration File

Location: `~/.devtrack/config.json`

```json
{
  "token": "your_jwt_token_here",
  "repoId": "current_repository_id"
}
```

## Troubleshooting

**"Not authenticated" error:**
- Run `node index.js login` again

**"No repository set" error:**
- Run `node index.js repo <repoId>` first

**Backend not running:**
- Make sure backend is running on `http://localhost:3000`
- Or set `API_URL` environment variable

**Can't find repo ID:**
- Check the URL in frontend when viewing a repository
- Or use the repository `_id` from MongoDB

## Benefits

✅ **Unified Experience:** CLI and Frontend use same data  
✅ **Real-time Sync:** Changes appear immediately in frontend  
✅ **Cloud Storage:** Push/Pull works with Supabase  
✅ **Version History:** All commits tracked in MongoDB  
✅ **GitHub-like:** Familiar workflow for developers  

