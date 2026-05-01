-- ============================================================
-- IH Mathematics Platform — Phase 4 Database Setup
-- Run this entire file in: Supabase → SQL Editor → Run
-- ============================================================


-- ── 1. PROFILES ─────────────────────────────────────────────
-- One row per auth user, stores student ID + role
CREATE TABLE IF NOT EXISTS public.profiles (
  id          uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id  text        UNIQUE NOT NULL,
  full_name   text,
  email       text,
  role        text        NOT NULL DEFAULT 'student',
  level       text,
  created_at  timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Students can read/update their own profile
CREATE POLICY "Users read own profile"   ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
-- Admin can read all profiles
CREATE POLICY "Admin reads all profiles" ON public.profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));


-- ── 2. AUTO STUDENT-ID TRIGGER ───────────────────────────────
-- Fires on every new auth.users row, auto-creates the profile
-- with a unique IH-XXXX student ID
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_student_id text;
  seq_num        integer;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(student_id FROM 4) AS integer)), 0) + 1
    INTO seq_num
    FROM public.profiles;

  new_student_id := 'IH-' || LPAD(seq_num::text, 4, '0');

  INSERT INTO public.profiles (id, student_id, full_name, email, role, level)
  VALUES (
    NEW.id,
    new_student_id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    NEW.raw_user_meta_data->>'level'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Attach the trigger (drop first so re-running this file is safe)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ── 3. ENROLLMENTS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.enrollments (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id   text        NOT NULL,
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  is_active   boolean     NOT NULL DEFAULT true,
  removed_at  timestamptz,
  UNIQUE (user_id, course_id)
);
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own enrollments"   ON public.enrollments FOR SELECT  USING (auth.uid() = user_id);
CREATE POLICY "Users insert own enrollment"  ON public.enrollments FOR INSERT  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own enrollment"  ON public.enrollments FOR UPDATE  USING (auth.uid() = user_id);
CREATE POLICY "Admin all enrollments"        ON public.enrollments FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));


-- ── 4. LESSONS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.lessons (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id        text        NOT NULL,
  section_name     text        NOT NULL,
  title            text        NOT NULL,
  order_index      integer     NOT NULL DEFAULT 0,
  video_url        text,
  video_description text,
  notes            text,
  status           text        NOT NULL DEFAULT 'draft',
  duration         text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enrolled users read published lessons" ON public.lessons FOR SELECT
  USING (
    status = 'published' AND
    EXISTS (SELECT 1 FROM public.enrollments e WHERE e.user_id = auth.uid() AND e.course_id = lessons.course_id AND e.is_active = true)
  );
CREATE POLICY "Admin full access on lessons" ON public.lessons FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));


-- ── 5. LESSON RESOURCES ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.lesson_resources (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id     uuid        NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  title         text        NOT NULL,
  url           text        NOT NULL,
  resource_type text        NOT NULL DEFAULT 'link',
  created_at    timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.lesson_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enrolled users read resources" ON public.lesson_resources FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.lessons l
    JOIN public.enrollments e ON e.course_id = l.course_id
    WHERE l.id = lesson_resources.lesson_id AND e.user_id = auth.uid() AND e.is_active = true
  ));
CREATE POLICY "Admin full access on resources" ON public.lesson_resources FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));


-- ── 6. ASSIGNMENTS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.assignments (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id    uuid        NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  title        text        NOT NULL,
  instructions text,
  total_marks  integer     NOT NULL DEFAULT 20,
  due_date     timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enrolled users read assignments" ON public.assignments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.lessons l
    JOIN public.enrollments e ON e.course_id = l.course_id
    WHERE l.id = assignments.lesson_id AND e.user_id = auth.uid() AND e.is_active = true
  ));
CREATE POLICY "Admin full access on assignments" ON public.assignments FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));


-- ── 7. ASSIGNMENT QUESTIONS ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.assignment_questions (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id   uuid        NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  question_text   text        NOT NULL,
  marks           integer     NOT NULL DEFAULT 5,
  order_index     integer     NOT NULL DEFAULT 0
);
ALTER TABLE public.assignment_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enrolled users read questions" ON public.assignment_questions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.assignments a
    JOIN public.lessons l ON l.id = a.lesson_id
    JOIN public.enrollments e ON e.course_id = l.course_id
    WHERE a.id = assignment_questions.assignment_id AND e.user_id = auth.uid() AND e.is_active = true
  ));
CREATE POLICY "Admin full access on questions" ON public.assignment_questions FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));


-- ── 8. ASSIGNMENT SUBMISSIONS ────────────────────────────────
CREATE TABLE IF NOT EXISTS public.assignment_submissions (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid        NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  user_id       uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  answers       jsonb       NOT NULL DEFAULT '[]',
  submitted_at  timestamptz NOT NULL DEFAULT now(),
  score         integer,
  feedback      text,
  graded_at     timestamptz,
  UNIQUE (assignment_id, user_id)
);
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own submissions"   ON public.assignment_submissions FOR SELECT  USING (auth.uid() = user_id);
CREATE POLICY "Users insert own submission"  ON public.assignment_submissions FOR INSERT  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin all submissions"        ON public.assignment_submissions FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));


-- ── 9. LESSON PROGRESS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id    uuid        NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own progress"   ON public.lesson_progress FOR SELECT  USING (auth.uid() = user_id);
CREATE POLICY "Users insert own progress" ON public.lesson_progress FOR INSERT  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin all progress"        ON public.lesson_progress FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));


-- ── 10. PROMO CODES ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  code           text        UNIQUE NOT NULL,
  discount_type  text        NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
  discount_value integer     NOT NULL,
  max_uses       integer,
  uses_count     integer     NOT NULL DEFAULT 0,
  expires_at     timestamptz,
  is_active      boolean     NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access on promo_codes" ON public.promo_codes FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));


-- ── 11. COURSE SETTINGS (pricing) ────────────────────────────
-- (may already exist — IF NOT EXISTS keeps it safe)
CREATE TABLE IF NOT EXISTS public.course_settings (
  course_id       text        PRIMARY KEY,
  access_type     text        NOT NULL DEFAULT 'free',
  price           integer     NOT NULL DEFAULT 0,
  original_price  integer     NOT NULL DEFAULT 0,
  currency        text        NOT NULL DEFAULT 'BDT',
  billing_period  text        NOT NULL DEFAULT 'month',
  preview_lessons integer     NOT NULL DEFAULT 0,
  updated_at      timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.course_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read course settings"   ON public.course_settings FOR SELECT USING (true);
CREATE POLICY "Admin write course settings"   ON public.course_settings FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));


-- ── DONE ─────────────────────────────────────────────────────
-- After running this SQL:
-- 1. Every new signup automatically gets a profile + IH-XXXX student ID
-- 2. To backfill existing users, run the insert below for each existing auth user:
--
--   INSERT INTO public.profiles (id, student_id, full_name, email, role)
--   SELECT
--     id,
--     'IH-' || LPAD(ROW_NUMBER() OVER (ORDER BY created_at)::text, 4, '0'),
--     raw_user_meta_data->>'full_name',
--     email,
--     COALESCE(raw_user_meta_data->>'role', 'student')
--   FROM auth.users
--   ON CONFLICT (id) DO NOTHING;
