"use client";

import { useState } from "react";

interface PromoCode {
  id: string;
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  max_uses: number | null;
  uses_count: number;
  expires_at: string | null;
  is_active: boolean;
}

const MOCK_CODES: PromoCode[] = [
  { id: "1", code: "SAVE30",    discount_type: "percent", discount_value: 30,  max_uses: 100, uses_count: 23, expires_at: "2026-12-31", is_active: true  },
  { id: "2", code: "IH500OFF",  discount_type: "fixed",   discount_value: 500, max_uses: 50,  uses_count: 12, expires_at: "2026-06-30", is_active: true  },
  { id: "3", code: "EARLYBIRD", discount_type: "percent", discount_value: 50,  max_uses: 20,  uses_count: 20, expires_at: "2026-04-01", is_active: false },
];

export default function PromoCodesUI({ adminName }: { adminName: string }) {
  const [codes,         setCodes]         = useState<PromoCode[]>(MOCK_CODES);
  const [showForm,      setShowForm]      = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  /* ── New code form state ─── */
  const [newCode,        setNewCode]        = useState("");
  const [discountType,   setDiscountType]   = useState<"percent" | "fixed">("percent");
  const [discountValue,  setDiscountValue]  = useState(20);
  const [maxUses,        setMaxUses]        = useState<number | "">("");
  const [expiresAt,      setExpiresAt]      = useState("");
  const [formError,      setFormError]      = useState("");

  function toggleCode(id: string) {
    setCodes((p) => p.map((c) => (c.id === id ? { ...c, is_active: !c.is_active } : c)));
  }

  function confirmDelete(id: string) { setDeleteConfirm(id); }
  function doDelete(id: string) {
    setCodes((p) => p.filter((c) => c.id !== id));
    setDeleteConfirm(null);
  }

  function resetForm() {
    setNewCode(""); setDiscountType("percent"); setDiscountValue(20);
    setMaxUses(""); setExpiresAt(""); setFormError(""); setShowForm(false);
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newCode.trim())          { setFormError("Code is required.");  return; }
    if (discountValue <= 0)       { setFormError("Discount must be > 0."); return; }
    if (discountType === "percent" && discountValue > 100) { setFormError("Percent discount cannot exceed 100."); return; }
    if (codes.some((c) => c.code === newCode.toUpperCase())) {
      setFormError("That code already exists."); return;
    }
    setCodes((p) => [{
      id: Date.now().toString(), code: newCode.toUpperCase(),
      discount_type: discountType, discount_value: discountValue,
      max_uses: maxUses || null, uses_count: 0,
      expires_at: expiresAt || null, is_active: true,
    }, ...p]);
    resetForm();
  }

  function discountLabel(c: PromoCode) {
    return c.discount_type === "percent" ? `${c.discount_value}% off` : `৳${c.discount_value.toLocaleString()} off`;
  }

  function isExpired(c: PromoCode) {
    return !!c.expires_at && new Date(c.expires_at) < new Date();
  }

  function statusBadge(c: PromoCode): { label: string; cls: string } {
    if (!c.is_active || isExpired(c))                         return { label: "Disabled",  cls: "bg-slate-100 text-slate-500"  };
    if (c.max_uses !== null && c.uses_count >= c.max_uses)    return { label: "Maxed Out", cls: "bg-amber-100 text-amber-700"  };
    return                                                           { label: "Active",    cls: "bg-emerald-100 text-emerald-700" };
  }

  const activeCount = codes.filter((c) => c.is_active && !isExpired(c)).length;
  const totalUses   = codes.reduce((s, c) => s + c.uses_count, 0);

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">

      {/* ── Sidebar stub ─────────────────────────────────────── */}
      <aside className="hidden lg:flex w-56 bg-slate-900 flex-col shrink-0">
        <div className="px-5 py-5 border-b border-slate-700">
          <p className="font-bold text-white text-sm">IH Mathematics</p>
          <p className="text-xs text-amber-400 font-medium">Admin Panel</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {[
            { label: "Overview",    href: "/dashboard/admin",              icon: "🏠" },
            { label: "Courses",     href: "/dashboard/admin#courses",      icon: "📚" },
            { label: "Promo Codes", href: "/dashboard/admin/promo-codes",  icon: "🏷️" },
            { label: "Papers",      href: "/past-papers",                  icon: "📄" },
          ].map(({ label, href, icon }) => (
            <a key={label} href={href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              label === "Promo Codes"
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}>
              <span>{icon}</span>{label}
            </a>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-slate-700">
          <p className="text-xs text-slate-500 truncate">{adminName}</p>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4 shrink-0">
          <nav className="flex items-center gap-2 text-sm text-slate-400">
            <a href="/dashboard/admin" className="hover:text-indigo-600 transition-colors">Admin</a>
            <span>/</span>
            <span className="text-slate-700 font-medium">Promo Codes</span>
          </nav>
          <div className="ml-auto">
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors flex items-center gap-2"
            >
              <span>+</span> New Promo Code
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total Codes",   value: codes.length,  color: "bg-blue-50 text-blue-700"    },
              { label: "Active Codes",  value: activeCount,   color: "bg-emerald-50 text-emerald-700" },
              { label: "Total Uses",    value: totalUses,     color: "bg-indigo-50 text-indigo-700" },
            ].map(({ label, value, color }) => (
              <div key={label} className={`rounded-2xl p-5 ${color}`}>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs font-medium mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Create form */}
          {showForm && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-slate-900 text-lg">New Promo Code</h2>
                <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 text-sm px-2">✕</button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                {formError && (
                  <div className="px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                    {formError}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Code */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Promo Code</label>
                    <input
                      value={newCode}
                      onChange={(e) => { setNewCode(e.target.value.toUpperCase().replace(/\s/g, "")); setFormError(""); }}
                      placeholder="e.g. SAVE50"
                      maxLength={20}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:font-normal"
                    />
                  </div>

                  {/* Discount type */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Discount Type</label>
                    <div className="flex">
                      <button
                        type="button"
                        onClick={() => setDiscountType("percent")}
                        className={`flex-1 py-2.5 text-sm font-semibold rounded-l-xl border transition-colors ${
                          discountType === "percent"
                            ? "bg-indigo-600 border-indigo-600 text-white"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        % Percent
                      </button>
                      <button
                        type="button"
                        onClick={() => setDiscountType("fixed")}
                        className={`flex-1 py-2.5 text-sm font-semibold rounded-r-xl border-t border-b border-r transition-colors ${
                          discountType === "fixed"
                            ? "bg-indigo-600 border-indigo-600 text-white"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        ৳ Fixed
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  {/* Value */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Discount Value</label>
                    <div className="flex">
                      <span className="px-3 py-2.5 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 text-slate-500 text-sm font-semibold">
                        {discountType === "percent" ? "%" : "৳"}
                      </span>
                      <input
                        type="number"
                        min={1}
                        max={discountType === "percent" ? 100 : undefined}
                        value={discountValue}
                        onChange={(e) => setDiscountValue(Number(e.target.value))}
                        className="flex-1 px-3 py-2.5 rounded-r-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Max uses */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Max Uses</label>
                    <input
                      type="number"
                      min={1}
                      value={maxUses}
                      onChange={(e) => setMaxUses(e.target.value ? Number(e.target.value) : "")}
                      placeholder="Unlimited"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder:text-slate-400"
                    />
                  </div>

                  {/* Expiry */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Expires On</label>
                    <input
                      type="date"
                      value={expiresAt}
                      onChange={(e) => setExpiresAt(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                    />
                  </div>
                </div>

                {/* Preview */}
                {newCode && (
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 flex items-center gap-3">
                    <code className="text-base font-bold text-indigo-700 bg-white px-3 py-1 rounded-lg border border-indigo-200 tracking-wider">
                      {newCode}
                    </code>
                    <span className="text-sm text-indigo-600 font-medium">
                      gives {discountType === "percent" ? `${discountValue}%` : `৳${discountValue.toLocaleString()}`} off
                      {maxUses ? ` · max ${maxUses} uses` : " · unlimited uses"}
                      {expiresAt ? ` · expires ${new Date(expiresAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}` : ""}
                    </span>
                  </div>
                )}

                <div className="flex gap-3 pt-1">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all"
                  >
                    Create Code
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Codes table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-semibold text-slate-800">All Promo Codes</h2>
              <span className="text-xs text-slate-400">{codes.length} code{codes.length !== 1 ? "s" : ""}</span>
            </div>

            {codes.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <p className="text-4xl mb-3">🏷️</p>
                <p className="font-medium text-slate-600">No promo codes yet</p>
                <p className="text-sm mt-1">Create your first discount code above</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {codes.map((code) => {
                  const badge   = statusBadge(code);
                  const expired = isExpired(code);

                  /* Delete confirmation row */
                  if (deleteConfirm === code.id) {
                    return (
                      <div key={code.id} className="px-6 py-4 bg-red-50 border-l-4 border-red-400 flex items-center gap-4">
                        <span className="text-sm text-slate-700 flex-1">
                          Delete code <strong>{code.code}</strong>? This cannot be undone.
                        </span>
                        <button onClick={() => doDelete(code.id)} className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors">
                          Yes, Delete
                        </button>
                        <button onClick={() => setDeleteConfirm(null)} className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-white transition-colors">
                          Cancel
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div key={code.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
                      {/* Code + badge */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1.5">
                          <code className="text-base font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg tracking-widest">
                            {code.code}
                          </code>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${badge.cls}`}>
                            {badge.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                          <span className="font-semibold text-slate-600">{discountLabel(code)}</span>
                          <span>Used: <strong className="text-slate-700">{code.uses_count}</strong>{code.max_uses ? `/${code.max_uses}` : ""}</span>
                          {code.expires_at ? (
                            <span className={expired ? "text-red-400 font-medium" : ""}>
                              {expired ? "Expired" : "Expires"}: {new Date(code.expires_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                            </span>
                          ) : (
                            <span>No expiry</span>
                          )}
                        </div>
                      </div>

                      {/* Usage progress */}
                      {code.max_uses !== null && (
                        <div className="hidden md:block w-32">
                          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                code.uses_count >= code.max_uses ? "bg-red-400" : "bg-indigo-500"
                              }`}
                              style={{ width: `${Math.min((code.uses_count / code.max_uses) * 100, 100)}%` }}
                            />
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 text-right">
                            {code.uses_count}/{code.max_uses} uses
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => toggleCode(code.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            code.is_active
                              ? "bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700"
                              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          }`}
                        >
                          {code.is_active ? "Disable" : "Enable"}
                        </button>
                        <button
                          onClick={() => confirmDelete(code.id)}
                          className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete code"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* SQL setup */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <p className="text-xs font-bold text-slate-600">
              📋 To persist promo codes in Supabase, run this SQL once:
            </p>
            <pre className="text-xs bg-white border border-slate-200 rounded-xl p-4 overflow-x-auto text-slate-700 leading-relaxed">{`CREATE TABLE IF NOT EXISTS promo_codes (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code          text UNIQUE NOT NULL,
  discount_type text NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
  discount_value integer NOT NULL,
  max_uses      integer,
  uses_count    integer DEFAULT 0,
  expires_at    timestamptz,
  is_active     boolean DEFAULT true,
  created_at    timestamptz DEFAULT now()
);
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access" ON promo_codes USING (true) WITH CHECK (true);`}</pre>
          </div>

        </main>
      </div>
    </div>
  );
}
