# 🔧 Quick Fix - Reinstall CLI

## Correct Commands

Since you used `npm link` (not `npm install -g`), use these commands:

```bash
cd backend

# Unlink the package
npm unlink -g devtrack-cli

# Or if that doesn't work, try:
npm unlink -g

# Then re-link
npm link
```

## Alternative: Just Re-link

If unlink doesn't work, you can just re-link (it will overwrite):

```bash
cd backend
npm link
```

The changes are already in the code, so re-linking will apply them.

## Test After Re-linking

```bash
# Go to your project
cd C:\Users\samee\OneDrive\Desktop\DevtrackCliDemo

# Remove old .devtrack
rmdir /s /q .devtrack

# Test
devtrack init
devtrack remote add 694ce5ae68fc2a8d1710e65c
devtrack remote
```

## If Still Having Issues

You can also just restart your terminal and the changes should be picked up, or use:

```bash
# Direct command (always works)
node C:\Users\samee\OneDrive\Desktop\DevTrack\backend\index.js init
```

But the `devtrack` command should work after re-linking.

