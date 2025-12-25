# ⚡ Quick Start Guide - Get Running in 5 Minutes

## 🎯 What You Need

- Node.js installed
- MongoDB running
- Supabase account (free tier works)

## 🚀 5-Minute Setup

### 1. Install Dependencies (2 min)

```bash
# Backend
cd backend
npm install

# Frontend (new terminal)
cd frontend
npm install
```

### 2. Setup Environment (1 min)

Create `backend/.env`:
```env
PORT=3000
MONGODB_URL=mongodb://localhost:27017/DevTrack
JWT_SECRET=any_random_string_here
SUPABASE_URL=your_supabase_url
SUPABASE_ROLE_KEY=your_supabase_key
```

### 3. Start Everything (1 min)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4. Test It (1 min)

1. Open http://localhost:5173
2. Register account
3. Create repository
4. Done! ✅

## 📋 First Time Usage

### Web Dashboard

1. **Register:** http://localhost:5173 → Register
2. **Create Repo:** Dashboard → "new" button
3. **View Repo:** Click on repository
4. **Add File:** "Add File" tab → Add content → Commit

### CLI

```bash
# 1. Login
node backend/index.js login

# 2. Go to your project
cd my-project

# 3. Initialize
node C:\Users\samee\OneDrive\Desktop\DevTrack\backend\index.js init

# 4. Connect remote (get ID from dashboard)
node C:\Users\samee\OneDrive\Desktop\DevTrack\backend\index.js remote add <id>

# 5. Use it!
node C:\Users\samee\OneDrive\Desktop\DevTrack\backend\index.js add app.js
node C:\Users\samee\OneDrive\Desktop\DevTrack\backend\index.js commit "First commit"
node C:\Users\samee\OneDrive\Desktop\DevTrack\backend\index.js push
```

## 💡 Pro Tip

Use the `devtrack.bat` file for easier commands:

```bash
devtrack.bat login
devtrack.bat init
devtrack.bat add app.js
devtrack.bat commit "First commit"
```

## ✅ Verify It Works

1. Backend shows: `server is listening on port 3000`
2. Frontend opens: http://localhost:5173
3. Can register/login
4. Can create repository
5. CLI commands work

**You're all set! 🎉**

