# IH Mathematics Platform — Full Claude Context Document
> Paste this entire file at the start of any new Claude conversation to give full project context.
> Last updated: 2026-05-07 (after Phase 4 + fixes session)

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

**Dev server:** `npx next dev` (run in `d:\CV\Teaching Website\my-math-platform`)
**Local URL:** `http://localhost:3000`
**GitHub:** `https://github.com/iqbalhabib/IH-Mathematics`
**Supabase project:** `https://osfthpdhdevfejcqntmk.supabase.co`

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

---

## CRITICAL NEXT.JS 16 RULES (read before writing any code)

1. **`middleware.ts` is GONE — use `proxy.ts` instead.** Next.js 16 renamed middleware to proxy. The exported function must also be named `proxy`, not `middleware`:
   ```typescript
   // proxy.ts (NOT middleware.ts)
   export async function proxy(request: NextRequest) { ... }
   export const config = { matcher: [...] };
   ```

2. **Dynamic route params are Promises** — must be `await`ed:
   ```tsx
   export default async function Page({ params }: { params: Promise<{ id: string }> }) {
     const { id } = await params;  // ← MUST await
   }
   ```

3. **Two Supabase clients** — never mix them:
   - `lib/supabase/server.ts` → use in Server Components and API routes (`await createClient()`)
   - `lib/supabase/client.ts` → use in Client Components (`createClient()` — no await needed)

4. **Supabase errors do NOT throw** — they return `{ data, error }`. `try/catch` won't catch query errors:
   ```typescript
   const { data, error } = await supabase.from("profiles").select("*").maybeSingle();
   if (error) console.error(error.message);  // ← check error field explicitly
   ```

5. **Use `.maybeSingle()` not `.single()`** when a row might not exist. `.single()` returns an error object if 0 rows found.

6. **Supabase join results typed as arrays** even for single-row joins:
   ```typescript
   const cid = Array.isArray(lessonsJoin) ? lessonsJoin[0]?.course_id : lessonsJoin?.course_id;
   ```

7. **Hydration warning from browser extensions** (e.g. Grammarly) — suppressed with `suppressHydrationWarning` on `<body>` in `layout.tsx`. This is already in place — do not remove it.

---

## COMPLETE FILE STRUCTURE

```
my-math-platform/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx              → /login  (client, Supabase signIn)
│   │   └── signup/page.tsx             → /signup (client, Supabase signUp)
│   ├── auth/callback/route.ts          → OAuth/email confirmation callback
│   ├── api/
│   │   └── enroll/route.ts             → POST /api/enroll (server-side enrollment)
│   ├── courses/
│   │   ├── page.tsx                    → /courses (client, search + filter tabs)
│   │   └── [id]/
│   │       ├── page.tsx                → /courses/[id] (server, fetches pricing + enrollment)
│   │       └── EnrollButton.tsx        → client, auth-aware enroll button
│   ├── dashboard/
│   │   ├── admin/
│   │   │   ├── page.tsx                → /dashboard/admin (server, admin-only guard)
│   │   │   ├── AdminUI.tsx             → client, full admin panel
│   │   │   ├── courses/[id]/
│   │   │   │   ├── page.tsx            → /dashboard/admin/courses/[id]
│   │   │   │   ├── CourseManageUI.tsx  → client, tabs: Overview/Students/Lessons/Settings
│   │   │   │   └── LessonEditor.tsx    → client, inline editor: Lecture/Study Material/Assignment
│   │   │   └── promo-codes/
│   │   │       ├── page.tsx            → /dashboard/admin/promo-codes
│   │   │       └── PromoCodesUI.tsx    → client, full promo code CRUD
│   │   └── student/
│   │       ├── page.tsx                → /dashboard/student (server, fetches real data)
│   │       └── DashboardUI.tsx         → client, full student dashboard
│   ├── past-papers/page.tsx            → /past-papers (client, filter + grid/list)
│   ├── ai-solver/page.tsx              → /ai-solver (placeholder — Phase 6)
│   ├── admin-signup/page.tsx           → /admin-signup (requires NEXT_PUBLIC_ADMIN_SETUP_CODE)
│   ├── layout.tsx                      → root layout (Navbar + Footer + suppressHydrationWarning)
│   └── page.tsx                        → / (homepage)
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx                  → auth-aware navbar (shows user or login buttons)
│   │   └── Footer.tsx
│   └── ui/IHLogo.tsx
├── lib/
│   ├── courses-data.ts                 → all 6 courses (Course interface + courses[] array)
│   ├── supabase/
│   │   ├── client.ts                   → createBrowserClient (for "use client" files)
│   │   └── server.ts                   → createServerClient with cookies (for server files)
│   └── supabase.ts                     → OLD — ignore, not used
├── types/index.ts                      → TypeScript interfaces
├── proxy.ts                            → route protection (renamed from middleware.ts in Next.js 16)
├── supabase/phase4-setup.sql           → full DB schema + RLS + triggers (already run in Supabase)
├── CLAUDE_CONTEXT.md                   → this file
└── DOCUMENTATION.md                    → older docs (up to Phase 3, partially outdated)
```

