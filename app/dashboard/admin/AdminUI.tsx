"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/* ─── Mock data ─────────────────────────────────────────────── */

const stats = [
  { label: "Total Students",   value: "312",   delta: "+18 this month",  icon: "👤", color: "bg-blue-50 text-blue-600",    ring: "ring-blue-100" },
  { label: "Active Courses",   value: "6",     delta: "1 coming soon",    icon: "📚", color: "bg-purple-50 text-purple-600", ring: "ring-purple-100" },
  { label: "Papers Downloaded",value: "1,284", delta: "+247 this week",   icon: "📄", color: "bg-emerald-50 text-emerald-600", ring: "ring-emerald-100" },
  { label: "AI Queries",       value: "847",   delta: "+63 today",        icon: "🤖", color: "bg-orange-50 text-orange-600", ring: "ring-orange-100" },
];

const weeklySignups = [
  { day: "Mon", count: 4 },
  { day: "Tue", count: 7 },
  { day: "Wed", count: 3 },
  { day: "Thu", count: 9 },
  { day: "Fri", count: 12 },
  { day: "Sat", count: 6 },
  { day: "Sun", count: 2 },
];

const recentStudents = [
  { name: "Tasnim Rahman",  email: "tasnim@example.com",  level: "O Level",  joined: "2 hours ago",  status: "Active"   },
  { name: "Arfan Hossain",  email: "arfan@example.com",   level: "A Level",  joined: "5 hours ago",  status: "Active"   },
  { name: "Nusrat Jahan",   email: "nusrat@example.com",  level: "O Level",  joined: "Yesterday",    status: "Active"   },
  { name: "Sakib Ahmed",    email: "sakib@example.com",   level: "GRE",      joined: "2 days ago",   status: "Active"   },
  { name: "Mita Akter",     email: "mita@example.com",    level: "O Level",  joined: "3 days ago",   status: "Inactive" },
  { name: "Rahat Khan",     email: "rahat@example.com",   level: "A Level",  joined: "4 days ago",   status: "Active"   },
  { name: "Sadia Islam",    email: "sadia@example.com",   level: "O Level",  joined: "5 days ago",   status: "Active"   },
];

const courses = [
  { id: "o-level-math",      title: "Mathematics (0580)",         level: "O Level", students: 312, status: "Active",      lessons: 24 },
  { id: "o-level-add-math",  title: "Additional Mathematics",     level: "O Level", students: 189, status: "Active",      lessons: 18 },
  { id: "a-level-pure",      title: "Pure Mathematics 1 & 2",     level: "A Level", students: 156, status: "Active",      lessons: 32 },
  { id: "a-level-stats",     title: "Statistics 1 & 2",           level: "A Level", students: 98,  status: "Active",      lessons: 20 },
  { id: "a-level-mechanics", title: "Mechanics 1",                level: "A Level", students: 74,  status: "Coming Soon", lessons: 16 },
  { id: "gre-quant",         title: "GRE Quantitative Reasoning", level: "GRE",     students: 67,  status: "Active",      lessons: 28 },
];

const navItems = [
  { label: "Overview",  href: "/dashboard/admin",          icon: "🏠" },
  { label: "Students",  href: "/dashboard/admin#students", icon: "👤" },
  { label: "Courses",   href: "/dashboard/admin#courses",  icon: "📚" },
  { label: "Papers",    href: "/past-papers",              icon: "📄" },
  { label: "Settings",  href: "#",                         icon: "⚙️" },
];

const maxSignup = Math.max(...weeklySignups.map((d) => d.count));

/* ─── Component ─────────────────────────────────────────────── */

