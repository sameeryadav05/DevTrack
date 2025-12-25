# 🚀 DevTrack - Complete Version Control System

> A full-stack Git/GitHub-like version control system with **CLI** and **Web Dashboard**

## 📦 Package Names

- **Backend Package:** `devtrack-cli` (npm package name)
- **CLI Command:** `devtrack` (after installation)
- **Frontend:** React app (no package name, runs locally)

## 🏗️ Project Structure

```
DevTrack/
├── backend/              # Node.js/Express Backend + CLI
│   ├── bin/             # CLI entry points
│   ├── controllers/     # Business logic
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── utils/           # Utilities (CLI auth, local repo)
│   └── index.js         # Main entry (server + CLI)
│
├── frontend/            # React Frontend
│   └── src/
│       ├── pages/       # Page components
│       ├── components/  # Reusable components
│       └── api/         # API client
│
└── devtrack.bat         # Windows CLI wrapper
```

## 🎯 What This Project Does

**DevTrack** is a complete version control system that works like Git/GitHub:

1. **CLI (Command Line Interface)** - Use commands in your terminal
2. **Web Dashboard** - Visual interface to manage repositories
3. **Local + Remote** - Commits stored locally AND in cloud
4. **Real-time Sync** - CLI operations appear instantly in dashboard

## 📋 Prerequisites

Before starting, make sure you have:

- ✅ **Node.js** (v14 or higher)
- ✅ **MongoDB** (local or cloud like MongoDB Atlas)
- ✅ **Supabase Account** (for cloud storage)
- ✅ **npm** (comes with Node.js)

## 🔧 Installation

### Step 1: Clone/Download Project

```bash
# If you have the project folder, navigate to it
cd C:\Users\samee\OneDrive\Desktop\DevTrack
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

This installs all backend dependencies including:
- Express (web server)
- Mongoose (MongoDB)
- Yargs (CLI parser)
- Axios (HTTP client)
- And more...

### Step 3: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

This installs React and all frontend dependencies.

### Step 4: Setup Environment Variables

Create `backend/.env` file:

```env
# Server
PORT=3000

# Database
MONGODB_URL=mongodb://localhost:27017/DevTrack
# OR for MongoDB Atlas:
# MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/DevTrack

# JWT Secret (any random string)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Supabase (get from supabase.com)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ROLE_KEY=your_service_role_key_here

# Optional
S3_BUCKET=commits
```

### Step 5: Install CLI Globally (Optional but Recommended)

```bash
cd backend
npm install -g .
```

This installs `devtrack` command globally. After this, you can use `devtrack` from anywhere.

**Alternative:** Use the wrapper file `devtrack.bat` from project root (no installation needed).

## 🚀 How to Start

### Start Backend Server

**Terminal 1:**
```bash
cd backend
npm start
```

You should see:
```
Database connected successfully !
server is listening on port 3000
```

### Start Frontend

**Terminal 2:**
```bash
cd frontend
npm run dev
```

You should see:
```
VITE ready in XXX ms
➜  Local:   http://localhost:5173/
```

### Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000

## 📖 Complete Usage Guide

### Part 1: Web Dashboard (GUI)

#### 1.1 Create Account

1. Go to http://localhost:5173
2. Click "Register"
3. Enter email, username, password
4. Verify email with OTP code
5. Login

#### 1.2 Create Repository

1. After login, you'll see the dashboard
2. Click "new" button (top left)
3. Enter repository name
4. Add description (optional)
5. Choose visibility (public/private)
6. Click "Create repository"

#### 1.3 View Repository

1. Click on any repository from the list
2. You'll see:
   - Repository details
   - Staged files tab
   - Commits tab
   - Add file tab
   - CLI connection instructions

#### 1.4 Use Version Control (Web)

1. Go to "Add File" tab
2. Enter filename and content
3. Click "Add to Staging"
4. Go to "Staged Files" tab
5. Enter commit message
6. Click "Commit"
7. Click "Push" to sync with cloud storage

### Part 2: CLI (Command Line)

#### 2.1 Login to CLI

```bash
# If installed globally
devtrack login

# Or using wrapper
devtrack.bat login