---

## CURRENT BUILD STATUS

### ✅ DONE — Phase 1: Scaffold & Homepage
- Homepage with Hero, Stats, Features, Courses preview, Testimonials, CTA sections
- Navbar (fixed, transparent→white on scroll, auto-hides on dashboard/auth pages)
- Footer (auto-hides on dashboard/auth pages)
- IH logo at `public/logo.png`

### ✅ DONE — Phase 2: Auth System
- `/login` — email + password, redirects to `/dashboard/student`
- `/signup` — collects: full name, email, level (O Level/A Level/GRE/Other), password
- `/auth/callback` — handles email confirmation link
- `/admin-signup` — admin account creation (requires setup code env var)
- `proxy.ts` protects `/dashboard/*` → redirects to `/login` if not authenticated
- `proxy.ts` redirects logged-in users away from `/login` and `/signup`

### ✅ DONE — Phase 3: Courses, Past Papers, Admin Panel
- `/courses` — listing with live search + tabs (All/O Level/A Level/GRE)
- `/courses/[id]` — full course page: breadcrumb, video preview, curriculum accordion, enrollment card
- `/past-papers` — 46+ papers, 5 filters, grid/list toggle
- `/dashboard/admin` — stats, weekly chart, student table, course management, quick actions

### ✅ DONE — Phase 4: Real Database + Enrollment + UX Fixes
- **Student IDs:** Auto-generated IH-XXXX by Postgres trigger on every new signup
- **Real enrollment:** POST `/api/enroll` → inserts into `enrollments` table
- **Enrollment check:** Course page detects if logged-in user is enrolled
- **Student dashboard:** Fetches real profile (student ID), enrollments, lesson progress from Supabase
- **Admin course management:** Student removal with inline confirmation, LessonEditor, promo codes
- **Lesson editor:** 3 tabs — Lecture (video URL + YouTube embed preview), Study Material (notes + resources list), Assignment (questions + marks + due date)
- **Promo codes:** Create/enable/disable/delete, percent or fixed discount, usage tracking
- **Dynamic pricing:** Course page reads from `course_settings` table (defaults to "free")
- **Auth-aware Navbar:** Shows user initials/name/dashboard link when logged in; shows Log In + Get Started Free when logged out; Sign Out on click; pulse skeleton while loading
- **EnrollButton UX:** Unauthenticated visitors see "Create Free Account" + "Log In" buttons — NOT the enroll button
- **proxy.ts:** Renamed from `middleware.ts` (Next.js 16 breaking change — function also renamed to `proxy`)
- **Hydration fix:** `suppressHydrationWarning` on `<body>` in `layout.tsx` (fixes Grammarly extension conflict)

---

## DATABASE SCHEMA (already live in Supabase)

All created via `supabase/phase4-setup.sql`.

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
**Trigger:** `handle_new_user()` fires on `auth.users` INSERT → auto-creates profile with next IH-XXXX student_id.

