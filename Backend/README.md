# 🔥 IronForge Gym — Full Stack Website

A complete gym membership website with **Node.js + Express + MongoDB** backend.

---

## 📁 Project Structure

```
ironforge-gym/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   └── email.js           # Nodemailer email utils
│   ├── models/
│   │   ├── Member.js          # Member schema (Mongoose)
│   │   └── Contact.js         # Contact form schema
│   ├── routes/
│   │   ├── auth.js            # Register / Login / Profile
│   │   ├── members.js         # Member CRUD + Admin stats
│   │   └── contact.js         # Contact form
│   ├── server.js              # Express app entry point
│   ├── package.json
│   └── .env.example           # Environment variable template
└── frontend/
    └── index.html             # Complete gym website (single file)
```

---

## ⚡ Quick Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) (local) OR a free [MongoDB Atlas](https://www.mongodb.com/atlas) cloud account

### 2. Install backend dependencies
```bash
cd backend
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
```
Edit `.env` with your values:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ironforge   # or your Atlas URI
JWT_SECRET=replace_with_long_random_string
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
ADMIN_EMAIL=admin@ironforge.com
```

> **Gmail App Password**: Go to Google Account → Security → 2-Step Verification → App Passwords

### 4. Start the backend server
```bash
# Production
npm start

# Development (auto-restart on file changes)
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
🔥 IronForge Gym Server running on port 5000
```

### 5. Open the frontend
Just open `frontend/index.html` in your browser directly, or serve it with:
```bash
npx serve frontend
# or
python3 -m http.server 3000 --directory frontend
```

---

## 🌐 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new member | Public |
| POST | `/api/auth/login` | Login | Public |
| GET | `/api/auth/me` | Get own profile | 🔐 JWT |

### Members (Admin)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/members` | List all members | 🔐 Admin |
| GET | `/api/members/stats` | Dashboard statistics | 🔐 Admin |
| GET | `/api/members/:id` | Get one member | 🔐 JWT |
| PUT | `/api/members/:id/status` | Update status | 🔐 Admin |
| PUT | `/api/members/:id/plan` | Change plan | 🔐 JWT |
| DELETE | `/api/members/:id` | Delete member | 🔐 Admin |

### Contact
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/contact` | Submit inquiry | Public |
| GET | `/api/contact` | View all inquiries | 🔐 Admin |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server status check |

---

## 🔒 Authentication

The API uses **JWT (JSON Web Tokens)**. After login/register, include the token in all protected requests:

```http
Authorization: Bearer <your_jwt_token>
```

---

## 📦 Sample API Requests

### Register a Member
```json
POST /api/auth/register
{
  "firstName": "Raj",
  "lastName": "Kumar",
  "email": "raj@example.com",
  "password": "MyPass@123",
  "phone": "+91 98765 43210",
  "age": 28,
  "gender": "Male",
  "fitnessGoal": "Muscle Gain",
  "membershipPlan": "Elite",
  "experienceLevel": "Intermediate"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "raj@example.com",
  "password": "MyPass@123"
}
```

---

## 🗄️ MongoDB Collections

### `members`
```
_id, memberId (IGF-xxx), firstName, lastName, email, password (hashed),
phone, age, gender, fitnessGoal, membershipPlan, experienceLevel,
membershipStatus, membershipStartDate, membershipEndDate,
role, isEmailVerified, notes, createdAt, updatedAt
```

### `contacts`
```
_id, name, email, phone, subject, message, status, createdAt, updatedAt
```

---

## 🚀 Deploy to Production

### Backend (Railway / Render / Heroku)
1. Push your code to GitHub
2. Connect to Railway/Render
3. Set environment variables in the dashboard
4. Set `NODE_ENV=production`

### Frontend
- Upload `index.html` to **Netlify** (drag & drop)
- Or host on **GitHub Pages**
- Update `API_BASE` in `index.html` to your deployed backend URL

### MongoDB Atlas (Cloud DB)
1. Create free account at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a cluster → Get connection string
3. Replace `MONGODB_URI` in your `.env`

---

## 🛡️ Security Features
- ✅ Passwords hashed with **bcryptjs** (salt rounds: 12)
- ✅ JWT authentication with expiry
- ✅ Rate limiting (100 req/15min general, 10 req/15min on auth)
- ✅ Helmet.js security headers
- ✅ Input validation with express-validator
- ✅ CORS protection
- ✅ MongoDB injection protection via Mongoose

---

## 📧 Email Features
- Welcome email sent to new members with their Member ID
- Admin notification email on every new registration
- HTML email template matching gym branding

---

*Built with ❤️ for IronForge Gym*
