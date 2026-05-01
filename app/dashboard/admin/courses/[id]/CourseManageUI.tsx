"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { type Course } from "@/lib/courses-data";
import LessonEditor from "./LessonEditor";

/* ─── Derived mock data helpers ─────────────────────────────── */

function buildLessons(course: Course) {
  return course.curriculum.flatMap((section, si) =>
    section.lessons.map((title, li) => {
      const order = si * 100 + li + 1;
      const isPublished = si === 0 || (si === 1 && li < 2);
      const isDraft     = !isPublished && si < 3;
      return {
        id:       `${si}-${li}`,
        section:  section.section,
        title,
        order,
        duration: `${5 + ((li * 3 + si * 7) % 20)} min`,
        status:   isPublished ? "Published" : isDraft ? "Draft" : "Locked",
        views:    isPublished ? Math.max(50, 340 - li * 40 - si * 30) : 0,
      };
    }),
  );
}

const ENROLLED_STUDENTS = [
  { studentId: "IH-0001", name: "Tasnim Rahman", email: "tasnim@example.com", enrolled: "15 Jan 2026", completed: 18, avgScore: 87, lastActive: "2 hours ago",  status: "Active"   },
  { studentId: "IH-0002", name: "Arfan Hossain", email: "arfan@example.com",  enrolled: "22 Jan 2026", completed: 24, avgScore: 94, lastActive: "Yesterday",    status: "Active"   },
  { studentId: "IH-0003", name: "Nusrat Jahan",  email: "nusrat@example.com", enrolled: "3 Feb 2026",  completed: 12, avgScore: 72, lastActive: "3 days ago",   status: "Active"   },
  { studentId: "IH-0004", name: "Sakib Ahmed",   email: "sakib@example.com",  enrolled: "10 Feb 2026", completed: 20, avgScore: 88, lastActive: "5 hours ago",  status: "Active"   },
  { studentId: "IH-0005", name: "Mita Akter",    email: "mita@example.com",   enrolled: "18 Feb 2026", completed: 6,  avgScore: 63, lastActive: "1 week ago",   status: "Inactive" },
  { studentId: "IH-0006", name: "Rahat Khan",    email: "rahat@example.com",  enrolled: "1 Mar 2026",  completed: 15, avgScore: 79, lastActive: "Today",        status: "Active"   },
  { studentId: "IH-0007", name: "Sadia Islam",   email: "sadia@example.com",  enrolled: "5 Mar 2026",  completed: 22, avgScore: 91, lastActive: "1 hour ago",   status: "Active"   },
  { studentId: "IH-0008", name: "Rahim Uddin",   email: "rahim@example.com",  enrolled: "12 Mar 2026", completed: 9,  avgScore: 68, lastActive: "4 days ago",   status: "Active"   },
  { studentId: "IH-0009", name: "Fariha Begum",  email: "fariha@example.com", enrolled: "20 Mar 2026", completed: 3,  avgScore: 55, lastActive: "2 weeks ago",  status: "Inactive" },
  { studentId: "IH-0010", name: "Jahid Hassan",  email: "jahid@example.com",  enrolled: "28 Mar 2026", completed: 17, avgScore: 82, lastActive: "3 hours ago",  status: "Active"   },
];

const MONTHLY_ENROLL = [
  { month: "Nov", count: 18 },
  { month: "Dec", count: 24 },
  { month: "Jan", count: 41 },
  { month: "Feb", count: 53 },
  { month: "Mar", count: 39 },
  { month: "Apr", count: 47 },
];

const SCORE_DIST = [
  { range: "90-100", count: 2, color: "bg-emerald-500" },
  { range: "80-89",  count: 3, color: "bg-indigo-500"  },
  { range: "70-79",  count: 2, color: "bg-blue-400"    },
  { range: "60-69",  count: 2, color: "bg-amber-400"   },
  { range: "<60",    count: 1, color: "bg-red-400"      },
];

