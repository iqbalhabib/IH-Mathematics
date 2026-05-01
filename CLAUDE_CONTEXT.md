# IH Mathematics Platform — Full Claude Context Document
> Paste this entire file at the start of any new Claude conversation to give full project context.
> Last updated: 2026-05-01 (after Phase 4 completion)

---

## WHO IS THE USER

- **Name:** Habib Iqbal (goes by "IH")
- **Email:** mr.habibiqbal@gmail.com (also the admin account)
- **Background:** Math teacher, Cambridge O & A Level specialist, Python/data analyst background
- **Location:** Bangladesh
- **Goal:** Build a real, launchable online math tutoring platform — not a demo

---

## WHAT THIS PROJECT IS

**IH Mathematics** — a full-stack online math tutoring platform for Cambridge O & A Level students in Bangladesh. Students sign up, enroll in courses, watch video lessons, track progress, and use an AI Math Solver. The teacher (Habib Iqbal) manages everything via an admin panel.

**Live dev URL:** `http://localhost:3000`
**Start dev server:** `npx next dev` (run in `d:\CV\Teaching Website\my-math-platform`)

---

## TECH STACK

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js App Router | 16.2.4 |
| UI | React | 19.2.4 |
| Styling | Tailwind CSS | 4 |
| Database | Supabase (PostgreSQL) | — |
| Auth | Supabase Auth | — |
| Language | TypeScript | 5 |
| Supabase clients | @supabase/ssr, @supabase/supabase-js | ^0.10.2, ^2.105.1 |

**Supabase project URL:** `https://osfthpdhdevfejcqntmk.supabase.co`

---

## CRITICAL NEXT.JS 16 RULES (read before writing any code)

1. **Dynamic route params are Promises** — must be `await`ed:
   ```tsx
   export default async function Page({ params }: { params: Promise<{ id: string }> }) {
     const { id } = await params;  // ← MUST await
   }
   ```

2. **Two Supabase clients** — never mix them:
   - `lib/supabase/server.ts` → use in Server Components and API routes (`await createClient()`)
   - `lib/supabase/client.ts` → use in Client Components (`createClient()` — no await)

3. **Supabase errors do NOT throw** — they return `{ data, error }`. `try/catch` won't catch query errors:
   ```typescript
   const { data, error } = await supabase.from("profiles").select("*").maybeSingle();
   if (error) console.error(error.message);  // ← check error field explicitly
   ```

4. **Use `.maybeSingle()` not `.single()`** when a row might not exist. `.single()` returns an error if 0 rows found.

5. **Supabase join results are typed as arrays** even for single-row joins:
   ```typescript
   // lessons(course_id) join comes back as array or object — handle both:
   const cid = Array.isArray(lessonsJoin) ? lessonsJoin[0]?.course_id : lessonsJoin?.course_id;
   ```

---

## COMPLETE FILE STRUCTURE

