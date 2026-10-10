# Smart QueueLess — College Canteen Pre-Order & Real-Time Queue Management System

> **"Smart QueueLess is a digital canteen management platform that enables students and faculty to pre-order and pay for food, receive a digital token and QR code, track preparation progress in real time, and collect their meals without standing in long queues. The system combines real-time queue management, pickup scheduling, inventory tracking, digital payments, QR-based verification, and intelligent demand prediction to reduce waiting time and prevent food shortages."**

---

## 🚀 Key Features

### 1. 🎓 Student & Faculty Experience
- **Interactive Live Menu**: Browse items with real-time stock availability, veg/non-veg tags, preparation duration, and ratings.
- **10-Minute Pickup Time Slots**: Select customizable pickup slots (e.g. `12:30–12:40 PM`) with automated capacity capping to prevent rush congestion.
- **Razorpay Digital Payments**: Secure online checkout with signature verification and automated token issuance.
- **Daily Unique Token & QR Code**: Daily resettable tokens (e.g. `#A014`) and encrypted QR verification identifiers.
- **Live WebSocket Tracking (STOMP)**: Real-time status progression (`PLACED` → `PAYMENT_CONFIRMED` → `ACCEPTED` → `PREPARING` → `READY` → `COLLECTED`).
- **🔔 "Leave Now" Smart Alert**: Real-time sound chime and in-app banner notifying students when food is ~5 minutes from readiness so they walk to the canteen at the exact right moment.
- **⚡ Counter 2 Quick Pickup**: Bypass normal line and show QR code at the dedicated express collection counter.
- **Reorder & Star Ratings**: 1-click reorder and 1-5 star dining reviews.

### 2. 👨‍🍳 Canteen Staff Operations
- **Kitchen Display System (KDS)**: Fullscreen 3-column Kanban board (`New` | `In Kitchen Cooking` | `Ready at Counter 2`).
- **Camera & Manual QR Scanner**: Instant camera scanning with `html5-qrcode` to verify tokens and hand over food in < 15 seconds.
- **Live Stock Inventory**: Atomic stock increment/decrement (`-5`, `+10`) and one-click "SOLD OUT" toggles.

### 3. 📊 Admin Analytics & Command Hub
- **Recharts Analytics**: Peak lunch rush curves (orders by hour), 7-day revenue performance, top campus favorites, and student vs faculty breakdown.
- **Catalog Management**: Add/Edit food items, categories, pricing, and prep times.
- **Time Slot & Coupon Configurator**: Create pickup slots with capacity caps and promo discount codes.
- **Live Presentation Demo Simulator**: 1-click simulated orders and state advances for hackathon/project evaluations.
- **AI Crowd & Meal Prediction**: Practical statistical forecasting engine with open architecture for Gemini API integration.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Backend REST API** | **Java 17+ / 25**, **Spring Boot 3.3.4**, Spring Web, Spring Security, JWT, Spring Data MongoDB, Spring WebSocket + STOMP |
| **Database** | **MongoDB** (Atomic updates, Collections for Users, Foods, Categories, Orders, Payments, PickupSlots, Notifications, Reviews, Coupons) |
| **Payment Gateway** | **Razorpay Java SDK / REST API** with test mode fallback |
| **QR Code Engine** | **ZXing 3.5.3** (Server-side) + **QRCode.react** & **HTML5-QRCode** (Client-side) |
| **Frontend UI** | **React.js 18**, **Vite**, **Tailwind CSS**, **React Router v7**, **Recharts**, **Lucide Icons**, **Axios**, **SockJS / STOMP** |

---

## 📋 Default Seeded Demo Accounts

All demo accounts share the password: `password123`

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Student** | `student@canteen.com` | `password123` | Pre-order, slot selection, live tracker, QR pass, reviews |
| **Faculty** | `faculty@canteen.com` | `password123` | Express faculty orders, slot booking, QR pass |
| **Canteen Staff** | `staff@canteen.com` | `password123` | Kitchen KDS Kanban, QR Scanner, Live Stock Inventory |
| **Administrator** | `admin@canteen.com` | `password123` | Analytics dashboard, Menu CRUD, Slots, Coupons, Simulator |

---

## ⚡ Quick Start & Setup Guide

### Prerequisites
- **Java 17 or higher** (Tested on Java 25 & Java 21)
- **Node.js 18+** & `npm`
- **MongoDB** running locally on `mongodb://localhost:27017` or MongoDB Atlas URI
- **Maven 3.9+** (included in `tools/` directory)

---

### Step 1: Start MongoDB
Ensure MongoDB is running on `localhost:27017`:
```bash
# macOS/Linux (Homebrew)
brew services start mongodb-community

# Windows (if installed as service)
net start MongoDB
# Or run mongod directly
mongod --dbpath <path-to-data-folder>
```

---

### Step 2: Run Spring Boot Backend

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. (Optional) Configure environment variables in `backend/src/main/resources/application.yml` or create `.env`:
   ```properties
   MONGODB_URI=mongodb://localhost:27017/smart_canteen
   JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
   RAZORPAY_KEY_ID=rzp_test_college_canteen_dummy_key
   RAZORPAY_KEY_SECRET=rzp_test_secret_demo_12345
   ```

3. Run the Spring Boot application using Maven:
   ```bash
   # Windows PowerShell
   $env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-25.0.3.9-hotspot"
   ..\tools\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run

   # Or standard Maven
   mvn spring-boot:run
   ```

> 💡 **Auto-Seeding**: Upon startup, `DatabaseSeederService` automatically seeds the database with Indian college canteen items (Veg Biryani, Chicken Biryani, Samosa, Paneer Roll, Egg Puff, Masala Chai, Thums Up), categories, 10-minute pickup slots, coupons (`CANTEEN10`, `WELCOME20`), and demo accounts!

Backend runs at: **`http://localhost:8080`**  
Swagger OpenAPI Docs: **`http://localhost:8080/swagger-ui.html`**

---

### Step 3: Run React Frontend

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install dependencies (already installed in workspace):
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

Frontend runs at: **`http://localhost:5173`**

---

## 🔄 Core End-to-End User Flow

```
1. Customer logs in (Student or Faculty)
   ↓
2. Browses Menu (Veg Biryani ₹80, Samosa ₹30)
   ↓
3. Adds items to Cart & selects Pickup Slot (12:40 PM - 12:50 PM)
   ↓
4. Applies promo coupon (e.g. CANTEEN10) & completes Razorpay checkout
   ↓
5. Backend verifies payment, generates Token #A014 & encrypted QR Code
   ↓
6. Order appears in real-time on Kitchen Display Screen (KDS)
   ↓
7. Staff marks order PREPARING → Customer gets "Leave Now" notification (~5 mins left)
   ↓
8. Staff marks order READY → Customer arrives at Counter 2 (Quick Pickup)
   ↓
9. Staff scans customer's QR Code → Order marked COLLECTED & COMPLETED!
```

---

## 📡 WebSocket STOMP Topics

- `/topic/orders/{orderId}`: Live progression of a specific order.
- `/topic/queue`: Real-time queue length & estimated kitchen wait time.
- `/topic/staff/orders`: Live incoming orders stream for kitchen staff KDS.
- `/topic/customer/{userId}`: Personal in-app alerts and notifications.

---

## 🛡️ Security & Quality

- Role-based authorization (`STUDENT`, `FACULTY`, `STAFF`, `ADMIN`) via Spring Security & JWT filters.
- Secure atomic MongoDB stock decrements to prevent simultaneous double-ordering of the last remaining food item.
- Dual Razorpay mode: Supports production credentials with automatic HMAC-SHA256 signature verification or development test mode.
