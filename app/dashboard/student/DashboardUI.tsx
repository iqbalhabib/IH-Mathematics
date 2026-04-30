"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

/* ── mock data (replace with Supabase queries later) ─────── */

const weeklyScores = [
  { day: "Mon", score: 72 }, { day: "Tue", score: 85 },
  { day: "Wed", score: 68 }, { day: "Thu", score: 90 },
  { day: "Fri", score: 78 }, { day: "Sat", score: 92 },
  { day: "Sun", score: 88 },
];

const subjectPerformance = [
  { name: "Algebra",       score: 88, color: "bg-indigo-500" },
  { name: "Calculus",      score: 72, color: "bg-purple-500" },
  { name: "Statistics",    score: 95, color: "bg-emerald-500" },
  { name: "Geometry",      score: 65, color: "bg-amber-500" },
  { name: "Trigonometry",  score: 80, color: "bg-blue-500" },
];

const pendingAssignments = [
  { id: 1, title: "Chapter 5 — Quadratic Equations",  course: "O Level Mathematics", due: "Tomorrow",  priority: "high",   marks: 20 },
  { id: 2, title: "Integration by Parts Practice",    course: "A Level Pure Math",   due: "In 3 days", priority: "medium", marks: 30 },
  { id: 3, title: "Probability Worksheet Set B",      course: "A Level Statistics",  due: "In 5 days", priority: "low",    marks: 15 },
  { id: 4, title: "Vectors & Matrices Problem Set",   course: "O Level Add. Maths",  due: "In 1 week", priority: "low",    marks: 25 },
];

const completedAssignments = [
  { id: 5, title: "Quadratic Functions Quiz",        course: "O Level Mathematics", scored: 18, marks: 20, date: "Yesterday",  grade: "A*" },
  { id: 6, title: "Differentiation Test",            course: "A Level Pure Math",   scored: 45, marks: 50, date: "3 days ago", grade: "A"  },
  { id: 7, title: "Descriptive Statistics Sheet",    course: "A Level Statistics",  scored: 28, marks: 35, date: "1 week ago", grade: "B+" },
  { id: 8, title: "Surds & Indices Worksheet",       course: "O Level Mathematics", scored: 19, marks: 20, date: "2 weeks ago",grade: "A*" },
];

const recentResults = [
  { test: "Mid-term Examination",    course: "O Level Math",   score: 82,  max: 100, grade: "A",  date: "Apr 20", pass: true },
  { test: "Chapter 4 Unit Test",     course: "A Level Pure",   score: 43,  max: 50,  grade: "A*", date: "Apr 15", pass: true },
  { test: "Probability Class Test",  course: "A Level Stats",  score: 28,  max: 40,  grade: "B",  date: "Apr 10", pass: true },
  { test: "Integration Quiz",        course: "A Level Pure",   score: 18,  max: 30,  grade: "C+", date: "Apr 5",  pass: true },
  { test: "Chapter 2 Mini Test",     course: "O Level Math",   score: 14,  max: 20,  grade: "B+", date: "Apr 1",  pass: true },
];

const activeCourses = [
  { name: "O Level Mathematics (0580)", progress: 45, done: 11, total: 24, next: "Trigonometry — Lesson 12", color: "bg-indigo-500" },
  { name: "A Level Pure Maths (9709)",  progress: 28, done: 9,  total: 32, next: "Integration by Parts",     color: "bg-purple-500" },
  { name: "O Level Add. Maths (0606)",  progress: 60, done: 11, total: 18, next: "Permutations & Combos",    color: "bg-emerald-500"},
];

const attendanceData = [
  { month: "Jan", pct: 92 }, { month: "Feb", pct: 88 },
  { month: "Mar", pct: 95 }, { month: "Apr", pct: 90 },
];

/* ── helpers ─────────────────────────────────────────────── */

function gradeColor(g: string) {
  if (g.startsWith("A")) return "text-emerald-600 bg-emerald-50";
  if (g.startsWith("B")) return "text-blue-600 bg-blue-50";
  return "text-amber-600 bg-amber-50";
}