```
my-math-platform/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx              → /login  (client component, Supabase signIn)
│   │   └── signup/page.tsx             → /signup (client component, Supabase signUp)
│   ├── auth/callback/route.ts          → OAuth callback handler
│   ├── api/
│   │   └── enroll/route.ts             → POST /api/enroll (server-side enrollment)
│   ├── courses/
│   │   ├── page.tsx                    → /courses (client, search + filter)
│   │   └── [id]/
│   │       ├── page.tsx                → /courses/[id] (server, fetches pricing + enrollment)
│   │       └── EnrollButton.tsx        → client component, auth-aware enroll button
│   ├── dashboard/
│   │   ├── admin/
│   │   │   ├── page.tsx                → /dashboard/admin (server, admin-only guard)
│   │   │   ├── AdminUI.tsx             → client component, full admin panel
│   │   │   ├── courses/[id]/
│   │   │   │   ├── page.tsx            → /dashboard/admin/courses/[id]
│   │   │   │   ├── CourseManageUI.tsx  → client, tabs: Overview/Students/Lessons/Settings
│   │   │   │   └── LessonEditor.tsx    → client, inline editor: Lecture/Study Material/Assignment
│   │   │   └── promo-codes/
│   │   │       ├── page.tsx            → /dashboard/admin/promo-codes
│   │   │       └── PromoCodesUI.tsx    → client, full promo code CRUD
│   │   └── student/
│   │       ├── page.tsx                → /dashboard/student (server, fetches real data)
│   │       └── DashboardUI.tsx         → client component, full student dashboard
│   ├── past-papers/page.tsx            → /past-papers (client, filter + grid/list)
│   ├── ai-solver/page.tsx              → /ai-solver (placeholder — Phase 6)
│   ├── admin-signup/page.tsx           → /admin-signup (requires NEXT_PUBLIC_ADMIN_SETUP_CODE)
│   ├── layout.tsx                      → root layout (Navbar + Footer)
│   └── page.tsx                        → / (homepage)
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx                  → auth-aware navbar (shows user name or login buttons)
│   │   └── Footer.tsx
│   └── ui/IHLogo.tsx
├── lib/
│   ├── courses-data.ts                 → all 6 courses (Course interface + courses[] array)
│   ├── supabase/
│   │   ├── client.ts                   → createBrowserClient (for "use client" files)
│   │   └── server.ts                   → createServerClient with cookies (for server files)
│   └── supabase.ts                     → OLD — ignore, not used
├── types/index.ts                      → TypeScript interfaces
├── middleware.ts                       → protects /dashboard/*, redirects auth pages
├── supabase/phase4-setup.sql           → full DB schema + RLS + triggers (already run)
└── DOCUMENTATION.md                    → older docs (phase 3, partially outdated)
```

---

## CURRENT BUILD STATUS

### ✅ DONE — Phase 1: Scaffold & Homepage
- Homepage with Hero, Stats, Features, Courses preview, Testimonials, CTA
- Navbar (fixed, transparent→white on scroll, auto-hides on dashboard/auth pages)
- Footer (auto-hides on dashboard/auth pages)
- IH logo (`public/logo.png`)

### ✅ DONE — Phase 2: Auth System
- `/login` — email + password login, redirects to `/dashboard/student`
- `/signup` — collects: full name, email, level (O Level/A Level/GRE/Other), password
- `/auth/callback` — handles email confirmation link
- `/admin-signup` — admin account creation (requires setup code)
- Middleware protects `/dashboard/*` → redirects to `/login` if not authenticated
- Middleware redirects logged-in users away from `/login` and `/signup`

### ✅ DONE — Phase 3: Courses, Past Papers, Admin Panel
- `/courses` — listing with live search + tabs (All/O Level/A Level/GRE)
- `/courses/[id]` — full course page: breadcrumb, video preview, curriculum accordion, enrollment card
- `/past-papers` — 46+ papers, 5 filters, grid/list toggle
- `/dashboard/admin` — stats, weekly chart, student table, course management, quick actions

### ✅ DONE — Phase 4: Real Database + Enrollment
- **Student IDs**: Auto-generated IH-XXXX by Postgres trigger on signup
- **Real enrollment**: POST `/api/enroll` → inserts into `enrollments` table
- **Enrollment check**: Course page checks if logged-in user is enrolled (shows "Continue Learning" or sign-up prompt)
- **Student dashboard**: Fetches real profile (student ID), real enrollments, real lesson progress from Supabase
- **Admin course management**: Student removal with confirmation, inline LessonEditor, promo codes page
- **Lesson editor**: 3 tabs — Lecture (video URL + YouTube preview), Study Material (notes + resources), Assignment (questions + marks + due date)
- **Promo codes**: Create/enable/disable/delete, percent or fixed discount, usage tracking
- **Dynamic pricing**: Course page reads from `course_settings` table (falls back to "free" default)
- **Auth-aware Navbar**: Shows user name + avatar when logged in, "Log In"/"Get Started Free" when logged out, Sign Out button
- **Enrollment UX fix**: Unauthenticated visitors see "Create Free Account" + "Log In" buttons instead of "Enroll Now"

---

## DATABASE SCHEMA (already live in Supabase)

All created via `supabase/phase4-setup.sql`. Tables:

