import Link from "next/link";
import { notFound } from "next/navigation";
import { courses, type Course } from "@/lib/courses-data";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = courses.find((c) => c.id === id);
  if (!course) notFound();

  const totalLessons = course.curriculum.reduce(
    (sum, sec) => sum + sec.lessons.length,
    0,
  );

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 pt-32 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/courses" className="hover:text-white transition-colors">
              Courses
            </Link>
            <span>/</span>
            <span className="text-slate-300">{course.title}</span>
          </nav>

          <div className="grid lg:grid-cols-3 gap-10 items-start">
            {/* Left — course info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${course.badgeColor}`}
                >
                  {course.badge}
                </span>
                {course.tag && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${course.tagColor}`}
                  >
                    {course.tag}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {course.title}
              </h1>
              <p className="text-indigo-300 text-lg font-medium mb-4">
                {course.subtitle}
              </p>
              <p className="text-slate-300 leading-relaxed mb-6 max-w-xl">
                {course.longDesc}
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap gap-5 text-sm">
                <div className="flex items-center gap-1.5 text-amber-400">
                  <span className="text-lg">★</span>
                  <span className="font-bold text-white">{course.rating}</span>
                  <span className="text-slate-400">rating</span>
                </div>
                <div className="text-slate-300">
                  <span className="font-bold text-white">{course.students}</span>
                  <span className="text-slate-400 ml-1">students</span>
                </div>
                <div className="text-slate-300">
                  <span className="font-bold text-white">{totalLessons}</span>
                  <span className="text-slate-400 ml-1">lessons</span>
                </div>
                <div className="text-slate-300">
                  <span className="font-bold text-white">{course.duration}</span>
                  <span className="text-slate-400 ml-1">total</span>
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-400">Level: </span>
                  <span className="font-bold text-white">{course.level}</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-3 mt-6">
                <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  HI
                </div>
                <div className="text-sm">
                  <span className="text-slate-400">Instructor: </span>
                  <span className="text-white font-medium">
                    {course.instructor}
                  </span>
                </div>
              </div>
            </div>

            {/* Right — enrollment card (desktop) */}
            <div className="hidden lg:block">
              <EnrollmentCard course={course} totalLessons={totalLessons} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Main content ────────────────────────────────────────── */}
      <section className="bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10 items-start">
            {/* Left — details */}
            <div className="lg:col-span-2 space-y-8">

              {/* Video preview */}
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-200">
                <div className="aspect-video bg-gradient-to-br from-slate-800 to-indigo-900 relative flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center mb-4 mx-auto hover:bg-white/20 transition-all cursor-pointer">
                      <svg
                        className="w-8 h-8 text-white ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <p className="text-white font-semibold">
                      Enroll to Watch All Lessons
                    </p>
                    <p className="text-slate-400 text-sm mt-1">
                      {totalLessons} video lessons · {course.duration}
                    </p>
                  </div>
                  {/* Preview label */}
                  <div className="absolute bottom-4 left-4 right-4 bg-black/50 rounded-xl px-4 py-2.5 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                    <span className="text-xs text-white flex-1 truncate">
                      Preview: Introduction to {course.title.split(" (")[0]}
                    </span>
                    <span className="text-xs text-slate-400 shrink-0">
                      5:32
                    </span>
                  </div>
                </div>
              </div>

              {/* What you'll learn */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-5">
                  What you&apos;ll learn
                </h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {course.whatYouLearn.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                      <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prerequisites */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-5">
                  Prerequisites
                </h2>
                <ul className="space-y-2">
                  {course.prerequisites.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm text-slate-700"
                    >
                      <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Curriculum */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold text-slate-900">
                    Curriculum
                  </h2>
                  <span className="text-sm text-slate-400">
                    {course.curriculum.length} sections · {totalLessons} lessons
                  </span>
                </div>

                <div className="space-y-3">
                  {course.curriculum.map((section, i) => (
                    <details
                      key={section.section}
                      className="group border border-slate-200 rounded-xl overflow-hidden"
                      open={i === 0}
                    >
                      <summary className="flex items-center justify-between px-5 py-4 cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors list-none">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">
                            {i + 1}
                          </span>
                          <span className="font-semibold text-slate-800 text-sm">
                            {section.section}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-400">
                            {section.lessons.length} lessons
                          </span>
                          <svg
                            className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-180"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </summary>

                      <ul className="divide-y divide-slate-100">
                        {section.lessons.map((lesson, li) => (
                          <li
                            key={lesson}
                            className="flex items-center gap-3 px-5 py-3 text-sm text-slate-600"
                          >
                            <span className="shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-400 text-xs flex items-center justify-center">
                              {li + 1}
                            </span>
                            <svg
                              className="w-4 h-4 text-slate-300 shrink-0"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                            {lesson}
                            <span className="ml-auto text-xs text-slate-300">
                              {5 + ((li * 3) % 20)} min
                            </span>
                          </li>
                        ))}
                      </ul>
                    </details>
                  ))}
                </div>
              </div>

              {/* Instructor */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-5">
                  About the Instructor
                </h2>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
                    HI
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Habib Iqbal</p>
                    <p className="text-sm text-indigo-600 font-medium mb-3">
                      Cambridge Certified Mathematics Tutor
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      With 5+ years of experience teaching Cambridge O &amp; A
                      Level Mathematics, Habib has helped over 500 students
                      achieve top grades. His teaching style focuses on deep
                      understanding over memorisation, using real exam questions
                      and clear step-by-step explanations.
                    </p>
                    <div className="flex gap-4 mt-4 text-xs text-slate-500">
                      <span>⭐ 4.8 avg rating</span>
                      <span>👤 996+ students</span>
                      <span>🎓 6 courses</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — sticky enrollment card (desktop) */}
            <div className="hidden lg:block lg:sticky lg:top-24">
              <EnrollmentCard course={course} totalLessons={totalLessons} />
            </div>
          </div>

          {/* Mobile enrollment card */}
          <div className="lg:hidden mt-8">
            <EnrollmentCard course={course} totalLessons={totalLessons} />
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Enrollment card component ──────────────────────────────── */
function EnrollmentCard({
  course,
  totalLessons,
}: {
  course: Course;
  totalLessons: number;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
      {/* Course thumbnail mini */}
      <div
        className={`h-32 bg-gradient-to-br ${course.bg} flex items-center justify-center`}
      >
        <span className="text-5xl font-bold text-slate-300/60 select-none">
          {course.symbol}
        </span>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-1">
          <span className="text-3xl font-bold text-slate-900">Free</span>
          <span className="text-sm text-slate-400 line-through">৳2,500/mo</span>
        </div>
        <p className="text-xs text-emerald-600 font-semibold mb-5">
          Free preview — enroll to unlock all lessons
        </p>

        <Link
          href="/signup"
          className="block w-full text-center px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg shadow-indigo-200 mb-3"
        >
          Enroll Now — It&apos;s Free
        </Link>
        <Link
          href="/login"
          className="block w-full text-center px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-all text-sm"
        >
          Already enrolled? Log in
        </Link>

        <div className="mt-6 space-y-3 text-sm text-slate-600">
          <p className="font-semibold text-slate-800 mb-1">This course includes:</p>
          {[
            { icon: "📹", text: `${totalLessons} video lessons (${course.duration})` },
            { icon: "📱", text: "Access on all devices" },
            { icon: "♾️", text: "Lifetime access" },
            { icon: "📄", text: "Past paper practice included" },
            { icon: "🤖", text: "AI Solver for this subject" },
            { icon: "📊", text: "Progress tracking dashboard" },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2.5">
              <span>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Need help choosing?{" "}
          <a
            href="mailto:mr.habibiqbal@gmail.com"
            className="text-indigo-600 hover:underline"
          >
            Email us
          </a>
        </p>
      </div>
    </div>
  );
}