# Or direct command
node backend/index.js login
```

Enter your email and password.

#### 2.2 Initialize Local Repository

```bash
# Navigate to your project
cd C:\Users\samee\Documents\my-project

# Initialize
devtrack init
# or: devtrack.bat init
# or: node C:\Users\samee\OneDrive\Desktop\DevTrack\backend\index.js init
```

This creates `.devtrack` folder (like `.git` in Git).

#### 2.3 Connect to Remote Repository

1. Get repository ID from web dashboard:
   - Go to repository page
   - Copy ID from URL: `/repo/<id>`
   - Or copy from CLI instructions section

2. Connect:
```bash
devtrack remote add <repositoryId>
```

Example:
```bash
devtrack remote add 694ce5ae68fc2a8d1710e65c
```

#### 2.4 Add Files

```bash
# Add single file
devtrack add app.js

# Add multiple files
devtrack add app.js index.html style.css

# Add all files (if supported)
devtrack add *
```

#### 2.5 Check Status

```bash
devtrack status
```

Shows:
- Remote repository
- Staged files
- Total commits
- Recent commits

#### 2.6 Commit

```bash
devtrack commit "Your commit message"
```

This:
- Creates local commit in `.devtrack/commits/`
- Syncs with remote repository
- Stores in MongoDB

#### 2.7 View Commit History

```bash
devtrack log
```

Shows all commits with:
- Commit ID
- Message
- Date
- Files count

#### 2.8 Push to Remote

```bash
devtrack push
```

This:
- Uploads commits to Supabase storage
- Syncs with MongoDB
- Updates web dashboard

#### 2.9 Pull from Remote

```bash
devtrack pull
```

Downloads commits from remote to local.

#### 2.10 Revert to Commit

```bash
# First, get commit ID from log
devtrack log

# Then revert
devtrack revert <commitId>
```

Restores files from that commit.

## 🔄 How Everything Works Together

### Architecture Flow

```
┌─────────────┐
│   Your PC   │
│             │
│  Project/   │
│  .devtrack/ │ ← Local repository
└──────┬──────┘
       │
       │ CLI Commands
       ↓
┌─────────────┐
│   Backend   │
│  (Express)  │ ← API Server
└──────┬──────┘
       │
       ├──→ MongoDB ← Stores commits, repos, users
       │
       └──→ Supabase ← Cloud file storage
       │
       ↓
┌─────────────┐
│  Frontend   │
│   (React)   │ ← Web Dashboard
└─────────────┘
```

### Data Flow Example

1. **User runs:** `devtrack add app.js`
   - File copied to `.devtrack/staging/app.js`

2. **User runs:** `devtrack commit "Initial commit"`
   - Commit created in `.devtrack/commits/<id>/`
   - API call to backend
   - Commit saved in MongoDB
   - If remote set, synced immediately

3. **User runs:** `devtrack push`
   - Commits uploaded to Supabase
   - Database updated
   - Frontend shows new commits

4. **User opens web dashboard**
   - Fetches commits from MongoDB
   - Displays in UI
   - Real-time sync!

## 📚 All Available Commands

### CLI Commands

| Command | Description | Example |
|---------|-------------|---------|
| `devtrack login` | Login to CLI | `devtrack login` |
| `devtrack logout` | Logout | `devtrack logout` |
| `devtrack init` | Initialize repo | `devtrack init` |
| `devtrack remote add <id>` | Connect remote | `devtrack remote add 123` |
| `devtrack remote` | Show remote | `devtrack remote` |
| `devtrack add <files>` | Stage files | `devtrack add app.js` |
| `devtrack status` | Show status | `devtrack status` |
| `devtrack commit "msg"` | Commit | `devtrack commit "Fix bug"` |
| `devtrack log` | Show history | `devtrack log` |
| `devtrack push` | Push to remote | `devtrack push` |
| `devtrack pull` | Pull from remote | `devtrack pull` |
| `devtrack revert <id>` | Revert commit | `devtrack revert abc123` |

### Web Dashboard Features

- ✅ Create/View repositories
- ✅ Add files via web UI
- ✅ View commit history
- ✅ Push/Pull operations
- ✅ User profile management
- ✅ Repository statistics

## 🎯 Complete Workflow Example

### Scenario: Create a new project and sync it

**Step 1: Setup (One-time)**
```bash
# Start backend
cd backend && npm start