### `profiles`
```sql
id          uuid (PK → auth.users.id)
student_id  text UNIQUE  -- format: IH-0001, IH-0002, etc.
full_name   text
email       text
role        text DEFAULT 'student'  -- 'student' or 'admin'
level       text
created_at  timestamptz
```
**Key trigger:** `handle_new_user()` fires on `auth.users` INSERT, auto-creates profile with next IH-XXXX student_id.

**RLS policy that matters (fixed bug):**
```sql
CREATE POLICY "Authenticated users read profiles"
  ON public.profiles FOR SELECT
  TO authenticated USING (true);
```
(The original policy `USING (auth.uid() = id)` was blocking server-side reads. This fixed the IH-???? bug.)

### `enrollments`
```sql
id          uuid (PK)
user_id     uuid → profiles.id
course_id   text  -- matches courses-data.ts IDs like 'o-level-math'
enrolled_at timestamptz
is_active   boolean DEFAULT true
removed_at  timestamptz
UNIQUE(user_id, course_id)
```

### `lessons`
```sql
id              uuid (PK)
course_id       text
section_name    text
title           text
order_index     integer
video_url       text
video_description text
notes           text
status          text DEFAULT 'draft'  -- 'draft' or 'published'
duration        text
created_at, updated_at  timestamptz
```

### `lesson_resources`
```sql
id            uuid (PK)
lesson_id     uuid → lessons.id
title         text
url           text
resource_type text DEFAULT 'link'
created_at    timestamptz
```

### `assignments`
```sql
id           uuid (PK)
lesson_id    uuid → lessons.id
title        text
instructions text
total_marks  integer DEFAULT 20
due_date     timestamptz
created_at   timestamptz
```

### `assignment_questions`
```sql
id             uuid (PK)
assignment_id  uuid → assignments.id
question_text  text
marks          integer DEFAULT 5
order_index    integer
```

### `assignment_submissions`
```sql
id             uuid (PK)
assignment_id  uuid → assignments.id
user_id        uuid → profiles.id
answers        jsonb
submitted_at   timestamptz
score          integer
feedback       text
graded_at      timestamptz
UNIQUE(assignment_id, user_id)
```

### `lesson_progress`
```sql
id           uuid (PK)
user_id      uuid → profiles.id
lesson_id    uuid → lessons.id
completed_at timestamptz
UNIQUE(user_id, lesson_id)
```

### `promo_codes`
```sql
id             uuid (PK)
code           text UNIQUE
discount_type  text  -- 'percent' or 'fixed'
discount_value integer
max_uses       integer
uses_count     integer DEFAULT 0
expires_at     timestamptz
is_active      boolean DEFAULT true
created_at     timestamptz
```

### `course_settings`
```sql
course_id       text (PK)  -- matches courses-data.ts IDs
access_type     text DEFAULT 'free'  -- 'free', 'paid', 'preview'
price           integer DEFAULT 0
original_price  integer DEFAULT 0
currency        text DEFAULT 'BDT'
billing_period  text DEFAULT 'month'  -- 'month', 'year', 'once'
preview_lessons integer DEFAULT 3
updated_at      timestamptz
```

---

## THE 6 COURSES (defined in `lib/courses-data.ts`)

| id | Title | Level | Tag |
|----|-------|-------|-----|
| `o-level-math` | Mathematics (0580) | O Level | Most Popular |
| `o-level-add-math` | Additional Mathematics (0606) | O Level | — |
| `a-level-pure` | Pure Mathematics 1 & 2 (9709) | A Level | New |
| `a-level-stats` | Statistics 1 & 2 (9709) | A Level | — |
| `a-level-mechanics` | Mechanics 1 (9709) | A Level | Coming Soon |
| `gre-quant` | GRE Quantitative Reasoning | GRE | New |

Each course has: `id`, `category`, `badge`, `badgeColor`, `icon`, `bg`, `symbol`, `title`, `subtitle`, `desc`, `longDesc`, `instructor`, `lessons`, `duration`, `students`, `rating`, `tag`, `tagColor`, `topics`, `level`, `whatYouLearn[]`, `prerequisites[]`, `curriculum[]` (sections with lesson title arrays).

---