export default function AdminUI({ name, email }: { name: string; email: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <>
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-900 flex flex-col transform transition-transform duration-200 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700">
            <Image src="/logo.png" alt="IH Mathematics" width={36} height={36} className="object-contain" />
            <div>
              <p className="font-bold text-white text-sm">IH Mathematics</p>
              <p className="text-xs text-amber-400 font-medium">Admin Panel</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map(({ label, href, icon }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-sm font-medium"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="text-base">{icon}</span>
                {label}
              </Link>
            ))}

            <div className="border-t border-slate-700 my-2" />

            <Link
              href="/dashboard/student"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors text-sm"
            >
              <span>👁️</span> View Student Side
            </Link>
          </nav>

          {/* User */}
          <div className="px-4 py-4 border-t border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {name[0]?.toUpperCase() ?? "A"}
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-semibold truncate">{name}</p>
                <p className="text-slate-400 text-xs truncate">{email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-400 text-sm transition-colors text-left"
            >
              Sign out
            </button>
          </div>
        </aside>
      </>

      {/* ── Main ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex items-center gap-4 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div>
            <h1 className="text-lg font-bold text-slate-900">Admin Overview</h1>
            <p className="text-xs text-slate-400">IH Mathematics platform management</p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Platform Live
            </span>
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg text-sm text-indigo-600 font-medium hover:bg-indigo-50 transition-colors"
            >
              View Site
            </Link>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* ── Stats cards ────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(({ label, value, delta, icon, color, ring }) => (
              <div
                key={label}
                className={`bg-white rounded-2xl p-5 border border-slate-100 ring-1 ${ring}`}
              >
                <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center text-xl mb-3`}>
                  {icon}
                </div>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                <p className="text-xs text-emerald-600 font-medium mt-1">{delta}</p>
              </div>
            ))}
          </div>

          {/* ── Charts row ─────────────────────────────────── */}
          <div className="grid lg:grid-cols-2 gap-6">

            {/* Weekly signups bar chart */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h2 className="font-bold text-slate-900 mb-1">Weekly Signups</h2>
              <p className="text-xs text-slate-400 mb-5">New student registrations this week</p>
              <div className="flex items-end gap-2 h-32">
                {weeklySignups.map(({ day, count }) => (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-bold text-indigo-600">{count}</span>
                    <div
                      className="w-full rounded-t-md bg-indigo-500 transition-all"
                      style={{ height: `${(count / maxSignup) * 100}%` }}
                    />
                    <span className="text-xs text-slate-400">{day}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 text-right mt-3">
                Total this week: <span className="font-bold text-slate-700">{weeklySignups.reduce((s, d) => s + d.count, 0)}</span>
              </p>
            </div>

            {/* Enrollment distribution */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h2 className="font-bold text-slate-900 mb-1">Enrollment by Level</h2>
              <p className="text-xs text-slate-400 mb-5">Student distribution across levels</p>

              {[
                { label: "O Level",  count: 312 + 189, total: 996, color: "bg-blue-500" },
                { label: "A Level",  count: 156 + 98 + 74, total: 996, color: "bg-purple-500" },
                { label: "GRE",      count: 67, total: 996, color: "bg-emerald-500" },
              ].map(({ label, count, total, color }) => (
                <div key={label} className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-slate-700">{label}</span>
                    <span className="text-sm text-slate-500">{count} students ({Math.round(count / total * 100)}%)</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${color}`}
                      style={{ width: `${(count / total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Recent students ─────────────────────────────── */}
          <div id="students" className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-900">Recent Students</h2>
                <p className="text-xs text-slate-400">Latest registrations</p>
              </div>
              <button className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-colors">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3 text-left">Student</th>
                    <th className="px-5 py-3 text-left">Level</th>
                    <th className="px-5 py-3 text-left hidden sm:table-cell">Joined</th>
                    <th className="px-5 py-3 text-left">Status</th>
                    <th className="px-5 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentStudents.map(({ name, email, level, joined, status }) => (
                    <tr key={email} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">
                            {name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{name}</p>
                            <p className="text-xs text-slate-400 hidden sm:block">{email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          level === "O Level"  ? "bg-blue-100 text-blue-700" :
                          level === "A Level"  ? "bg-purple-100 text-purple-700" :
                          "bg-emerald-100 text-emerald-700"
                        }`}>
                          {level}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 hidden sm:table-cell text-sm text-slate-500">{joined}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button className="text-xs text-indigo-600 hover:underline font-medium">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Course management ───────────────────────────── */}
          <div id="courses" className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-900">Course Management</h2>
                <p className="text-xs text-slate-400">{courses.length} courses total</p>
              </div>
              <button className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-colors">
                + Add Course
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3 text-left">Course</th>
                    <th className="px-5 py-3 text-left hidden sm:table-cell">Lessons</th>
                    <th className="px-5 py-3 text-left">Students</th>
                    <th className="px-5 py-3 text-left">Status</th>
                    <th className="px-5 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {courses.map(({ id, title, level, students, status, lessons }) => (
                    <tr key={id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-semibold text-slate-800">{title}</p>
                        <span className={`text-xs font-medium ${
                          level === "O Level"  ? "text-blue-600" :
                          level === "A Level"  ? "text-purple-600" :
                          "text-emerald-600"
                        }`}>
                          {level}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 hidden sm:table-cell text-sm text-slate-600">
                        {lessons} lessons
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">
                        {students}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          status === "Active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-3">
                          <Link href={`/dashboard/admin/courses/${id}`} className="text-xs text-indigo-600 hover:underline font-medium">
                            Manage
                          </Link>
                          <Link href={`/courses/${id}`} target="_blank" className="text-xs text-slate-400 hover:text-slate-600 font-medium">
                            Preview ↗
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Quick Actions ────────────────────────────────── */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-4">
            {[
              { label: "Upload Past Paper",   icon: "📄", desc: "Add a new paper to the library",  color: "hover:border-indigo-300 hover:bg-indigo-50" },
              { label: "Send Announcement",   icon: "📢", desc: "Notify all students",              color: "hover:border-purple-300 hover:bg-purple-50" },
              { label: "View AI Usage",       icon: "🤖", desc: "Monitor AI Solver queries",        color: "hover:border-orange-300 hover:bg-orange-50" },
              { label: "Export Student Data", icon: "📊", desc: "Download CSV report",              color: "hover:border-emerald-300 hover:bg-emerald-50" },
            ].map(({ label, icon, desc, color }) => (
              <button
                key={label}
                className={`bg-white border border-slate-200 rounded-2xl p-5 text-left transition-all card-hover ${color}`}
              >
                <span className="text-2xl mb-3 block">{icon}</span>
                <p className="font-semibold text-slate-800 text-sm">{label}</p>
                <p className="text-xs text-slate-400 mt-1">{desc}</p>
              </button>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}
