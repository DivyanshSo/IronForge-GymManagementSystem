# 🔥 IronForge Gym — Full Stack Web Application

![IronForge Gym](https://img.shields.io/badge/IronForge-Gym-ff5c00?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-v22-339933?style=for-the-badge&logo=nodedotjs)
![Express](https://img.shields.io/badge/Express-4.18-000000?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-7.6-47A248?style=for-the-badge&logo=mongodb)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=for-the-badge&logo=javascript)

A fully functional, production-ready **Gym Management Website** with member registration, login portal, admin dashboard, exercise finder, BMI calculator, and a complete REST API backend.

---

## 🌐 Live Demo

| Page | Link |
|------|------|
| 🏠 Main Website | `Frontend/index.html` |
| 👤 Member Portal | `Frontend/member-portal.html` |
| 🔐 Admin Dashboard | `Frontend/admin.html` |
| ⚙️ API Health Check | `http://localhost:5000/api/health` |

---

## 📸 Features

### 🏠 Main Website (`index.html`)
- Hero section with animated typography
- Membership plans (Starter ₹999 / Elite ₹1,999 / Pro ₹3,499)
- Exercise finder — filter by goal, experience level, muscle group
- Member registration form connected to backend API
- **Login modal in navbar** — login/signup popup
- **After login** — shows member name + dropdown menu in navbar
- Fully responsive on mobile

### 👤 Member Portal (`member-portal.html`)
- Secure login & registration
- **Overview Dashboard** — stats cards, weekly activity chart, workout split chart
- **My Workouts** — personalized exercises based on fitness goal
- **Progress Tracker** — weight history chart, goal completion bars, activity timeline
- **BMI Calculator** — with personalized gym advice
- **Membership** — plan details, upgrade options
- **Profile** — editable personal information

### 🔐 Admin Dashboard (`admin.html`)
- Secure admin-only login
- **KPI Cards** — total members, active, pending, monthly revenue
- **Charts** — member growth, plan distribution, revenue trends, analytics
- **Member Management** — search, filter, activate, delete members
- **Revenue Overview** — monthly/annual projections, per-plan breakdown
- **Analytics** — registrations, experience levels, gender split, status breakdown
- **Activity Feed** — recent system events

### ⚙️ Backend API
- JWT Authentication (Register / Login / Profile)
- Member CRUD with admin controls
- Password hashing with bcryptjs
- Email notifications (welcome email + admin alerts)
- Rate limiting & security headers
- Input validation

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Charts** | Chart.js 4.4 |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB + Mongoose |
| **Authentication** | JWT (JSON Web Tokens) |
| **Password Hashing** | bcryptjs |
| **Email** | Nodemailer |
| **Security** | Helmet.js, express-rate-limit, CORS |
| **Validation** | express-validator |

---

## 📁 Project Structure

```
ironforge-gym/
├── Backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication & protection
│   │   └── email.js           # Nodemailer email utilities
│   ├── models/
│   │   ├── Member.js          # Member Mongoose schema
│   │   └── Contact.js         # Contact form schema
│   ├── routes/
│   │   ├── auth.js            # Register / Login / Profile routes
│   │   ├── members.js         # Member CRUD + admin stats
│   │   └── contact.js         # Contact form routes
│   ├── server.js              # Express app entry point
│   ├── package.json
│   └── .env.example           # Environment variables template
└── Frontend/
    ├── index.html             # Main gym website
    ├── member-portal.html     # Member dashboard
    └── admin.html             # Admin dashboard
```

---

## ⚡ Quick Start (Local Setup)

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/try/download/community) (local) or [MongoDB Atlas](https://mongodb.com/atlas) (cloud)
- [VS Code](https://code.visualstudio.com/) (recommended)

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/ironforge-gym.git
cd ironforge-gym
```

### 2. Install Backend Dependencies
```bash
cd Backend
npm install
```

### 3. Configure Environment Variables
```bash
copy .env.example .env
```
Open `.env` and fill in your values:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ironforge
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:5500
ADMIN_EMAIL=admin@ironforge.com
ADMIN_PASSWORD=Admin@123456
```

### 4. Start the Backend Server
```bash
node server.js
```
You should see:
```
✅ MongoDB Connected: localhost
🔥 IronForge Gym Server running on port 5000
```

### 5. Open the Frontend
Open `Frontend/index.html` directly in your browser, or use the VS Code **Live Server** extension.

---

## 🌐 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new member | Public |
| POST | `/api/auth/login` | Login | Public |
| GET | `/api/auth/me` | Get own profile | 🔐 JWT |

### Members
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/members` | List all members | 🔐 Admin |
| GET | `/api/members/stats` | Dashboard statistics | 🔐 Admin |
| GET | `/api/members/:id` | Get one member | 🔐 JWT |
| PUT | `/api/members/:id/status` | Update membership status | 🔐 Admin |
| PUT | `/api/members/:id/plan` | Change membership plan | 🔐 JWT |
| DELETE | `/api/members/:id` | Delete member | 🔐 Admin |

### Contact
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/contact` | Submit contact form | Public |
| GET | `/api/contact` | View all inquiries | 🔐 Admin |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server status check |

---

## 🔒 Security Features

- ✅ Passwords hashed with **bcryptjs** (12 salt rounds)
- ✅ **JWT tokens** with configurable expiry
- ✅ **Rate limiting** — 100 req/15min general, 10 req/15min on auth routes
- ✅ **Helmet.js** security headers
- ✅ **CORS** protection
- ✅ Input validation with **express-validator**
- ✅ MongoDB injection protection via Mongoose

---

## 🚀 Deployment

### Frontend → Netlify
1. Go to [netlify.com](https://netlify.com)
2. Drag & drop the `Frontend/` folder
3. Live in 2 minutes ✅

### Backend → Render
1. Go to [render.com](https://render.com)
2. New Web Service → connect GitHub repo
3. Set Root Directory: `Backend`
4. Start Command: `node server.js`
5. Add all environment variables
6. Deploy ✅

### Database → MongoDB Atlas
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free M0 cluster
3. Get connection string
4. Set as `MONGODB_URI` in Render environment variables ✅

---

## 🎭 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Member | `member@demo.com` | `demo1234` |
| Admin | `admin@ironforge.com` | `Admin@123456` |

> Works even without backend running (demo mode fallback built-in)

---

## 📊 Database Schema

### Member Collection
```
memberId         String  (auto-generated e.g. IGF-ABC123-XY)
firstName        String
lastName         String
email            String  (unique)
password         String  (bcrypt hashed)
phone            String
age              Number
gender           String
fitnessGoal      String
membershipPlan   String  (Starter / Elite / Pro)
experienceLevel  String  (Beginner / Intermediate / Advanced)
membershipStatus String  (pending / active / expired / cancelled)
role             String  (member / admin)
createdAt        Date    (auto)
updatedAt        Date    (auto)
```

---

## 🔮 Future Improvements

- [ ] Razorpay / Stripe payment integration
- [ ] Class booking & scheduling system
- [ ] Trainer appointment booking
- [ ] Real-time notifications with Socket.io
- [ ] Google OAuth login
- [ ] Workout plan builder
- [ ] Diet & nutrition planner
- [ ] Docker + CI/CD pipeline
- [ ] Mobile app (React Native)

---

## 👨‍💻 Author

**Divya**
- GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">Built with 🔥 for IronForge Gym</p>
<p align="center"><strong>FORGE YOUR LEGACY</strong></p>
