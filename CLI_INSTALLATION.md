# DevTrack CLI Installation Guide

## Installation Options

### Option 1: Install Globally (Recommended)

This allows you to use `devtrack` command from anywhere:

```bash
cd backend
npm install -g .
```

Or if you're in the project root:
```bash
npm install -g ./backend
```

After installation, you can use:
```bash
devtrack login
devtrack init
devtrack add file.js
# etc.
```

### Option 2: Use npm link (For Development)

If you're developing the CLI and want to test it:

```bash
cd backend
npm link
```

This creates a global symlink, so you can use `devtrack` command from anywhere.

### Option 3: Use Directly (No Installation)

You can use the CLI without installing by running:

```bash
# From backend directory
node index.js <command>

# Or from project root
node backend/index.js <command>
```

Or create an alias in your shell:

**For Windows (PowerShell):**
```powershell
# Add to your PowerShell profile
Set-Alias devtrack "node C:\path\to\DevTrack\backend\index.js"
```

**For Linux/Mac (Bash/Zsh):**
```bash
# Add to ~/.bashrc or ~/.zshrc
alias devtrack='node /path/to/DevTrack/backend/index.js'
```

Then reload your shell:
```bash
source ~/.bashrc  # or source ~/.zshrc
```

## Verify Installation

After installing globally, verify it works:

```bash
devtrack --help
```

You should see all available commands.

## Uninstall

If you installed globally and want to remove it:

```bash
npm uninstall -g devtrack-cli
```

## Quick Start After Installation

1. **Login:**
   ```bash
   devtrack login
   ```

2. **Navigate to your project:**
   ```bash
   cd ~/my-project
   ```

3. **Initialize:**
   ```bash
   devtrack init
   ```

4. **Connect to remote:**
   ```bash
   devtrack remote add <repositoryId>
   ```

5. **Start using:**
   ```bash
   devtrack add file.js
   devtrack commit "Initial commit"
   devtrack push
   ```

## Troubleshooting

### "devtrack: command not found"

**If installed globally:**
- Make sure npm global bin is in your PATH
- Check: `npm config get prefix`
- Add to PATH if needed

**If using alias:**
- Make sure the path is correct
- Reload your shell

**If using directly:**
- Use full path: `node /path/to/backend/index.js <command>`

### Permission Errors (Linux/Mac)

If you get permission errors when installing globally:

```bash
sudo npm install -g ./backend
```

Or fix npm permissions:
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

Then install:
```bash
npm install -g ./backend
```

## Alternative: Create a Wrapper Script

Create a file `devtrack` (or `devtrack.bat` for Windows) in your project root:

**Linux/Mac (`devtrack`):**
```bash
#!/bin/bash
node "$(dirname "$0")/backend/index.js" "$@"
```

Make it executable:
```bash
chmod +x devtrack
```

**Windows (`devtrack.bat`):**
```batch
@echo off
node "%~dp0backend\index.js" %*
```

Then you can use:
```bash
./devtrack login
./devtrack init
```

## Recommended Setup

For the best experience, use **Option 1 (Global Installation)**:

```bash
cd backend
npm install -g .
```

This gives you:
- ✅ `devtrack` command available everywhere
- ✅ Clean command syntax
- ✅ No need to remember paths
- ✅ Works like any other CLI tool

## Next Steps

After installation, see:
- `GIT_LIKE_CLI_GUIDE.md` - Complete usage guide
- `COMPLETE_GIT_SYSTEM.md` - System overview

