# How to Start Backend and Frontend

## Prerequisites
Make sure you have Node.js and npm installed on your system.

## Backend Setup

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies (if not already installed):**
   ```bash
   npm install
   ```

3. **Create a `.env` file in the backend folder** with the following variables:
   ```
   PORT=3000
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_ROLE_KEY=your_supabase_service_role_key
   S3_BUCKET=commits
   ```

4. **Start the backend server:**
   ```bash
   node index.js start
   ```
   
   Or if you have nodemon installed globally:
   ```bash
   npm run dev
   ```
   
   **Note:** The backend uses yargs, so you need to pass `start` as a command argument. If `npm run dev` doesn't work, use `node index.js start` directly.

   The server will start on `http://localhost:3000`

## Frontend Setup

1. **Open a new terminal and navigate to frontend folder:**
   ```bash
   cd frontend
   ```

2. **Install dependencies (if not already installed):**
   ```bash
   npm install
   ```

3. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:5173` (default Vite port)

## Quick Start (Both Servers)

### Option 1: Two Separate Terminals

**Terminal 1 (Backend):**
```bash
cd backend
node index.js start
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

### Option 2: Update Backend Script (Recommended)

You can update the backend `package.json` to make it easier:

```json
{
  "scripts": {
    "dev": "node index.js start",
    "start": "node index.js start"
  }
}
```

Then you can use:
```bash
cd backend
npm run dev
```

## Verify Everything is Working

1. Backend should show: `server is listening on port 3000` and `Database connected successfully !`
2. Frontend should open in your browser at `http://localhost:5173`
3. You should be able to:
   - Register/Login
   - Create repositories
   - Access repository detail pages
   - Use version control features

## Troubleshooting

- **Backend won't start:** Make sure MongoDB is running and the connection string is correct
- **Frontend can't connect:** Check that backend is running on port 3000 and CORS is configured correctly
- **Port already in use:** Change the PORT in backend `.env` file or kill the process using that port