**Critical RLS policy (the one that works):**
```sql
CREATE POLICY "Authenticated users read profiles"
  ON public.profiles FOR SELECT
  TO authenticated USING (true);
```
The original `USING (auth.uid() = id)` policy blocked server-side reads and caused IH-???? bug. Do not revert.

### `enrollments`
```sql
id          uuid (PK)
user_id     uuid → profiles.id
course_id   text  -- matches courses-data.ts IDs e.g. 'o-level-math'
enrolled_at timestamptz
is_active   boolean DEFAULT true
removed_at  timestamptz
UNIQUE(user_id, course_id)
```

### `lessons`
```sql
id, course_id (text), section_name, title, order_index,
video_url, video_description, notes,
status (DEFAULT 'draft' | 'published'), duration,
created_at, updated_at
```

### `lesson_resources`
```sql
id, lesson_id → lessons.id, title, url,
resource_type DEFAULT 'link', created_at
```

### `assignments`
```sql
id, lesson_id → lessons.id, title, instructions,
total_marks DEFAULT 20, due_date, created_at
```

### `assignment_questions`
```sql
id, assignment_id → assignments.id,
question_text, marks DEFAULT 5, order_index
```

### `assignment_submissions`
```sql
id, assignment_id, user_id, answers (jsonb),
submitted_at, score, feedback, graded_at
UNIQUE(assignment_id, user_id)
```

### `lesson_progress`
```sql
id, user_id → profiles.id, lesson_id → lessons.id,
completed_at
UNIQUE(user_id, lesson_id)
```

### `promo_codes`
```sql
id, code UNIQUE, discount_type ('percent'|'fixed'),
discount_value, max_uses, uses_count DEFAULT 0,
expires_at, is_active DEFAULT true, created_at
```

