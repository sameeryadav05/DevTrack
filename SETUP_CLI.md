# DevTrack CLI Setup Guide

## The Problem

When you install globally, npm creates a command based on the package name. Since the package is named `devtrack-cli`, you might see `devtrack.js` in the help, but the actual command should be `devtrack`.

## Solution: Reinstall Properly

### Step 1: Uninstall if Already Installed

```bash
npm uninstall -g devtrack-cli
```

### Step 2: Install from Backend Directory

```bash
cd backend
npm install -g .
```

### Step 3: Verify Installation

```bash
devtrack --help
```

You should see:
```
devtrack <command>

Commands:
  devtrack start                command to start the server
  devtrack login                Login to DevTrack CLI
  ...
```

## If It Still Shows `devtrack.js`

### Option A: Use the Command as Shown

If npm installed it as `devtrack.js`, just use that:

```bash
devtrack.js login
devtrack.js init
devtrack.js remote add <repoId>
```

### Option B: Create a Windows Batch File

Create a file `devtrack.bat` in a folder that's in your PATH (like `C:\Windows\System32` or create a `bin` folder):

**devtrack.bat:**
```batch
@echo off
node "C:\Users\samee\OneDrive\Desktop\DevTrack\backend\index.js" %*
```

Then you can use:
```bash
devtrack login
devtrack init
```

### Option C: Use Direct Path (Easiest for Now)

Create an alias or just use the full path:

**PowerShell:**
```powershell
function devtrack {
    node "C:\Users\samee\OneDrive\Desktop\DevTrack\backend\index.js" $args
}
```

Add this to your PowerShell profile:
```powershell
notepad $PROFILE
```

Then use:
```bash
devtrack login
devtrack init
```

## Quick Fix: Use Direct Command

For now, the easiest way is to use the direct command:

```bash
# From backend directory
node index.js login
node index.js init
node index.js remote add <repoId>
```

Or create a simple wrapper script in your project root:

**devtrack.bat** (in project root):
```batch
@echo off
cd backend
node index.js %*
```

Then use:
```bash
devtrack login
devtrack init
```

## Recommended Setup for Windows

1. **Create a devtrack.bat file** in your project root:

```batch
@echo off
node "%~dp0backend\index.js" %*
```

2. **Add project root to PATH** (optional):
   - Add `C:\Users\samee\OneDrive\Desktop\DevTrack` to your PATH
   - Then you can use `devtrack` from anywhere

3. **Or use PowerShell function** (add to profile):

```powershell
function devtrack {
    param([Parameter(ValueFromRemainingArguments=$true)]$args)
    node "C:\Users\samee\OneDrive\Desktop\DevTrack\backend\index.js" $args
}
```

## Test It Works

```bash
# Method 1: Direct (always works)
node backend/index.js --help

# Method 2: From backend directory
cd backend
node index.js --help

# Method 3: If installed globally
devtrack --help
```

## Complete Usage Example

```bash
# Login
node backend/index.js login

# Go to your project
cd ~/my-project

# Initialize
node C:\Users\samee\OneDrive\Desktop\DevTrack\backend\index.js init

# Or use the batch file
devtrack init

# Connect to remote
devtrack remote add 694ce5ae68fc2a8d1710e65c

# Add files
devtrack add app.js

# Commit
devtrack commit "Initial commit"

# Push
devtrack push
```

## Summary

**For immediate use:**
- Use `node backend/index.js <command>` from project root
- Or `node index.js <command>` from backend directory

**For better experience:**
- Create `devtrack.bat` wrapper in project root
- Or add PowerShell function to your profile

The CLI works perfectly, it's just about making the command name shorter! 🚀

