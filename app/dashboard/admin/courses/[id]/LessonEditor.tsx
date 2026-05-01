"use client";

import { useState } from "react";

type LessonTab = "lecture" | "material" | "assignment";

interface Resource {
  id: string;
  title: string;
  url: string;
  type: "pdf" | "drive" | "link";
}

interface Question {
  id: string;
  text: string;
  marks: number;
}

interface LessonData {
  id: string;
  title: string;
  duration: string;
  section: string;
  status: string;
}

interface Props {
  lesson: LessonData;
  onClose: () => void;
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&\s?]+)/);
  return match ? match[1] : null;
}

export default function LessonEditor({ lesson, onClose }: Props) {
  const [tab, setTab]       = useState<LessonTab>("lecture");
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  /* ── Lecture ──────────────────── */
  const [videoUrl,  setVideoUrl]  = useState("");
  const [videoDesc, setVideoDesc] = useState("");

  /* ── Study Material ───────────── */
  const [notes,     setNotes]     = useState("");
  const [resources, setResources] = useState<Resource[]>([]);

  /* ── Assignment ───────────────── */
  const [assignTitle,    setAssignTitle]    = useState(`${lesson.title} — Assignment`);
  const [instructions,   setInstructions]   = useState("");
  const [questions,      setQuestions]      = useState<Question[]>([{ id: "q1", text: "", marks: 5 }]);
  const [dueDate,        setDueDate]        = useState("");

  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
  const ytId       = getYouTubeId(videoUrl);

  /* ── Resource helpers ─────────── */
  function addResource() {
    setResources((p) => [...p, { id: Date.now().toString(), title: "", url: "", type: "link" }]);
  }
  function updateResource(id: string, field: keyof Resource, value: string) {
    setResources((p) => p.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }
  function removeResource(id: string) {
    setResources((p) => p.filter((r) => r.id !== id));
  }

  /* ── Question helpers ─────────── */
  function addQuestion() {
    setQuestions((p) => [...p, { id: Date.now().toString(), text: "", marks: 5 }]);
  }
  function updateQuestion(id: string, field: "text" | "marks", value: string | number) {
    setQuestions((p) => p.map((q) => (q.id === id ? { ...q, [field]: value } : q)));
  }
  function removeQuestion(id: string) {
    if (questions.length === 1) return;
    setQuestions((p) => p.filter((q) => q.id !== id));
  }

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    setSavedMsg("Saved!");
    setTimeout(() => setSavedMsg(""), 2500);
  }

  return (
    <div className="border-t-2 border-indigo-300 bg-slate-50">

      {/* Editor header bar */}
      <div className="flex items-center justify-between px-5 py-2.5 bg-indigo-600">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xs font-bold text-indigo-200 uppercase tracking-wide shrink-0">Editing</span>
          <span className="text-sm font-semibold text-white truncate">{lesson.title}</span>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 text-indigo-200 hover:text-white text-sm font-medium px-3 py-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          ✕ Close
        </button>
      </div>

      {/* Sub-tabs */}
      <div className="flex bg-white border-b border-slate-200">
        {([
          { id: "lecture"    as LessonTab, icon: "📹", label: "Lecture"        },
          { id: "material"   as LessonTab, icon: "📚", label: "Study Material" },
          { id: "assignment" as LessonTab, icon: "📝", label: "Assignment"     },
        ] as { id: LessonTab; icon: string; label: string }[]).map(({ id, icon, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === id
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <span>{icon}</span> {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-5 space-y-4 max-h-[480px] overflow-y-auto">

        {/* ── LECTURE ───────────────────────────────── */}
        {tab === "lecture" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Video URL
                <span className="ml-2 font-normal text-slate-400 text-xs">YouTube, Vimeo, or direct MP4 link</span>
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder:text-slate-400"
              />
            </div>

            {ytId && (
              <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                <div className="bg-slate-900 px-4 py-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs text-slate-400 font-medium">Video Preview</span>
                </div>
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${ytId}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {!ytId && videoUrl && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
                ⚠️ Could not detect a YouTube video ID. Make sure the URL is a valid YouTube or Vimeo link.
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Lecture Description</label>
              <textarea
                value={videoDesc}
                onChange={(e) => setVideoDesc(e.target.value)}
                rows={4}
                placeholder="What will students learn in this lesson? Key topics covered..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder:text-slate-400 resize-none"
              />
            </div>
          </div>
        )}

        {/* ── STUDY MATERIAL ────────────────────────── */}
        {tab === "material" && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Lesson Notes
                <span className="ml-2 font-normal text-slate-400 text-xs">Shown to students as readable content</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={9}
                placeholder={"Write lesson notes here. Key concepts, formulas, worked examples...\n\nExample:\n• Topic: Quadratic Equations\n• Formula: ax² + bx + c = 0\n• Discriminant: b² − 4ac"}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder:text-slate-400 resize-none font-mono leading-relaxed"
              />
            </div>

            {/* Resource links */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-slate-700">
                  Downloadable Resources
                  <span className="ml-2 font-normal text-slate-400 text-xs">PDFs, worksheets, Google Drive links</span>
                </label>
                <button
                  type="button"
                  onClick={addResource}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors"
                >
                  + Add
                </button>
              </div>

              {resources.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl">
                  <p className="text-sm text-slate-400">No resources yet</p>
                  <button
                    type="button"
                    onClick={addResource}
                    className="mt-2 text-xs text-indigo-600 hover:underline font-medium"
                  >
                    + Add first resource
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {resources.map((res) => (
                    <div key={res.id} className="flex gap-2 items-start">
                      <select
                        value={res.type}
                        onChange={(e) => updateResource(res.id, "type", e.target.value)}
                        className="shrink-0 px-2 py-2 rounded-lg border border-slate-200 text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      >
                        <option value="pdf">📄 PDF</option>
                        <option value="drive">☁️ Drive</option>
                        <option value="link">🔗 Link</option>
                      </select>
                      <input
                        value={res.title}
                        onChange={(e) => updateResource(res.id, "title", e.target.value)}
                        placeholder="Resource title"
                        className="w-36 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder:text-slate-400"
                      />
                      <input
                        value={res.url}
                        onChange={(e) => updateResource(res.id, "url", e.target.value)}
                        placeholder="URL or Google Drive link"
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder:text-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => removeResource(res.id)}
                        className="shrink-0 p-2 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ASSIGNMENT ────────────────────────────── */}
        {tab === "assignment" && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Assignment Title</label>
                <input
                  value={assignTitle}
                  onChange={(e) => setAssignTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Instructions for Students</label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={3}
                placeholder="Show all working. Round answers to 3 significant figures unless stated otherwise..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder:text-slate-400 resize-none"
              />
            </div>

            {/* Questions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Questions</label>
                  <span className="ml-3 text-xs text-slate-400">
                    Total: <span className="font-bold text-slate-700">{totalMarks} marks</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors"
                >
                  + Add Question
                </button>
              </div>

              <div className="space-y-2.5">
                {questions.map((q, qi) => (
                  <div key={q.id} className="flex gap-2.5 items-start">
                    <span className="shrink-0 w-7 h-8 flex items-center justify-center text-xs font-bold text-slate-500 bg-slate-100 rounded-lg mt-0.5">
                      {qi + 1}
                    </span>
                    <textarea
                      value={q.text}
                      onChange={(e) => updateQuestion(q.id, "text", e.target.value)}
                      rows={2}
                      placeholder={`Question ${qi + 1} — type the question here...`}
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder:text-slate-400 resize-none"
                    />
                    <div className="shrink-0 flex flex-col items-center gap-0.5">
                      <input
                        type="number"
                        min={1}
                        value={q.marks}
                        onChange={(e) => updateQuestion(q.id, "marks", Math.max(1, Number(e.target.value)))}
                        className="w-16 px-2 py-2 rounded-lg border border-slate-200 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                      />
                      <span className="text-xs text-slate-400">marks</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeQuestion(q.id)}
                      disabled={questions.length === 1}
                      className="shrink-0 p-2 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30 mt-0.5"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* Marks summary */}
              <div className="mt-4 flex items-center justify-between py-3 px-4 bg-slate-100 rounded-xl text-sm">
                <span className="text-slate-600">{questions.length} question{questions.length !== 1 ? "s" : ""}</span>
                <span className="font-bold text-slate-800">{totalMarks} marks total</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save bar */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-white border-t border-slate-200">
        <p className="text-xs text-slate-400">
          Changes saved to this lesson only
          {tab === "lecture" && " · Video will be embedded for students"}
          {tab === "material" && " · Notes visible in student dashboard"}
          {tab === "assignment" && " · Students submit answers in their dashboard"}
        </p>
        <div className="flex items-center gap-3 shrink-0">
          {savedMsg && (
            <span className="text-xs font-semibold text-emerald-600">✓ {savedMsg}</span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-semibold transition-all flex items-center gap-2"
          >
            {saving ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Saving…
              </>
            ) : "Save Lesson"}
          </button>
        </div>
      </div>
    </div>
  );
}
