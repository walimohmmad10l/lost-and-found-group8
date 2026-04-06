# 🔍 Campus Lost & Found Management System
### Group 8 — Complete Setup Guide

---

## 📁 Project Structure

```
lost-and-found/
├── backend/               ← Node.js + Express API
│   ├── models/            ← Database schemas
│   ├── routes/            ← API endpoints
│   ├── middleware/        ← Auth + file upload
│   ├── uploads/           ← Uploaded images (auto-created)
│   ├── server.js          ← Main entry point
│   ├── .env.example       ← Copy this to .env
│   └── package.json
│
└── frontend/              ← React app
    ├── public/
    ├── src/
    │   ├── pages/         ← All page components
    │   ├── components/    ← Reusable components
    │   ├── context/       ← Auth state management
    │   ├── App.js         ← Routes setup
    │   └── index.css      ← All styles
    └── package.json
```

---

## ✅ STEP 1 — Install Prerequisites

Make sure you have these installed on your computer:

1. **Node.js** — Download from https://nodejs.org (get LTS version)
   - Verify: open terminal → type `node -v` → should show v18+ 

2. **MongoDB** — Download from https://www.mongodb.com/try/download/community
   - Install and start it. It runs on port 27017 by default.
   - OR use MongoDB Atlas (free cloud): https://www.mongodb.com/atlas

3. **VS Code** — You already have this ✓

---

## ✅ STEP 2 — Set Up the Backend

Open a terminal in VS Code. Navigate into the backend folder:

```bash
cd lost-and-found/backend
```

Install all backend packages:
```bash
npm install
```

Create your environment file:
```bash
# On Windows:
copy .env.example .env

# On Mac/Linux:
cp .env.example .env
```

Open the `.env` file and update it:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/lostandfound
JWT_SECRET=mysecretkey123changeThis
NODE_ENV=development
```

> If using MongoDB Atlas instead of local:
> Replace MONGO_URI with your Atlas connection string like:
> `MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/lostandfound`

Start the backend server:
```bash
npm run dev
```

You should see:
```
✅ MongoDB connected
🚀 Server running on port 5000
```

---

## ✅ STEP 3 — Set Up the Frontend

Open a **NEW terminal** (keep the backend running). Navigate to frontend:

```bash
cd lost-and-found/frontend
```

Install all frontend packages:
```bash
npm install
```

Start the React app:
```bash
npm start
```

The app will open at **http://localhost:3000** in your browser.

---

## ✅ STEP 4 — Create the First Admin Account

The first admin must be created manually using the API.

1. First, register a normal account at http://localhost:3000/register

2. Open MongoDB Compass (or use mongosh terminal) and update that user's role:
   ```
   Database: lostandfound
   Collection: users
   Find the user you created → Edit → change "role" from "user" to "admin"
   ```

   OR use this API call with Postman/Thunder Client:
   - POST http://localhost:5000/api/auth/login
   - Body: `{ "email": "admin@test.com", "password": "123456" }`
   - Copy the token from response
   - POST http://localhost:5000/api/admin/create-admin
   - Header: Authorization: Bearer <token>
   - Body: `{ "name": "Admin", "email": "admin2@test.com", "password": "admin123" }`

---

## ✅ STEP 5 — Test the Application

Open http://localhost:3000 and try:

1. **Register** a new account
2. **Browse items** on the homepage
3. **Report a lost item** — fill the form and submit
4. **Report a found item** — change type to "Found"
5. **Search** for items using keywords
6. **View item detail** and see contact info
7. **Dashboard** — see all your reported items
8. **Admin panel** (if admin) — verify/remove items

---

## 🌐 DEPLOYMENT (Hosting the App Online)

### Backend — Deploy to Render.com (Free)

1. Create account at https://render.com
2. Click "New Web Service" → Connect your GitHub repo
3. Set these settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Add Environment Variables:
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = any long random string
   - `NODE_ENV` = production

### Frontend — Deploy to Vercel.com (Free)

1. Create account at https://vercel.com
2. Import your GitHub repo
3. Set **Root Directory** to `frontend`
4. Add Environment Variable:
   - `REACT_APP_API_URL` = your Render backend URL (e.g. https://yourapp.onrender.com)
5. In `frontend/src/context/AuthContext.js` and all axios calls, replace `/api/` with `process.env.REACT_APP_API_URL + '/api/'` if needed.

> For local development, the `"proxy": "http://localhost:5000"` in frontend/package.json handles this automatically.

---

## 📋 API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/auth/register | Register user | No |
| POST | /api/auth/login | Login | No |
| GET | /api/auth/me | Get current user | Yes |
| GET | /api/items | Get all items (filters) | No |
| GET | /api/items/:id | Get single item | No |
| POST | /api/items | Create item | Yes |
| PUT | /api/items/:id | Update item | Yes (owner) |
| DELETE | /api/items/:id | Delete item | Yes (owner) |
| GET | /api/items/user/my-items | My items | Yes |
| GET | /api/admin/stats | Dashboard stats | Admin only |
| GET | /api/admin/items | All items | Admin only |
| PATCH | /api/admin/items/:id/verify | Verify item | Admin only |
| PATCH | /api/admin/items/:id/status | Change status | Admin only |
| GET | /api/admin/users | All users | Admin only |

---

## 🚨 Common Errors & Fixes

**"Cannot connect to MongoDB"**
→ Make sure MongoDB is running. Run `mongod` in terminal, or check MongoDB Compass.

**"Port 5000 already in use"**
→ Change PORT in .env to 5001 or kill the process using that port.

**"Module not found"**
→ Run `npm install` again in the correct folder.

**Frontend shows blank page**
→ Check browser console for errors. Make sure backend is running on port 5000.

**Images not showing**
→ Make sure `/backend/uploads/` folder exists (it's created automatically).

---

## 👥 Group 8 — Feature Summary

| Feature | Status |
|---------|--------|
| User Registration & Login | ✅ Complete |
| Report Lost Item (with photo) | ✅ Complete |
| Report Found Item (with photo) | ✅ Complete |
| Search & Filter Items | ✅ Complete |
| Item Detail with Contact Info | ✅ Complete |
| User Dashboard | ✅ Complete |
| Admin Panel — Verify/Remove | ✅ Complete |
| Admin User Management | ✅ Complete |
| Pagination | ✅ Complete |
| JWT Authentication | ✅ Complete |
| Image Upload | ✅ Complete |

---

Built with: React.js · Node.js · Express · MongoDB · JWT
