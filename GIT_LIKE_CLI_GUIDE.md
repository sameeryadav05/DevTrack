# DevTrack Git-like CLI Guide

## Overview
DevTrack CLI works just like Git! You can initialize repositories in any project directory, connect to remote repositories, and sync your work with the DevTrack platform.

## Installation & Setup

### 1. Login to CLI
```bash
node index.js login
```
Enter your email and password. Your authentication token will be saved.

### 2. Create a Repository on DevTrack
- Go to http://localhost:5173
- Create a new repository
- Copy the Repository ID from the URL: `/repo/<repositoryId>`

## Basic Workflow

### Step 1: Initialize Local Repository
Navigate to your project directory and initialize:
```bash
cd /path/to/your/project
node index.js init
```

This creates a `.devtrack` folder in your project (similar to `.git`).

### Step 2: Connect to Remote Repository
```bash
node index.js remote add <repositoryId>
```

Replace `<repositoryId>` with the ID from DevTrack dashboard.

### Step 3: Add Files
```bash
node index.js add file1.js file2.js index.html
```

Or add all files:
```bash
node index.js add *
```

### Step 4: Check Status
```bash
node index.js status
```

Shows:
- Remote repository
- Staged files
- Total commits
- Recent commit history

### Step 5: Commit
```bash
node index.js commit "Your commit message"
```

This creates a local commit AND syncs it with the remote repository.

### Step 6: Push to Remote
```bash
node index.js push
```

Pushes all local commits to the remote repository and cloud storage.

### Step 7: Pull from Remote
```bash
node index.js pull
```

Pulls commits from remote repository to your local repository.

## All Commands

### Repository Management
```bash
# Initialize repository
node index.js init

# Connect to remote
node index.js remote add <repoId>

# Show remote
node index.js remote
```

### File Operations
```bash
# Add files to staging
node index.js add <file1> <file2> ...

# Show status
node index.js status
```

### Commit Operations
```bash
# Create commit
node index.js commit "commit message"

# Show commit history
node index.js log

# Revert to a commit
node index.js revert <commitId>
```

### Sync Operations
```bash
# Push to remote
node index.js push

# Pull from remote
node index.js pull
```

### Authentication
```bash
# Login
node index.js login

# Logout
node index.js logout
```

## Complete Example

```bash
# 1. Login
node index.js login

# 2. Navigate to your project
cd ~/my-project

# 3. Initialize repository
node index.js init

# 4. Connect to remote (get ID from DevTrack dashboard)
node index.js remote add 507f1f77bcf86cd799439011

# 5. Add files
node index.js add app.js index.html style.css

# 6. Check status
node index.js status

# 7. Commit
node index.js commit "Initial commit"

# 8. Push to remote
node index.js push

# 9. View in DevTrack dashboard
# Go to http://localhost:5173/repo/507f1f77bcf86cd799439011
# You'll see your commit!
```

## How It Works

### Local Repository Structure
```
your-project/
├── .devtrack/
│   ├── config.json      # Repository configuration
│   ├── HEAD             # Current commit reference
│   ├── staging/         # Staged files
│   └── commits/         # Local commits
│       └── <commitId>/
│           ├── commit.json
│           └── <files>
├── app.js
└── index.html
```

### Remote Connection
- Remote repository ID is stored in `.devtrack/config.json`
- When you commit, it syncs with the remote automatically
- Push/Pull operations sync with DevTrack backend and Supabase storage

### Data Flow
```
Local Project
    ↓
.devtrack/ (local storage)
    ↓
Commit (creates local + remote commit)
    ↓
Push → DevTrack API → MongoDB + Supabase
    ↓
Frontend Dashboard (shows commits)
```

## Comparison with Git

| Git Command | DevTrack Command | Description |
|------------|------------------|-------------|
| `git init` | `devtrack init` | Initialize repository |
| `git remote add origin <url>` | `devtrack remote add <repoId>` | Connect to remote |
| `git add <files>` | `devtrack add <files>` | Stage files |
| `git status` | `devtrack status` | Show status |
| `git commit -m "msg"` | `devtrack commit "msg"` | Create commit |
| `git log` | `devtrack log` | Show history |
| `git push` | `devtrack push` | Push to remote |
| `git pull` | `devtrack pull` | Pull from remote |
| `git revert <commit>` | `devtrack revert <commitId>` | Revert commit |

## Tips

1. **Always login first** before using remote operations
2. **Set remote** after initializing repository
3. **Check status** frequently to see what's staged
4. **Commit often** - each commit is synced with remote
5. **Push regularly** to backup your work to cloud storage

## Troubleshooting

**"Not in a repository" error:**
- Make sure you're in a directory with `.devtrack` folder
- Run `devtrack init` first

**"No remote repository set" error:**
- Run `devtrack remote add <repoId>`
- Get repo ID from DevTrack dashboard

**"Not authenticated" error:**
- Run `devtrack login`
- Make sure backend is running

**Can't find repository ID:**
- Go to DevTrack dashboard
- Click on a repository
- Copy the ID from URL: `/repo/<id>`

## Advanced Usage

### Working with Multiple Projects
Each project directory can have its own `.devtrack` folder and remote connection.

### Reverting Changes
```bash
# View commit history
node index.js log

# Revert to a specific commit
node index.js revert <commitId>
```

This restores files from that commit to your working directory.

### Checking Remote Status
```bash
node index.js remote
```

Shows which remote repository is connected.

## Integration with Frontend

All CLI operations are automatically reflected in the DevTrack frontend:

1. **Commits** appear in the repository detail page
2. **Push/Pull** syncs with cloud storage
3. **Status** matches between CLI and web UI
4. **Real-time sync** - no manual refresh needed

Enjoy using DevTrack CLI! 🚀

