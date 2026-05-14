# 🍕 PizzaCraft — Full Stack Pizza Delivery Application

A production-ready, full stack pizza delivery platform built with **React**, **Node.js**, **Express**, and **MongoDB**. Features a complete custom pizza builder, Razorpay payment integration, real-time order tracking, admin inventory management, and automated low-stock email alerts.

---

## 📁 Project Structure

```
pizza-app/
├── backend/                   # Node.js + Express API
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Register, login, verify, forgot/reset password
│   │   ├── inventoryController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   └── userController.js
│   ├── jobs/
│   │   └── stockNotification.js  # Cron job for low-stock alerts
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT protect, adminOnly, emailVerified
│   │   └── errorMiddleware.js # Global error handler
│   ├── models/
│   │   ├── User.js
│   │   ├── Inventory.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── pizzaRoutes.js
│   │   ├── inventoryRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── adminRoutes.js
│   ├── services/
│   │   └── emailService.js    # Nodemailer + HTML templates
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── seeder.js          # Seeds DB with initial data
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── server.js              # Entry point
│
├── frontend/                  # React 18 SPA
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   └── layout/
│       │       ├── UserLayout.js
│       │       ├── AdminLayout.js
│       │       └── Layout.css
│       ├── context/
│       │   ├── AuthContext.js  # Auth state, login/logout
│       │   └── CartContext.js  # Pizza builder state + pricing
│       ├── pages/
│       │   ├── auth/
│       │   │   ├── Login.js
│       │   │   ├── Register.js
│       │   │   ├── VerifyEmail.js
│       │   │   ├── ForgotPassword.js
│       │   │   ├── ResetPassword.js
│       │   │   └── Auth.css
│       │   ├── user/
│       │   │   ├── UserDashboard.js
│       │   │   ├── PizzaBuilder.js   # 5-step pizza builder
│       │   │   ├── Checkout.js       # Razorpay integration
│       │   │   ├── MyOrders.js
│       │   │   ├── OrderDetail.js    # Live status tracker
│       │   │   ├── Profile.js
│       │   │   └── User.css
│       │   └── admin/
│       │       ├── AdminDashboard.js # Stats + alerts
│       │       ├── AdminOrders.js    # Order management + status updates
│       │       ├── AdminInventory.js # Full CRUD + restock
│       │       ├── AdminUsers.js
│       │       └── Admin.css
│       ├── services/
│       │   └── api.js          # Axios instance + all API calls
│       ├── App.js              # Routes + providers
│       ├── index.js
│       ├── index.css           # Global design system
│       ├── .env.example
│       ├── Dockerfile
│       └── package.json
│
├── docker-compose.yml
├── package.json               # Root scripts with concurrently
└── README.md
```

---

## ✨ Features

### Authentication & Users
- ✅ Registration with **email verification** (token-based, 24h expiry)
- ✅ JWT-based login for users and admins
- ✅ **Forgot password** with secure reset link (30min expiry)
- ✅ **Change password** from profile
- ✅ Route guards: Public, Protected, AdminOnly
- ✅ Persistent login via localStorage

### Pizza Builder (5-Step Flow)
1. 🫓 **Base** — 5 options (Hand-Tossed, Thin Crust, Thick Pan, Whole Wheat, Cheese Burst)
2. 🍅 **Sauce** — 5 options (Tomato, Pesto, BBQ, White Garlic, Arrabbiata)
3. 🧀 **Cheese** — Single selection (Mozzarella, Cheddar, Parmesan, Ricotta, Vegan)
4. 🥬 **Veggies** — Multi-select from 8 options
5. 🍗 **Meats** — Multi-select from 5 options
- Live price calculator with tax (5%) + delivery fee
- Cart context persists builder state across steps

### Payments (Razorpay Test Mode)
- Creates Razorpay order via backend
- Signature verification on backend before placing order
- Test card: `4111 1111 1111 1111`, any future date, any CVV
- On success: order saved, inventory deducted, confirmation email sent

### Order Tracking
- Real-time status flow: **Order Received → In Kitchen → Out for Delivery → Delivered**
- Visual progress tracker on order detail page
- Status history log per order
- Email notification to user on every status change

### Admin Panel
- 📊 **Dashboard**: Total orders, revenue, today's orders, pending count, low stock count, recent orders
- 📦 **Inventory**: Full CRUD, category filter tabs, inline restock, low-stock highlighting, availability toggle
- 🛵 **Orders**: Filter by status, expand for details, one-click status advancement, status history
- 👥 **Users**: View all users, activate/deactivate accounts

