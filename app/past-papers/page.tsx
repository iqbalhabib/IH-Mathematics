"use client";

import { useState, useMemo } from "react";

/* ─── Types & Data ──────────────────────────────────────────── */

type Session = "May/June" | "Oct/Nov" | "Feb/March";
type PaperType = "Question Paper" | "Mark Scheme";
type Level = "O Level" | "A Level";

interface PastPaper {
  id: string;
  subject: string;
  code: string;
  level: Level;
  year: number;
  session: Session;
  paper: string;
  type: PaperType;
  pages: number;
  downloads: number;
}

function makePaper(
  subject: string,
  code: string,
  level: Level,
  year: number,
  session: Session,
  paper: string,
  type: PaperType,
  pages: number,
  downloads: number,
): PastPaper {
  const id = `${code}-${year}-${session.replace("/", "")}-${paper.replace(" ", "")}-${type === "Question Paper" ? "QP" : "MS"}`;
  return { id, subject, code, level, year, session, paper, type, pages, downloads };
}

const papers: PastPaper[] = [
  /* ── Mathematics 0580 ── */
  makePaper("Mathematics", "0580", "O Level", 2024, "May/June",   "Paper 2", "Question Paper", 16, 1843),
  makePaper("Mathematics", "0580", "O Level", 2024, "May/June",   "Paper 2", "Mark Scheme",     8,  921),
  makePaper("Mathematics", "0580", "O Level", 2024, "May/June",   "Paper 4", "Question Paper", 20, 2104),
  makePaper("Mathematics", "0580", "O Level", 2024, "May/June",   "Paper 4", "Mark Scheme",    10, 1052),
  makePaper("Mathematics", "0580", "O Level", 2024, "Oct/Nov",    "Paper 2", "Question Paper", 16,  987),
  makePaper("Mathematics", "0580", "O Level", 2024, "Oct/Nov",    "Paper 2", "Mark Scheme",     8,  493),
  makePaper("Mathematics", "0580", "O Level", 2024, "Oct/Nov",    "Paper 4", "Question Paper", 20, 1123),
  makePaper("Mathematics", "0580", "O Level", 2024, "Oct/Nov",    "Paper 4", "Mark Scheme",    10,  561),
  makePaper("Mathematics", "0580", "O Level", 2023, "May/June",   "Paper 2", "Question Paper", 16, 3241),
  makePaper("Mathematics", "0580", "O Level", 2023, "May/June",   "Paper 2", "Mark Scheme",     8, 1620),
  makePaper("Mathematics", "0580", "O Level", 2023, "May/June",   "Paper 4", "Question Paper", 20, 3867),
  makePaper("Mathematics", "0580", "O Level", 2023, "May/June",   "Paper 4", "Mark Scheme",    10, 1933),
  makePaper("Mathematics", "0580", "O Level", 2023, "Oct/Nov",    "Paper 2", "Question Paper", 16, 2198),
  makePaper("Mathematics", "0580", "O Level", 2023, "Oct/Nov",    "Paper 4", "Question Paper", 20, 2654),
  makePaper("Mathematics", "0580", "O Level", 2022, "May/June",   "Paper 2", "Question Paper", 16, 4102),
  makePaper("Mathematics", "0580", "O Level", 2022, "May/June",   "Paper 4", "Question Paper", 20, 4891),
  makePaper("Mathematics", "0580", "O Level", 2022, "Oct/Nov",    "Paper 2", "Question Paper", 16, 3344),
  makePaper("Mathematics", "0580", "O Level", 2022, "Oct/Nov",    "Paper 4", "Question Paper", 20, 3998),
  makePaper("Mathematics", "0580", "O Level", 2021, "May/June",   "Paper 2", "Question Paper", 16, 5012),
  makePaper("Mathematics", "0580", "O Level", 2021, "Oct/Nov",    "Paper 4", "Question Paper", 20, 4776),
  makePaper("Mathematics", "0580", "O Level", 2020, "May/June",   "Paper 2", "Question Paper", 16, 5890),
  makePaper("Mathematics", "0580", "O Level", 2020, "Oct/Nov",    "Paper 4", "Question Paper", 20, 5541),

  /* ── Additional Mathematics 0606 ── */
  makePaper("Additional Mathematics", "0606", "O Level", 2024, "May/June",   "Paper 1", "Question Paper", 12, 876),
  makePaper("Additional Mathematics", "0606", "O Level", 2024, "May/June",   "Paper 1", "Mark Scheme",     6, 438),
  makePaper("Additional Mathematics", "0606", "O Level", 2024, "May/June",   "Paper 2", "Question Paper", 12, 823),
  makePaper("Additional Mathematics", "0606", "O Level", 2024, "Oct/Nov",    "Paper 1", "Question Paper", 12, 654),
  makePaper("Additional Mathematics", "0606", "O Level", 2023, "May/June",   "Paper 1", "Question Paper", 12, 1543),
  makePaper("Additional Mathematics", "0606", "O Level", 2023, "May/June",   "Paper 2", "Question Paper", 12, 1467),
  makePaper("Additional Mathematics", "0606", "O Level", 2023, "Oct/Nov",    "Paper 1", "Question Paper", 12, 1102),
  makePaper("Additional Mathematics", "0606", "O Level", 2022, "May/June",   "Paper 1", "Question Paper", 12, 2234),
  makePaper("Additional Mathematics", "0606", "O Level", 2022, "Oct/Nov",    "Paper 2", "Question Paper", 12, 1987),
  makePaper("Additional Mathematics", "0606", "O Level", 2021, "May/June",   "Paper 1", "Question Paper", 12, 2876),

  /* ── Pure Mathematics 9709 ── */
  makePaper("Pure Mathematics", "9709", "A Level", 2024, "May/June",   "Paper 1 (P1)", "Question Paper", 20, 1234),
  makePaper("Pure Mathematics", "9709", "A Level", 2024, "May/June",   "Paper 1 (P1)", "Mark Scheme",    10,  617),
  makePaper("Pure Mathematics", "9709", "A Level", 2024, "May/June",   "Paper 3 (P3)", "Question Paper", 20, 1098),
  makePaper("Pure Mathematics", "9709", "A Level", 2024, "Feb/March",  "Paper 1 (P1)", "Question Paper", 20,  743),
  makePaper("Pure Mathematics", "9709", "A Level", 2024, "Oct/Nov",    "Paper 1 (P1)", "Question Paper", 20,  891),
  makePaper("Pure Mathematics", "9709", "A Level", 2023, "May/June",   "Paper 1 (P1)", "Question Paper", 20, 2341),
  makePaper("Pure Mathematics", "9709", "A Level", 2023, "May/June",   "Paper 3 (P3)", "Question Paper", 20, 2087),
  makePaper("Pure Mathematics", "9709", "A Level", 2023, "Oct/Nov",    "Paper 1 (P1)", "Question Paper", 20, 1876),
  makePaper("Pure Mathematics", "9709", "A Level", 2022, "May/June",   "Paper 1 (P1)", "Question Paper", 20, 3102),
  makePaper("Pure Mathematics", "9709", "A Level", 2022, "Oct/Nov",    "Paper 3 (P3)", "Question Paper", 20, 2765),

  /* ── Statistics 9709 ── */
  makePaper("Statistics",       "9709", "A Level", 2024, "May/June",   "Paper 5 (S1)", "Question Paper", 12, 654),
  makePaper("Statistics",       "9709", "A Level", 2024, "May/June",   "Paper 5 (S1)", "Mark Scheme",     6, 327),
  makePaper("Statistics",       "9709", "A Level", 2023, "May/June",   "Paper 5 (S1)", "Question Paper", 12, 1234),
  makePaper("Statistics",       "9709", "A Level", 2023, "Oct/Nov",    "Paper 5 (S1)", "Question Paper", 12,  987),
  makePaper("Statistics",       "9709", "A Level", 2022, "May/June",   "Paper 5 (S1)", "Question Paper", 12, 1543),
];

