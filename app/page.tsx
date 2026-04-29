import Link from "next/link";

/* ─── data ─────────────────────────────────────────────────── */

const stats = [
  { value: "500+",  label: "Students Enrolled" },
  { value: "98%",   label: "Pass Rate" },
  { value: "50+",   label: "Video Lessons" },
  { value: "5+",    label: "Years Experience" },
];

const features = [
  {
    icon: "🎬",
    color: "bg-blue-50 text-blue-600",
    ring: "ring-blue-100",
    title: "Video Courses",
    desc: "High-quality recorded lessons for every O & A Level topic. Watch at your own pace, rewind, and rewatch anytime.",
  },
  {
    icon: "🤖",
    color: "bg-purple-50 text-purple-600",
    ring: "ring-purple-100",
    title: "AI Math Solver",
    desc: "Snap a photo of any math problem. Our AI gives you a clear, step-by-step solution in seconds.",
  },
  {
    icon: "📄",
    color: "bg-emerald-50 text-emerald-600",
    ring: "ring-emerald-100",
    title: "Past Papers Library",
    desc: "Every Cambridge O & A Level past paper organised by year and topic — fully searchable and downloadable.",
  },
  {
    icon: "📊",
    color: "bg-orange-50 text-orange-600",
    ring: "ring-orange-100",
    title: "Progress Dashboard",
    desc: "Track attendance, quiz scores, and topic mastery in real time. Know exactly where to focus next.",
  },
];

const courses = [
  {
    badge:    "O Level",
    badgeColor: "bg-blue-100 text-blue-700",
    title:    "Mathematics (0580)",
    desc:     "Full coverage of the Cambridge O Level syllabus — algebra, geometry, statistics, and more.",
    lessons:  24,
    duration: "48 hrs",
    tag:      "Most Popular",
    tagColor: "bg-emerald-100 text-emerald-700",
    href:     "/courses",
  },
  {
    badge:    "O Level",
    badgeColor: "bg-blue-100 text-blue-700",
    title:    "Additional Mathematics (0606)",
    desc:     "Bridge the gap between O and A Level with functions, calculus, trigonometry, and vectors.",
    lessons:  18,
    duration: "36 hrs",
    tag:      null,
    tagColor: "",
    href:     "/courses",
  },
  {
    badge:    "A Level",
    badgeColor: "bg-purple-100 text-purple-700",
    title:    "Pure Mathematics (9709)",
    desc:     "Deep-dive into pure maths: differentiation, integration, complex numbers, and series.",
    lessons:  32,
    duration: "64 hrs",
    tag:      "New",
    tagColor: "bg-indigo-100 text-indigo-700",
    href:     "/courses",
  },
];

const steps = [
  { num: "01", title: "Create a Free Account", desc: "Sign up in under a minute — no credit card needed to get started." },
  { num: "02", title: "Choose Your Course",    desc: "Browse O Level, A Level, or GRE courses and enroll instantly." },
  { num: "03", title: "Learn & Track Progress", desc: "Watch lessons, solve past papers, use the AI Solver, and watch your grade improve." },
];

const testimonials = [
  {
    name:    "Tasnim Rahman",
    grade:   "O Level 2024 — Grade A*",
    quote:   "The video lessons were so clear. I finally understood trigonometry after struggling for months. Passed with A*!",
    initials: "TR",
    color:   "bg-indigo-600",
  },
  {
    name:    "Arfan Hossain",
    grade:   "A Level 2024 — Grade A",
    quote:   "The AI Math Solver is unreal. I uploaded a past paper question, got a perfect explanation instantly. Saved me hours.",
    initials: "AH",
    color:   "bg-purple-600",
  },
  {
    name:    "Nusrat Jahan",
    grade:   "O Level 2023 — Grade A",
    quote:   "The past papers library alone is worth it. Every paper organised by topic — I was able to target my weak areas.",
    initials: "NJ",
    color:   "bg-emerald-600",
  },
];