### Inventory & Alerts
- Every ingredient tracked: base, sauce, cheese, veggie, meat
- Configurable threshold per item (default: 20)
- **Cron job** runs every 15 minutes, sends email alert to admin when stock ≤ threshold
- Alert de-duplicated: `lowStockAlertSent` flag resets only when restocked above threshold

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Razorpay account (test mode)
- Gmail or Mailtrap for emails

### 1. Clone & Install

```bash
git clone <repo-url>
cd pizza-app

# Install root + both services
npm install
npm run install:all
```

### 2. Configure Environment

**Backend** — copy and fill:
```bash
cp backend/.env.example backend/.env
```

Key variables:
```env
MONGO_URI=mongodb://localhost:27017/pizza_delivery
JWT_SECRET=your_long_random_secret_here
CLIENT_URL=http://localhost:3000

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password       # Gmail App Password
EMAIL_FROM=noreply@pizza.com
ADMIN_EMAIL=admin@pizza.com

RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx

STOCK_THRESHOLD=20
```

**Frontend** — copy and fill:
```bash
cp frontend/.env.example frontend/.env
```

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
```

### 3. Seed the Database

```bash
npm run seed
```

This creates:
- 👑 **Admin**: `admin@pizzadelivery.com` / `Admin@123`
- 👤 **User**: `user@pizzadelivery.com` / `User@123`
- 28 inventory items (bases, sauces, cheeses, veggies, meats)

### 4. Run in Development

```bash
# Both frontend and backend together
npm run dev
```

Or separately:
```bash
npm run start:backend    # http://localhost:5000
npm run start:frontend   # http://localhost:3000
```

---

## 🐳 Docker

```bash
# Copy .env files first, then:
docker-compose up --build
```

MongoDB, backend, and frontend all start together.

---

## 🔑 Razorpay Test Mode Setup

1. Sign up at [razorpay.com](https://razorpay.com)
2. Go to **Settings → API Keys → Generate Test Key**
3. Copy `Key ID` and `Key Secret` into both `.env` files
4. Test payment credentials:
   - Card: `4111 1111 1111 1111`
   - Expiry: any future date
   - CVV: any 3 digits
   - OTP: `1234` (for test mode)

---

## 📧 Email Setup (Gmail)

1. Enable 2FA on your Google account
2. Go to **Google Account → Security → App Passwords**
3. Generate an app password for "Mail"
4. Use that 16-character password as `EMAIL_PASS`

For testing without real email, use [Mailtrap](https://mailtrap.io):
```env
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_mailtrap_user
EMAIL_PASS=your_mailtrap_pass
```

---

## 🌐 API Reference

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/verify-email/:token` | Public | Verify email |
| POST | `/api/auth/forgot-password` | Public | Send reset link |
| PUT | `/api/auth/reset-password/:token` | Public | Reset password |
| GET | `/api/auth/me` | Private | Get current user |
| GET | `/api/pizza/options` | Private | All pizza ingredients |
| GET | `/api/inventory` | Admin | All inventory |
| POST | `/api/inventory` | Admin | Add item |
| PUT | `/api/inventory/:id` | Admin | Update item |
| PUT | `/api/inventory/:id/restock` | Admin | Restock item |
| DELETE | `/api/inventory/:id` | Admin | Delete item |
| POST | `/api/payment/create-order` | Private | Create Razorpay order |
| POST | `/api/payment/verify` | Private | Verify payment |
| POST | `/api/orders` | Private | Place order |
| GET | `/api/orders/my-orders` | Private | User's orders |
| GET | `/api/orders` | Admin | All orders |
| PUT | `/api/orders/:id/status` | Admin | Update order status |
| GET | `/api/admin/dashboard` | Admin | Dashboard stats |

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios |
| State | Context API (Auth + Cart) |
| UI | Custom CSS design system, React Icons, Recharts |
| Payments | Razorpay Web SDK |
| Notifications | React Hot Toast |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT, bcryptjs |
| Email | Nodemailer (HTML templates) |
| Scheduling | node-cron |
| Containerization | Docker + Docker Compose |

---

## 📱 Screenshots Overview

- **Login/Register** — Split-screen with animated pizza hero
- **Pizza Builder** — Step-by-step with live price summary sidebar
- **Checkout** — Address form + Razorpay payment
- **Order Tracking** — Visual progress stepper
- **Admin Dashboard** — Stats cards, low-stock alerts, recent orders
- **Inventory** — Category-filtered table with inline restock
- **Order Management** — Expandable rows with one-click status updates