/* ─── Filter config ─────────────────────────────────────────── */

const SUBJECT_OPTIONS = [
  "All Subjects",
  "Mathematics (0580)",
  "Additional Mathematics (0606)",
  "Pure Mathematics (9709)",
  "Statistics (9709)",
];

const YEAR_OPTIONS = ["All Years", "2024", "2023", "2022", "2021", "2020"];
const SESSION_OPTIONS = ["All Sessions", "May/June", "Oct/Nov", "Feb/March"];
const TYPE_OPTIONS = ["All Types", "Question Paper", "Mark Scheme"];
const LEVEL_OPTIONS = ["All Levels", "O Level", "A Level"];

/* ─── Badge helpers ─────────────────────────────────────────── */

function subjectBadge(subject: string, level: Level) {
  if (level === "A Level")
    return "bg-purple-100 text-purple-700";
  if (subject === "Additional Mathematics")
    return "bg-sky-100 text-sky-700";
  return "bg-blue-100 text-blue-700";
}

function typeBadge(type: PaperType) {
  return type === "Question Paper"
    ? "bg-indigo-100 text-indigo-700"
    : "bg-emerald-100 text-emerald-700";
}

function sessionBadge(session: Session) {
  if (session === "May/June") return "bg-amber-100 text-amber-700";
  if (session === "Oct/Nov") return "bg-orange-100 text-orange-700";
  return "bg-teal-100 text-teal-700";
}