## KEY COMPONENT BEHAVIOURS

### Navbar (`components/layout/Navbar.tsx`)
- **Client component** with `useEffect` checking Supabase auth via `onAuthStateChange`
- Auto-hides on: `/dashboard/*`, `/login`, `/signup`
- Transparent on dark hero → white/blur when scrolled
- **Logged out:** Shows "Log In" + "Get Started Free"
- **Logged in:** Shows user initials avatar + name + "My Dashboard" link. Clicking signs out.
- Admin (`mr.habibiqbal@gmail.com`) → "My Dashboard" links to `/dashboard/admin`
- Others → `/dashboard/student`
- Shows a pulse skeleton while auth is loading (prevents flash)

### EnrollButton (`app/courses/[id]/EnrollButton.tsx`)
- **Unauthenticated visitor:** Shows "Create Free Account" (→ `/signup?redirect=/courses/[id]`) + "Already have an account? Log in" (→ `/login?redirect=/courses/[id]`)
- **Logged in, not enrolled:** Shows "Enroll Now — It's Free" / "Start Free Preview" / "Enroll Now" depending on `access_type`. Calls `POST /api/enroll`.
- **Enrolled:** Shows green "✓ Enrolled — Continue Learning" → links to `/dashboard/student`

### Student Dashboard (`app/dashboard/student/page.tsx` + `DashboardUI.tsx`)
- **Server component** (`page.tsx`) fetches:
  - `profiles` table → student_id, full_name, level
  - `enrollments` table → enrolled course IDs
  - `lesson_progress` table (with `lessons(course_id)` join) → completed lesson counts per course
- Builds `enrolledCourses` array using `courses-data.ts` for titles and curriculum totals
- Passes real data to `DashboardUI` — falls back to mock data if nothing enrolled yet
- Shows `studentId` (IH-XXXX) in sidebar as purple monospace badge

### Admin Guard
```typescript
const ADMIN_EMAIL = "mr.habibiqbal@gmail.com";
if (!user) redirect("/login");
if (user.email !== ADMIN_EMAIL) redirect("/dashboard/student");
```

### API Enroll Route (`app/api/enroll/route.ts`)
- Checks auth (`getUser()`) — returns 401 if not logged in
- Checks for existing enrollment — reactivates if `is_active = false`, inserts new if none
- Returns `{ enrolled: true }` on success

---

## MIDDLEWARE (`middleware.ts`)

```typescript
// Protects: /dashboard/*
// Redirects logged-in users away from: /login, /signup
matcher: ["/dashboard/:path*", "/login", "/signup"]
```

---

