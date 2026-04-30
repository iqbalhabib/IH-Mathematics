# IH Mathematics Platform — Full Developer Documentation

> **Last updated:** 2026-04-30
> **Version:** 0.3.0 (Phase 3 complete)
> **Repository:** https://github.com/iqbalhabib/IH-Mathematics
> **Live URL:** TBD (deploy in Phase 6)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack — Why Each Tool Was Chosen](#2-tech-stack--why-each-tool-was-chosen)
3. [Prerequisites & First-Time Setup](#3-prerequisites--first-time-setup)
4. [Folder Structure — Every File Explained](#4-folder-structure--every-file-explained)
5. [Environment Variables — Full Reference](#5-environment-variables--full-reference)
6. [Running the Project Locally](#6-running-the-project-locally)
7. [How Next.js App Router Works (Key Concepts)](#7-how-nextjs-app-router-works-key-concepts)
8. [Pages & Routes — Complete Reference](#8-pages--routes--complete-reference)
9. [Authentication System — Full Flow](#9-authentication-system--full-flow)
10. [Components — Detailed Breakdown](#10-components--detailed-breakdown)
11. [Styling System — How to Customize](#11-styling-system--how-to-customize)
12. [Database Schema — Full Reference](#12-database-schema--full-reference)
13. [Supabase — How to Use It](#13-supabase--how-to-use-it)
14. [How to Add New Features](#14-how-to-add-new-features)
15. [How to Customize Existing Features](#15-how-to-customize-existing-features)
16. [Build Phases — Progress Tracker](#16-build-phases--progress-tracker)
17. [Git Workflow](#17-git-workflow)
18. [Deployment Guide](#18-deployment-guide)
19. [Troubleshooting Common Issues](#19-troubleshooting-common-issues)
20. [Cost Breakdown](#20-cost-breakdown)

---

## 1. Project Overview

**IH Mathematics** is a full-stack online math tutoring platform built for Cambridge O & A Level students in Bangladesh, with plans to expand to GRE and professional exam prep.

### What It Does
- Students sign up, enroll in courses, watch video lessons, and track their progress
- A built-in AI Math Solver lets students upload a photo of any problem and get a step-by-step solution
- A full past papers library organises all Cambridge papers by year and topic
- The teacher/admin manages everything through a dedicated admin panel
- Payments are handled through SSLCommerz (Bangladesh) or Stripe (international)

### Who Built It
- **Owner / Teacher:** IH (Habib Iqbal) — mr.habibiqbal@gmail.com
- **Built with:** Claude Code (AI-assisted development)

### Target Users
| User Type | What They Do |
|-----------|-------------|
| **Students** | Sign up, enroll in courses, view past papers, use AI solver, check dashboard |
| **Admin (Teacher)** | Add courses, manage students, grade assignments, track attendance |
| **Visitors** | Browse homepage, see course listings (no login needed) |

---

## 2. Tech Stack — Why Each Tool Was Chosen

### Frontend: Next.js 16 with App Router
**What it is:** A React framework that handles routing, server-side rendering, and optimisation automatically.

**Why chosen:**
- Built-in file-based routing (create a file = create a page)
- Server Components: pages load faster because data fetching happens on the server
- Free deployment on Vercel (made by the same team)
- TypeScript support out of the box

**Key Next.js concepts used:**
- **App Router** — all pages live in the `app/` folder
- **Server Components** — run on the server, can access databases directly
- **Client Components** — run in the browser, handle interactivity (`"use client"` at top)
- **Route Groups** — folders with `()` like `(auth)` don't affect the URL but let you share layouts

### Styling: Tailwind CSS v4
**What it is:** A utility-first CSS framework. Instead of writing CSS files, you apply pre-built classes directly to HTML elements.

**Why chosen:**
- No separate CSS files to manage
- Responsive design built in (`sm:`, `md:`, `lg:` prefixes)
- Consistent design system out of the box
- Very fast to build with

**Example:**
```tsx
// Instead of writing CSS:
// .button { background: blue; padding: 12px; border-radius: 8px; }

// You write Tailwind classes directly:
<button className="bg-blue-600 px-4 py-3 rounded-xl">Click me</button>
```

### Database + Auth: Supabase
**What it is:** A hosted PostgreSQL database with a built-in authentication system, real-time subscriptions, and file storage.

**Why chosen:**
- Free tier supports up to 500 users (perfect for starting)
- Authentication is built in — no need to build login/signup from scratch
- Works natively with Next.js
- Has a visual dashboard to manage data

**Supabase project:** `https://osfthpdhdevfejcqntmk.supabase.co`

### Hosting: Vercel
**Why chosen:** Free hosting, auto-deploys from GitHub, built by the Next.js team so perfect compatibility.

### AI Solver: Anthropic Claude Vision API
**What it is:** An API that can read and understand images. We send it a photo of a math problem and it returns a step-by-step solution.

**Why chosen:** Claude has excellent reasoning for mathematics. The API is simple — one API call with an image.

### TypeScript
**What it is:** JavaScript with type safety. It catches errors before the code runs.

**Example:**
```typescript
// Without TypeScript — no error warning:
function greet(name) { return "Hello " + name; }
greet(42); // Bug: passes a number, not a string

// With TypeScript — error caught immediately:
function greet(name: string) { return "Hello " + name; }
greet(42); // ❌ Error: Argument of type 'number' is not assignable to parameter of type 'string'
```

---

## 3. Prerequisites & First-Time Setup

### What You Need Installed

| Tool | Version | How to Check | Install |
|------|---------|--------------|---------|
| Node.js | v18 or higher | `node --version` | [nodejs.org](https://nodejs.org) — download LTS |
| npm | v9 or higher | `npm --version` | Comes with Node.js |
| Git | Any | `git --version` | [git-scm.com](https://git-scm.com) |
| VS Code | Any | — | [code.visualstudio.com](https://code.visualstudio.com) |

### Recommended VS Code Extensions
Install these for the best development experience:
- **Tailwind CSS IntelliSense** — autocomplete for Tailwind classes
- **ES7+ React/Redux/React-Native snippets** — code shortcuts
- **Prettier** — auto-format code
- **TypeScript Vue Plugin** — better TypeScript support

### Clone the Project (for a new developer)
```bash
# Clone from GitHub
git clone https://github.com/iqbalhabib/IH-Mathematics.git

# Go into the project folder
cd IH-Mathematics/my-math-platform

# Install all dependencies
npm install

# Create your .env.local file (copy the template)
copy .env.example .env.local
# Then fill in your Supabase keys (see Section 5)

# Start the development server
npm run dev
```

---

## 4. Folder Structure — Every File Explained

```
my-math-platform/
│
├── app/                              ← ALL pages live here
│   │
│   ├── (auth)/                       ← Route group: auth pages share no layout
│   │   │                               The parentheses mean (auth) is NOT in the URL
│   │   │                               So: app/(auth)/login → URL is /login
│   │   ├── login/
│   │   │   └── page.tsx              ← Login form page
│   │   └── signup/
│   │       └── page.tsx              ← Signup/registration form page
│   │
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts              ← API route that handles Supabase email
│   │                                   confirmation links. Not a page — it's a
│   │                                   server-side handler that redirects users.
│   │
│   ├── dashboard/                    ← Protected area (login required)
│   │   ├── student/
│   │   │   ├── page.tsx              ← Server component: checks auth, gets user data,
│   │   │   │                           passes it to DashboardUI
│   │   │   └── DashboardUI.tsx       ← Client component: the full interactive dashboard
│   │   │                               (sidebar, charts, assignments, results, etc.)
│   │   └── admin/
│   │       ├── page.tsx              ← Server component: checks auth + admin email,
│   │       │                           redirects non-admins to /dashboard/student
│   │       └── AdminUI.tsx           ← Client component: full admin panel UI
│   │                                   (stats, charts, student table, course management)
│   │
│   ├── courses/
│   │   ├── page.tsx                  ← Course listing with search + tab filters (client)
│   │   └── [id]/
│   │       └── page.tsx              ← Individual course page (server, async params)
│   │                                   URL: /courses/o-level-math, /courses/gre-quant, etc.
│   │
│   ├── past-papers/
│   │   └── page.tsx                  ← Past papers library: 46+ papers, 5 filters,
│   │                                   grid/list view toggle (client component)
│   │
│   ├── ai-solver/
│   │   └── page.tsx                  ← AI Math Solver (Phase 5 — placeholder now)
│   │
│   ├── layout.tsx                    ← ROOT LAYOUT: wraps every page on the site.
│   │                                   Sets the font, metadata (title, description),
│   │                                   and renders <Navbar> and <Footer> around all content.
│   │
│   ├── page.tsx                      ← HOMEPAGE (URL: /)
│   │                                   Contains: Hero, Stats, Features, Courses,
│   │                                   How It Works, Testimonials, CTA sections
│   │
│   └── globals.css                   ← Global CSS file. Imports Tailwind and defines
│                                       custom animations and reusable CSS classes.
│
├── components/                       ← Reusable UI pieces used across multiple pages
│   │
│   ├── layout/
│   │   ├── Navbar.tsx                ← Top navigation bar (client component)
│   │   │                               Auto-hides on dashboard and auth pages.
│   │   │                               Transparent on hero, white when scrolled.
│   │   └── Footer.tsx                ← Site footer (client component)
│   │                                   Auto-hides on dashboard and auth pages.
│   │
│   └── ui/
│       └── IHLogo.tsx                ← SVG version of the IH logo (fallback if
│                                       logo.png fails to load). Pure code, no file needed.
│
├── lib/                              ← Utility functions and external service clients
│   │
│   ├── supabase/
│   │   ├── client.ts                 ← Creates a Supabase client for use in the BROWSER
│   │   │                               (Client Components). Uses cookies for auth.
│   │   └── server.ts                 ← Creates a Supabase client for use on the SERVER
│   │                                   (Server Components, API routes). Uses cookies too.
│   │
│   ├── courses-data.ts               ← Shared TypeScript data for all 6 courses.
│   │                                   Contains the Course interface + courses[] array.
│   │                                   Imported by both /courses/page.tsx and /courses/[id]/page.tsx
│   └── supabase.ts                   ← OLD file (kept for reference, not used anymore)
│                                       Replaced by lib/supabase/client.ts
│
├── types/
│   └── index.ts                      ← TypeScript type definitions for the whole app.
│                                       Defines the shape of User, Course, Enrollment, etc.
│                                       Import these in any file that needs them.
│
├── public/                           ← Static files served directly by the web server
│   │                                   Accessible at: /filename.ext (no /public/ in URL)
│   ├── logo.png                      ← Main IH logo (blue geometric design)
│   │                                   Used in: Navbar, Footer, Login page, Signup page
│   ├── logo-icon.png                 ← Rounded icon version of the logo
│   │                                   Used as: browser tab favicon, Apple home screen icon
│   ├── images/
│   │   ├── courses/                  ← Thumbnail images for each course card
│   │   │                               Naming convention: olevel-math.jpg, alevel-pure.jpg
│   │   ├── team/                     ← Teacher/staff profile photos
│   │   │                               Naming convention: habib-iqbal.jpg
│   │   └── testimonials/             ← Student profile photos (optional)
│   └── icons/                        ← Custom SVG icons if needed
│
├── middleware.ts                      ← Runs on EVERY request before the page loads.
│                                       Checks if user is logged in.
│                                       Redirects unauthenticated users away from /dashboard/*
│                                       Redirects logged-in users away from /login and /signup
│
├── .env.local                         ← SECRET KEYS — never commit to Git
│                                       Contains: Supabase URL, API keys, payment keys
│
├── .gitignore                         ← Files Git should ignore (includes .env.local, node_modules)
│
├── next.config.ts                     ← Next.js configuration file
│                                       Use this to: add allowed image domains, set redirects,
│                                       configure environment variables for build time
│
├── tailwind.config.ts                 ← Tailwind CSS configuration
│                                       Use this to: add custom colors, fonts, breakpoints
│
├── tsconfig.json                      ← TypeScript configuration
│                                       The @/* import alias is set here (@ = project root)
│
├── package.json                       ← Project dependencies and npm scripts
│                                       npm run dev  = start development server
│                                       npm run build = build for production
│                                       npm run start = run production build
│
├── package-lock.json                  ← Exact versions of all installed packages
│                                       Always commit this — ensures everyone uses the same versions
│
└── DOCUMENTATION.md                   ← This file
```

---

## 5. Environment Variables — Full Reference

**Location:** `d:\CV\Teaching Website\my-math-platform\.env.local`

This file is **never committed to Git** (it's in `.gitignore`). Each developer needs their own copy.

```env
# ─────────────────────────────────────────────────────────────
# SUPABASE — Database and Authentication
# Get from: supabase.com → Your Project → Settings → API
# ─────────────────────────────────────────────────────────────

# The URL of your Supabase project
# Safe to expose in browser code (NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_SUPABASE_URL=https://osfthpdhdevfejcqntmk.supabase.co

# The anonymous/public key — safe for browser use
# This key has limited permissions controlled by Row Level Security
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...

# The service role key — NEVER use NEXT_PUBLIC_ with this
# Has full database access — only use in server-side code
# Get from: Supabase → Settings → API → service_role key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...

# ─────────────────────────────────────────────────────────────
# ANTHROPIC — AI Math Solver
# Get from: console.anthropic.com → API Keys
# ─────────────────────────────────────────────────────────────

# Keep this server-side ONLY — never add NEXT_PUBLIC_ prefix
ANTHROPIC_API_KEY=sk-ant-api03-...

# ─────────────────────────────────────────────────────────────
# STRIPE — International Payments (add in Phase 6)
# Get from: dashboard.stripe.com → Developers → API Keys
# ─────────────────────────────────────────────────────────────

STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# ─────────────────────────────────────────────────────────────
# SSLCOMMERZ — Bangladesh Payments (add in Phase 6)
# Get from: developer.sslcommerz.com
# ─────────────────────────────────────────────────────────────

SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_store_password
SSLCOMMERZ_IS_LIVE=false   # change to true for production
```

### Security Rules
| Key type | NEXT_PUBLIC_ prefix? | Why |
|----------|----------------------|-----|
| Supabase URL | ✅ Yes | Needs to be in browser for auth |
| Supabase Anon Key | ✅ Yes | Designed to be public, RLS protects data |
| Supabase Service Role | ❌ Never | Has full DB access — server only |
| Anthropic API Key | ❌ Never | Billed per use — keep secret |
| Stripe Secret | ❌ Never | Can charge cards — keep secret |
| Stripe Publishable | ✅ Yes | Designed for browser use |

---

## 6. Running the Project Locally

```bash
# Start dev server (hot reload — changes appear instantly)
npm run dev
# → Opens at http://localhost:3000

# Build for production (checks for errors)
npm run build

# Run the production build locally
npm run start

# Check for TypeScript errors
npx tsc --noEmit

# Install a new package
npm install package-name

# Install a dev-only package
npm install -D package-name
```

### What happens when you run `npm run dev`
1. Next.js starts a local web server on port 3000
2. It compiles your TypeScript and Tailwind CSS
3. Any file change instantly updates in the browser (no manual refresh needed)
4. Error messages appear both in the terminal and in the browser

---

## 7. How Next.js App Router Works (Key Concepts)

### File = Page
Every `page.tsx` file inside `app/` automatically becomes a URL:
```
app/page.tsx              → /
app/courses/page.tsx      → /courses
app/dashboard/student/page.tsx → /dashboard/student
```

### Route Groups (parentheses folders)
Folders with `()` are organisational only — they don't appear in the URL:
```
app/(auth)/login/page.tsx → URL is /login  (not /auth/login)
app/(auth)/signup/page.tsx → URL is /signup
```
Use them to group pages that share a layout without affecting URLs.

### Layouts
A `layout.tsx` file wraps all pages in its folder and subfolders:
```tsx
// app/layout.tsx — wraps EVERY page on the site
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Navbar />
        {children}   {/* ← your page content goes here */}
        <Footer />
      </body>
    </html>
  );
}
```

### Server vs Client Components

**Server Components** (default — no special label needed):
- Run on the server before sending HTML to the browser
- Can access the database directly
- Cannot use `useState`, `useEffect`, event handlers
- Faster — no JavaScript sent to browser for them

```tsx
// app/dashboard/student/page.tsx — Server Component
// Can call Supabase directly
export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("*");
  return <div>{data?.name}</div>;
}
```

**Client Components** (`"use client"` at the very top):
- Run in the browser
- Can use `useState`, `useEffect`, event handlers, click handlers
- Required for any interactive UI

```tsx
"use client";
// app/dashboard/student/DashboardUI.tsx — Client Component
import { useState } from "react";

export default function DashboardUI() {
  const [tab, setTab] = useState("pending"); // ✅ useState works here
  return <button onClick={() => setTab("completed")}>Switch</button>;
}
```

### API Routes
Files named `route.ts` inside `app/` become API endpoints (not pages):
```
app/auth/callback/route.ts → GET /auth/callback
```

---

## 8. Pages & Routes — Complete Reference

### Public Pages (Navbar + Footer visible)

#### Homepage — `app/page.tsx`
**URL:** `/`
**Type:** Server Component
**Sections:**
1. **Hero** — Dark gradient background, headline, two CTA buttons, floating AI Solver card
2. **Stats** — 500+ students, 98% pass rate, 50+ lessons, 5+ years experience
3. **Features** — 4 cards: Video Courses, AI Solver, Past Papers, Dashboard
4. **Courses Preview** — 3 course cards: O Level 0580, O Level 0606, A Level 9709
5. **How It Works** — 3 steps: Sign Up → Choose Course → Learn
6. **Testimonials** — 3 student quotes with grades
7. **CTA Banner** — "Create Free Account" call to action

**To customise:**
- Change hero headline: find `<h1>` tag, edit the text
- Change stats numbers: find `const stats = [...]` array at top of file
- Add/remove course cards: edit `const courses = [...]` array
- Change testimonials: edit `const testimonials = [...]` array
- Change colour scheme: see Section 11 (Styling)

---

### Auth Pages (No Navbar/Footer — full screen split layout)

#### Login — `app/(auth)/login/page.tsx`
**URL:** `/login`
**Type:** Client Component (`"use client"`)

**How it works:**
```
User submits form
  → createClient() creates browser Supabase client
  → supabase.auth.signInWithPassword({ email, password })
  → If error: show red error message
  → If success: router.push("/dashboard/student")
```

**Form fields:** Email, Password (with show/hide toggle)
**Features:** Loading spinner, error state, "Forgot password" link, link to signup

**To customise:**
- Change redirect after login: find `router.push("/dashboard/student")` and change the path
- Add Google OAuth: add `await supabase.auth.signInWithOAuth({ provider: 'google' })` button
- Change left panel background: find `bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950`

#### Signup — `app/(auth)/signup/page.tsx`
**URL:** `/signup`
**Type:** Client Component

**Form fields:** Full name, Email, Level (dropdown), Password, Confirm Password

**Level options:** O Level, A Level, GRE Quantitative, Other

**How it works:**
```
User submits form
  → Validates passwords match and length ≥ 6
  → supabase.auth.signUp({ email, password, options: { data: { full_name, level } } })
  → The extra data (full_name, level) is stored in user_metadata
  → emailRedirectTo sends user to /auth/callback after email confirmation
  → Shows success screen: "Check your email!"
```

**To add more signup fields** (e.g. phone number):
```tsx
// 1. Add state
const [phone, setPhone] = useState("");

// 2. Add input field in JSX
<input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" />

// 3. Include in signUp call
options: { data: { full_name: fullName, level, phone } }
```

---

### Auth Callback — `app/auth/callback/route.ts`
**URL:** `/auth/callback`
**Type:** API Route (not a visible page)
**Purpose:** Handles the link in the confirmation email

**Flow:**
```
Email link clicked → /auth/callback?code=XXXXX
  → route.ts extracts the code
  → supabase.auth.exchangeCodeForSession(code)
  → Redirect to /dashboard/student on success
  → Redirect to /login?error=auth_failed on failure
```

---

### Protected Pages (redirect to /login if not authenticated)

#### Student Dashboard — `app/dashboard/student/`

**Two-file pattern:**

**`page.tsx`** (Server Component — runs on server):
```tsx
// Checks authentication on the server
// If not logged in → redirect to /login
// If logged in → extracts user data, passes to DashboardUI
export default async function StudentDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return <DashboardUI name={...} level={...} email={...} />;
}
```

**`DashboardUI.tsx`** (Client Component — runs in browser):
- Full interactive dashboard with sidebar, charts, tabs
- Currently uses **mock data** (hardcoded arrays at the top of the file)
- In Phase 4, these arrays will be replaced with real Supabase queries

**Dashboard sections:**
| Section | Location in file | What to customise |
|---------|-----------------|------------------|
| Mock data | Top of file (`const weeklyScores = [...]`) | Replace with real DB data in Phase 4 |
| Sidebar nav links | `const navItems = [...]` | Add/remove nav items here |
| Stats cards | Inside `return`, "Stats cards" comment | Change icons, labels, colours |
| Weekly chart | "Weekly performance chart" comment | Adjust bar heights/colours |
| Subject performance | `const subjectPerformance = [...]` | Add/remove subjects |
| Assignments | `const pendingAssignments`, `completedAssignments` | Replace with DB queries |
| Results table | `const recentResults = [...]` | Replace with DB queries |
| Attendance chart | `const attendanceData = [...]` | Replace with DB queries |

---

### Course Pages (Phase 3)

#### Course Listing — `app/courses/page.tsx`
**URL:** `/courses`
**Type:** Client Component (`"use client"`)
**Features:** Live search, tab filters (All/O Level/A Level/GRE), 6 course cards

**How filtering works:**
```tsx
// useMemo recalculates filtered list whenever tab or search changes
const filtered = useMemo(() => {
  return courses.filter((c) => {
    const matchTab    = activeTab === "All" || c.category === activeTab;
    const matchSearch = !q || c.title.toLowerCase().includes(q) || ...;
    return matchTab && matchSearch;
  });
}, [activeTab, search]);
```

**To add a new course:**
1. Open `lib/courses-data.ts`
2. Copy an existing course object and paste it at the end of the `courses` array
3. Give it a unique `id` — this becomes the URL slug (e.g., `"o-level-physics"` → `/courses/o-level-physics`)
4. Fill in all fields. The course appears automatically on the listing page.

---

#### Individual Course Page — `app/courses/[id]/page.tsx`
**URL:** `/courses/[id]` — e.g., `/courses/o-level-math`
**Type:** Server Component (async, awaits params)

**Important — Next.js 16 dynamic params:**
```tsx
// In Next.js 16, params is a Promise — must be awaited
export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = courses.find((c) => c.id === id);
  if (!course) notFound();  // Shows 404 page
  ...
}
```

**Page sections:**
1. **Hero** — breadcrumb, level badge, title, description, stats (rating, students, lessons, duration), instructor
2. **Video Preview** — dark gradient card with play button; unlocked after enrollment
3. **What You'll Learn** — 2-column checklist from `course.whatYouLearn`
4. **Prerequisites** — bullet list from `course.prerequisites`
5. **Curriculum** — native `<details>/<summary>` accordion (no JavaScript needed), section i opens by default
6. **Instructor Bio** — Habib Iqbal's info
7. **Enrollment Card** — sticky on desktop, inline on mobile; links to `/signup` and `/login`

**To customise the enrollment card price:**
Find the `EnrollmentCard` component at the bottom of the file. Change `Free` and `৳2,500/mo` to your actual pricing.

---

#### Past Papers Library — `app/past-papers/page.tsx`
**URL:** `/past-papers`
**Type:** Client Component (`"use client"`)

**Data structure:**
```typescript
interface PastPaper {
  id: string;
  subject: string;       // e.g., "Mathematics"
  code: string;          // e.g., "0580"
  level: "O Level" | "A Level";
  year: number;          // e.g., 2024
  session: "May/June" | "Oct/Nov" | "Feb/March";
  paper: string;         // e.g., "Paper 2", "Paper 1 (P1)"
  type: "Question Paper" | "Mark Scheme";
  pages: number;
  downloads: number;
}
```

**Filters available:** Subject, Level, Year, Session, Type (5 independent dropdowns)
**Views:** Grid (card layout) and List (compact rows) — toggle in top-right
**Download button:** Currently links nowhere (Phase 4: upload real PDFs to Supabase Storage)

**To add more papers:** In the `papers` array near the top of the file, call `makePaper(...)` with the paper details. The function generates a unique `id` automatically.

**To add real PDF downloads:**
1. Upload PDFs to Supabase Storage (bucket: `past-papers`)
2. Replace the `<button>` with `<a href={paper.pdfUrl} download>` where `pdfUrl` is the storage URL

---

### Admin Dashboard (Phase 3)

#### Admin Panel — `app/dashboard/admin/`
**URL:** `/dashboard/admin`
**Access:** Protected — only `mr.habibiqbal@gmail.com` can access; others are redirected to `/dashboard/student`

**Two-file pattern (same as student dashboard):**

**`page.tsx`** (Server Component):
```typescript
const ADMIN_EMAIL = "mr.habibiqbal@gmail.com";

// Check auth first
if (!user) redirect("/login");
// Then check admin role
if (user.email !== ADMIN_EMAIL) redirect("/dashboard/student");

return <AdminUI name={...} email={...} />;
```

**`AdminUI.tsx`** (Client Component) — sections:
| Section | What it shows |
|---------|--------------|
| Stats cards (4) | Total Students, Active Courses, Papers Downloaded, AI Queries |
| Weekly Signups chart | CSS bar chart showing signups Mon–Sun |
| Enrollment breakdown | Progress bars: O Level / A Level / GRE split |
| Recent Students table | Name, email, level, join date, status, action button |
| Course Management table | Title, level, lessons, students, status, edit/view buttons |
| Quick Actions (4) | Upload Past Paper, Send Announcement, View AI Usage, Export Data |

**To add more admins:** In `page.tsx`, change the ADMIN_EMAIL check to an array:
```typescript
const ADMIN_EMAILS = ["mr.habibiqbal@gmail.com", "second-admin@example.com"];
if (!ADMIN_EMAILS.includes(user.email ?? "")) redirect("/dashboard/student");
```

---

## 9. Authentication System — Full Flow

### How Supabase Auth Works

Supabase stores sessions in cookies. When a user logs in:
1. Supabase sets a cookie in the browser (`sb-access-token`, `sb-refresh-token`)
2. Every request to the server includes these cookies
3. The server reads the cookies and knows who the user is
4. The middleware checks cookies on every request to protected routes

### The Two Supabase Clients

**Browser client** (`lib/supabase/client.ts`):
```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```
Use this in Client Components (`"use client"` files):
```tsx
"use client";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
await supabase.auth.signInWithPassword({ email, password });
```

**Server client** (`lib/supabase/server.ts`):
```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(url, key, { cookies: { getAll, setAll } });
}
```
Use this in Server Components:
```tsx
// app/dashboard/student/page.tsx
import { createClient } from "@/lib/supabase/server";

const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
```

### The Middleware (`middleware.ts`)

Runs before every page load. Protects routes:

```typescript
export async function middleware(request: NextRequest) {
  // Skip if Supabase not configured (dev safety)
  if (!supabaseUrl || supabaseUrl.includes("your_supabase")) {
    return NextResponse.next();
  }

  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser();

  // Not logged in + trying to access /dashboard → redirect to /login
  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Logged in + trying to access /login or /signup → redirect to dashboard
  if (user && ["/login", "/signup"].includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/dashboard/student", request.url));
  }
}

// Which routes the middleware runs on:
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
```

**To protect a new route** (e.g. `/courses` for enrolled students only):
```typescript
// Add it to the matcher:
export const config = {
  matcher: ["/dashboard/:path*", "/courses/:path*", "/login", "/signup"],
};
// And add the check:
if (!user && request.nextUrl.pathname.startsWith("/courses")) {
  return NextResponse.redirect(new URL("/login", request.url));
}
```

### Supabase Dashboard Settings

Go to: [supabase.com](https://supabase.com) → Your Project → **Authentication** → **URL Configuration**

| Setting | Development | Production |
|---------|-------------|------------|
| Site URL | `http://localhost:3000` | `https://yourdomain.com` |
| Redirect URLs | `http://localhost:3000/**` | `https://yourdomain.com/**` |

---

## 10. Components — Detailed Breakdown

### Navbar (`components/layout/Navbar.tsx`)

**Type:** Client Component (needs `useState` for mobile menu, `useEffect` for scroll)

**Key behaviour — auto-hide:**
```tsx
const pathname = usePathname();
const hidden = pathname.startsWith("/dashboard") || pathname === "/login" || pathname === "/signup";
if (hidden) return null;
```

**Key behaviour — scroll effect:**
```tsx
useEffect(() => {
  const onScroll = () => setScrolled(window.scrollY > 10);
  window.addEventListener("scroll", onScroll);
  return () => window.removeEventListener("scroll", onScroll);
}, []);
// When scrolled: white/blur background, dark text
// When not scrolled: transparent background, white text (for dark hero)
```

**To add a new nav link:**
```tsx
const navLinks = [
  { label: "Courses",     href: "/courses" },
  { label: "Past Papers", href: "/past-papers" },
  { label: "AI Solver",   href: "/ai-solver" },
  { label: "About",       href: "/about" },  // ← Add here
];
```

**To change the brand name:**
```tsx
// Find this line and edit:
<span>IH <span className="text-yellow-400">Mathematics</span></span>
```

---

### Footer (`components/layout/Footer.tsx`)

**Type:** Client Component (needs `usePathname` to hide on dashboard/auth)

**To add a new footer column:**
```tsx
// Add a new array at the top:
const newColumn = [
  { label: "Link 1", href: "/link1" },
  { label: "Link 2", href: "/link2" },
];

// Then add a new <div> section in the grid:
<div>
  <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
    Column Title
  </h3>
  <ul className="space-y-2.5">
    {newColumn.map((item) => (
      <li key={item.label}>
        <Link href={item.href} className="text-sm text-slate-400 hover:text-indigo-400">
          {item.label}
        </Link>
      </li>
    ))}
  </ul>
</div>
```

**To update the contact info:**
```tsx
// Find the Contact section and update:
<a href="mailto:your-new-email@gmail.com">your-new-email@gmail.com</a>
```

---

### TypeScript Types (`types/index.ts`)

These define the shape of data throughout the app. Import them wherever needed:

```typescript
import type { User, Course, Enrollment } from "@/types";
```

**Current types:**
```typescript
export type UserRole = "student" | "admin";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: "O Level" | "A Level";
  video_url: string;
  price: number;
  created_at: string;
}

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  enrolled_at: string;
  status: "active" | "completed";
}

export interface PastPaper {
  id: string;
  title: string;
  level: "O Level" | "A Level";
  year: number;
  subject: string;
  file_url: string;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  course_id: string;
  date: string;
  present: boolean;
}
```

**To add a new type:**
```typescript
// Add to types/index.ts:
export interface Assignment {
  id: string;
  title: string;
  course_id: string;
  due_date: string;
  max_marks: number;
}
```

---

## 11. Styling System — How to Customize

### Colour Palette (current design)

| Purpose | Tailwind Class | Hex Colour |
|---------|---------------|-----------|
| Primary (buttons, links) | `indigo-600` | `#4f46e5` |
| Primary hover | `indigo-700` | `#4338ca` |
| Hero background | `slate-900` + `indigo-950` | Dark navy |
| Brand accent (logo text) | `yellow-400` | `#facc15` |
| Success | `emerald-500` | `#10b981` |
| Warning | `amber-500` | `#f59e0b` |
| Error | `red-500` | `#ef4444` |
| Body text | `slate-900` | `#0f172a` |
| Muted text | `slate-500` | `#64748b` |
| Borders | `slate-200` | `#e2e8f0` |
| Page background | `slate-50` | `#f8fafc` |

### How to Change the Primary Colour

The site uses `indigo` as its primary colour everywhere. To change to, say, `blue`:

1. Open VS Code
2. Press `Ctrl+Shift+H` (Find and Replace in all files)
3. Search: `indigo-` → Replace: `blue-`
4. Review changes before saving

### Custom Animations (`app/globals.css`)

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-12px); }
}

/* Custom utility classes */
@utility animate-fade-up { animation: fadeUp 0.7s ease-out forwards; }
@utility animate-float   { animation: float 4s ease-in-out infinite; }
```

**To add a new animation:**
```css
/* In globals.css */
@keyframes slideIn {
  from { transform: translateX(-20px); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
}

@utility animate-slide-in { animation: slideIn 0.5s ease-out; }
```

Then use in JSX:
```tsx
<div className="animate-slide-in">Content</div>
```

### Responsive Design Breakpoints

| Prefix | Screen size | When it applies |
|--------|-------------|-----------------|
| (none) | All screens | Default style |
| `sm:` | ≥ 640px | Small tablets+ |
| `md:` | ≥ 768px | Tablets+ |
| `lg:` | ≥ 1024px | Laptops+ |
| `xl:` | ≥ 1280px | Large screens |

**Example:**
```tsx
// 1 column on mobile, 2 on tablet, 4 on desktop:
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
```

---

## 12. Database Schema — Full Reference

### Current State
No tables created yet — auth is handled by Supabase's built-in `auth.users` table.
User metadata (name, level) is stored in `auth.users.user_metadata` (JSON field).

### Full Schema to Create in Phase 3

Run this SQL in Supabase → **SQL Editor**:

```sql
-- ─────────────────────────────────────────────────
-- PROFILES (extends Supabase auth users)
-- ─────────────────────────────────────────────────
create table public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  full_name   text,
  level       text check (level in ('o_level', 'a_level', 'gre', 'other')),
  role        text not null default 'student' check (role in ('student', 'admin')),
  avatar_url  text,
  phone       text,
  created_at  timestamptz default now()
);

-- Auto-create profile when user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, level)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'level'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────────
-- COURSES
-- ─────────────────────────────────────────────────
create table public.courses (
  id           uuid default gen_random_uuid() primary key,
  title        text not null,
  description  text,
  level        text not null check (level in ('O Level', 'A Level', 'GRE')),
  subject_code text,              -- e.g. '0580', '9709'
  video_url    text,              -- YouTube or Bunny.net URL
  thumbnail    text,              -- image path in /public/images/courses/
  price        numeric default 0, -- 0 = free
  total_lessons int default 0,
  duration_hrs  numeric,
  is_published  boolean default false,
  created_at   timestamptz default now()
);

-- ─────────────────────────────────────────────────
-- LESSONS (individual videos within a course)
-- ─────────────────────────────────────────────────
create table public.lessons (
  id          uuid default gen_random_uuid() primary key,
  course_id   uuid references public.courses(id) on delete cascade,
  title       text not null,
  description text,
  video_url   text not null,
  order_num   int not null,       -- which lesson number (1, 2, 3...)
  duration_min int,               -- lesson length in minutes
  is_free     boolean default false, -- preview lesson for non-enrolled
  created_at  timestamptz default now()
);

-- ─────────────────────────────────────────────────
-- ENROLLMENTS
-- ─────────────────────────────────────────────────
create table public.enrollments (
  id           uuid default gen_random_uuid() primary key,
  student_id   uuid references public.profiles(id) on delete cascade,
  course_id    uuid references public.courses(id) on delete cascade,
  enrolled_at  timestamptz default now(),
  status       text default 'active' check (status in ('active', 'completed', 'cancelled')),
  paid_amount  numeric default 0,
  unique(student_id, course_id)   -- student can't enroll twice
);

-- ─────────────────────────────────────────────────
-- LESSON PROGRESS
-- ─────────────────────────────────────────────────
create table public.lesson_progress (
  id           uuid default gen_random_uuid() primary key,
  student_id   uuid references public.profiles(id) on delete cascade,
  lesson_id    uuid references public.lessons(id) on delete cascade,
  completed    boolean default false,
  completed_at timestamptz,
  unique(student_id, lesson_id)
);

-- ─────────────────────────────────────────────────
-- ASSIGNMENTS
-- ─────────────────────────────────────────────────
create table public.assignments (
  id           uuid default gen_random_uuid() primary key,
  course_id    uuid references public.courses(id) on delete cascade,
  title        text not null,
  description  text,
  due_date     date,
  max_marks    int not null,
  created_at   timestamptz default now()
);

-- ─────────────────────────────────────────────────
-- SUBMISSIONS
-- ─────────────────────────────────────────────────
create table public.submissions (
  id            uuid default gen_random_uuid() primary key,
  assignment_id uuid references public.assignments(id) on delete cascade,
  student_id    uuid references public.profiles(id) on delete cascade,
  submitted_at  timestamptz default now(),
  file_url      text,             -- submitted file (if any)
  score         int,              -- null until teacher grades it
  feedback      text,             -- teacher's written feedback
  status        text default 'submitted' check (status in ('submitted', 'graded', 'late')),
  unique(assignment_id, student_id)
);

-- ─────────────────────────────────────────────────
-- ATTENDANCE
-- ─────────────────────────────────────────────────
create table public.attendance (
  id         uuid default gen_random_uuid() primary key,
  student_id uuid references public.profiles(id) on delete cascade,
  course_id  uuid references public.courses(id) on delete cascade,
  date       date not null,
  present    boolean default false,
  unique(student_id, course_id, date)
);

-- ─────────────────────────────────────────────────
-- PAST PAPERS
-- ─────────────────────────────────────────────────
create table public.past_papers (
  id         uuid default gen_random_uuid() primary key,
  title      text not null,
  level      text not null check (level in ('O Level', 'A Level')),
  subject    text not null,       -- e.g. 'Mathematics', 'Additional Mathematics'
  subject_code text,              -- e.g. '0580', '9709'
  year       int not null,
  session    text,                -- 'May/June', 'Oct/Nov', 'Feb/Mar'
  paper_num  int,                 -- Paper 1, 2, 3, 4
  file_url   text not null,       -- Supabase Storage URL
  answer_url text,                -- Mark scheme URL
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS) — Very important!
-- Controls who can read/write each table
-- ─────────────────────────────────────────────────

-- Enable RLS on all tables
alter table public.profiles        enable row level security;
alter table public.courses         enable row level security;
alter table public.lessons         enable row level security;
alter table public.enrollments     enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.assignments     enable row level security;
alter table public.submissions     enable row level security;
alter table public.attendance      enable row level security;
alter table public.past_papers     enable row level security;

-- Profiles: users can only read/update their own profile
create policy "Users can view own profile"   on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Courses: anyone can read published courses
create policy "Anyone can view published courses" on public.courses for select using (is_published = true);

-- Enrollments: students can view/create their own enrollments
create policy "Students view own enrollments"   on public.enrollments for select using (auth.uid() = student_id);
create policy "Students create own enrollment"  on public.enrollments for insert with check (auth.uid() = student_id);

-- Past papers: any logged-in user can read
create policy "Authenticated users can view past papers" on public.past_papers for select using (auth.role() = 'authenticated');
```

---

## 13. Supabase — How to Use It

### Reading Data (in a Server Component)

```typescript
import { createClient } from "@/lib/supabase/server";

// Get all published courses
const supabase = await createClient();
const { data: courses, error } = await supabase
  .from("courses")
  .select("*")
  .eq("is_published", true)
  .order("created_at", { ascending: false });

if (error) console.error(error);
```

### Reading Data (in a Client Component)

```typescript
"use client";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

const supabase = createClient();

const { data, error } = await supabase
  .from("courses")
  .select("id, title, level, price")
  .eq("level", "O Level");
```

### Writing Data

```typescript
// Insert a new enrollment
const { data, error } = await supabase
  .from("enrollments")
  .insert({
    student_id: user.id,
    course_id:  courseId,
    paid_amount: 0,
  });
```

### Filtering

```typescript
// Single condition
.eq("level", "O Level")

// Multiple conditions
.eq("level", "O Level").eq("is_published", true)

// Range
.gte("year", 2020).lte("year", 2024)

// Search
.ilike("title", "%mathematics%")

// Order
.order("created_at", { ascending: false })

// Limit
.limit(10)
```

### Joins (selecting from related tables)

```typescript
// Get enrollments WITH course details
const { data } = await supabase
  .from("enrollments")
  .select(`
    id,
    enrolled_at,
    status,
    courses (
      id,
      title,
      level,
      thumbnail
    )
  `)
  .eq("student_id", user.id);
```

### Supabase Storage (file uploads)

```typescript
// Upload a file (e.g. past paper PDF)
const { data, error } = await supabase.storage
  .from("past-papers")                    // bucket name
  .upload(`2024/olevel-0580-p1.pdf`, file);

// Get the public URL
const { data: { publicUrl } } = supabase.storage
  .from("past-papers")
  .getPublicUrl("2024/olevel-0580-p1.pdf");
```

---

## 14. How to Add New Features

### Add a New Page

1. Create the file:
```
app/about/page.tsx  →  accessible at /about
```

2. Write the component:
```tsx
// app/about/page.tsx
export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold text-slate-900">About IH Mathematics</h1>
      <p className="text-slate-600 mt-4">...</p>
    </div>
  );
}
```

3. Add to Navbar if needed:
```tsx
// In components/layout/Navbar.tsx
const navLinks = [
  ...existing links...
  { label: "About", href: "/about" },  // ← add here
];
```

---

### Add a New Protected Page

1. Create the file under `app/dashboard/`:
```
app/dashboard/progress/page.tsx  →  /dashboard/progress
```

2. Add auth check:
```tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProgressPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return <div>Progress page content</div>;
}
```

3. The middleware already protects all `/dashboard/*` routes — no extra config needed.

---

### Add a New API Route

```typescript
// app/api/solve-math/route.ts
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: Request) {
  const { imageBase64 } = await request.json();

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: [
        { type: "image", source: { type: "base64", media_type: "image/jpeg", data: imageBase64 } },
        { type: "text", text: "Solve this math problem step by step." }
      ]
    }]
  });

  return NextResponse.json({ solution: response.content[0].text });
}
```

---

### Add a New Reusable Component

```tsx
// components/ui/CourseCard.tsx
import Link from "next/link";
import type { Course } from "@/types";

interface Props {
  course: Course;
}

export default function CourseCard({ course }: Props) {
  return (
    <Link href={`/courses/${course.id}`}
      className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-all"
    >
      <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
        {course.level}
      </span>
      <h3 className="font-bold text-slate-900 mt-3 mb-2">{course.title}</h3>
      <p className="text-sm text-slate-500">{course.description}</p>
      <p className="text-lg font-bold text-indigo-600 mt-4">
        {course.price === 0 ? "Free" : `৳${course.price}`}
      </p>
    </Link>
  );
}

// Use it in any page:
import CourseCard from "@/components/ui/CourseCard";
<CourseCard course={courseData} />
```

---

## 15. How to Customize Existing Features

### Change the Site Name / Brand

All occurrences of "IH Mathematics" across the site:

| File | What to change |
|------|---------------|
| `app/layout.tsx` | `title` and `description` in metadata |
| `components/layout/Navbar.tsx` | Brand name in logo link |
| `components/layout/Footer.tsx` | Brand name in footer logo |
| `app/page.tsx` | Text in hero and CTA sections |
| `app/dashboard/student/DashboardUI.tsx` | Sidebar logo text |

### Change the Hero Section Text

Open `app/page.tsx`, find the Hero section comment and edit:
```tsx
{/* ── Hero ─── */}
<h1 className="text-4xl ...">
  Master Maths for{" "}
  <span className="gradient-text">O &amp; A Level</span>{" "}   {/* ← change headline */}
  with Confidence
</h1>
<p className="text-lg text-slate-300 ...">
  Expert-led video courses...    {/* ← change subtext */}
</p>
```

### Change Course Cards on Homepage

Open `app/page.tsx`, find `const courses = [...]` at the top:
```tsx
const courses = [
  {
    badge:    "O Level",
    title:    "Mathematics (0580)",
    desc:     "Full coverage...",
    lessons:  24,
    duration: "48 hrs",
    tag:      "Most Popular",    // or null for no badge
    href:     "/courses",
  },
  // Add more courses here...
];
```

### Change Dashboard Sidebar Links

Open `app/dashboard/student/DashboardUI.tsx`, find `const navItems`:
```tsx
const navItems = [
  { icon: "🏠", label: "Dashboard",   href: "/dashboard/student", active: true  },
  { icon: "🎬", label: "My Courses",  href: "/courses",           active: false },
  { icon: "📋", label: "Assignments", href: "#assignments",        active: false },
  { icon: "📊", label: "Results",     href: "#results",           active: false },
  { icon: "📄", label: "Past Papers", href: "/past-papers",       active: false },
  { icon: "🤖", label: "AI Solver",   href: "/ai-solver",         active: false },
  // Add more items here ↓
  { icon: "⚙️", label: "Settings",    href: "/dashboard/settings",active: false },
];
```

---

## 16. Build Phases — Progress Tracker

| Phase | Features | Status | Started | Completed |
|-------|----------|--------|---------|-----------|
| **Phase 1** | Project scaffold, homepage, Navbar, Footer, logo | ✅ Done | 2026-04-29 | 2026-04-29 |
| **Phase 2** | Supabase auth, login, signup, email confirmation, student dashboard | ✅ Done | 2026-04-29 | 2026-04-30 |
| **Phase 3** | Course listing, individual course pages, past papers library, admin dashboard | ✅ Done | 2026-04-30 | 2026-04-30 |
| **Phase 4** | Real data in dashboard (replace mock data with Supabase queries), attendance, DB tables | 🔄 Next | — | — |
| **Phase 5** | AI Photo Math Solver (Claude Vision API integration) | ⏳ | — | — |
| **Phase 6** | Payments (SSLCommerz/Stripe), final testing, production deploy | ⏳ | — | — |

### Phase 3 — What Was Built
- [x] `lib/courses-data.ts` — Shared TypeScript data for all 6 courses (O Level 0580, O Level 0606, A Level P1P2, A Level Stats, A Level Mechanics, GRE)
- [x] `app/courses/page.tsx` — Course listing with live search + tab filters (All / O Level / A Level / GRE)
- [x] `app/courses/[id]/page.tsx` — Individual course page: breadcrumb, video preview, what you'll learn, curriculum accordion, instructor bio, sticky enrollment card
- [x] `app/past-papers/page.tsx` — Full library: 46+ papers, 5 filters (subject/level/year/session/type), grid/list view toggle, download button
- [x] `app/dashboard/admin/page.tsx` + `AdminUI.tsx` — Admin panel (email-protected), stats, weekly signup chart, enrollment breakdown, student table, course management, quick actions

### Phase 4 Breakdown (Next Up)
- [ ] Run SQL from Section 12 in Supabase to create all DB tables
- [ ] Replace mock data in `DashboardUI.tsx` with real Supabase queries
- [ ] Real attendance/assignment/results data from DB
- [ ] Enroll students to courses on signup

---

## 17. Git Workflow

### Daily Development Flow
```bash
# 1. Check what's changed
git status

# 2. See the actual changes
git diff

# 3. Stage changes
git add -A

# 4. Commit with a clear message
git commit -m "Add course listing page with filters"

# 5. Push to GitHub
git push origin main
```

### Branch Strategy (when working with a team)
```bash
# Create a new branch for a feature
git checkout -b feature/course-pages

# Work, commit, then push the branch
git push origin feature/course-pages

# Merge back to main when done
git checkout main
git merge feature/course-pages
```

### Commit Message Convention
```
Add [feature]           → new feature added
Fix [bug]               → bug fixed
Update [thing]          → existing thing changed
Remove [thing]          → something deleted
Refactor [thing]        → code restructured, no feature change
```

---

## 18. Deployment Guide

### Step 1: Prepare Environment

1. Make sure all code is committed and pushed to GitHub
2. Make sure `.env.local` is in `.gitignore` (it is by default)
3. Update `DOCUMENTATION.md` with the production URL once deployed

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import `IH-Mathematics` from GitHub
4. Set the **Root Directory** to `my-math-platform`
5. Under **Environment Variables**, add all keys from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ANTHROPIC_API_KEY`
   - (add others as needed)
6. Click **Deploy**
7. Vercel gives you a URL like `ih-mathematics.vercel.app`

**Auto-deploys:** Every `git push origin main` automatically triggers a new deploy on Vercel.

### Step 3: Update Supabase for Production

1. Go to Supabase → Authentication → URL Configuration
2. Update **Site URL** to your Vercel URL (or custom domain)
3. Add your Vercel URL to **Redirect URLs**: `https://your-site.vercel.app/**`

### Step 4: Custom Domain (optional)

1. Buy a domain at Namecheap or GoDaddy (e.g. `ihmathematics.com`)
2. In Vercel → your project → **Domains** → add your domain
3. Follow the DNS instructions Vercel shows
4. Update Supabase Site URL to your custom domain

### Production Checklist
- [ ] All environment variables added to Vercel
- [ ] Supabase Site URL updated to production domain
- [ ] Supabase Redirect URLs include production domain
- [ ] RLS (Row Level Security) enabled on all tables
- [ ] Test login/signup on production URL
- [ ] Test all pages load correctly

---

## 19. Troubleshooting Common Issues

### "Invalid supabaseUrl" error
**Cause:** `.env.local` has placeholder values or the file doesn't exist.
**Fix:** Open `.env.local` and replace `your_supabase_url_here` with your real Supabase URL.

### Page shows 404 after email confirmation
**Cause:** Auth callback redirect URL doesn't match the current domain.
**Fix:** Go to Supabase → Authentication → URL Configuration → update Site URL.

### Navbar overlaps page content
**Cause:** Navbar is `fixed` (sticks to top). Pages need top padding to account for navbar height.
**Fix:** Add `pt-16` or `pt-20` to the page's top container. (Dashboard pages don't need this because the Navbar hides on dashboard.)

### "Hydration error" in browser console
**Cause:** Almost always a browser extension (usually Grammarly) modifying the HTML. Not a code bug.
**Fix:** Ignore it in development. It never appears in production.

### Dashboard redirects to login even when logged in
**Cause:** Supabase session cookie not set correctly, or middleware can't read it.
**Fix:** Clear browser cookies for localhost:3000 and log in again.

### Tailwind classes not applying
**Cause:** Class name is misspelled, or you used an arbitrary value wrong.
**Fix:** Check [tailwindcss.com/docs](https://tailwindcss.com/docs) for the exact class name.

### TypeScript error: "Property X does not exist on type Y"
**Cause:** You're accessing a property that wasn't defined in the TypeScript types.
**Fix:** Add the property to the relevant interface in `types/index.ts`.

### `npm run dev` fails to start
**Cause:** Usually a port conflict (another app using port 3000) or corrupted node_modules.
**Fix:**
```bash
# Kill port 3000
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001

# If node_modules corrupted:
rm -rf node_modules
npm install
```

---

## 20. Cost Breakdown

### Monthly Operating Costs at Launch

| Service | Plan | Cost | Notes |
|---------|------|------|-------|
| Vercel | Hobby (free) | $0 | Up to 100GB bandwidth |
| Supabase | Free | $0 | Up to 500 users, 500MB DB |
| Anthropic API | Pay-as-you-go | ~$10–30 | Depends on AI Solver usage |
| Cloudflare R2 | Free tier | $0 | Up to 10GB storage |
| Domain (.com) | — | ~$1/month | ~$12/year |
| **Total** | | **~$11–31/month** | |

### When to Upgrade
| Threshold | Action |
|-----------|--------|
| 500+ users | Upgrade Supabase to Pro ($25/month) |
| High video bandwidth | Consider Bunny.net (~$7–15/month) |
| High AI usage | Monitor Anthropic costs, add rate limiting |
| 100GB+ traffic | Upgrade Vercel to Pro ($20/month) |

### Savings vs Hiring
| Option | Cost |
|--------|------|
| This platform (built with Claude) | ~$20–30/month running costs |
| Local developer (Bangladesh) | ৳2,00,000–3,50,000 one-time ($1,800–3,200) |
| International developer (Upwork) | $3,000–5,000 one-time |
| **Saved** | **$1,800–5,000** |

---

*This documentation is updated after every development session. Last updated: 2026-04-30 after completing Phase 2 (auth + dashboard).*