/* ─── page ──────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 overflow-hidden">

        {/* Background decorative circles */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-0 grid lg:grid-cols-2 gap-12 items-center">

          {/* Left — text */}
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              Cambridge Certified Mathematics Tutor
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Master Maths for{" "}
              <span className="gradient-text">O &amp; A Level</span>{" "}
              with Confidence
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-lg">
              Expert-led video courses, an AI photo math solver, complete past
              papers library, and real-time progress tracking — everything you
              need to ace Cambridge exams.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="px-7 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base transition-all shadow-lg shadow-indigo-900/40 hover:shadow-indigo-700/40 hover:-translate-y-0.5 text-center"
              >
                Start Learning Free →
              </Link>
              <Link
                href="/courses"
                className="px-7 py-4 rounded-xl border border-white/20 text-white hover:bg-white/10 font-semibold text-base transition-all text-center"
              >
                Browse Courses
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-6 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">✓ <span>No credit card needed</span></span>
              <span className="flex items-center gap-1.5">✓ <span>Free past papers</span></span>
              <span className="flex items-center gap-1.5">✓ <span>AI Solver included</span></span>
            </div>
          </div>

          {/* Right — AI Solver card */}
          <div className="hidden lg:flex justify-center animate-float">
            <div className="w-80 bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Card header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white text-lg">🤖</div>
                <div>
                  <p className="text-white font-semibold text-sm">AI Math Solver</p>
                  <p className="text-indigo-200 text-xs">Step-by-step solution</p>
                </div>
                <span className="ml-auto px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-medium">Live</span>
              </div>

              {/* Problem */}
              <div className="px-5 py-4 bg-slate-50 border-b border-slate-100">
                <p className="text-xs text-slate-500 mb-1">Problem detected</p>
                <p className="font-mono text-slate-800 text-sm font-semibold">Solve: x² + 5x + 6 = 0</p>
              </div>

              {/* Solution steps */}
              <div className="px-5 py-4 space-y-3">
                {[
                  { step: "Step 1", text: "Factor the quadratic expression", math: "(x + 2)(x + 3) = 0" },
                  { step: "Step 2", text: "Apply zero-product property", math: "x + 2 = 0  or  x + 3 = 0" },
                  { step: "Step 3", text: "Solve for x", math: "x = −2  or  x = −3" },
                ].map(({ step, text, math }) => (
                  <div key={step} className="flex gap-3">
                    <span className="mt-0.5 shrink-0 w-14 text-xs font-bold text-indigo-600">{step}</span>
                    <div>
                      <p className="text-xs text-slate-500">{text}</p>
                      <p className="font-mono text-xs text-slate-800 font-semibold mt-0.5">{math}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 bg-emerald-50 border-t border-emerald-100 flex items-center justify-between">
                <span className="text-emerald-700 text-xs font-semibold">✓ Solved in 1.2s</span>
                <span className="text-xs text-slate-400">Powered by Claude AI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 20C1200 60 900 0 720 20C540 40 240 0 0 20L0 60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(({ value, label }) => (
              <div
                key={label}
                className="text-center p-6 rounded-2xl bg-gradient-to-b from-indigo-50 to-white border border-indigo-100 card-hover"
              >
                <p className="text-4xl font-bold text-indigo-600 mb-1">{value}</p>
                <p className="text-sm text-slate-500 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-3">Everything You Need</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              One platform. Every tool.
            </h2>
            <p className="mt-4 text-slate-500 max-w-xl mx-auto">
              Built specifically for Cambridge students who want to study smarter, not harder.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon, color, ring, title, desc }) => (
              <div
                key={title}
                className={`bg-white rounded-2xl p-6 border border-slate-100 ring-1 ${ring} card-hover cursor-default`}
              >
                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-2xl mb-4`}>
                  {icon}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Courses ──────────────────────────────────────────── */}
      <section id="courses" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-3">Our Courses</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Start with the right course</h2>
            </div>
            <Link
              href="/courses"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 shrink-0 transition-colors"
            >
              View all courses →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(({ badge, badgeColor, title, desc, lessons, duration, tag, tagColor, href }) => (
              <Link
                key={title}
                href={href}
                className="group bg-white border border-slate-200 rounded-2xl overflow-hidden card-hover flex flex-col"
              >
                {/* Card image placeholder */}
                <div className="h-40 bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 relative flex items-center justify-center">
                  <span className="text-5xl opacity-40">∫</span>
                  {tag && (
                    <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold ${tagColor}`}>
                      {tag}
                    </span>
                  )}
                </div>

                {/* Card body */}
                <div className="p-5 flex flex-col flex-1">
                  <span className={`inline-block self-start px-2.5 py-1 rounded-full text-xs font-bold mb-3 ${badgeColor}`}>
                    {badge}
                  </span>
                  <h3 className="font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed flex-1">{desc}</p>
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 font-medium">
                    <span>📹 {lessons} lessons</span>
                    <span>⏱ {duration}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-indigo-950 to-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-indigo-400 font-semibold text-sm uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Get started in 3 steps</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 relative">
            {/* connector line */}
            <div className="hidden sm:block absolute top-10 left-1/4 right-1/4 h-px bg-indigo-700/50" />

            {steps.map(({ num, title, desc }) => (
              <div key={num} className="relative flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mb-5">
                  <span className="text-2xl font-bold text-indigo-400">{num}</span>
                </div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-3">Student Results</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">What our students say</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map(({ name, grade, quote, initials, color }) => (
              <div key={name} className="bg-white rounded-2xl p-6 border border-slate-100 card-hover">
                <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">
                  &ldquo;{quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                    {initials}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{name}</p>
                    <p className="text-xs text-slate-500">{grade}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-10 sm:p-14 text-center shadow-2xl shadow-indigo-200">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to boost your grade?
            </h2>
            <p className="text-indigo-200 text-lg mb-8 max-w-xl mx-auto">
              Join 500+ Cambridge students already learning with IH Mathematics.
              Start free today — no commitment required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="px-8 py-4 rounded-xl bg-white text-indigo-700 font-bold hover:bg-indigo-50 transition-all shadow-lg text-center"
              >
                Create Free Account
              </Link>
              <Link
                href="/courses"
                className="px-8 py-4 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all text-center"
              >
                Explore Courses
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
