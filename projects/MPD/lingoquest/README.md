# LingoQuest — AI-Powered Language Learning Platform

> **Course:** Software Engineering — Spring 2026 | **Group 9 — Lost in Translation**  
> **Instructor:** Dr. Tushara Sadasivuni

[![Live Demo](https://img.shields.io/badge/Live%20Demo-lingoquest2026.netlify.app-6c4dff?style=flat-square)](https://lingoquest2026.netlify.app)
[![Built With](https://img.shields.io/badge/Built%20With-HTML%20%7C%20CSS%20%7C%20JavaScript-ff6b35?style=flat-square)]()
[![Database](https://img.shields.io/badge/Database-Supabase%20%7C%20MySQL-22c55e?style=flat-square)]()

---

## 📖 Table of Contents

1. [Project Overview](#project-overview)
2. [Live Demo](#live-demo)
3. [Key Features](#key-features)
4. [Tech Stack & Dependencies](#tech-stack--dependencies)
5. [Project Structure](#project-structure)
6. [Setup & Installation](#setup--installation)
7. [Supabase Configuration](#supabase-configuration)
8. [Database Schema](#database-schema)
9. [Running the Project](#running-the-project)
10. [Sprint History](#sprint-history)
11. [Team](#team)

---

## 📌 Project Overview

LingoQuest is a full-stack, AI-driven educational web platform that helps users overcome language barriers through adaptive learning, pronunciation testing, and personalized progress tracking. It supports **8 languages** — Spanish, French, Japanese, Mandarin, German, Portuguese, Korean, and Italian — and adapts difficulty in real time based on each learner's performance.

Unlike platforms such as Duolingo, LingoQuest integrates:
- Real-time AI personalization and adaptive difficulty
- Voice-based pronunciation testing with scoring
- A visual sketchpad for note-taking linked to lessons
- A full gamification system with XP, streaks, and milestone badges
- Background and cursor customization for a personalized UI

---

## 🌐 Live Demo

🔗 **[https://lingoquest2026.netlify.app](https://lingoquest2026.netlify.app)**

To test the full experience:
1. Click **Get Started** and create a free account
2. Select your target language
3. Take the skill assessment pre-test
4. Work through lessons, quizzes, the sketchpad, and pronunciation tests

---

## ✨ Key Features

### 🔐 Authentication (Supabase Auth)
- Secure email/password signup and login
- Session persistence across page refreshes
- Every login records a timestamp in the Supabase `Profile` table
- Auth wall — lesson sections unlock only after login

### 🌍 Language Selection
- Choose from 8 languages with flag tiles
- Confirms and initializes a personalized learning path
- Immediately filters Pre-Test and Quiz questions to match the selected language

### 📝 Skill Assessment Pre-Test
- 5 language-specific questions per test
- AI scores responses and assigns: **Beginner**, **Intermediate**, or **Advanced**
- Skip option defaults to Beginner
- Question bank contains 6–8 unique questions per language

### 📚 Level-Based Lessons
- Structured lessons organized by proficiency level
- Each lesson includes a description and vocabulary cards
- Completion status saved to `localStorage` and synced to Supabase
- Completed lessons switch to **Review Mode** for revisiting

### 🧠 Adaptive Quiz
- Language-contextual question bank (5–6 questions per difficulty per language)
- Three difficulty tiers: **Easy**, **Medium**, **Hard**
- Scores ≥ 80% → automatically promotes to next difficulty level
- Scores < 50% → drops to easier difficulty and recommends review
- **XP awarded only on quiz completion** (Easy: +5 XP | Medium: +10 XP | Hard: +15 XP)

### 🎨 Visual Sketchpad
- Full HTML5 Canvas drawing with mouse and touch support
- 6 color options and adjustable brush size (2–20px slider)
- Eraser tool uses background color for clean erasing
- **Save Note** — converts canvas to Base64 PNG, stores in `localStorage`, syncs to Supabase
- **Export** — downloads drawing as a `.png` file

### 🎤 Pronunciation Test
- Language-contextual target words with IPA phonetic guides
- Mic button triggers a 3-second recording session
- AI scores pronunciation (60–100%) with corrective feedback
- Attempt history tracked per session with word, score, and timestamp
- Color-coded score ring (green/yellow/red)

### 🔥 Daily Streaks & Milestones
- Consecutive day logic: increment / same-day unchanged / missed day resets to 1
- XP system with 6 levels: Beginner → Explorer → Apprentice → Learner → Fluent → Master
- Progress bar shows XP toward next level
- 5 milestone badges: First Lesson 🌱, 3-Day Streak 🔥, 7-Day Streak ⚡, 10 Lessons 💎, 30-Day Streak 👑
- All progress synced to Supabase on lesson completion

### ⚙️ Settings & Personalization
- Target language selector and daily XP goal
- Toggle: Daily Reminder, Streak Alerts, Sound Effects, Show Progress Bar
- Background color customization (7 theme colors with light/dark auto-detection)
- Custom cursor: 5 shapes (Default, Dot, Ring, Cross, Star) with 7 color options
- All settings persisted to `localStorage`

### 🌍 Global Community
- Active learners list with online indicators
- XP Leaderboard ranked by total points
- Designed to connect to FastAPI `GET /users` endpoint in production

---

## 🛠️ Tech Stack & Dependencies

### Frontend
| Dependency | Version | How It's Loaded | Purpose |
|---|---|---|---|
| HTML5 / CSS3 / Vanilla JS | — | Native | Core UI and all application logic |
| [Syne Font](https://fonts.google.com/specimen/Syne) | Latest | Google Fonts CDN | Headings and display text |
| [DM Sans Font](https://fonts.google.com/specimen/DM+Sans) | Latest | Google Fonts CDN | Body and UI text |
| [@supabase/supabase-js](https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2) | v2 | jsDelivr CDN | Auth + Supabase database client |

> No `npm install` or build step is required. All frontend dependencies load via CDN links in the `<head>` of `index.html`.

### Backend
| Package | Version | Purpose |
|---|---|---|
| Python | 3.10+ | Runtime |
| FastAPI | Latest | REST API framework |
| Uvicorn | Latest | ASGI web server |
| mysql-connector-python | Latest | MySQL database driver |
| supabase-py | Latest | Supabase Python client |
| python-jose[cryptography] | Latest | JWT token creation and validation |
| passlib[bcrypt] | Latest | Secure password hashing |
| python-dotenv | Latest | Load environment variables from `.env` |

### Database & Hosting
| Service | Purpose |
|---|---|
| **Supabase** (PostgreSQL) | Auth, Profile table, real-time session and progress sync |
| **MySQL** | Core application tables: users, lessons, progress, quizzes |
| **Netlify** | Frontend deployment and hosting |

---

## 📁 Project Structure

```
SWE-Engineering-spring-2026/
│
├── index.html                  # Main frontend — single HTML file, no build needed
│
├── /backend                    # Python FastAPI backend
│   ├── main.py                 # App entry point, router registration
│   ├── /routes
│   │   ├── auth.py             # POST /login, /register, /logout
│   │   ├── users.py            # GET /users — community leaderboard
│   │   ├── lessons.py          # GET /lessons, POST /lessons/complete
│   │   └── progress.py         # GET/POST /progress — streak and XP
│   ├── /models
│   │   └── schemas.py          # Pydantic request/response models
│   ├── /services
│   │   └── database.py         # MySQL connection pool and query helpers
│   └── requirements.txt        # All Python dependencies
│
├── /database
│   ├── schema.sql              # Full MySQL CREATE TABLE statements
│   ├── seed.sql                # Sample data for local development
│   └── /migrations             # Version-controlled schema changes
│
└── README.md
```

---

## ⚙️ Setup & Installation

### Prerequisites

Ensure the following are installed on your machine before getting started:

- [Git](https://git-scm.com/) — version control
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- [Python 3.10+](https://www.python.org/downloads/) — required for the backend only
- [MySQL 8.0+](https://dev.mysql.com/downloads/) — required for local database only
- A free [Supabase account](https://supabase.com) — for auth and profile syncing

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/Marquez03Johnson/SWE-Engineering-spring-2026.git
cd SWE-Engineering-spring-2026
```

---

### Step 2 — Run the Frontend

The frontend is a single `index.html` file with no build tools or package manager required.

**Option A — Open directly in your browser:**
```bash
# macOS
open index.html

# Windows — double-click index.html in File Explorer
# or right-click → Open With → Chrome
```

**Option B — Deploy to Netlify (live shareable URL):**
1. Go to [app.netlify.com](https://app.netlify.com) and log in
2. Rename `index.html` to keep it as `index.html`
3. Drag and drop the file onto the Netlify dashboard
4. Your live URL is ready in about 30 seconds

**Option C — GitHub auto-deploy (recommended for ongoing updates):**
1. Push your code to GitHub
2. Connect your GitHub repo to Netlify once under **Sites → Add New Site → Import from Git**
3. Every push to `main` will auto-deploy — no manual upload needed

---

### Step 3 — Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

If you don't have a `requirements.txt` yet, install manually:

```bash
pip install fastapi uvicorn[standard] mysql-connector-python supabase python-jose[cryptography] passlib[bcrypt] python-dotenv
```

---

### Step 4 — Configure Environment Variables

Create a `.env` file in the `/backend` directory:

```env
# MySQL connection
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=language_learning

# Supabase (use the service role key for backend — NOT the anon key)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-service-role-key

# JWT secret for session tokens
SECRET_KEY=your-random-secret-key-here
```

> ⚠️ Never commit your `.env` file to GitHub. Add it to `.gitignore`.

---

### Step 5 — Set Up the MySQL Database

Start your MySQL server, then run:

```bash
mysql -u root -p
```

```sql
CREATE DATABASE language_learning;
USE language_learning;
SOURCE database/schema.sql;
SOURCE database/seed.sql;
```

---

## 🔑 Supabase Configuration

LingoQuest uses Supabase for user authentication and live profile syncing.

### Getting Your Credentials

1. Go to [supabase.com](https://supabase.com) and open your project (**LingoQuest Project**)
2. Click **Settings → API** in the left sidebar
3. Copy your **Project URL** and **anon public key**

### Adding Credentials to the Frontend

Open `index.html` and find the Supabase config block near the bottom of the `<script>` section. Replace the values:

```javascript
// Around line 662 in index.html
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-public-key';
```

### Required SQL — Run in Supabase SQL Editor

Go to your Supabase dashboard → **SQL Editor → New Query** and run the following:

```sql
-- 1. Profile table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public."Profile" (
  id            UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email         TEXT,
  first_name    TEXT,
  last_name     TEXT,
  last_login    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  streak_count  INT DEFAULT 0,
  total_xp      INT DEFAULT 0,
  target_language TEXT
);

-- 2. Auto-create/update Profile row on signup or login
CREATE OR REPLACE FUNCTION public.handle_user_login()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public."Profile" (id, email, last_login)
  VALUES (NEW.id, NEW.email, NOW())
  ON CONFLICT (id) DO UPDATE
    SET last_login = NOW(),
        email      = EXCLUDED.email;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Attach trigger to auth sign-ups
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_login();
```

After running this, every new user signup will automatically create a `Profile` row. You can verify by going to **Table Editor → Profile** in Supabase after logging in through the site.

---

## 🗄️ Database Schema

### MySQL Tables

```sql
-- Users
CREATE TABLE IF NOT EXISTS users (
  user_id       BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  first_name    VARCHAR(50)  NOT NULL,
  last_name     VARCHAR(50)  NOT NULL,
  email         VARCHAR(100) NOT NULL UNIQUE,
  password_hash TEXT         NOT NULL,
  role          TEXT         NOT NULL DEFAULT 'CLIENT',
  created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
  last_login    TIMESTAMP    NULL
);

-- Learning Paths
CREATE TABLE IF NOT EXISTS learning_paths (
  path_id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id        BIGINT       NOT NULL,
  assigned_level VARCHAR(50)  DEFAULT 'Beginner',
  start_date     TIMESTAMP    NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_lp_user FOREIGN KEY (user_id)
    REFERENCES users(user_id) ON DELETE CASCADE
);

-- Progress Tracker
CREATE TABLE IF NOT EXISTS progress_tracker (
  progress_id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id            BIGINT NOT NULL,
  completed_lessons  INT    NOT NULL DEFAULT 0,
  completed_quizzes  INT    NOT NULL DEFAULT 0,
  streak_count       INT    NOT NULL DEFAULT 0,
  CONSTRAINT fk_pt_user FOREIGN KEY (user_id)
    REFERENCES users(user_id) ON DELETE CASCADE
);
```

---

## ▶️ Running the Project

### Frontend Only (Quickest — No Setup Needed)

```bash
open index.html
# or visit https://lingoquest2026.netlify.app
```

### Full Stack (Frontend + Backend + Database)

```bash
# Terminal 1 — Backend API
cd backend
uvicorn main:app --reload --port 8000
# API available at http://localhost:8000
# Interactive docs at http://localhost:8000/docs

# Terminal 2 — Open the frontend
open index.html
```

---

## 📅 Sprint History

| Sprint | Key Deliverables | Team |
|--------|-----------------|------|
| **Sprint 1** | Problem Statement, Context Diagram, Activity Diagram, Initial Use Cases | All |
| **Sprint 2** | Class Diagram, Behavioral Modeling (UML Sequence Diagrams), Database Schema, Requirements | All |
| **Sprint 3** | Frontend Home Page, Smooth Scroll, Flip Cards, Supabase Login Tracking, Global Community, Daily Streaks UML, Settings UML | Quez, Faysal, Harry |
| **Sprint 4** | Language Selection, Pre-Test, Lesson System, Adaptive Quiz, Sketchpad, Pronunciation Test, Full Class Diagram Implementation, Netlify Deployment | Quez, Lasya, Harry, Faysal |
| **Sprint 5** | Contextual Question Banks (8 languages, 5–8 questions each), Robust Sketchpad (Base64 + touch support), Adaptive XP Rewards, Supabase State Sync (streak/xp/language) | Quez |

---

## 👥 Team

| Name | Email | Role |
|------|-------|------|
| **Lasya Jonnalagadda** | ljonnalagadda1@student.gsu.edu | Class Diagrams, Architectural Modeling, Problem Statement |
| **Marquez Johnson** | mjohnson428@student.gsu.edu | Implementation, Backend API Integration, Database |
| **Harry Ahsan** | tahsan1@student.gsu.edu | UML Sequence Diagrams, Use Case Diagrams, Test Cases, Daily Streaks |
| **Faysal Abdulkadir** | fabdulkadir2@student.gsu.edu | Context Diagram, Activity Diagram, Behavioral Modeling, Settings Page |

---

*CSC 4320 — Software Engineering | Georgia State University | Spring 2026*
