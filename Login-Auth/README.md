# 🔑 AuthVault — Login Authentication System

A production-structured login authentication system built with **Node.js + Express** (backend) and **Vanilla HTML/CSS/JS** (frontend), following industry-standard security practices.

---

## 📁 Project Structure

```
auth-system/
├── backend/
│   ├── config/
│   │   └── jwt.js              # JWT sign/verify helpers
│   ├── middleware/
│   │   ├── authMiddleware.js   # Bearer token guard for protected routes
│   │   └── validate.js         # Input validation middleware
│   ├── models/
│   │   └── userStore.js        # In-memory user store (swap for DB)
│   ├── routes/
│   │   ├── authRoutes.js       # POST /api/auth/register|login|logout|refresh
│   │   └── protectedRoutes.js  # GET  /api/protected/dashboard|profile
│   ├── .env                    # Environment config (never commit this!)
│   └── server.js               # Express app entry point
│
└── frontend/
    ├── css/
    │   └── main.css            # Global styles, design system, CSS variables
    ├── js/
    │   ├── api.js              # Fetch wrapper for all API calls
    │   ├── auth.js             # Client auth state: token storage, guards
    │   └── ui.js               # Shared UI helpers: alerts, loaders, strength
    ├── pages/
    │   ├── login.html          # Login page
    │   ├── register.html       # Registration page
    │   └── dashboard.html      # Protected dashboard (requires JWT)
    └── index.html              # Root redirect → /pages/login.html
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm v9+

### Installation & Run

```bash
# 1. Install backend dependencies
cd backend
npm install

# 2. Start the server
node server.js

# 3. Open your browser
#    http://localhost:3001
```

The Express server also **serves the frontend** as static files, so a single `node server.js` runs everything.

---

## 🔐 Security Features

| Feature | Implementation |
|---|---|
| Password hashing | `bcryptjs` with 12 salt rounds |
| Tokens | Stateless JWT — access (1h) + refresh (7d) |
| Route protection | `authMiddleware.js` — validates Bearer token |
| Input validation | Server-side middleware (`validate.js`) |
| Rate limiting | `express-rate-limit` — 10 req / 15 min per IP |
| Security headers | `helmet` middleware |
| CORS | Configured in `server.js` |
| Password masking | Passwords never returned in API responses |

---

## 📡 API Endpoints

### Auth (public)
| Method | Endpoint | Body | Description |
|---|---|---|---|
| POST | `/api/auth/register` | `{ email, username, password }` | Create account |
| POST | `/api/auth/login` | `{ email, password }` | Login |
| POST | `/api/auth/refresh` | `{ refreshToken }` | Get new access token |
| POST | `/api/auth/logout` | — | Logout (client clears token) |

### Protected (requires `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/protected/dashboard` | Dashboard data |
| GET | `/api/protected/profile` | User profile |

---

## 🗄️ Swapping to a Real Database

The `models/userStore.js` file is a simple in-memory Map. Replace it with your preferred DB:

**MongoDB (Mongoose)**
```js
const User = require('./User'); // Mongoose model
UserStore.create = async (email, username, hash) => {
  const user = new User({ email, username, password: hash });
  return user.save();
};
```

**PostgreSQL (pg/Prisma)**
```js
UserStore.create = async (email, username, hash) => {
  return prisma.user.create({ data: { email, username, password: hash } });
};
```

---

## ⚙️ Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | Server port |
| `JWT_SECRET` | — | **Change this!** Use a 256-bit random string in production |
| `JWT_EXPIRES_IN` | `1h` | Access token lifetime |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | Refresh token lifetime |
| `NODE_ENV` | `development` | Environment mode |

Generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🔄 Token Flow

```
Client                      Server
  │                            │
  │── POST /auth/register ────►│  Hash password (bcrypt)
  │◄── { accessToken,          │  Store user
  │       refreshToken, user } │  Sign JWT tokens
  │                            │
  │── GET /protected/dashboard ─►│  Verify Bearer token
  │◄── { user, stats }          │  Return protected data
  │                            │
  │── POST /auth/refresh ──────►│  Verify refresh token
  │◄── { accessToken }         │  Issue new access token
```

---

## 📦 Dependencies

```json
{
  "express":            "^4.x",
  "bcryptjs":           "^2.x",
  "jsonwebtoken":       "^9.x",
  "cors":               "^2.x",
  "dotenv":             "^16.x",
  "express-rate-limit": "^7.x",
  "helmet":             "^7.x"
}
```