const ACTIVITY = [
  { student: "Sadia Islam",   action: "Completed lesson 22/24",      time: "1 hour ago"  },
  { student: "Jahid Hassan",  action: "Scored 89% on Topic Quiz 3",  time: "3 hours ago" },
  { student: "Tasnim Rahman", action: "Resumed lesson 18",           time: "5 hours ago" },
  { student: "Sakib Ahmed",   action: "Downloaded Paper 2 2023",     time: "Yesterday"   },
  { student: "Rahat Khan",    action: "Completed lesson 15/24",      time: "Today"       },
];

type Tab = "overview" | "students" | "lessons" | "settings";

const navItems = [
  { label: "Overview",    href: "/dashboard/admin",                icon: "🏠" },
  { label: "Students",    href: "/dashboard/admin#students",       icon: "👤" },
  { label: "Courses",     href: "/dashboard/admin#courses",        icon: "📚" },
  { label: "Promo Codes", href: "/dashboard/admin/promo-codes",    icon: "🏷️" },
  { label: "Papers",      href: "/past-papers",                    icon: "📄" },
  { label: "Settings",    href: "#",                               icon: "⚙️" },
];

/* ─── Main component ────────────────────────────────────────── */

export default function CourseManageUI({ course }: { course: Course }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab]     = useState<Tab>("overview");
  const [search, setSearch]           = useState("");
  const [courseStatus, setCourseStatus] = useState(
    course.tag === "Coming Soon" ? "Draft" : "Published",
  );

  /* ── Students / remove ─────────────────────────────────────── */
  const [students,      setStudents]      = useState(ENROLLED_STUDENTS);
  const [removeConfirm, setRemoveConfirm] = useState<string | null>(null); // email
  const [realStudentsLoaded, setRealStudentsLoaded] = useState(false);

  /* ── Lesson editor ─────────────────────────────────────────── */
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);

  /* ── Pricing state ─────────────────────────────────────────── */
  const [accessType,    setAccessType]    = useState<"free" | "paid" | "preview">("free");
  const [price,         setPrice]         = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [billingPeriod, setBillingPeriod] = useState<"month" | "year" | "once">("month");
  const [previewLessons,setPreviewLessons]= useState(3);
  const [pricingSaving, setPricingSaving] = useState(false);
  const [pricingMsg,    setPricingMsg]    = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showSql,       setShowSql]       = useState(false);

  const router = useRouter();
  const lessons = buildLessons(course);

  const totalLessons  = course.curriculum.reduce((s, sec) => s + sec.lessons.length, 0);
  const avgScore      = students.length ? Math.round(students.reduce((s, st) => s + st.avgScore, 0) / students.length) : 0;
  const avgCompletion = students.length ? Math.round(students.reduce((s, st) => s + (st.completed / totalLessons) * 100, 0) / students.length) : 0;
  const activeCount   = students.filter((s) => s.status === "Active").length;

  /* ── Load real students when Students tab opens ───────────── */
  useEffect(() => {
    if (activeTab !== "students" || realStudentsLoaded) return;
    async function loadStudents() {
      const supabase = createClient();
      const { data } = await supabase
        .from("enrollments")
        .select("user_id, enrolled_at, profiles(student_id, full_name, email)")
        .eq("course_id", course.id)
        .eq("is_active", true);
      if (data && data.length > 0) {
        const mapped = data.map((row: Record<string, unknown>, i: number) => {
          // Supabase returns foreign-table joins as arrays
          const profileArr = row.profiles as { student_id: string; full_name: string; email: string }[] | null;
          const profile    = Array.isArray(profileArr) ? profileArr[0] : profileArr;
          return {
            studentId:  profile?.student_id ?? `IH-???${i}`,
            name:       profile?.full_name  ?? "Unknown Student",
            email:      profile?.email      ?? (row.user_id as string),
            enrolled:   new Date(row.enrolled_at as string).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
            completed:  0,
            avgScore:   0,
            lastActive: "—",
            status:     "Active",
            userId:     row.user_id as string,
          };
        });
        setStudents(mapped as typeof ENROLLED_STUDENTS);
        setRealStudentsLoaded(true);
      }
    }
    loadStudents();
  }, [activeTab, course.id, realStudentsLoaded]);

  /* ── Load pricing from Supabase when Settings tab opens ───── */
  useEffect(() => {
    if (activeTab !== "settings") return;
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("course_settings")
        .select("*")
        .eq("course_id", course.id)
        .single();
      if (data) {
        setAccessType(data.access_type ?? "free");
        setPrice(data.price ?? 0);
        setOriginalPrice(data.original_price ?? 0);
        setBillingPeriod(data.billing_period ?? "month");
        setPreviewLessons(data.preview_lessons ?? 3);
      }
    }
    load();
  }, [activeTab, course.id]);

  /* ── Save pricing to Supabase ─────────────────────────────── */
  async function savePricing() {
    setPricingSaving(true);
    setPricingMsg(null);
    setShowSql(false);
    const supabase = createClient();
    const { error } = await supabase.from("course_settings").upsert({
      course_id:      course.id,
      access_type:    accessType,
      price,
      original_price: originalPrice,
      billing_period: billingPeriod,
      currency:       "BDT",
      preview_lessons: previewLessons,
      updated_at:     new Date().toISOString(),
    });
    setPricingSaving(false);
    if (error) {
      setPricingMsg({ type: "error", text: "Could not save. Create the table first (see SQL below)." });
      setShowSql(true);
    } else {
      setPricingMsg({ type: "success", text: "Pricing saved successfully!" });
    }
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const filteredStudents = students.filter((s) =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.studentId.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <>
        {sidebarOpen && (
          <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
        <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-900 flex flex-col transform transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700">
            <Image src="/logo.png" alt="IH Mathematics" width={36} height={36} className="object-contain" />
            <div>
              <p className="font-bold text-white text-sm">IH Mathematics</p>
              <p className="text-xs text-amber-400 font-medium">Admin Panel</p>
            </div>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map(({ label, href, icon }) => (
              <Link key={label} href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-sm font-medium" onClick={() => setSidebarOpen(false)}>
                <span className="text-base">{icon}</span>{label}
              </Link>
            ))}
            <div className="border-t border-slate-700 my-2" />
            <Link href="/dashboard/student" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors text-sm">
              <span>👁️</span> View Student Side
            </Link>
          </nav>
          <div className="px-4 py-4 border-t border-slate-700">
            <button onClick={handleLogout} className="w-full px-3 py-2 rounded-lg bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-400 text-sm transition-colors text-left">
              Sign out
            </button>
          </div>
        </aside>
      </>

      {/* ── Main ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex items-center gap-3 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-400 min-w-0">
            <Link href="/dashboard/admin" className="hover:text-indigo-600 transition-colors shrink-0">Admin</Link>
            <span>/</span>
            <Link href="/dashboard/admin#courses" className="hover:text-indigo-600 transition-colors shrink-0">Courses</Link>
            <span>/</span>
            <span className="text-slate-700 font-medium truncate">{course.title}</span>
          </nav>

          <div className="ml-auto flex items-center gap-2 shrink-0">
            {/* Status toggle */}
            <select
              value={courseStatus}
              onChange={(e) => setCourseStatus(e.target.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${
                courseStatus === "Published"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-amber-50 border-amber-200 text-amber-700"
              }`}
            >
              <option value="Published">● Published</option>
              <option value="Draft">○ Draft</option>
            </select>

            <Link
              href={`/courses/${course.id}`}
              target="_blank"
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Preview ↗
            </Link>
          </div>
        </header>

        {/* Course hero banner */}
        <div className={`bg-gradient-to-r from-slate-900 to-indigo-900 px-4 sm:px-6 py-5 shrink-0`}>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${course.bg} flex items-center justify-center text-2xl font-bold text-slate-400/70 shrink-0`}>
              {course.symbol}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${course.badgeColor}`}>{course.badge}</span>
              </div>
              <h1 className="text-white font-bold text-lg leading-tight truncate">{course.title}</h1>
              <p className="text-indigo-300 text-sm">{course.subtitle} · {course.instructor}</p>
            </div>

            {/* Stats pills */}
            <div className="hidden md:flex items-center gap-3 ml-auto shrink-0">
              {[
                { value: ENROLLED_STUDENTS.length, label: "Students", icon: "👤" },
                { value: `${avgScore}%`,  label: "Avg Score",   icon: "📊" },
                { value: `${avgCompletion}%`, label: "Completion", icon: "✅" },
                { value: totalLessons,    label: "Lessons",     icon: "📹" },
              ].map(({ value, label, icon }) => (
                <div key={label} className="bg-white/10 rounded-xl px-3 py-2 text-center border border-white/10 min-w-[72px]">
                  <p className="text-white font-bold text-sm">{icon} {value}</p>
                  <p className="text-indigo-300 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 shrink-0">
          <div className="flex gap-0">
            {(["overview", "students", "lessons", "settings"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3.5 text-sm font-medium capitalize border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">

          {/* ── OVERVIEW TAB ─────────────────────────────────── */}
          {activeTab === "overview" && (
            <div className="space-y-6">

              {/* Mobile stats */}
              <div className="grid grid-cols-2 md:hidden gap-3">
                {[
                  { value: ENROLLED_STUDENTS.length, label: "Enrolled",   color: "bg-blue-50 text-blue-700"    },
                  { value: `${avgScore}%`,           label: "Avg Score",  color: "bg-indigo-50 text-indigo-700" },
                  { value: `${avgCompletion}%`,      label: "Completion", color: "bg-emerald-50 text-emerald-700" },
                  { value: activeCount,              label: "Active",     color: "bg-purple-50 text-purple-700" },
                ].map(({ value, label, color }) => (
                  <div key={label} className={`rounded-xl p-4 ${color} text-center`}>
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="text-xs font-medium mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">

                {/* Monthly enrollment chart */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5">
                  <h2 className="font-bold text-slate-900 mb-1">Monthly Enrollments</h2>
                  <p className="text-xs text-slate-400 mb-5">New students per month</p>
                  <div className="flex items-end gap-2 h-28">
                    {MONTHLY_ENROLL.map(({ month, count }) => {
                      const max = Math.max(...MONTHLY_ENROLL.map((d) => d.count));
                      return (
                        <div key={month} className="flex-1 flex flex-col items-center gap-1">
                          <span className="text-xs font-bold text-indigo-600">{count}</span>
                          <div className="w-full rounded-t-md bg-indigo-500" style={{ height: `${(count / max) * 100}%` }} />
                          <span className="text-xs text-slate-400">{month}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Score distribution */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5">
                  <h2 className="font-bold text-slate-900 mb-1">Score Distribution</h2>
                  <p className="text-xs text-slate-400 mb-5">How students are performing</p>
                  {SCORE_DIST.map(({ range, count, color }) => (
                    <div key={range} className="flex items-center gap-3 mb-2.5">
                      <span className="text-xs text-slate-500 w-14 shrink-0">{range}%</span>
                      <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${color}`}
                          style={{ width: `${(count / ENROLLED_STUDENTS.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 w-16 text-right">
                        {count} student{count !== 1 ? "s" : ""}
                      </span>
                    </div>
                  ))}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500">
                    <span>Class average: <span className="font-bold text-slate-800">{avgScore}%</span></span>
                    <span>Pass rate: <span className="font-bold text-emerald-600">90%</span></span>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">

                {/* Recent activity */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5">
                  <h2 className="font-bold text-slate-900 mb-4">Recent Activity</h2>
                  <ul className="space-y-3">
                    {ACTIVITY.map(({ student, action, time }) => (
                      <li key={student + time} className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {student.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800">{student}</p>
                          <p className="text-xs text-slate-500 truncate">{action}</p>
                        </div>
                        <span className="text-xs text-slate-400 shrink-0 whitespace-nowrap">{time}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Needs attention */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5">
                  <h2 className="font-bold text-slate-900 mb-1">Needs Attention</h2>
                  <p className="text-xs text-slate-400 mb-4">Students scoring below 70%</p>
                  <ul className="space-y-3">
                    {ENROLLED_STUDENTS.filter((s) => s.avgScore < 70)
                      .sort((a, b) => a.avgScore - b.avgScore)
                      .map((s) => (
                        <li key={s.email} className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center shrink-0">
                            {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800">{s.name}</p>
                            <p className="text-xs text-slate-500">Last active: {s.lastActive}</p>
                          </div>
                          <span className="text-sm font-bold text-red-500">{s.avgScore}%</span>
                        </li>
                      ))}
                    {ENROLLED_STUDENTS.filter((s) => s.avgScore < 70).length === 0 && (
                      <p className="text-sm text-slate-400 text-center py-4">All students performing well ✓</p>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ── STUDENTS TAB ─────────────────────────────────── */}
          {activeTab === "students" && (
            <div className="space-y-4">
              {/* Search + export */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  />
                </div>
                <span className="text-sm text-slate-400">{filteredStudents.length} students</span>
                <button className="ml-auto px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-colors">
                  Export CSV
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3 text-left">ID</th>
                        <th className="px-4 py-3 text-left">Student</th>
                        <th className="px-4 py-3 text-left hidden md:table-cell">Enrolled</th>
                        <th className="px-4 py-3 text-left">Progress</th>
                        <th className="px-4 py-3 text-left">Avg Score</th>
                        <th className="px-4 py-3 text-left hidden sm:table-cell">Last Active</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredStudents.map((s) => {
                        const pct = Math.round((s.completed / totalLessons) * 100);

                        /* Inline removal confirmation */
                        if (removeConfirm === s.email) {
                          return (
                            <tr key={s.email} className="bg-red-50 border-l-4 border-red-400">
                              <td colSpan={8} className="px-5 py-4">
                                <div className="flex items-center flex-wrap gap-3">
                                  <span className="text-sm text-slate-700 flex-1">
                                    Remove <strong>{s.name}</strong>{" "}
                                    <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600">{s.studentId}</code>{" "}
                                    from this course?
                                  </span>
                                  <button
                                    onClick={() => {
                                      setStudents((p) => p.filter((st) => st.email !== s.email));
                                      setRemoveConfirm(null);
                                    }}
                                    className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors"
                                  >
                                    Yes, Remove
                                  </button>
                                  <button
                                    onClick={() => setRemoveConfirm(null)}
                                    className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-white transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        }

                        return (
                          <tr key={s.email} className="hover:bg-slate-50/50 transition-colors">
                            {/* Student ID */}
                            <td className="px-4 py-3.5">
                              <code className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100">
                                {s.studentId}
                              </code>
                            </td>

                            {/* Name + email */}
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">
                                  {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-slate-800 whitespace-nowrap">{s.name}</p>
                                  <p className="text-xs text-slate-400 hidden sm:block">{s.email}</p>
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-3.5 hidden md:table-cell text-sm text-slate-500 whitespace-nowrap">{s.enrolled}</td>

                            {/* Progress */}
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-2.5 min-w-[110px]">
                                <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${pct >= 90 ? "bg-emerald-500" : pct >= 60 ? "bg-indigo-500" : "bg-amber-400"}`}
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <span className="text-xs text-slate-500 shrink-0">{s.completed}/{totalLessons}</span>
                              </div>
                            </td>

                            {/* Score */}
                            <td className="px-4 py-3.5">
                              <span className={`text-sm font-bold ${s.avgScore >= 80 ? "text-emerald-600" : s.avgScore >= 65 ? "text-slate-700" : "text-red-500"}`}>
                                {s.avgScore}%
                              </span>
                            </td>

                            <td className="px-4 py-3.5 hidden sm:table-cell text-sm text-slate-500 whitespace-nowrap">{s.lastActive}</td>

                            {/* Status */}
                            <td className="px-4 py-3.5">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${s.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                                {s.status}
                              </span>
                            </td>

                            {/* Remove */}
                            <td className="px-4 py-3.5">
                              <button
                                onClick={() => setRemoveConfirm(s.email)}
                                className="text-xs text-red-400 hover:text-red-600 hover:underline font-semibold transition-colors whitespace-nowrap"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── LESSONS TAB ──────────────────────────────────── */}
          {activeTab === "lessons" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{totalLessons} lessons in {course.curriculum.length} sections</p>
                <button className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-colors">
                  + Add Lesson
                </button>
              </div>

              {course.curriculum.map((section, si) => (
                <div key={section.section} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                  {/* Section header */}
                  <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">
                        {si + 1}
                      </span>
                      <h3 className="font-semibold text-slate-800 text-sm">{section.section}</h3>
                    </div>
                    <span className="text-xs text-slate-400">{section.lessons.length} lessons</span>
                  </div>

                  {/* Lessons list */}
                  <div>
                    {lessons
                      .filter((l) => l.section === section.section)
                      .map((lesson, li) => (
                        <div key={lesson.id} className="border-b border-slate-50 last:border-0">
                          {/* Lesson row */}
                          <div className={`flex items-center gap-3 px-5 py-3 transition-colors ${expandedLesson === lesson.id ? "bg-indigo-50/60" : "hover:bg-slate-50/50"}`}>
                            {/* Drag handle */}
                            <svg className="w-4 h-4 text-slate-300 shrink-0 cursor-grab" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 4h1v1H9V4zm0 4h1v1H9V8zm0 4h1v1H9v-1zm0 4h1v1H9v-1zm5-12h1v1h-1V4zm0 4h1v1h-1V8zm0 4h1v1h-1v-1zm0 4h1v1h-1v-1z"/>
                            </svg>

                            {/* Lesson number */}
                            <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 text-xs flex items-center justify-center shrink-0 font-medium">
                              {si * 100 + li + 1}
                            </span>

                            {/* Play icon */}
                            <svg className="w-4 h-4 text-slate-300 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>

                            {/* Title */}
                            <span className="flex-1 text-sm text-slate-700 font-medium truncate min-w-0">
                              {lesson.title}
                            </span>

                            {/* Content pills */}
                            <div className="hidden lg:flex items-center gap-1.5 shrink-0">
                              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-400">📹 Lecture</span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-400">📚 Material</span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-400">📝 Assignment</span>
                            </div>

                            {/* Duration */}
                            <span className="text-xs text-slate-400 shrink-0 hidden sm:block">{lesson.duration}</span>

                            {/* Views */}
                            <span className="text-xs text-slate-400 shrink-0 hidden md:flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {lesson.views > 0 ? `${lesson.views}` : "—"}
                            </span>

                            {/* Status badge */}
                            <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              lesson.status === "Published" ? "bg-emerald-100 text-emerald-700" :
                              lesson.status === "Draft"     ? "bg-amber-100 text-amber-700" :
                              "bg-slate-100 text-slate-500"
                            }`}>
                              {lesson.status}
                            </span>

                            {/* Actions */}
                            <div className="shrink-0 flex gap-2">
                              <button
                                onClick={() => setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)}
                                className={`text-xs font-semibold transition-colors ${
                                  expandedLesson === lesson.id
                                    ? "text-slate-500 hover:text-slate-700"
                                    : "text-indigo-600 hover:text-indigo-800"
                                }`}
                              >
                                {expandedLesson === lesson.id ? "Close" : "Edit"}
                              </button>
                              <button className="text-xs text-slate-400 hover:text-slate-600 font-medium hidden sm:block">
                                {lesson.status === "Published" ? "Unpublish" : "Publish"}
                              </button>
                            </div>
                          </div>

                          {/* Inline lesson editor */}
                          {expandedLesson === lesson.id && (
                            <LessonEditor
                              lesson={lesson}
                              onClose={() => setExpandedLesson(null)}
                            />
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── SETTINGS TAB ─────────────────────────────────── */}
          {activeTab === "settings" && (
            <div className="max-w-2xl space-y-6">

              {/* ── Course Details ──────────────────────────────── */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
                <h2 className="font-bold text-slate-900">Course Details</h2>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Course Title</label>
                  <input
                    defaultValue={course.title}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Subtitle</label>
                  <input
                    defaultValue={course.subtitle}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Level</label>
                    <select defaultValue={course.category} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                      <option>O Level</option>
                      <option>A Level</option>
                      <option>GRE</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Difficulty</label>
                    <select defaultValue={course.level} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                      <option>Beginner – Intermediate</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                      <option>Intermediate – Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Short Description</label>
                  <textarea defaultValue={course.desc} rows={2} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Description</label>
                  <textarea defaultValue={course.longDesc} rows={4} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
                </div>

                <div className="flex gap-3 pt-1">
                  <button className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all">
                    Save Details
                  </button>
                  <button className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all">
                    Discard
                  </button>
                </div>
              </div>

              {/* ── Pricing ─────────────────────────────────────── */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-slate-900">Pricing</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Controls what students pay to access this course</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full font-medium border border-indigo-100">
                    Saved to database
                  </span>
                </div>

                {/* Access type selector */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2.5">Access Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "free",    icon: "🎁", label: "Free",         desc: "Open to all students"     },
                      { value: "paid",    icon: "💳", label: "Paid",         desc: "Payment required"          },
                      { value: "preview", icon: "👀", label: "Free Preview", desc: "First N lessons free"      },
                    ].map(({ value, icon, label, desc }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => { setAccessType(value as "free" | "paid" | "preview"); setPricingMsg(null); }}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-center transition-all ${
                          accessType === value
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                            : "border-slate-200 hover:border-slate-300 text-slate-600"
                        }`}
                      >
                        <span className="text-xl">{icon}</span>
                        <span className="text-xs font-bold">{label}</span>
                        <span className="text-xs text-slate-400 leading-tight">{desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price + billing — shown for paid & preview */}
                {accessType !== "free" && (
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Price */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          {accessType === "preview" ? "Full Price (after free lessons)" : "Price"}
                        </label>
                        <div className="flex">
                          <span className="px-3 py-2.5 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 text-slate-500 text-sm font-semibold">৳</span>
                          <input
                            type="number"
                            min={0}
                            value={price}
                            onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
                            className="flex-1 px-3 py-2.5 rounded-r-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      {/* Billing period */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Billing Period</label>
                        <select
                          value={billingPeriod}
                          onChange={(e) => setBillingPeriod(e.target.value as "month" | "year" | "once")}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        >
                          <option value="month">Per Month</option>
                          <option value="year">Per Year</option>
                          <option value="once">One-time Payment</option>
                        </select>
                      </div>
                    </div>

                    {/* Original / crossed-out price */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Original Price
                        <span className="ml-2 text-slate-400 font-normal text-xs">
                          optional — shows as ~~strikethrough~~ to highlight a discount
                        </span>
                      </label>
                      <div className="flex">
                        <span className="px-3 py-2.5 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 text-slate-500 text-sm font-semibold">৳</span>
                        <input
                          type="number"
                          min={0}
                          value={originalPrice}
                          onChange={(e) => setOriginalPrice(Math.max(0, Number(e.target.value)))}
                          placeholder="0 = no discount shown"
                          className="flex-1 px-3 py-2.5 rounded-r-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Free preview lesson count */}
                {accessType === "preview" && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Free Preview Lessons
                      <span className="ml-2 text-slate-400 font-normal text-xs">students can watch these without paying</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={totalLessons}
                      value={previewLessons}
                      onChange={(e) => setPreviewLessons(Math.min(totalLessons, Math.max(1, Number(e.target.value))))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      {previewLessons} of {totalLessons} lessons will be free
                    </p>
                  </div>
                )}

                {/* Live preview of the enrollment card price */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-xs font-medium text-slate-500 mb-3">Preview — enrollment card on course page:</p>
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      {accessType === "free" ? (
                        <>
                          <span className="text-2xl font-bold text-slate-900">Free</span>
                          <p className="text-xs text-emerald-600 font-medium mt-0.5">Full access — no payment needed</p>
                        </>
                      ) : (
                        <>
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-2xl font-bold text-slate-900">৳{price.toLocaleString()}</span>
                            <span className="text-sm text-slate-500">
                              / {billingPeriod === "month" ? "month" : billingPeriod === "year" ? "year" : "one-time"}
                            </span>
                            {originalPrice > price && (
                              <span className="text-sm text-slate-400 line-through">৳{originalPrice.toLocaleString()}</span>
                            )}
                          </div>
                          {originalPrice > price && (
                            <p className="text-xs text-emerald-600 font-semibold mt-0.5">
                              Save ৳{(originalPrice - price).toLocaleString()} ({Math.round((1 - price / originalPrice) * 100)}% off)
                            </p>
                          )}
                          {accessType === "preview" && (
                            <p className="text-xs text-indigo-600 font-medium mt-0.5">
                              First {previewLessons} lessons free to try
                            </p>
                          )}
                        </>
                      )}
                    </div>
                    <div className="shrink-0 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold">
                      {accessType === "free" ? "Enroll Free" : "Enroll Now"}
                    </div>
                  </div>
                </div>

                {/* Save pricing */}
                <div className="flex items-center gap-3 flex-wrap pt-1">
                  <button
                    type="button"
                    onClick={savePricing}
                    disabled={pricingSaving}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold text-sm transition-all flex items-center gap-2"
                  >
                    {pricingSaving ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Saving…
                      </>
                    ) : "Save Pricing"}
                  </button>
                  {pricingMsg && (
                    <p className={`text-sm font-medium ${pricingMsg.type === "success" ? "text-emerald-600" : "text-red-600"}`}>
                      {pricingMsg.type === "success" ? "✓" : "✗"} {pricingMsg.text}
                    </p>
                  )}
                </div>

                {/* SQL setup — shown only if save fails because table doesn't exist */}
                {showSql && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-bold text-amber-800">
                      📋 One-time setup: run this SQL in Supabase to create the pricing table
                    </p>
                    <pre className="text-xs bg-white border border-amber-100 rounded-lg p-3 overflow-x-auto text-slate-700 leading-relaxed whitespace-pre">{`CREATE TABLE IF NOT EXISTS course_settings (
  course_id       text PRIMARY KEY,
  access_type     text NOT NULL DEFAULT 'free',
  price           integer NOT NULL DEFAULT 0,
  original_price  integer NOT NULL DEFAULT 0,
  currency        text NOT NULL DEFAULT 'BDT',
  billing_period  text NOT NULL DEFAULT 'month',
  preview_lessons integer NOT NULL DEFAULT 0,
  updated_at      timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE course_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access" ON course_settings
  USING (true) WITH CHECK (true);`}</pre>
                    <p className="text-xs text-amber-700">
                      Go to: <span className="font-semibold">supabase.com → Your Project → SQL Editor → paste → Run</span>. Then click Save Pricing again.
                    </p>
                  </div>
                )}
              </div>

              {/* ── Visibility ──────────────────────────────────── */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
                <h2 className="font-bold text-slate-900">Visibility</h2>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-slate-800">Publication Status</p>
                    <p className="text-xs text-slate-400 mt-0.5">Controls whether students can see this course</p>
                  </div>
                  <select
                    value={courseStatus}
                    onChange={(e) => setCourseStatus(e.target.value)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Published">● Published</option>
                    <option value="Draft">○ Draft</option>
                  </select>
                </div>
              </div>

              {/* ── Danger zone ─────────────────────────────────── */}
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                <h3 className="font-semibold text-red-700 mb-1">Danger Zone</h3>
                <p className="text-xs text-red-500 mb-4">These actions are irreversible. Proceed with caution.</p>
                <button className="px-4 py-2 rounded-lg border border-red-300 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors">
                  Archive Course
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
