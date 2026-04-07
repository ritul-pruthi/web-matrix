# 💠 WebMatrix Solution — Digital Success Studio

**WebMatrix Solution** is a modern, high-performance landing page and digital services agency platform built on React, Vite, and Supabase. The project focuses on a "Cyber-Fresh" aesthetic, combining deep obsidian tones with vibrant Emerald and Cyan accents to create a premium, high-tech user experience.

## 🚀 [Launch Live Demo](https://web-matrix-eight.vercel.app/)

---

## 🚀 Features

* **Aesthetic UI/UX:** A "Cyber-obsidian" dark mode theme with glassmorphism effects and neon glow accents.
* **3D Hero Section:** Integrated with **DotLottie** for high-fidelity animations.
* **Responsive Grid:** A fluid service matrix seamlessly adapting from 4K to mobile.
* **Full-Stack CMS Capabilities:**
  * Protected internal routing & dashboard for administrators.
  * Real-time client inquiries and user role-management through Supabase.
  * Interactive review system mapped to authenticated sessions.
* **Interactive Motion:** Sticky navigation, scroll-reveal animations, lifting cards.

---

## 🛠️ Tech Stack

* **Frontend:** React, Vite
* **Backend:** Supabase (Auth, Database, Edge Functions)
* **Styling:** Custom CSS Variables + Flexbox/Grid
* **Icons & Assets:** Lucide React, DotLottie-React
* **Routing:** React Router v6

---

## 📂 Project Structure

```text
.
├── src/
│   ├── components/      # Reusable UI React Components (Forms, Layout, Dashboards)
│   ├── context/         # Global App State (AuthContext, etc.)
│   ├── hooks/           # Custom React Hooks (useReviews, etc.)
│   ├── lib/             # Third-party singletons (supabase.js)
│   ├── pages/           # Next-level views tied to routing (LandingPage, Auth, Dashboard/)
│   ├── App.jsx          # Router configurations & layout composition
│   └── index.css        # CSS definitions & "Cyber-Fresh" themes
├── public/              # Global raw assets
├── supabase/            # Local DB definitions & SQL Migrations
├── .env.example         # Template for environment keys
├── index.html           # Main Vite entry point
└── package.json         # Node configurations & package scripts
```

---

## ⚙️ Local Development Setup

To get you up and running locally, follow these steps:

1. **Clone the repository**
   ```bash
   git clone https://github.com/ritul-pruthi/web-matrix.git
   cd web-matrix
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment variables**
   ```bash
   cp .env.example .env.local
   ```
   *Edit `.env.local` to fill out your keys:*
   ```text
   VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
   VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