## ENVIRONMENT VARIABLES (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=https://osfthpdhdevfejcqntmk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_ADMIN_SETUP_CODE=...  (secret code for /admin-signup)
ANTHROPIC_API_KEY=sk-ant-...      (for AI Solver — Phase 6)
STRIPE_SECRET_KEY=sk_...          (for payments — Phase 7)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
```

---

## KNOWN BUGS FIXED (do not repeat these mistakes)

### 1. IH-???? student ID not showing
- **Cause:** RLS policy `USING (auth.uid() = id)` blocked server-side reads because the JWT wasn't matching when reading other users' profiles. Also, `.single()` returns `{ data: null, error }` silently — `try/catch` doesn't catch it.
- **Fix 1 (SQL):** Changed profiles SELECT policy to `TO authenticated USING (true)` so any authenticated user can read profiles.
- **Fix 2 (code):** Changed `.single()` to `.maybeSingle()`, added explicit `if (profileError) console.error(...)`.

### 2. Navbar always showed "Log In" even when logged in
- **Cause:** Navbar was a static client component with hardcoded auth buttons — never checked session.
- **Fix:** Added `supabase.auth.getUser()` + `onAuthStateChange` in `useEffect`. Now shows real user state.

### 3. Course page showed "Enrolled" to apparently-logged-out user
- **Cause:** User WAS logged in (session cookie existed) but navbar didn't reflect it. After navbar fix this is now obvious.
- **Not a bug** — just needed the navbar to reflect auth state.

### 4. Supabase join typed as array
- **Cause:** When selecting `lessons(course_id)`, Supabase infers the join as `{ course_id: string }[] | { course_id: string } | null`.
- **Fix:** Check `Array.isArray(lessonsJoin) ? lessonsJoin[0]?.course_id : lessonsJoin?.course_id`.

### 5. Auto-enrollment of unauthenticated visitors
- **Cause:** EnrollButton showed "Enroll Now" to everyone; clicking it redirected to login silently, which felt broken.
- **Fix:** Now shows separate "Create Free Account" / "Log in" buttons for unauthenticated visitors instead of the enroll button.

---

## PENDING PHASES

### Phase 5: Student Lesson Viewer (NEXT)
- When enrolled student clicks a lesson → show lesson page
- 3 tabs: Lecture (YouTube embed), Study Material (notes + downloadable resources), Assignment (questions + submission form)
- Mark lesson as complete → saves to `lesson_progress` table
- Update progress bar on student dashboard

### Phase 6: AI Photo Math Solver
- `/ai-solver` page — student uploads photo of math problem
- Sends image to Anthropic Claude Vision API via `POST /api/solve-math`
- Displays step-by-step solution
- Uses `ANTHROPIC_API_KEY` (server-side only)
- Model: `claude-sonnet-4-6`

### Phase 7: Payments
- SSLCommerz for Bangladesh (BDT)
- Stripe for international (USD)
- Promo code application at checkout
- `course_settings` table already has pricing fields ready

### Phase 8: Production Deploy
- Push to Vercel
- Update Supabase Site URL + Redirect URLs to production domain
- Custom domain (e.g. ihmathematics.com)

---

## HOW TO ADD A NEW COURSE

1. Open `lib/courses-data.ts`
2. Copy an existing course object, paste at end of `courses[]` array
3. Give it a unique `id` (becomes the URL slug, e.g. `"o-level-physics"` → `/courses/o-level-physics`)
4. Fill all fields. Course appears automatically on listing and course pages.
5. To add pricing: insert a row in `course_settings` with `course_id` matching the new id.

---

## HOW TO ADD A NEW ADMIN

In `app/dashboard/admin/page.tsx`, change:
```typescript
// Current:
if (user.email !== "mr.habibiqbal@gmail.com") redirect("/dashboard/student");

// For multiple admins:
const ADMINS = ["mr.habibiqbal@gmail.com", "other@example.com"];
if (!ADMINS.includes(user.email ?? "")) redirect("/dashboard/student");
```
Also update the same check in `components/layout/Navbar.tsx` (`isAdmin` const).

---

## DESIGN SYSTEM

**Colour palette:**
| Purpose | Tailwind class |
|---------|---------------|
| Primary buttons/links | `indigo-600` / `indigo-700` (hover) |
| Hero background | `from-slate-900 via-indigo-950 to-blue-950` |
| Brand accent (logo) | `yellow-400` |
| Success | `emerald-500` / `emerald-600` |
| Warning | `amber-500` |
| Error | `red-500` |
| Body text | `slate-900` |
| Muted text | `slate-500` |
| Borders | `slate-200` |
| Page background | `slate-50` |

**Breakpoints:** `sm:` ≥640px · `md:` ≥768px · `lg:` ≥1024px · `xl:` ≥1280px

**Border radius convention:** `rounded-xl` (small cards), `rounded-2xl` (large cards/panels)

**Shadow convention:** `shadow-lg shadow-indigo-200` for primary buttons

---

## DEPLOYMENT NOTES (when ready for Phase 8)

1. Push all code to GitHub
2. Go to vercel.com → Import project → Set root directory to `my-math-platform`
3. Add all `.env.local` vars in Vercel dashboard
4. After deploy, update in Supabase → Authentication → URL Configuration:
   - Site URL → production domain
   - Redirect URLs → `https://yourdomain.com/**`

**Cost estimate:** ~$11–31/month (Vercel free + Supabase free + Anthropic API ~$10-30 + domain ~$1)

---

## DOCUMENTATION FILE

Full detailed docs are in `DOCUMENTATION.md` (note: that file documents up to Phase 3 — this file is more current for Phase 4+ features).
