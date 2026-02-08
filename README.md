# SkillSync Client 🎓

> **Full-featured tutor marketplace frontend** — browse expert tutors, book sessions, manage dashboards. Built with Next.js 16, React 19, TypeScript, Tailwind CSS 4 & shadcn/ui.

🔗 **Live Site:** [skillsync-portal.vercel.app](https://skillsync-portal.vercel.app)  
🔗 **Live API:** [skillsync-api.vercel.app](https://skillsync-api.vercel.app)  
📂 **Backend Repo:** [skillsync-backend](../skillsync-backend)

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Pages & Routes](#-pages--routes)
- [Screenshots](#-screenshots)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Admin Credentials](#-admin-credentials)

---

## ✨ Features

### 🌐 Public

- **Landing page** — hero section, search, how-it-works, featured tutors, CTA
- **Tutor browsing** — filter by category, price range, rating, keyword search
- **Tutor profiles** — bio, subjects, availability schedule, reviews, instant booking
- **Email verification** — token-based email confirmation flow

### 🎓 Student Dashboard

- **Dashboard overview** — booking stats (total, upcoming, completed, cancelled)
- **Book sessions** — date/time picker, duration selection, price calculation
- **Booking management** — tabbed view (upcoming / past / cancelled), cancel bookings
- **Leave reviews** — star rating + comment for completed sessions
- **Profile management** — update name, phone, avatar

### 📚 Tutor Dashboard

- **Dashboard overview** — session stats, earnings, today's schedule, recent reviews
- **Session management** — tabbed view, mark sessions as completed
- **Availability management** — add/remove weekly time slots grouped by day
- **Profile editor** — bio, hourly rate, experience, categories, personal info

### 🛡 Admin Dashboard

- **Analytics dashboard** — user distribution charts, booking analytics with completion rate, revenue stats, recent signups
- **User management** — searchable/filterable table, ban/unban users
- **Booking oversight** — all platform bookings with detail dialogs
- **Category management** — create, edit, and delete subject categories

### 🔒 Auth & Security

- **Email/password** authentication with Zod validation
- **Google OAuth** social login
- **Email verification** with SMTP
- **Role-based middleware** — cookie-based role enforcement at middleware level
- **Server-side role guards** — layout-level redirect for wrong-role access
- **Same-origin API proxies** — all backend requests proxied for secure cookie handling

---

## 🛠 Tech Stack

| Layer          | Technology                  | Version |
| -------------- | --------------------------- | ------- |
| Framework      | Next.js (App Router)        | 16.1    |
| UI Library     | React                       | 19.2    |
| Language       | TypeScript                  | 5.x     |
| Styling        | Tailwind CSS                | 4.x     |
| Components     | shadcn/ui + Radix UI        | Latest  |
| Auth           | Better Auth (client)        | 1.4     |
| Forms          | @tanstack/react-form + Zod  | —       |
| Date Handling  | date-fns + react-day-picker | —       |
| Toasts         | Sonner                      | 2.x     |
| Theming        | next-themes                 | 0.4     |
| Env Validation | @t3-oss/env-nextjs          | —       |
| Deploy         | Vercel                      | —       |

---

## 🗺 Pages & Routes

### Public Routes

| Route           | Page               | Description                                                          |
| --------------- | ------------------ | -------------------------------------------------------------------- |
| `/`             | Home               | Hero section, search bar, featured tutors, how-it-works, CTA         |
| `/tutors`       | Browse Tutors      | Filterable tutor grid with sidebar (category, price, rating, search) |
| `/tutors/[id]`  | Tutor Profile      | Full profile, availability, reviews, booking modal                   |
| `/login`        | Login              | Email/password + Google OAuth                                        |
| `/register`     | Register           | Sign up with role selection (Student / Tutor)                        |
| `/verify-email` | Email Verification | Token verification landing page                                      |

### Student Routes (Protected)

| Route                 | Page        | Description                                                    |
| --------------------- | ----------- | -------------------------------------------------------------- |
| `/dashboard`          | Dashboard   | Stats cards, upcoming bookings, quick actions                  |
| `/dashboard/bookings` | My Bookings | Tabbed list (Upcoming / Past / Cancelled) with cancel + review |
| `/dashboard/profile`  | Profile     | Edit name, phone, avatar                                       |

### Tutor Routes (Protected)

| Route                           | Page         | Description                                                    |
| ------------------------------- | ------------ | -------------------------------------------------------------- |
| `/tutor-dashboard`              | Dashboard    | Session stats, earnings, today's schedule, recent reviews      |
| `/tutor-dashboard/sessions`     | Sessions     | Tabbed list with mark-complete action                          |
| `/tutor-dashboard/availability` | Availability | Add/delete time slots, grouped by day of week                  |
| `/tutor-dashboard/profile`      | Profile      | Edit personal + tutor info (bio, rate, experience, categories) |

### Admin Routes (Protected)

| Route                         | Page       | Description                                                            |
| ----------------------------- | ---------- | ---------------------------------------------------------------------- |
| `/admin-dashboard`            | Dashboard  | Analytics: user distribution, booking charts, completion rate, revenue |
| `/admin-dashboard/users`      | Users      | Searchable table with ban/unban actions                                |
| `/admin-dashboard/bookings`   | Bookings   | All bookings with filter + detail dialog                               |
| `/admin-dashboard/categories` | Categories | Create, edit, delete subject categories                                |

### Utility Routes

| Route                 | Description                                                 |
| --------------------- | ----------------------------------------------------------- |
| `/dashboard-redirect` | Server-side role detection → redirects to correct dashboard |
| `/not-found`          | Custom 404 page                                             |

---

## 📸 Screenshots

> Visit the **[live site](https://skillsync-portal.vercel.app)** to explore all pages.

| Page              | Description                          |
| ----------------- | ------------------------------------ |
| Landing Page      | Hero + featured tutors + CTA         |
| Tutor Browsing    | Sidebar filters + tutor cards grid   |
| Tutor Profile     | Detail view with booking modal       |
| Student Dashboard | Stats + upcoming bookings            |
| Admin Analytics   | Charts + user distribution + revenue |

---

## 🏗 Architecture

```
Browser
  │
  ├── Next.js Pages (App Router)
  │     ├── Server Components (data fetching, SEO)
  │     └── Client Components (interactivity)
  │
  ├── Middleware (middleware.ts)
  │     ├── Auth check (session cookie)
  │     └── Role-based route protection (user-role cookie)
  │
  ├── API Proxy Routes (/api/*)
  │     ├── /api/auth/*        → Backend auth
  │     ├── /api/user/*        → User profile
  │     ├── /api/admin/*       → Admin endpoints
  │     ├── /api/bookings/*    → Booking CRUD
  │     ├── /api/tutors/*      → Public tutor discovery
  │     ├── /api/tutor/*       → Tutor management
  │     ├── /api/reviews/*     → Reviews
  │     ├── /api/student/*     → Student endpoints
  │     └── /api/categories/*  → Categories
  │
  └── Backend API (skillsync-backend)
```

### Key Architecture Decisions

| Decision                    | Rationale                                                                                                              |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **API Proxy Layer**         | All backend calls go through Next.js route handlers to keep auth cookies on the same origin (no CORS cookie issues)    |
| **Parallel Routes**         | Admin, student, and tutor dashboards use Next.js parallel routes (`@admin`, `@student`, `@tutor`) for isolated layouts |
| **Server-Side Role Guards** | Each dashboard layout calls `getRoleRedirectPath()` to verify the user's actual role before rendering                  |
| **Cookie-Based Middleware** | Middleware reads a `user-role` cookie (set on login) for fast role checks without API calls                            |
| **Service Layer Pattern**   | All API calls are centralized in `src/services/*.ts` — clean separation from UI                                        |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended)
- Running [skillsync-backend](../skillsync-backend) instance

### Installation

```bash
# Clone & navigate
git clone <repo-url>
cd skillsync-client

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values (see below)

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

Create `.env.local` in the project root:

```env
# Backend URLs (server-side)
BACKEND_URL=http://localhost:5000
API_URL=http://localhost:5000/api
AUTH_URL=http://localhost:5000/api/auth

# Backend URLs (client-side / browser)
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_AUTH_URL=http://localhost:5000/api/auth

# App
NEXT_PUBLIC_APP_NAME=SkillSync
```

| Variable               | Side   | Purpose                               |
| ---------------------- | ------ | ------------------------------------- |
| `BACKEND_URL`          | Server | Base backend URL                      |
| `API_URL`              | Server | Backend API base for SSR requests     |
| `AUTH_URL`             | Server | Backend auth URL for SSR              |
| `NEXT_PUBLIC_API_URL`  | Client | Backend API base for browser requests |
| `NEXT_PUBLIC_AUTH_URL` | Client | Better Auth URL for browser           |
| `NEXT_PUBLIC_APP_NAME` | Client | App display name                      |

---

## 📂 Project Structure

```
skillsync-client/
├── middleware.ts                    # Auth + role-based route protection
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (providers, theme, toaster)
│   │   ├── not-found.tsx           # Custom 404
│   │   ├── globals.css             # Tailwind + global styles
│   │   ├── (public)/               # Public pages (/, /tutors, /tutors/[id])
│   │   ├── (auth)/                 # Auth pages (/login, /register, /verify-email)
│   │   ├── (studentLayout)/        # Student dashboard (parallel route @student)
│   │   ├── (tutorLayout)/          # Tutor dashboard (parallel route @tutor)
│   │   ├── (adminLayout)/          # Admin dashboard (parallel route @admin)
│   │   ├── dashboard-redirect/     # Server-side role → dashboard redirect
│   │   └── api/                    # API proxy route handlers
│   │       ├── auth/[...all]/      # → Backend /api/auth/*
│   │       ├── user/[...all]/      # → Backend /api/user/*
│   │       ├── admin/[...all]/     # → Backend /api/admin/*
│   │       ├── bookings/           # → Backend /api/bookings/*
│   │       ├── tutors/             # → Backend /api/tutors/*
│   │       ├── tutor/[...all]/     # → Backend /api/tutor/*
│   │       ├── reviews/            # → Backend /api/reviews/*
│   │       ├── student/[...all]/   # → Backend /api/student/*
│   │       └── categories/         # → Backend /api/categories/*
│   ├── actions/                    # Server actions
│   │   ├── auth.action.ts          # Register / login actions
│   │   ├── booking.action.ts       # Create booking action
│   │   └── tutor.action.ts         # Get tutors action
│   ├── services/                   # API client layer
│   │   ├── admin.service.ts        # Admin: users, bookings, stats, categories
│   │   ├── auth.service.ts         # Auth: register, login, logout, session
│   │   ├── booking.service.ts      # Bookings: CRUD, cancel, complete
│   │   ├── review.service.ts       # Reviews: create, list by tutor
│   │   ├── tutor.service.ts        # Tutors: browse, profile, availability
│   │   └── user.service.ts         # User: me, update profile
│   ├── components/
│   │   ├── layout/                 # Navbar, Footer, Sidebars
│   │   ├── modules/                # Feature components (TutorCard, BookingModal, etc.)
│   │   └── ui/                     # shadcn/ui primitives
│   ├── hooks/                      # Custom hooks (useAuth, useMobile)
│   ├── lib/                        # Utilities (auth-client, server-auth, utils)
│   ├── providers/                  # ThemeProvider
│   ├── routes/                     # Sidebar route definitions per role
│   └── types/                      # TypeScript type definitions
├── public/                         # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
└── tailwind / postcss configs
```

---

## 🔐 Admin Credentials

After running the backend seed script:

| Field    | Value                 |
| -------- | --------------------- |
| Email    | `admin@skillsync.com` |
| Password | `Admin@123`           |
| Role     | ADMIN                 |

> See backend README for seed instructions: `npx prisma db seed`

---

## 📜 Scripts

| Command      | Description              |
| ------------ | ------------------------ |
| `pnpm dev`   | Start Next.js dev server |
| `pnpm build` | Build for production     |
| `pnpm start` | Run production build     |
| `pnpm lint`  | Run ESLint               |

---

## ☁️ Deployment

Deployed on **Vercel** with automatic builds on push to `main`.

```bash
vercel --prod
```

Make sure all environment variables are set in Vercel project settings.

---

## 🤝 Related

- **Backend:** [skillsync-backend](../skillsync-backend) — Express 5, Prisma 7, Better Auth
- **Live Site:** [skillsync-portal.vercel.app](https://skillsync-portal.vercel.app)
- **Live API:** [skillsync-api.vercel.app](https://skillsync-api.vercel.app)
