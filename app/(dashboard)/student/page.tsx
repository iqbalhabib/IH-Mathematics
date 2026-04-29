import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function StudentDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "Student";
  const level = user.user_metadata?.level?.replace("_", " ").toUpperCase() || "O LEVEL";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="bg-white border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Student Dashboard</h1>
            <p className="text-sm text-slate-500">IH Mathematics</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-800">{name}</p>
              <p className="text-xs text-indigo-600 font-medium">{level}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              {name[0].toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 sm:p-8 mb-8 text-white">
          <p className="text-indigo-200 text-sm font-medium mb-1">Welcome back 👋</p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Hello, {name.split(" ")[0]}!</h2>
          <p className="text-indigo-100">You&apos;re on track. Keep going — your next exam is closer than you think.</p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Courses Enrolled", value: "0",   icon: "🎬", color: "text-blue-600",   bg: "bg-blue-50" },
            { label: "Lessons Completed", value: "0",  icon: "✅", color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Past Papers Done",  value: "0",  icon: "📄", color: "text-purple-600",  bg: "bg-purple-50" },
            { label: "AI Solver Uses",    value: "0",  icon: "🤖", color: "text-orange-600",  bg: "bg-orange-50" },
          ].map(({ label, value, icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl p-5 border border-slate-100">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center text-xl mb-3`}>
                {icon}
              </div>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-slate-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            { href: "/courses",     icon: "🎬", title: "Browse Courses",    desc: "Enroll in O & A Level courses",   color: "bg-blue-600" },
            { href: "/ai-solver",   icon: "🤖", title: "AI Math Solver",    desc: "Upload a problem, get a solution", color: "bg-purple-600" },
            { href: "/past-papers", icon: "📄", title: "Past Papers",       desc: "Practice with real exam papers",  color: "bg-emerald-600" },
          ].map(({ href, icon, title, desc, color }) => (
            <Link
              key={href}
              href={href}
              className="bg-white rounded-2xl p-5 border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all group flex items-start gap-4"
            >
              <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform`}>
                {icon}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{title}</h3>
                <p className="text-sm text-slate-500 mt-0.5">{desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* My Courses placeholder */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-900">My Courses</h3>
            <Link href="/courses" className="text-sm text-indigo-600 font-medium hover:text-indigo-800">
              Browse all →
            </Link>
          </div>
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📚</div>
            <p className="text-slate-500 mb-4">You haven&apos;t enrolled in any courses yet.</p>
            <Link
              href="/courses"
              className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              Explore Courses
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
