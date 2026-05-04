# 📋 CareerBoard — Job Application Tracker

> Track your job applications, visualise your progress, land your dream job.

CareerBoard is a full-stack web application that helps job seekers manage their entire job search in one place. Features a modern dashboard with analytics, a Kanban board with drag & drop, and complete CRUD with JWT authentication.

---

## ✨ Features

- 🔐 **Authentication** — Register / Login with JWT (stored securely, auto-refresh)
- 📊 **Dashboard** — Stats cards, monthly bar chart (Recharts), status pie chart, interview rate insight
- 📋 **Applications list** — Search, filter by status/priority, sort, paginate
- 🗂️ **Kanban board** — Drag & drop cards between columns to update status instantly
- 🌙 **Dark / Light mode** — System default + toggle, persisted in localStorage
- 🏷️ **Tags & Notes** — Add custom tags and freeform notes to each application
- 🔗 **Job URL** — Direct link to the job posting from each card
- 📱 **Fully responsive** — Mobile-first design with Tailwind CSS
- ⚡ **Animations** — Fade-in, slide-up, card hover micro-interactions

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS |
| **Routing** | React Router v6 |
| **Charts** | Recharts |
| **HTTP client** | Axios |
| **Backend** | Node.js, Express |
| **Auth** | JWT + bcryptjs |
| **Database** | MongoDB + Mongoose |
| **Security** | Helmet, express-rate-limit, CORS |
| **Deploy** | Vercel (frontend) + Render (backend) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/careerboard.git
cd careerboard
```

### 2. Install all dependencies
```bash
npm install
npm run install:all
```

### 3. Configure environment variables

**Backend** — copy and edit:
```bash
cp backend/.env.example backend/.env
```
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/careerboard
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

**Frontend** — copy and edit:
```bash
cp frontend/.env.example frontend/.env
```
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run in development mode
```bash
npm run dev
```

This starts both servers simultaneously:
- 🌐 Frontend: [http://localhost:5173](http://localhost:5173)
- 🔌 API: [http://localhost:5000](http://localhost:5000)

---

## 📁 Project Structure

```
careerboard/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js  # Register, login, getMe
│   │   │   └── jobController.js   # Full CRUD + stats aggregation
│   │   ├── middleware/
│   │   │   └── auth.js            # JWT protection middleware
│   │   ├── models/
│   │   │   ├── User.js            # User schema (bcrypt pre-save)
│   │   │   └── Job.js             # Job schema with indexes
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   └── jobs.js
│   │   └── app.js                 # Express entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── JobCard.tsx        # Card with edit/delete actions
│   │   │   ├── JobFormModal.tsx   # Create/edit modal form
│   │   │   ├── KanbanColumn.tsx   # Drag & drop column
│   │   │   ├── Navbar.tsx         # Sticky nav + dark mode toggle
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── StatsCard.tsx
│   │   ├── context/
│   │   │   ├── AuthContext.tsx    # Global auth state
│   │   │   └── ThemeContext.tsx   # Dark/light mode state
│   │   ├── hooks/
│   │   │   └── useJobs.ts         # CRUD + toast feedback
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx  # Stats + charts + recent list
│   │   │   ├── ApplicationsPage.tsx # Filtered grid view
│   │   │   ├── KanbanPage.tsx     # Drag & drop board
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── services/
│   │   │   └── api.ts             # Axios instance + interceptors
│   │   ├── types/
│   │   │   └── index.ts           # TS interfaces + status configs
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css              # Tailwind + custom component classes
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── package.json                   # Root: concurrently dev script
└── README.md
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Login, receive JWT |
| GET | `/api/auth/me` | Get current user (protected) |

### Jobs (all protected — Bearer token required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | List jobs (supports `?status`, `?search`, `?priority`, `?sort`) |
| POST | `/api/jobs` | Create a job application |
| GET | `/api/jobs/:id` | Get single job |
| PUT | `/api/jobs/:id` | Update job |
| DELETE | `/api/jobs/:id` | Delete job |

> The GET `/api/jobs` response also includes `stats` (per-status counts) and `monthly` (last 6 months activity) for the dashboard.

---

## ☁️ Deployment

### Backend → Render (free tier)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your repository, set **Root directory** to `backend`
4. **Build command**: `npm install`
5. **Start command**: `node src/app.js`
6. Add Environment Variables:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://...  ← your Atlas URI
   JWT_SECRET=your_secret_here
   CLIENT_URL=https://your-app.vercel.app
   ```
7. Copy your Render URL (e.g. `https://careerboard-api.onrender.com`)

### Frontend → Vercel (free tier)

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your repository, set **Root directory** to `frontend`
3. Framework preset: **Vite**
4. Add Environment Variable:
   ```
   VITE_API_URL=https://careerboard-api.onrender.com/api
   ```
5. Deploy → your app is live 🎉

---

## 👤 Demo Account

A demo account is pre-seeded for testing:

| Field | Value |
|-------|-------|
| Email | `demo@careerboard.dev` |
| Password | `demo1234` |

> **Note:** Add a seed script to `backend/src/config/seed.js` if you want to auto-create the demo account on first run.

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## 📄 License

MIT — feel free to use this project in your own portfolio.

---

<p align="center">Made with ❤️ using React & Node.js</p>
