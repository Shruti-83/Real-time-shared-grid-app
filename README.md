# 🟩 Real-Time Shared Grid App

A real-time interactive grid where users can capture blocks and compete with others live. Built with a focus on **real-time systems, scalability, and clean UI**.

---

## 🚀 Features

* 🧱 Interactive grid with hundreds of blocks
* ⚡ Real-time updates using WebSockets (Socket.io)
* 👥 Multiple users can interact simultaneously
* 🎯 Block ownership system
* ⏳ Cooldown mechanism to prevent spam
* 🏆 Live leaderboard
* 📊 Grid statistics (claimed vs total)
* 🟢 Online users tracking

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Socket.io Client

### Backend

* Node.js + Express
* Socket.io (Real-time communication)
* MongoDB + Mongoose

---

## 🧠 System Design Highlights

* ⚡ **In-memory grid store** for ultra-fast updates
* 🔄 **Asynchronous database persistence** (non-blocking)
* 🧩 **Event-driven architecture** using WebSockets
* 🛡️ **Backend-controlled validation** (prevents race conditions)
* ⏱️ **Cooldown handling** to avoid spam clicks

---

## 📡 Real-Time Flow

1. User connects and joins the system
2. Server sends initial grid state
3. User clicks a block → emits `capture` event
4. Server:

   * Validates request
   * Updates in-memory grid
   * Saves to database (async)
   * Broadcasts update to all users
5. All clients instantly update UI

---

## 📁 Project Structure

```
backend/
├── config/
├── models/
├── routes/
├── socket/
└── index.js

frontend/
├── src/
│   ├── components/
│   ├── App.jsx
│   └── socket.js
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone repository

```bash
git clone https://github.com/Shruti-83/Real-time-shared-grid-app.git
cd Real-time-shared-grid-app
```

---

### 2️⃣ Backend setup

```bash
cd backend
npm install
npm run dev
```

---

### 3️⃣ Frontend setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🌍 Environment Variables

Create a `.env` file in backend:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

---

## ✨ Future Improvements

* 🔍 Zoom & pan for large grids
* 🧠 AI bot players
* 🏁 Territory capture system
* 🔐 Authentication (JWT)
* ☁️ Deployment with Docker + Redis scaling

---

## 💡 Learnings

* Designing real-time systems with WebSockets
* Handling concurrency and race conditions
* Optimizing performance using in-memory state
* Building scalable backend architecture

---

## 📌 Author

Built with focus on **real-time architecture + UI clarity + scalability**.

---

## ⭐ If you like this project

Give it a star ⭐ and share feedback!