### `course_settings`
```sql
course_id (PK, text)  -- matches courses-data.ts IDs
access_type DEFAULT 'free'  -- 'free' | 'paid' | 'preview'
price DEFAULT 0, original_price DEFAULT 0
currency DEFAULT 'BDT'
billing_period DEFAULT 'month'  -- 'month' | 'year' | 'once'
preview_lessons DEFAULT 0
updated_at
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

Each course object has: `id`, `category`, `badge`, `badgeColor`, `icon`, `bg`, `symbol`, `title`, `subtitle`, `desc`, `longDesc`, `instructor`, `lessons` (count), `duration`, `students`, `rating`, `tag`, `tagColor`, `topics[]`, `level`, `whatYouLearn[]`, `prerequisites[]`, `curriculum[]` (sections → `{ section: string, lessons: string[] }`).

---

## KEY COMPONENT BEHAVIOURS

### Navbar (`components/layout/Navbar.tsx`)
- Client component, checks auth via `supabase.auth.getUser()` + `onAuthStateChange` in `useEffect`
- Auto-hides on: `/dashboard/*`, `/login`, `/signup`
- Transparent on dark hero, white/blur when scrolled past 10px
- **Logged out:** "Log In" + "Get Started Free"
- **Logged in:** User initials avatar + display name + "My Dashboard" link. Clicking name/avatar signs out.
- Admin (`mr.habibiqbal@gmail.com`) → dashboard links to `/dashboard/admin`
- All others → `/dashboard/student`
- Pulse skeleton while auth is resolving (no flash of wrong state)

### EnrollButton (`app/courses/[id]/EnrollButton.tsx`)
- Receives: `courseId`, `isLoggedIn`, `initialEnrolled`, `accessType`, `isFree`
- **Not logged in:** Shows info box ("Create a free account to enroll") + "Create Free Account" button (→ `/signup?redirect=/courses/[id]`) + "Already have an account? Log in" (→ `/login?redirect=/courses/[id]`)
- **Logged in, not enrolled:** Shows "Enroll Now — It's Free" / "Start Free Preview" / "Enroll Now". Calls `POST /api/enroll`.
- **Enrolled:** Shows green "✓ Enrolled — Continue Learning" → links to `/dashboard/student`

### Student Dashboard (`app/dashboard/student/page.tsx` + `DashboardUI.tsx`)
- Server component fetches: profile (student_id), enrollments (course IDs), lesson_progress (completed counts per course)
- Builds `enrolledCourses[]` using `courses-data.ts` for titles + curriculum totals
- Passes real data to `DashboardUI` — falls back to mock activeCourses if nothing enrolled
- Shows `studentId` (IH-XXXX) in sidebar as purple monospace badge

### Admin Guard (in `app/dashboard/admin/page.tsx`)
```typescript
const ADMIN_EMAIL = "mr.habibiqbal@gmail.com";
if (!user) redirect("/login");
if (user.email !== ADMIN_EMAIL) redirect("/dashboard/student");
```

### API Enroll Route (`app/api/enroll/route.ts`)
- Checks auth — returns 401 if not logged in
- Checks for existing enrollment — reactivates if `is_active = false`, inserts new if none exists
- Returns `{ enrolled: true }` on success

### Root Layout (`app/layout.tsx`)
- `suppressHydrationWarning` on `<body>` — suppresses Grammarly/extension attribute injection errors
- Geist font from Google Fonts
- Metadata: "IH Mathematics | O & A Level Online Tutoring"

---

## PROXY / ROUTE PROTECTION (`proxy.ts`)

Renamed from `middleware.ts` in Next.js 16. Function is `proxy`, not `middleware`.

```typescript
export async function proxy(request: NextRequest) { ... }
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
```

Protects `/dashboard/*` → redirects to `/login` if no session.
Redirects logged-in users away from `/login` and `/signup` → to `/dashboard/student`.

---

## ENVIRONMENT VARIABLES (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=https://osfthpdhdevfejcqntmk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_ADMIN_SETUP_CODE=...   (secret for /admin-signup page)
ANTHROPIC_API_KEY=sk-ant-...       (AI Solver — Phase 6, server-side only)
STRIPE_SECRET_KEY=sk_...           (Payments — Phase 7)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
```

---

## ALL BUGS FIXED — DO NOT REPEAT

### 1. IH-???? student ID not showing
- **Cause:** RLS policy `USING (auth.uid() = id)` silently blocked server-side reads. Also, `.single()` + `try/catch` doesn't catch Supabase errors (they return `{ data: null, error }`, not throw).
- **Fix:** Changed profiles SELECT policy to `TO authenticated USING (true)`. Changed `.single()` to `.maybeSingle()` with explicit error logging.

### 2. Navbar always showed "Log In" even when logged in
- **Cause:** Navbar was a static hardcoded component with no session check.
- **Fix:** Added `supabase.auth.getUser()` + `onAuthStateChange` useEffect. Now dynamically reflects auth state.

### 3. Course page showed "Enrolled" when navbar showed "Log In"
- **Not a bug** — user WAS logged in (session cookie existed) but navbar was static. Fixed by the navbar auth-awareness above.

### 4. New visitors seeing "Enroll Now" instead of login prompt
- **Cause:** EnrollButton showed "Enroll Now" to everyone; clicking silently redirected to login with no explanation.
- **Fix:** Unauthenticated visitors now see dedicated "Create Free Account" + "Log In" buttons with an explanatory message.

### 5. `middleware.ts` deprecation warning
- **Cause:** Next.js 16 deprecated `middleware.ts` in favour of `proxy.ts`.
- **Fix:** Renamed file to `proxy.ts`, renamed exported function from `middleware` to `proxy`.

### 6. Hydration error in browser
- **Cause:** Grammarly extension injects `data-gr-ext-installed` and `data-new-gr-c-s-check-loaded` onto `<body>`, causing server/client HTML mismatch.
- **Fix:** Added `suppressHydrationWarning` to `<body>` in `app/layout.tsx`. Not a code bug — safe to suppress.

### 7. Supabase join typed as array
- **Cause:** `lessons(course_id)` join inferred as array by TypeScript.
- **Fix:** `Array.isArray(lessonsJoin) ? lessonsJoin[0]?.course_id : lessonsJoin?.course_id`

---

## PENDING PHASES

### Phase 5: Student Lesson Viewer (NEXT TO BUILD)
When an enrolled student clicks a lesson → show the lesson page with:
- **Lecture tab:** YouTube video embed (from `video_url` in `lessons` table), description
- **Study Material tab:** Notes content + downloadable resources list (from `lesson_resources` table)
- **Assignment tab:** Questions list, answer inputs, submit button → inserts into `assignment_submissions`
- Mark lesson complete → insert into `lesson_progress` table
- Progress bar on student dashboard updates

### Phase 6: AI Photo Math Solver
- `/ai-solver` page — student uploads photo of math problem
- Sends image to Anthropic Claude Vision API via `POST /api/solve-math`
- Returns step-by-step solution
- Uses `ANTHROPIC_API_KEY` (server-side only, never expose to browser)
- Model to use: `claude-sonnet-4-6`

### Phase 7: Payments
- SSLCommerz for Bangladesh (BDT)
- Stripe for international (USD)
- Promo code validation at checkout
- `course_settings` table already has all pricing fields ready

### Phase 8: Production Deploy
- Push to Vercel, set root directory to `my-math-platform`
- Add all `.env.local` vars in Vercel dashboard
- Update Supabase → Authentication → URL Configuration: Site URL + Redirect URLs → production domain
- Custom domain (e.g. ihmathematics.com)

---

## HOW TO ADD A NEW COURSE

1. Open `lib/courses-data.ts`
2. Copy an existing course object, paste at end of `courses[]` array
3. Give it a unique `id` (becomes the URL slug — e.g. `"o-level-physics"` → `/courses/o-level-physics`)
4. Fill all required fields
5. Course appears automatically on listing page and gets its own course page
6. To set pricing: insert a row in `course_settings` with matching `course_id`

---

## HOW TO ADD A NEW ADMIN

In `app/dashboard/admin/page.tsx`:
```typescript
// Change from single email check:
if (user.email !== "mr.habibiqbal@gmail.com") redirect("/dashboard/student");

// To array check:
const ADMINS = ["mr.habibiqbal@gmail.com", "other@example.com"];
if (!ADMINS.includes(user.email ?? "")) redirect("/dashboard/student");
```
Also update the `isAdmin` constant in `components/layout/Navbar.tsx`.

---

## DESIGN SYSTEM

| Purpose | Tailwind class |
|---------|---------------|
| Primary buttons/links | `indigo-600` / `indigo-700` (hover) |
| Hero background | `from-slate-900 via-indigo-950 to-blue-950` |
| Brand accent (logo text) | `yellow-400` |
| Success / enrolled | `emerald-500` / `emerald-600` |
| Warning | `amber-500` |
| Error | `red-500` |
| Body text | `slate-900` |
| Muted text | `slate-500` |
| Borders | `slate-200` |
| Page background | `slate-50` |

**Border radius:** `rounded-xl` small cards, `rounded-2xl` large panels
**Shadows:** `shadow-lg shadow-indigo-200` for primary CTA buttons
**Breakpoints:** `sm:` ≥640px · `md:` ≥768px · `lg:` ≥1024px · `xl:` ≥1280px

---

## DEPLOYMENT CHECKLIST (Phase 8)

1. Push all code to GitHub main branch
2. Vercel → New Project → Import `IH-Mathematics` → Root Directory: `my-math-platform`
3. Add env vars in Vercel dashboard (all keys from `.env.local`)
4. After deploy → Supabase → Authentication → URL Configuration:
   - Site URL → `https://yourdomain.com`
   - Redirect URLs → `https://yourdomain.com/**`
5. Test login/signup/enrollment on production URL

**Monthly cost estimate:** ~$11–31/month (Vercel free + Supabase free + Anthropic API ~$10–30 + domain ~$1)
