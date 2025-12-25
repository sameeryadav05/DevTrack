# 🚀 Quick Start Guide

## Starting the Application

### Step 1: Start Backend Server

Open a terminal and run:

```bash
cd backend
npm install  # Only needed first time
node index.js start
```

**OR** use the npm script:
```bash
cd backend
npm start
```

You should see:
- ✅ `Database connected successfully !`
- ✅ `server is listening on port 3000`

### Step 2: Start Frontend Server

Open a **NEW terminal** and run:

```bash
cd frontend
npm install  # Only needed first time
npm run dev
```

You should see:
- ✅ Vite dev server running
- ✅ Local URL: `http://localhost:5173`

### Step 3: Open in Browser

Navigate to: **http://localhost:5173**

---

## 📋 Prerequisites Checklist

Before starting, make sure you have:

1. ✅ **Node.js installed** (v14 or higher)
2. ✅ **MongoDB running** (local or cloud)
3. ✅ **Backend `.env` file** with:
   - `MONGODB_URL`
   - `JWT_SECRET`
   - `SUPABASE_URL`
   - `SUPABASE_ROLE_KEY`
   - `PORT=3000`

---

## 🎯 What You Can Do Now

1. **Register/Login** - Create an account
2. **Create Repository** - Click "new" button on dashboard
3. **Initialize Repo** - Click "Initialize Repository" on repo page
4. **Add Files** - Use "Add File" tab
5. **Commit** - Stage files and commit with message
6. **Push/Pull** - Sync with Supabase storage

---

## ⚠️ Troubleshooting

**Backend won't start?**
- Check MongoDB connection string in `.env`
- Make sure MongoDB is running
- Check if port 3000 is available

**Frontend can't connect?**
- Make sure backend is running first
- Check browser console for errors
- Verify CORS settings in backend

**Port already in use?**
- Change `PORT` in backend `.env`
- Or kill the process: `npx kill-port 3000` (or 5173)

---

## 📝 Environment Variables Template

Create `backend/.env`:

```env
PORT=3000
MONGODB_URL=mongodb://localhost:27017/DevTrack
JWT_SECRET=your_secret_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ROLE_KEY=your_service_role_key
S3_BUCKET=commits
```

