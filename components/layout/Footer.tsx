"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const courses = [
  { label: "O Level Mathematics",    href: "/courses" },
  { label: "O Level Add. Maths",     href: "/courses" },
  { label: "A Level Pure Maths",     href: "/courses" },
  { label: "A Level Statistics",     href: "/courses" },
  { label: "GRE Quantitative",       href: "/courses" },
];

const resources = [
  { label: "Past Papers Library",  href: "/past-papers" },
  { label: "AI Math Solver",       href: "/ai-solver" },
  { label: "Student Dashboard",    href: "/dashboard/student" },
  { label: "Study Schedule",       href: "#" },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard") || pathname === "/login" || pathname === "/signup") return null;

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <Image
                src="/logo.png"
                alt="IH Mathematics Logo"
                width={42}
                height={42}
                className="object-contain shrink-0"
              />
              <span className="font-bold text-white text-lg">
                IH <span className="text-yellow-400">Mathematics</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 mb-5">
              Expert Cambridge O &amp; A Level math tutoring — video lessons, AI
              problem solving, and comprehensive past papers.
            </p>
            <div className="flex gap-3">
              {["Facebook", "YouTube", "WhatsApp"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-indigo-600 flex items-center justify-center text-xs font-bold transition-colors"
                  aria-label={s}
                >
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Courses */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Courses
            </h3>
            <ul className="space-y-2.5">
              {courses.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-400 hover:text-indigo-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-2.5">
              {resources.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-400 hover:text-indigo-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="mt-0.5">📧</span>
                <a href="mailto:mr.habibiqbal@gmail.com" className="hover:text-indigo-400 transition-colors break-all">
                  mr.habibiqbal@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>Bangladesh</span>
              </li>
              <li className="flex items-start gap-2">
                <span>🕐</span>
                <span>Sat – Thu, 9 AM – 9 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} IH Mathematics. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-300 transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
