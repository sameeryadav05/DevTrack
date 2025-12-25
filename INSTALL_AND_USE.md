# Quick Installation & Usage Guide

## 🚀 Installation (Choose One Method)

### Method 1: Global Installation (Best)

```bash
cd backend
npm install -g .
```

Now you can use `devtrack` from anywhere:
```bash
devtrack login
devtrack init
```

### Method 2: Direct Usage (No Installation)

From the backend directory:
```bash
node index.js login
node index.js init
```

Or from project root:
```bash
node backend/index.js login
node backend/index.js init
```

### Method 3: Create Alias

**Windows PowerShell:**
```powershell
Set-Alias devtrack "node C:\Users\samee\OneDrive\Desktop\DevTrack\backend\index.js"
```

**Linux/Mac:**
```bash
alias devtrack='node /path/to/DevTrack/backend/index.js'
```

## ✅ Verify Installation

```bash
devtrack --help
# or
node backend/index.js --help
```

## 📝 Complete Usage Example

```bash
# 1. Login
devtrack login
# Enter your email and password

# 2. Go to your project
cd ~/my-project

# 3. Initialize repository
devtrack init

# 4. Connect to remote (get ID from DevTrack dashboard)
devtrack remote add 507f1f77bcf86cd799439011

# 5. Add files
devtrack add app.js index.html

# 6. Commit
devtrack commit "Initial commit"

# 7. Push
devtrack push

# 8. View in dashboard
# Go to http://localhost:5173/repo/507f1f77bcf86cd799439011
```

## 🎯 All Commands

```bash
devtrack login              # Login to CLI
devtrack logout             # Logout
devtrack init               # Initialize repository
devtrack remote add <id>    # Connect to remote
devtrack remote             # Show remote
devtrack add <files...>      # Add files
devtrack status             # Show status
devtrack commit "msg"       # Commit
devtrack log                # Show history
devtrack push               # Push to remote
devtrack pull               # Pull from remote
devtrack revert <id>        # Revert commit
```

## 💡 Recommendation

**Use Method 1 (Global Installation)** for the best experience:
- Clean command syntax
- Works from any directory
- No need to remember paths
- Just like Git!

```bash
cd backend
npm install -g .
```

Then use `devtrack` everywhere! 🎉

