# 📊 DevTrack Project Overview

## 🎯 What is DevTrack?

DevTrack is a **complete version control system** that combines:
- **CLI (Command Line)** - Like Git
- **Web Dashboard** - Like GitHub
- **Cloud Storage** - Like GitHub's remote repositories
- **Local Storage** - Like Git's `.git` folder

## 🏗️ Architecture

### Components

```
┌─────────────────────────────────────────────────┐
│              DevTrack System                     │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────┐         ┌──────────┐            │
│  │   CLI    │────────▶│ Backend  │            │
│  │ (Terminal)│         │ (Express)│            │
│  └──────────┘         └────┬─────┘            │
│                            │                   │
│  ┌──────────┐              │                   │
│  │  Web UI  │──────────────┘                   │
│  │  (React) │                                  │
│  └──────────┘                                  │
│                            │                   │
│                            ├──→ MongoDB        │
│                            │   (Database)       │
│                            │                   │
│                            └──→ Supabase       │
│                                (File Storage)   │
└─────────────────────────────────────────────────┘
```

### Data Storage

1. **Local (`.devtrack/`)** - Like Git's `.git`
   - Commits
   - Staged files
   - Configuration

2. **MongoDB** - Database
   - Users
   - Repositories
   - Commits metadata
   - Relationships

3. **Supabase** - Cloud Storage
   - File contents
   - Commit snapshots
   - Backup

## 🔄 How It Works

### Workflow

1. **User creates repository** (Web or CLI)
   - Stored in MongoDB
   - Gets unique ID

2. **User initializes local project** (CLI)
   - Creates `.devtrack/` folder
   - Connects to remote repository

3. **User adds files** (CLI or Web)
   - Staged locally
   - Can be committed

4. **User commits** (CLI or Web)
   - Creates commit locally
   - Syncs with MongoDB
   - Stores in database

5. **User pushes** (CLI or Web)
   - Uploads to Supabase
   - Updates database
   - Visible in dashboard

6. **User views in dashboard**
   - Fetches from MongoDB
   - Shows commits, files, history

### Sync Mechanism

```
Local Project
    │
    ├─→ .devtrack/ (local commits)
    │
    └─→ API Call → Backend
            │
            ├─→ MongoDB (metadata)
            │
            └─→ Supabase (files)
                    │
                    └─→ Dashboard (displays)
```

## 📦 Package Information

### Backend Package

- **Name:** `devtrack-cli`
- **Type:** npm package (installable)
- **Entry:** `backend/index.js`
- **CLI Command:** `devtrack` (after global install)

### Installation Methods

1. **Global Install:**
   ```bash
   cd backend
   npm install -g .
   ```
   Then use: `devtrack <command>`

2. **Local Wrapper:**
   Use `devtrack.bat` from project root
   Then use: `devtrack.bat <command>`

3. **Direct:**
   ```bash
   node backend/index.js <command>
   ```

## 🎨 Features

### CLI Features
- ✅ Git-like commands
- ✅ Local repository management
- ✅ Remote synchronization
- ✅ Authentication
- ✅ Status tracking

### Web Features
- ✅ User authentication
- ✅ Repository management
- ✅ Visual commit history
- ✅ File management
- ✅ Profile management
- ✅ Statistics dashboard

### Core Features
- ✅ Version control
- ✅ Commit history
- ✅ File staging
- ✅ Push/Pull operations
- ✅ Revert functionality
- ✅ Cloud backup

## 🔐 Authentication

### CLI Authentication
- Token stored in `~/.devtrack/config.json`
- Used for API calls
- Login via: `devtrack login`

### Web Authentication
- JWT tokens
- Stored in browser
- Session management
- Email verification

## 📁 File Structure Explained

### Backend Files

**Core:**
- `index.js` - Main entry (server + CLI)
- `package.json` - Package config

**CLI:**
- `bin/devtrack.js` - CLI entry point
- `controllers/gitController.js` - Git commands
- `controllers/cliController.js` - Auth commands
- `utils/localRepo.js` - Local repo management
- `utils/cliAuth.js` - CLI authentication

**API:**
- `controllers/vcController.js` - Version control API
- `controllers/repoController.js` - Repository API
- `controllers/userController.js` - User API
- `routes/*.js` - Route definitions

**Models:**
- `models/user.model.js` - User schema
- `models/repo.model.js` - Repository schema
- `models/commit.model.js` - Commit schema

### Frontend Files

**Core:**
- `src/App.jsx` - Main app component
- `src/main.jsx` - Entry point

**Pages:**
- `src/pages/RepoDetail.jsx` - Repository view
- `src/pages/Profile.jsx` - User profile
- `src/pages/CreateRepo.jsx` - Create repository

**API:**
- `src/api/Axios.js` - API client

## 🚀 Getting Started

1. **Install dependencies**
2. **Setup environment variables**
3. **Start backend**
4. **Start frontend**
5. **Use CLI or Web**

See [README.md](./README.md) for detailed instructions.

## 📚 Documentation Files

- `README.md` - Complete guide
- `QUICK_START_GUIDE.md` - 5-minute setup
- `GIT_LIKE_CLI_GUIDE.md` - CLI usage
- `CLI_INSTALLATION.md` - CLI setup
- `COMPLETE_GIT_SYSTEM.md` - System overview

## 🎓 Learning Path

1. **Start with:** `QUICK_START_GUIDE.md`
2. **Then read:** `README.md`
3. **For CLI:** `GIT_LIKE_CLI_GUIDE.md`
4. **For details:** `COMPLETE_GIT_SYSTEM.md`

## ✨ Key Concepts

- **Local Repository:** `.devtrack/` folder in your project
- **Remote Repository:** MongoDB + Supabase storage
- **Sync:** Automatic synchronization between local and remote
- **Commits:** Snapshots of your code at a point in time
- **Staging:** Preparing files for commit

---

**Ready to start? Check [README.md](./README.md)! 🚀**

