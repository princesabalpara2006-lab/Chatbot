# 🌌 AetherTalk - Premium AI Chatbot Platform

AetherTalk is a state-of-the-art, premium full-stack AI chatbot platform built with a visually stunning, glassmorphic dark/light UI. Designed for fluid responsiveness, speed, and real-time interactive capabilities, it replicates a premium SaaS experience like ChatGPT with integrated productivity tools, voice controls, custom AI personalities, and comprehensive admin controls.

---

## 🚀 Key Features

- **🎭 Custom AI Personalities**: Converse with AI styled as Friendly, Professional, Funny, Teacher, or Motivational. Powered by Groq/Grok AI.
- **💬 Real-Time Interactions**: Real-time messaging, glowing typing indicators, live emoji reactions, and instant read receipts via Socket.io.
- **🎙️ Voice Interface**: Hands-free interactions with built-in voice-to-text recording waves and high-quality text-to-speech toggles.
- **📁 Drag-and-Drop File Uploads**: Parse, summarize, and query PDFs, Word documents, text files, or images.
- **🛠️ Integrated Productivity Suite**:
  - **To-Do Task List**: Inline task manager synced dynamically.
  - **Reminder System**: Calendar notifications with popups.
  - **Scratchpad Notes**: Fast draft editor that downloads as `.txt` files or passes contents to AI for structured formatting.
  - **Helper Cards**: Real-time mock tech news feeds, beautiful calculator popup, local mock weather widget, and motivating dev quotes.
- **🛡️ Premium Security & MVC Architecture**: Protected by custom JWT authentication, session tokens, Helmet security headers, rate limiting, and input sanitization.
- **📈 Advanced Admin Dashboard**: Track server activity metrics, list/manage users (block/unblock/delete), and inspect moderation logs.
- **📱 PWA (Progressive Web App) Ready**: Easily installable on mobile devices with support for offline page caches.

---

## 🛠️ Technology Stack

### Frontend
- **Core**: React 19, Vite (highly optimized bundle times)
- **Styling**: Tailwind CSS + custom glassmorphism primitives + sleek scrollbars
- **Animations**: Framer Motion (for fluid card triggers, sidebar expanding, sound waves)
- **Icons**: Lucide React
- **Router**: React Router DOM (with isolated Marketing, Auth, and Dashboard layouts)
- **Real-time Client**: Socket.io-client

### Backend
- **Framework**: Express.js (Node.js) MVC pattern
- **Real-time Server**: Socket.io
- **Database**: MongoDB (via Mongoose schemas)
- **AI Engine**: Groq/Grok AI API client integration
- **File Uploads**: Multer
- **Security**: JWT, BcryptJS, Helmet, Express Mongo Sanitize, Express Rate Limit

---

## 📂 Directory Layout

```text
Day3/
 ├── backend/
 │    ├── config/          # Database connection & env validation
 │    ├── controllers/     # Auth, Chat, Message, Upload, productivity controllers
 │    ├── middleware/      # Protected routes auth, file parse limits, rate limiters
 │    ├── models/          # MongoDB Schemas (User, Chat, Message, Settings, Reminders)
 │    ├── routes/          # REST API router mappings
 │    ├── sockets/         # WebSocket listeners & event triggers
 │    ├── server.js        # Server initial bootstrap file
 │    └── .env             # Server variables (Groq/Grok AI)
 ├── frontend/
 │    ├── public/          # Favicon, SVG assets, PWA sw.js
 │    ├── src/
 │    │    ├── components/ # Custom reusable glass buttons, inputs, skeletons
 │    │    ├── context/    # Global AuthContext, ChatContext, ThemeContext
 │    │    ├── hooks/      # useVoice recording
 │    │    ├── layouts/    # Auth, Dashboard, and Landing layout shells
 │    │    ├── pages/      # 14 rich full-screen modern pages
 │    │    ├── services/   # Axios API setup & socket listener handles
 │    │    └── App.jsx     # Route router tree
 └── README.md
```

---

## ⚙️ Getting Started & Installation

### Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** (Ensure local MongoDB is running at `mongodb://127.0.0.1:27017/aethertalk`, or configure a remote URI in `.env`)

### 1. Backend Setup
1. Open a terminal inside the `backend` directory:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Set up the `.env` file:
   The backend includes a `.env` template. Fill in your Groq API Key in the `GROK_API_KEY` field to enable the powerful Groq Llama-3 model.
4. Launch the backend:
   - For Production: `npm start`
   - For Development (with live-reload): `npm run dev`

### 2. Frontend Setup
1. Open a terminal inside the `frontend` directory:
   ```bash
   cd ../frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Launch the Vite development client:
   ```bash
   npm run dev
   ```
4. Access the premium application in your browser at `http://localhost:5173`.

---

## 🎨 Creative Philosophy

AetherTalk is designed to **wow** at first glance. Leveraging smooth color blending (indigo, slate, emerald, violet HSL palettes), rich glassmorphism (blurry transparency, razor-thin borders, and subtle drop shadows), and dynamic micro-animations (Framer Motion card bounces, real-time wave oscillations, and AI typing simulations), the interface feels fully alive and premium.
