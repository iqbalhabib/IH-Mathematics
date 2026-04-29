# IH Mathematics Platform — Project Documentation

> **Last updated:** 2026-04-30
> **Version:** 0.2.0 (Phase 2 complete)

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure](#3-folder-structure)
4. [Environment Variables](#4-environment-variables)
5. [Running Locally](#5-running-locally)
6. [Pages & Routes](#6-pages--routes)
7. [Authentication Flow](#7-authentication-flow)
8. [Components](#8-components)
9. [Database](#9-database)
10. [Build Phases](#10-build-phases)
11. [Deployment](#11-deployment)

---

## 1. Project Overview

**IH Mathematics** is a full-stack online math tutoring platform for Cambridge O & A Level students (and future GRE / job applicants).

**Core features:**
- Online courses with recorded video lessons
- Student enrollment, login & personal dashboard
- Attendance & performance tracking
- AI Photo Math Solver — upload a problem image, get a step-by-step solution
- Past papers library (O & A Level, by year & topic)
- Payment system for course enrollment
- Admin panel for the teacher/manager

**Target audience:** Cambridge O & A Level students (Bangladesh), future: GRE & job applicants

---

## 2. Tech Stack

| Purpose | Tool | Notes |
|---------|------|-------|
| Frontend | Next.js 16 (App Router) | React, TypeScript |
| Styling | Tailwind CSS v4 | Utility-first CSS |
| Database + Auth | Supabase | PostgreSQL + Row Level Security |
| Hosting | Vercel | Free tier |
| AI Math Solver | Anthropic Claude Vision API | claude-sonnet model |
| Video Hosting | YouTube embed / Bunny.net | TBD |
| Payments | Stripe / SSLCommerz | TBD — SSLCommerz for Bangladesh |
| File Storage | Cloudflare R2 / Supabase Storage | For PDFs, images |

---

## 3. Folder Structure

```
my-math-platform/
│
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Auth route group (no navbar/footer)
│   │   ├── login/page.tsx        # Login page
│   │   └── signup/page.tsx       # Signup page
│   │
│   ├── auth/
│   │   └── callback/route.ts     # Supabase email confirmation handler
│   │
│   ├── dashboard/
│   │   ├── student/
│   │   │   ├── page.tsx          # Server component — auth check
│   │   │   └── DashboardUI.tsx   # Client component — full interactive UI
│   │   └── admin/
│   │       └── page.tsx          # Admin panel (Phase 3)
│   │
│   ├── courses/page.tsx          # Course listing page (Phase 3)
│   ├── past-papers/page.tsx      # Past papers library (Phase 3)
│   ├── ai-solver/page.tsx        # AI Math Solver (Phase 3)
│   │
│   ├── layout.tsx                # Root layout (font, metadata, navbar, footer)
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global styles + custom animations
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx            # Sticky navbar (hidden on dashboard/auth)
│   │   └── Footer.tsx            # Footer (hidden on dashboard/auth)
│   └── ui/
│       └── IHLogo.tsx            # SVG logo component (fallback)
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser Supabase client
│   │   └── server.ts             # Server Supabase client (SSR/cookies)
│   └── supabase.ts               # Legacy — replaced by lib/supabase/
│
├── types/
│   └── index.ts                  # TypeScript types: User, Course, Enrollment, etc.
│
├── public/
│   ├── logo.png                  # Main logo (blue geometric IH, used in navbar/footer)
│   ├── logo-icon.png             # Icon logo (used as favicon)
│   ├── images/
│   │   ├── courses/              # Course thumbnail images
│   │   ├── team/                 # Teacher/staff photos
│   │   └── testimonials/         # Student profile pictures
│   └── icons/                    # SVG icons
│
├── middleware.ts                  # Auth middleware — protects /dashboard routes
├── .env.local                     # Secret keys (never commit)
├── DOCUMENTATION.md               # This file
└── package.json
```

---

## 4. Environment Variables

Located in `.env.local` (never committed to Git).

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://osfthpdhdevfejcqntmk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>

# Anthropic — AI Math Solver
ANTHROPIC_API_KEY=<your-anthropic-key>

# Stripe — Payments (add when ready)
STRIPE_SECRET_KEY=<your-stripe-secret>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<your-stripe-public>
```

> **Note:** `NEXT_PUBLIC_` prefix makes variables available in the browser. Never put secret keys with this prefix.

---

## 5. Running Locally

### Prerequisites
- Node.js v18+ (currently using v24)
- npm v9+

### Steps

```bash
# 1. Navigate to project
cd "d:/CV/Teaching Website/my-math-platform"

# 2. Install dependencies (first time only)
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:3000
```

### Useful URLs (local)
| URL | Page |
|-----|------|
| http://localhost:3000 | Homepage |
| http://localhost:3000/login | Login |
| http://localhost:3000/signup | Signup |
| http://localhost:3000/dashboard/student | Student Dashboard |
| http://localhost:3000/courses | Courses (placeholder) |
| http://localhost:3000/past-papers | Past Papers (placeholder) |
| http://localhost:3000/ai-solver | AI Solver (placeholder) |

---

## 6. Pages & Routes

### Public pages (with Navbar + Footer)
| Route | File | Status |
|-------|------|--------|
| `/` | `app/page.tsx` | ✅ Complete |
| `/courses` | `app/courses/page.tsx` | 🔄 Phase 3 |
| `/past-papers` | `app/past-papers/page.tsx` | 🔄 Phase 3 |
| `/ai-solver` | `app/ai-solver/page.tsx` | 🔄 Phase 3 |

### Auth pages (no Navbar/Footer — full screen)
| Route | File | Status |
|-------|------|--------|
| `/login` | `app/(auth)/login/page.tsx` | ✅ Complete |
| `/signup` | `app/(auth)/signup/page.tsx` | ✅ Complete |
| `/auth/callback` | `app/auth/callback/route.ts` | ✅ Complete |

### Protected pages (requires login)
| Route | File | Status |
|-------|------|--------|
| `/dashboard/student` | `app/dashboard/student/page.tsx` | ✅ Complete |
| `/dashboard/admin` | `app/dashboard/admin/page.tsx` | 🔄 Phase 3 |

---

## 7. Authentication Flow

```
User visits /signup
  → Fills form (name, email, password, level)
  → Supabase creates account
  → Confirmation email sent
  → User clicks link → /auth/callback?code=xxx
  → Code exchanged for session
  → Redirect to /dashboard/student

User visits /login
  → Email + password submitted
  → Supabase validates
  → Session cookie set
  → Redirect to /dashboard/student

User visits /dashboard/* (not logged in)
  → middleware.ts catches it
  → Redirect to /login

User visits /login or /signup (already logged in)
  → middleware.ts catches it
  → Redirect to /dashboard/student
```

### Supabase Settings Required
- **Site URL:** `http://localhost:3000` (dev) / `https://yourdomain.com` (prod)
- **Redirect URLs:** `http://localhost:3000/**`
- Email confirmation: Enabled (default)

---

## 8. Components

### Navbar (`components/layout/Navbar.tsx`)
- Fixed to top, transparent over hero, white/blur when scrolled
- Hides on: `/dashboard/*`, `/login`, `/signup`
- Mobile: hamburger menu with slide-down
- Links: Courses, Past Papers, AI Solver
- CTAs: Log In, Get Started Free

### Footer (`components/layout/Footer.tsx`)
- Hides on: `/dashboard/*`, `/login`, `/signup`
- 4 columns: Brand, Courses, Resources, Contact
- Social links: Facebook, YouTube, WhatsApp

### Student Dashboard (`app/dashboard/student/DashboardUI.tsx`)
- Sidebar: logo, navigation, user card, sign out
- Stats: courses, assignments, avg score, attendance
- Weekly performance bar chart (CSS-based)
- Subject performance with progress bars
- Assignments: pending/completed tabs
- Active courses with progress
- Results table with grades and pass/fail
- Monthly attendance chart
- Quick action buttons

---

## 9. Database

**Provider:** Supabase (PostgreSQL)
**Project URL:** `https://osfthpdhdevfejcqntmk.supabase.co`

### Planned Tables (Phase 3)

```sql
-- Users (extends Supabase auth.users)
profiles (
  id          uuid references auth.users primary key,
  full_name   text,
  level       text,   -- 'o_level', 'a_level', 'gre'
  role        text,   -- 'student', 'admin'
  created_at  timestamptz
)

-- Courses
courses (
  id          uuid primary key,
  title       text,
  description text,
  level       text,
  video_url   text,
  price       numeric,
  created_at  timestamptz
)

-- Enrollments
enrollments (
  id          uuid primary key,
  student_id  uuid references profiles,
  course_id   uuid references courses,
  enrolled_at timestamptz,
  status      text  -- 'active', 'completed'
)

-- Past Papers
past_papers (
  id        uuid primary key,
  title     text,
  level     text,
  year      int,
  subject   text,
  file_url  text
)

-- Attendance
attendance (
  id         uuid primary key,
  student_id uuid references profiles,
  course_id  uuid references courses,
  date       date,
  present    boolean
)

-- Assignments
assignments (
  id          uuid primary key,
  title       text,
  course_id   uuid references courses,
  due_date    date,
  max_marks   int
)

-- Assignment Submissions
submissions (
  id            uuid primary key,
  assignment_id uuid references assignments,
  student_id    uuid references profiles,
  submitted_at  timestamptz,
  score         int,
  feedback      text
)
```

---

## 10. Build Phases

| Phase | Features | Status |
|-------|----------|--------|
| **Phase 1** | Project setup, homepage, Navbar, Footer | ✅ Complete |
| **Phase 2** | Supabase auth, login, signup, student dashboard | ✅ Complete |
| **Phase 3** | Course pages, past papers, admin panel | 🔄 Next |
| **Phase 4** | Attendance tracking, performance analytics (real data) | ⏳ Upcoming |
| **Phase 5** | AI Photo Math Solver (Claude Vision API) | ⏳ Upcoming |
| **Phase 6** | Payments (SSLCommerz/Stripe) + final testing + launch | ⏳ Upcoming |

---

## 11. Deployment

### Vercel (Frontend)
1. Push code to GitHub (`github.com/iqbalhabib/IH-Mathematics`)
2. Go to [vercel.com](https://vercel.com) → Import GitHub repo
3. Add all environment variables from `.env.local`
4. Deploy — Vercel auto-deploys on every `git push`

### Supabase (Database)
- Update **Site URL** to production domain
- Add production domain to **Redirect URLs**
- Enable Row Level Security (RLS) on all tables

### Estimated Monthly Cost (at launch)
| Service | Cost |
|---------|------|
| Vercel hosting | Free |
| Supabase (up to 500 users) | Free |
| Anthropic API (AI Solver) | ~$10–30/month |
| Domain (.com) | ~$12/year |
| **Total** | **~$10–30/month** |

---

*This documentation is maintained alongside the codebase. Update it whenever a new feature is added, a route changes, or a phase is completed.*