function priorityBadge(p: string) {
  if (p === "high")   return "bg-red-100 text-red-600";
  if (p === "medium") return "bg-amber-100 text-amber-600";
  return "bg-slate-100 text-slate-500";
}

const navItems = [
  { icon: "🏠", label: "Dashboard",   href: "/dashboard/student",   active: true  },
  { icon: "🎬", label: "My Courses",  href: "/courses",             active: false },
  { icon: "📋", label: "Assignments", href: "#assignments",          active: false },
  { icon: "📊", label: "Results",     href: "#results",             active: false },
  { icon: "📄", label: "Past Papers", href: "/past-papers",         active: false },
  { icon: "🤖", label: "AI Solver",   href: "/ai-solver",           active: false },
];

/* ── component ───────────────────────────────────────────── */

export default function DashboardUI({ name, level, email }: { name: string; level: string; email: string }) {
  const router = useRouter();
  const [tab,         setTab]         = useState<"pending" | "completed">("pending");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const displayLevel = level.replace("_", " ").toUpperCase();
  const avgScore     = Math.round(recentResults.reduce((s, r) => s + (r.score / r.max) * 100, 0) / recentResults.length);
  const attendance   = Math.round(attendanceData.reduce((s, d) => s + d.pct, 0) / attendanceData.length);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const maxWeekly = Math.max(...weeklyScores.map(d => d.score));

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* ── Sidebar ────────────────────────────────────────── */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 flex flex-col transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0 lg:flex
      `}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-800">
          <Image src="/logo.png" alt="IH Mathematics" width={36} height={36} className="object-contain" />
          <div>
            <p className="font-bold text-white text-sm leading-tight">IH <span className="text-yellow-400">Mathematics</span></p>
            <p className="text-slate-400 text-xs">{displayLevel}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ icon, label, href, active }) => (
            <Link key={label} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/40"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <span className="text-base">{icon}</span> {label}
            </Link>
          ))}
        </nav>

        {/* User card */}
        <div className="px-3 py-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-800 mb-2">
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {name[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{name}</p>
              <p className="text-slate-400 text-xs truncate">{email}</p>
            </div>
          </div>
          {email === "mr.habibiqbal@gmail.com" && (
            <Link
              href="/dashboard/admin"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 text-sm font-medium transition-colors mb-1"
            >
              <span>⚙️</span> Admin Panel
            </Link>
          )}
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 text-sm transition-colors"
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main content ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="bg-white border-b border-slate-100 px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
            >
              ☰
            </button>
            <div>
              <h1 className="text-base font-bold text-slate-900">Student Dashboard</h1>
              <p className="text-xs text-slate-400 hidden sm:block">Welcome back, {name.split(" ")[0]}!</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/ai-solver"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-semibold hover:bg-indigo-100 transition-colors"
            >
              🤖 AI Solver
            </Link>
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-base cursor-pointer">🔔</div>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                {pendingAssignments.length}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              {name[0].toUpperCase()}
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">

          {/* Welcome banner */}
          <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl p-5 sm:p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-indigo-200 text-sm mb-1">Good day 👋</p>
              <h2 className="text-xl sm:text-2xl font-bold mb-1">Hello, {name.split(" ")[0]}!</h2>
              <p className="text-indigo-200 text-sm">
                You have <span className="text-white font-bold">{pendingAssignments.length} pending assignments</span>. Keep pushing!
              </p>
            </div>
            <div className="flex gap-3">
              <div className="text-center bg-white/10 rounded-xl px-4 py-3">
                <p className="text-2xl font-bold">{avgScore}%</p>
                <p className="text-indigo-200 text-xs">Avg Score</p>
              </div>
              <div className="text-center bg-white/10 rounded-xl px-4 py-3">
                <p className="text-2xl font-bold">{attendance}%</p>
                <p className="text-indigo-200 text-xs">Attendance</p>
              </div>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { label: "Courses Enrolled",    value: activeCourses.length,             icon: "🎬", color: "text-indigo-600", bg: "bg-indigo-50",  sub: "Active this term"    },
              { label: "Assignments Done",    value: completedAssignments.length,       icon: "✅", color: "text-emerald-600",bg: "bg-emerald-50", sub: "Out of " + (completedAssignments.length + pendingAssignments.length) },
              { label: "Average Score",       value: avgScore + "%",                   icon: "📊", color: "text-purple-600", bg: "bg-purple-50",  sub: "Across all subjects"  },
              { label: "Attendance Rate",     value: attendance + "%",                 icon: "📅", color: "text-amber-600",  bg: "bg-amber-50",   sub: "Last 4 months"        },
            ].map(({ label, value, icon, color, bg, sub }) => (
              <div key={label} className="bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center text-xl mb-3`}>{icon}</div>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-xs font-semibold text-slate-700 mt-1">{label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid lg:grid-cols-2 gap-6">

            {/* Weekly performance chart */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-slate-900">Weekly Performance</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Score trend this week</p>
                </div>
                <span className="text-xs bg-indigo-50 text-indigo-600 font-semibold px-2.5 py-1 rounded-lg">This Week</span>
              </div>
              <div className="flex items-end gap-2 h-32">
                {weeklyScores.map(({ day, score }) => (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-500">{score}</span>
                    <div className="w-full rounded-t-lg bg-indigo-100 relative overflow-hidden" style={{ height: "80px" }}>
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all"
                        style={{ height: `${(score / maxWeekly) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">{day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subject performance */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-slate-900">Subject Performance</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Score by topic area</p>
                </div>
                <span className="text-xs bg-emerald-50 text-emerald-600 font-semibold px-2.5 py-1 rounded-lg">All Topics</span>
              </div>
              <div className="space-y-3.5">
                {subjectPerformance.map(({ name: subj, score, color }) => (
                  <div key={subj}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-slate-700">{subj}</span>
                      <span className={`text-xs font-bold ${score >= 80 ? "text-emerald-600" : score >= 65 ? "text-amber-600" : "text-red-500"}`}>
                        {score}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Assignments + Courses row */}
          <div className="grid lg:grid-cols-5 gap-6">

            {/* Assignments (wider) */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100" id="assignments">
              <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-50">
                <h3 className="font-bold text-slate-900">Assignments</h3>
                <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
                  <button onClick={() => setTab("pending")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${tab === "pending" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    Pending <span className="ml-1 bg-red-100 text-red-600 rounded-full px-1.5">{pendingAssignments.length}</span>
                  </button>
                  <button onClick={() => setTab("completed")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${tab === "completed" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    Done <span className="ml-1 bg-emerald-100 text-emerald-600 rounded-full px-1.5">{completedAssignments.length}</span>
                  </button>
                </div>
              </div>

              <div className="divide-y divide-slate-50">
                {tab === "pending"
                  ? pendingAssignments.map(({ id, title, course, due, priority, marks }) => (
                      <div key={id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                        <div className={`mt-0.5 w-2.5 h-2.5 rounded-full shrink-0 ${priority === "high" ? "bg-red-500" : priority === "medium" ? "bg-amber-400" : "bg-slate-300"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{title}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{course} · {marks} marks</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${priorityBadge(priority)}`}>
                            {due}
                          </span>
                        </div>
                      </div>
                    ))
                  : completedAssignments.map(({ id, title, course, scored, marks, date, grade }) => (
                      <div key={id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                        <span className="mt-0.5 text-emerald-500 text-base shrink-0">✓</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{title}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{course} · {date}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-slate-500">{scored}/{marks}</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${gradeColor(grade)}`}>{grade}</span>
                        </div>
                      </div>
                    ))
                }
              </div>
            </div>

            {/* Active courses (narrower) */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100">
              <div className="px-5 pt-5 pb-4 border-b border-slate-50">
                <h3 className="font-bold text-slate-900">My Courses</h3>
                <p className="text-xs text-slate-400 mt-0.5">Current progress</p>
              </div>
              <div className="divide-y divide-slate-50">
                {activeCourses.map(({ name: cname, progress, done, total, next, color }) => (
                  <div key={cname} className="px-5 py-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold text-slate-800 leading-snug">{cname}</p>
                      <span className="text-xs font-bold text-indigo-600">{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                      <div className={`h-full ${color} rounded-full`} style={{ width: `${progress}%` }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-slate-400">{done}/{total} lessons</p>
                      <p className="text-[10px] text-indigo-500 font-medium truncate max-w-[100px]">▶ {next}</p>
                    </div>
                  </div>
                ))}
                <div className="px-5 py-3">
                  <Link href="/courses"
                    className="block text-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 py-2 rounded-xl hover:bg-indigo-50 transition-colors"
                  >
                    Browse more courses →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recent results table */}
          <div className="bg-white rounded-2xl border border-slate-100" id="results">
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-50">
              <div>
                <h3 className="font-bold text-slate-900">Recent Results</h3>
                <p className="text-xs text-slate-400 mt-0.5">Your latest test and exam scores</p>
              </div>
              <span className="text-xs bg-purple-50 text-purple-600 font-semibold px-2.5 py-1 rounded-lg">Last 30 days</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-50">
                    {["Test / Exam", "Course", "Score", "Grade", "Date", "Status"].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentResults.map(({ test, course, score, max, grade, date, pass }) => (
                    <tr key={test} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 text-sm font-semibold text-slate-800">{test}</td>
                      <td className="px-5 py-3.5 text-xs text-slate-500">{course}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-800">{score}<span className="text-slate-400 font-normal">/{max}</span></span>
                          <div className="flex-1 hidden sm:block">
                            <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${score / max >= 0.8 ? "bg-emerald-500" : score / max >= 0.6 ? "bg-amber-400" : "bg-red-400"}`}
                                style={{ width: `${(score / max) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${gradeColor(grade)}`}>{grade}</span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-400">{date}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${pass ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                          {pass ? "Pass" : "Fail"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Attendance + Quick actions row */}
          <div className="grid sm:grid-cols-2 gap-6 pb-4">

            {/* Attendance */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-1">Monthly Attendance</h3>
              <p className="text-xs text-slate-400 mb-5">Your class participation rate</p>
              <div className="flex items-end gap-3 h-24">
                {attendanceData.map(({ month, pct }) => (
                  <div key={month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-500">{pct}%</span>
                    <div className="w-full bg-slate-100 rounded-t-lg" style={{ height: "64px" }}>
                      <div
                        className={`w-full rounded-t-lg transition-all ${pct >= 90 ? "bg-emerald-500" : pct >= 75 ? "bg-amber-400" : "bg-red-400"}`}
                        style={{ height: `${pct}%`, marginTop: `${100 - pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">{month}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="text-2xl font-bold text-emerald-600">{attendance}%</span>
                <span className="text-slate-400 text-xs">Overall attendance — Excellent</span>
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-1">Quick Actions</h3>
              <p className="text-xs text-slate-400 mb-4">Jump to the tools you use most</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: "🤖", label: "AI Math Solver",  href: "/ai-solver",   color: "bg-purple-50 hover:bg-purple-100 text-purple-700" },
                  { icon: "📄", label: "Past Papers",      href: "/past-papers", color: "bg-emerald-50 hover:bg-emerald-100 text-emerald-700" },
                  { icon: "🎬", label: "Watch a Lesson",   href: "/courses",     color: "bg-blue-50 hover:bg-blue-100 text-blue-700" },
                  { icon: "📊", label: "View All Results", href: "#results",     color: "bg-indigo-50 hover:bg-indigo-100 text-indigo-700" },
                ].map(({ icon, label, href, color }) => (
                  <Link key={label} href={href}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl text-center text-xs font-semibold transition-colors ${color}`}
                  >
                    <span className="text-2xl">{icon}</span>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