# Start frontend (new terminal)
cd frontend && npm run dev

# Login to CLI
devtrack login
```

**Step 2: Create Repository (Web)**
1. Go to http://localhost:5173
2. Register/Login
3. Create repository "my-app"
4. Copy repository ID: `694ce5ae68fc2a8d1710e65c`

**Step 3: Initialize Local Project**
```bash
# Create project folder
mkdir my-app
cd my-app

# Create some files
echo console.log("Hello"); > app.js
echo <html></html> > index.html

# Initialize DevTrack
devtrack init

# Connect to remote
devtrack remote add 694ce5ae68fc2a8d1710e65c
```

**Step 4: Version Control**
```bash
# Add files
devtrack add app.js index.html

# Check status
devtrack status

# Commit
devtrack commit "Initial commit"

# Push
devtrack push
```

**Step 5: View in Dashboard**
1. Go to http://localhost:5173/repo/694ce5ae68fc2a8d1710e65c
2. See your commit!
3. All files visible
4. History shows your commit

## 🔍 Understanding the Code

### Backend Structure

**`backend/index.js`**
- Main entry point
- Handles both: Server startup AND CLI commands
- Uses Yargs for CLI parsing
- Starts Express server on `npm start`

**`backend/controllers/gitController.js`**
- All Git-like commands
- `init()` - Creates `.devtrack` folder
- `add()` - Stages files
- `commit()` - Creates commits
- `push()` - Syncs with remote
- `pull()` - Downloads from remote

**`backend/utils/localRepo.js`**
- Manages local repository
- Creates `.devtrack` structure
- Handles staging area
- Manages commits locally

**`backend/utils/cliAuth.js`**
- Stores authentication token
- Saves in `~/.devtrack/config.json`
- Used by CLI to authenticate API calls

**`backend/controllers/vcController.js`**
- API endpoints for version control
- Used by both CLI and Frontend
- Handles: init, add, commit, push, pull, log

### Frontend Structure

**`frontend/src/pages/RepoDetail.jsx`**
- Repository detail page
- Shows commits, staged files
- Allows web-based version control
- Displays CLI connection instructions

**`frontend/src/pages/Profile.jsx`**
- User profile page
- Shows statistics
- Edit profile settings

**`frontend/src/api/Axios.js`**
- API client configuration
- Base URL: http://localhost:3000
- Handles authentication headers

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify `.env` file exists
- Check MongoDB connection string

### Frontend can't connect
- Make sure backend is running
- Check CORS settings in backend
- Verify API URL in `frontend/src/api/Axios.js`

### CLI commands not found
- Use `devtrack.bat` from project root
- Or use `node backend/index.js <command>`
- Or install globally: `cd backend && npm install -g .`

### "Not authenticated" error
- Run `devtrack login` first
- Check token in `~/.devtrack/config.json`

### "Not in a repository" error
- Run `devtrack init` first
- Make sure `.devtrack` folder exists

## 📝 Important Files

- **`backend/.env`** - Environment variables (create this!)
- **`backend/index.js`** - Main entry point
- **`devtrack.bat`** - Windows CLI wrapper
- **`~/.devtrack/config.json`** - CLI auth config (auto-created)
- **`.devtrack/`** - Local repository (created per project)

## 🎉 You're Ready!

You now have a complete version control system:

1. ✅ **CLI** - Use commands in terminal
2. ✅ **Web Dashboard** - Visual interface
3. ✅ **Local Storage** - Commits in `.devtrack/`
4. ✅ **Cloud Storage** - Supabase backup
5. ✅ **Database** - MongoDB for metadata
6. ✅ **Real-time Sync** - CLI ↔ Dashboard

Start using it in your projects! 🚀

## 📞 Need Help?

- Check `GIT_LIKE_CLI_GUIDE.md` for CLI details
- Check `COMPLETE_GIT_SYSTEM.md` for system overview
- Check `CLI_INSTALLATION.md` for installation help

---

**Happy Coding! 🎊**