/* ─── Page ──────────────────────────────────────────────────── */

export default function PastPapersPage() {
  const [subject, setSubject]   = useState("All Subjects");
  const [year, setYear]         = useState("All Years");
  const [session, setSession]   = useState("All Sessions");
  const [type, setType]         = useState("All Types");
  const [level, setLevel]       = useState("All Levels");
  const [search, setSearch]     = useState("");
  const [view, setView]         = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return papers.filter((p) => {
      if (subject !== "All Subjects") {
        const subLabel = `${p.subject} (${p.code})`;
        if (subLabel !== subject) return false;
      }
      if (year !== "All Years" && p.year !== Number(year)) return false;
      if (session !== "All Sessions" && p.session !== session) return false;
      if (type !== "All Types" && p.type !== type) return false;
      if (level !== "All Levels" && p.level !== level) return false;
      if (q && !`${p.subject} ${p.code} ${p.year} ${p.session} ${p.paper} ${p.type}`.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [subject, year, session, type, level, search]);

  const totalDownloads = papers.reduce((s, p) => s + p.downloads, 0);

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-sm font-medium mb-5">
              <span className="text-lg">📄</span>
              Cambridge Past Papers Library
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Past Papers Library
            </h1>
            <p className="text-slate-300 text-lg mb-8">
              Every Cambridge O &amp; A Level Mathematics past paper, organised
              by subject, year, and session — fully searchable and free to
              download.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: papers.length.toString(), label: "Papers" },
                { value: "4", label: "Subjects" },
                { value: "2020–2024", label: "Years Covered" },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="bg-white/10 rounded-xl px-4 py-3 text-center border border-white/10"
                >
                  <p className="text-xl font-bold text-white">{value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Filters + Papers ───────────────────────────────────── */}
      <section className="bg-slate-50 min-h-screen">

        {/* Sticky filter bar */}
        <div className="sticky top-16 z-10 bg-white/90 backdrop-blur border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {/* Row 1: search + view toggle */}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative flex-1 max-w-sm">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search papers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                />
              </div>

              <span className="text-sm text-slate-400 ml-auto whitespace-nowrap">
                {filtered.length} paper{filtered.length !== 1 ? "s" : ""}
              </span>

              {/* View toggle */}
              <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                {(["grid", "list"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`px-3 py-2 transition-colors ${
                      view === v
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-slate-500 hover:bg-slate-50"
                    }`}
                    title={v === "grid" ? "Grid view" : "List view"}
                  >
                    {v === "grid" ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 2: dropdowns */}
            <div className="flex flex-wrap gap-2">
              {[
                { value: subject,  setter: setSubject,  options: SUBJECT_OPTIONS  },
                { value: level,    setter: setLevel,    options: LEVEL_OPTIONS    },
                { value: year,     setter: setYear,     options: YEAR_OPTIONS     },
                { value: session,  setter: setSession,  options: SESSION_OPTIONS  },
                { value: type,     setter: setType,     options: TYPE_OPTIONS     },
              ].map(({ value, setter, options }) => (
                <select
                  key={options[0]}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  {options.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              ))}

              {(subject !== "All Subjects" || year !== "All Years" || session !== "All Sessions" || type !== "All Types" || level !== "All Levels" || search) && (
                <button
                  onClick={() => {
                    setSubject("All Subjects");
                    setYear("All Years");
                    setSession("All Sessions");
                    setType("All Types");
                    setLevel("All Levels");
                    setSearch("");
                  }}
                  className="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Papers content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-400 text-lg">
                No papers match your filters.
              </p>
              <p className="text-slate-400 text-sm mt-1">
                Try adjusting or clearing your filters.
              </p>
            </div>
          ) : view === "grid" ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((paper) => (
                <PaperCard key={paper.id} paper={paper} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((paper) => (
                <PaperRow key={paper.id} paper={paper} />
              ))}
            </div>
          )}

          {/* Footer info */}
          {filtered.length > 0 && (
            <p className="text-center text-xs text-slate-400 mt-10">
              Showing {filtered.length} of {papers.length} papers ·{" "}
              {totalDownloads.toLocaleString()} total downloads
            </p>
          )}
        </div>
      </section>
    </>
  );
}

/* ─── Grid card ─────────────────────────────────────────────── */
function PaperCard({ paper }: { paper: PastPaper }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 card-hover flex flex-col">
      {/* Header badges */}
      <div className="flex items-center gap-1.5 flex-wrap mb-3">
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-bold ${subjectBadge(paper.subject, paper.level)}`}
        >
          {paper.code}
        </span>
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-bold ${typeBadge(paper.type)}`}
        >
          {paper.type === "Question Paper" ? "QP" : "MS"}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-bold text-slate-800 text-sm mb-1 leading-snug">
        {paper.subject}
      </h3>
      <p className="text-xs text-slate-500 mb-3">{paper.paper}</p>

      {/* Meta */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <span
          className={`px-2 py-0.5 rounded-md text-xs font-medium ${sessionBadge(paper.session)}`}
        >
          {paper.year} {paper.session}
        </span>
        <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-500">
          {paper.level}
        </span>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 text-xs text-slate-400 mt-auto mb-4">
        <span>📄 {paper.pages} pages</span>
        <span>⬇ {paper.downloads.toLocaleString()}</span>
      </div>

      {/* Download button */}
      <button className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download PDF
      </button>
    </div>
  );
}

/* ─── List row ──────────────────────────────────────────────── */
function PaperRow({ paper }: { paper: PastPaper }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-5 py-3.5 flex items-center gap-4 hover:border-indigo-300 transition-colors">
      {/* Subject badge */}
      <span
        className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-bold ${subjectBadge(paper.subject, paper.level)}`}
      >
        {paper.code}
      </span>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-800 text-sm truncate">
          {paper.subject} — {paper.paper}
        </p>
        <p className="text-xs text-slate-400">
          {paper.year} {paper.session} · {paper.level}
        </p>
      </div>

      {/* Type badge */}
      <span
        className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-bold ${typeBadge(paper.type)}`}
      >
        {paper.type === "Question Paper" ? "Question Paper" : "Mark Scheme"}
      </span>

      {/* Pages + downloads */}
      <span className="shrink-0 text-xs text-slate-400 hidden sm:block">
        {paper.pages}p
      </span>
      <span className="shrink-0 text-xs text-slate-400 hidden md:block">
        ⬇ {paper.downloads.toLocaleString()}
      </span>

      {/* Download button */}
      <button className="shrink-0 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download
      </button>
    </div>
  );
}
