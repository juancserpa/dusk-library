import { useState, useMemo, useEffect, useCallback } from "react";

// ============================================================
// "AI AND THE DUSK OF HUMANS" — THE AI READING LIST
// v4: Fresh modern design — dark hero, glassmorphism cards,
// gradient accents, Inter-style system font stack
// ============================================================

const C = {
  bg: "#f5f5f7",
  white: "#ffffff",
  dark: "#1d1d1f",
  darkSoft: "#2d2d30",
  gray900: "#1d1d1f",
  gray800: "#3a3a3c",
  gray600: "#6e6e73",
  gray500: "#86868b",
  gray400: "#aeaeb2",
  gray300: "#d1d1d6",
  gray200: "#e5e5ea",
  gray100: "#f2f2f7",
  accent: "#6366f1",      // indigo
  accentSoft: "#6366f115",
  accentLight: "#eef2ff",
  accentGlow: "#6366f130",
  accentDark: "#4f46e5",
  warm: "#f97316",         // orange for highlights
  warmSoft: "#fff7ed",
  green: "#10b981",
  rose: "#f43f5e",
  sky: "#0ea5e9",
  violet: "#8b5cf6",
  amber: "#f59e0b",
};

const font = { fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', system-ui, sans-serif" };
const mono = { fontFamily: "'SF Mono', 'Fira Code', 'Courier New', monospace" };

// --- 11 BROWSING QUESTIONS ---
const QUESTIONS = [
  { label: "Will AI take my job?",                 icon: "💼", gradient: "linear-gradient(135deg, #10b981, #059669)" },
  { label: "How fast is this happening?",          icon: "⚡", gradient: "linear-gradient(135deg, #f59e0b, #d97706)" },
  { label: "What happens to meaning and purpose?", icon: "🔮", gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)" },
  { label: "Is AI actually dangerous?",            icon: "🔴", gradient: "linear-gradient(135deg, #f43f5e, #e11d48)" },
  { label: "Can AI think or feel?",                icon: "🧠", gradient: "linear-gradient(135deg, #6366f1, #4f46e5)" },
  { label: "How do I actually use AI well?",       icon: "🛠", gradient: "linear-gradient(135deg, #0ea5e9, #0284c7)" },
  { label: "What happens to love and connection?", icon: "💜", gradient: "linear-gradient(135deg, #ec4899, #db2777)" },
  { label: "Who controls AI?",                     icon: "⚖️", gradient: "linear-gradient(135deg, #64748b, #475569)" },
  { label: "What happens to education?",           icon: "📚", gradient: "linear-gradient(135deg, #14b8a6, #0d9488)" },
  { label: "What does AI cost the planet?",        icon: "🌱", gradient: "linear-gradient(135deg, #22c55e, #16a34a)" },
  { label: "Am I still the real me?",              icon: "🪞", gradient: "linear-gradient(135deg, #a855f7, #9333ea)" },
];

const TYPE_META = {
  article:  { label: "Article",  color: "#f43f5e", bg: "#fef2f2", icon: "📰" },
  paper:    { label: "Research", color: "#6366f1", bg: "#eef2ff", icon: "🔬" },
  podcast:  { label: "Podcast",  color: "#8b5cf6", bg: "#f5f3ff", icon: "🎧" },
  video:    { label: "Video",    color: "#0ea5e9", bg: "#f0f9ff", icon: "▶️"  },
  book:     { label: "Book",     color: "#f59e0b", bg: "#fffbeb", icon: "📖" },
  report:   { label: "Report",   color: "#10b981", bg: "#ecfdf5", icon: "📊" },
  legal:    { label: "Legal",    color: "#64748b", bg: "#f8fafc", icon: "⚖️"  },
  series:   { label: "Series",   color: "#ec4899", bg: "#fdf2f8", icon: "📺" },
};

const DIFF_META = {
  quick:    { label: "Quick read",  color: "#10b981", icon: "⚡" },
  moderate: { label: "Moderate",    color: "#f59e0b", icon: "📖" },
  deep:     { label: "Deep dive",   color: "#6366f1", icon: "🏊" },
};

const CHAPTERS = [
  { id: "prologue", label: "Prologue", short: "Prologue", title: "Welcome to Second Place" },
  { id: "ch1",  label: "Chapter 1",  short: "Ch 1" },
  { id: "ch2",  label: "Chapter 2",  short: "Ch 2" },
  { id: "ch3",  label: "Chapter 3",  short: "Ch 3" },
  { id: "ch4",  label: "Chapter 4",  short: "Ch 4" },
  { id: "ch5",  label: "Chapter 5",  short: "Ch 5" },
  { id: "ch6",  label: "Chapter 6",  short: "Ch 6" },
  { id: "ch7",  label: "Chapter 7",  short: "Ch 7" },
  { id: "ch8",  label: "Chapter 8",  short: "Ch 8" },
  { id: "ch9",  label: "Chapter 9",  short: "Ch 9" },
  { id: "ch10", label: "Chapter 10", short: "Ch 10" },
  { id: "ch11", label: "Chapter 11", short: "Ch 11" },
  { id: "ch12", label: "Chapter 12", short: "Ch 12" },
  { id: "ch13", label: "Chapter 13", short: "Ch 13" },
  { id: "ch14", label: "Chapter 14", short: "Ch 14" },
  { id: "ch15", label: "Chapter 15", short: "Ch 15" },
  { id: "ch16", label: "Chapter 16", short: "Ch 16" },
  { id: "ch17", label: "Chapter 17", short: "Ch 17" },
  { id: "ch18", label: "Chapter 18", short: "Ch 18" },
];

const CHAPTER_IDS = CHAPTERS.map(c => c.id);

async function loadAllEntries() {
  const results = await Promise.allSettled(
    CHAPTER_IDS.map(ch =>
      fetch(`/data/${ch}_references.json`)
        .then(r => r.ok ? r.json() : null)
    )
  );
  return results
    .filter(r => r.status === "fulfilled" && r.value)
    .flatMap(r => r.value.entries);
}

// --- MAIN ---
export default function DuskLibrary() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selQ, setSelQ] = useState([]);
  const [selKw, setSelKw] = useState([]);
  const [selTypes, setSelTypes] = useState([]);
  const [selDiff, setSelDiff] = useState([]);
  const [selChapter, setSelChapter] = useState(null);
  const [sort, setSort] = useState("chapter");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [page, setPage] = useState(1);
  const PER = 12;

  useEffect(() => {
    loadAllEntries()
      .then(data => { setEntries(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const allKeywords = useMemo(() => {
    const set = new Set();
    entries.forEach(e => (e.keywords || []).forEach(k => set.add(k)));
    return [...set].sort();
  }, [entries]);

  const activeChapters = useMemo(() => {
    const set = new Set(entries.map(e => e.chapter));
    return CHAPTERS.filter(c => set.has(c.id));
  }, [entries]);

  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 200);
    return () => clearTimeout(t);
  }, [search]);

  const results = useMemo(() => {
    let r = [...entries];
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      r = r.filter(i =>
        (i.title || "").toLowerCase().includes(q) ||
        (i.author || "").toLowerCase().includes(q) ||
        (i.source || "").toLowerCase().includes(q) ||
        (i.hook || "").toLowerCase().includes(q) ||
        (i.why_it_matters || "").toLowerCase().includes(q)
      );
    }
    if (selQ.length) r = r.filter(i => selQ.some(q => (i.questions || []).includes(q)));
    if (selKw.length) r = r.filter(i => selKw.some(k => (i.keywords || []).includes(k)));
    if (selTypes.length) r = r.filter(i => selTypes.includes(i.type));
    if (selDiff.length) r = r.filter(i => selDiff.includes(i.difficulty));
    if (selChapter) r = r.filter(i => i.chapter === selChapter);

    r.sort((a, b) => {
      if (sort === "chapter") {
        const ci = CHAPTER_IDS.indexOf(a.chapter) - CHAPTER_IDS.indexOf(b.chapter);
        if (ci !== 0) return ci;
        return (a.id || "").localeCompare(b.id || "");
      }
      if (sort === "year") return (b.year || 0) - (a.year || 0);
      if (sort === "title") return (a.title || "").localeCompare(b.title || "");
      return 0;
    });
    return r;
  }, [entries, debouncedSearch, selQ, selKw, selTypes, selDiff, selChapter, sort]);

  const totalPages = Math.ceil(results.length / PER);
  const visible = results.slice((page - 1) * PER, page * PER);
  useEffect(() => setPage(1), [debouncedSearch, selQ, selKw, selTypes, selDiff, selChapter]);

  const startHereItems = useMemo(() => entries.filter(i => i.startHere), [entries]);
  const hasFilters = selQ.length > 0 || selKw.length > 0 || selTypes.length > 0 || selDiff.length > 0 || selChapter || search;

  const clearAll = useCallback(() => {
    setSelQ([]); setSelKw([]); setSelTypes([]); setSelDiff([]); setSelChapter(null); setSearch("");
  }, []);

  const tog = (set, v) => set(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);

  return (
    <div style={{ ...font, minHeight: "100vh", background: C.bg, color: C.dark }}>

      {/* ===== DARK HERO ===== */}
      <header style={{
        background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Subtle grid overlay */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.03,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }} />
        {/* Glow accent */}
        <div style={{
          position: "absolute", top: "-40%", left: "50%", transform: "translateX(-50%)",
          width: 600, height: 400, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(99,102,241,0.15), transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 960, margin: "0 auto", padding: "56px 28px 44px", position: "relative", textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px",
            borderRadius: 20, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
            marginBottom: 24,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
            <span style={{ ...font, fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 500, letterSpacing: "0.02em" }}>
              {loading ? "Loading..." : `${entries.length} sources curated`}
            </span>
          </div>

          <h1 style={{ ...font, margin: 0, lineHeight: 1.15 }}>
            <span style={{
              display: "block", fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 700,
              color: "#ffffff", letterSpacing: "-0.03em",
            }}>
              The AI Reading List
            </span>
          </h1>
          <p style={{
            ...font, fontSize: "clamp(15px, 2.2vw, 18px)", lineHeight: 1.6,
            color: "rgba(255,255,255,0.5)", maxWidth: 480, margin: "16px auto 0", fontWeight: 400,
          }}>
            Articles, podcasts, and research for humans figuring out what comes next.
          </p>

          {/* Question pills in hero */}
          <div style={{ maxWidth: 720, margin: "32px auto 0" }}>
            <p style={{ ...font, fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.35)", marginBottom: 14, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              What are you curious about?
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
              {QUESTIONS.map(q => {
                const active = selQ.includes(q.label);
                const count = entries.filter(i => (i.questions || []).includes(q.label)).length;
                if (count === 0 && !loading) return null;
                return (
                  <button
                    key={q.label}
                    onClick={() => tog(setSelQ, q.label)}
                    style={{
                      ...font, fontSize: 13, fontWeight: active ? 600 : 450,
                      padding: "8px 16px", borderRadius: 20,
                      background: active ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${active ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.08)"}`,
                      color: active ? "#fff" : "rgba(255,255,255,0.55)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      display: "flex", alignItems: "center", gap: 6,
                      backdropFilter: "blur(8px)",
                    }}
                    onMouseEnter={e => { if (!active) { e.target.style.background = "rgba(255,255,255,0.08)"; e.target.style.borderColor = "rgba(255,255,255,0.15)"; e.target.style.color = "rgba(255,255,255,0.8)"; }}}
                    onMouseLeave={e => { if (!active) { e.target.style.background = "rgba(255,255,255,0.04)"; e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.color = "rgba(255,255,255,0.55)"; }}}
                  >
                    <span style={{ fontSize: 14 }}>{q.icon}</span>
                    {q.label}
                    {count > 0 && (
                      <span style={{
                        ...mono, fontSize: 10, fontWeight: 600,
                        background: active ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)",
                        color: active ? "#fff" : "rgba(255,255,255,0.4)",
                        padding: "1px 6px", borderRadius: 8, marginLeft: 2,
                      }}>{count}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* ===== START HERE ===== */}
      {startHereItems.length > 0 && !hasFilters && (
        <section style={{ maxWidth: 960, margin: "0 auto", padding: "36px 28px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 28, height: 28, borderRadius: 8, background: C.warmSoft, fontSize: 14,
            }}>⭐</span>
            <h2 style={{ ...font, fontSize: 16, fontWeight: 700, color: C.dark, margin: 0, letterSpacing: "-0.02em" }}>
              If you read nothing else
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
            {startHereItems.map(item => <StartCard key={item.id} item={item} />)}
          </div>
        </section>
      )}

      {/* ===== SEARCH + FILTERS (sticky) ===== */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: `rgba(245,245,247,0.85)`, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        borderBottom: `1px solid ${C.gray200}`, padding: "12px 0",
        marginTop: 24,
      }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 28px" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            {/* Search */}
            <div style={{
              flex: 1, minWidth: 220, display: "flex", alignItems: "center", gap: 10,
              background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 10,
              padding: "10px 14px", boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.gray400} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
              <input type="text" placeholder="Search by title, author, topic..."
                value={search} onChange={e => setSearch(e.target.value)}
                aria-label="Search references"
                style={{ ...font, flex: 1, background: "none", border: "none", fontSize: 14, color: C.dark, outline: "none", fontWeight: 400 }}
                onFocus={e => { e.target.parentNode.style.borderColor = C.accent; e.target.parentNode.style.boxShadow = `0 0 0 3px ${C.accentGlow}`; }}
                onBlur={e => { e.target.parentNode.style.borderColor = C.gray200; e.target.parentNode.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)"; }}
              />
              {search && <button onClick={() => setSearch("")} aria-label="Clear search" style={{ background: "none", border: "none", color: C.gray400, cursor: "pointer", fontSize: 18, lineHeight: 1, padding: 2 }}>×</button>}
            </div>

            {/* Filters toggle */}
            <button onClick={() => setFiltersOpen(!filtersOpen)} style={{
              ...font, fontSize: 13, fontWeight: 500, padding: "10px 16px", borderRadius: 10, cursor: "pointer",
              background: filtersOpen ? C.accentLight : C.white,
              border: `1px solid ${filtersOpen ? C.accent + "40" : C.gray200}`,
              color: filtersOpen ? C.accent : C.gray600,
              display: "flex", alignItems: "center", gap: 6,
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              transition: "all 0.2s",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
              Filters
              {(selTypes.length + selDiff.length + selKw.length > 0) && <span style={{
                background: C.accent, color: "#fff", borderRadius: "50%", width: 18, height: 18,
                display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700,
              }}>{selTypes.length + selDiff.length + selKw.length}</span>}
            </button>

            {/* Sort */}
            <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort entries" style={{
              ...font, fontSize: 13, padding: "10px 12px", borderRadius: 10,
              background: C.white, border: `1px solid ${C.gray200}`, color: C.gray600, cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)", fontWeight: 500,
            }}>
              <option value="chapter">By chapter</option>
              <option value="year">Newest first</option>
              <option value="title">A → Z</option>
            </select>

            {hasFilters && (
              <button onClick={clearAll} style={{ ...font, fontSize: 13, color: C.accent, background: "none", border: "none", cursor: "pointer", fontWeight: 600, padding: "6px 4px" }}>
                Clear all
              </button>
            )}
          </div>

          {/* Expanded filter panel */}
          {filtersOpen && (
            <div style={{ marginTop: 10, padding: "18px 20px", background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}>
              {activeChapters.length > 1 && (
                <FRow label="Chapter">
                  <FilterTag label="All" active={!selChapter} color={C.accent} onClick={() => setSelChapter(null)} />
                  {activeChapters.map(ch => {
                    const count = entries.filter(e => e.chapter === ch.id).length;
                    return <FilterTag key={ch.id} label={`${ch.short} (${count})`} active={selChapter === ch.id} color={C.accent} onClick={() => setSelChapter(selChapter === ch.id ? null : ch.id)} />;
                  })}
                </FRow>
              )}
              <FRow label="Type">
                {Object.entries(TYPE_META).map(([t, m]) => (
                  <FilterTag key={t} label={`${m.icon} ${m.label}`} active={selTypes.includes(t)} color={m.color} onClick={() => tog(setSelTypes, t)} />
                ))}
              </FRow>
              <FRow label="Depth">
                {Object.entries(DIFF_META).map(([d, m]) => (
                  <FilterTag key={d} label={`${m.icon} ${m.label}`} active={selDiff.includes(d)} color={m.color} onClick={() => tog(setSelDiff, d)} />
                ))}
              </FRow>
              {allKeywords.length > 0 && (
                <FRow label="Topics" last>
                  {allKeywords.map(kw => (
                    <FilterTag key={kw} label={kw} active={selKw.includes(kw)} color={C.gray600} onClick={() => tog(setSelKw, kw)} />
                  ))}
                </FRow>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ===== ACTIVE QUESTION TAGS ===== */}
      {selQ.length > 0 && (
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "16px 28px 0" }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ ...font, fontSize: 12, color: C.gray500, fontWeight: 500 }}>Filtering:</span>
            {selQ.map(q => {
              const qObj = QUESTIONS.find(x => x.label === q);
              return (
                <span key={q} style={{
                  ...font, fontSize: 12, padding: "4px 10px 4px 8px", borderRadius: 8,
                  background: C.accentLight, color: C.accent, fontWeight: 600,
                  display: "inline-flex", alignItems: "center", gap: 4, border: `1px solid ${C.accent}20`,
                }}>
                  {qObj?.icon} {q}
                  <button onClick={() => tog(setSelQ, q)} style={{ background: "none", border: "none", color: C.accent, cursor: "pointer", fontSize: 14, lineHeight: 1, marginLeft: 2 }}>×</button>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== RESULTS ===== */}
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "20px 28px 80px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <p style={{ ...font, fontSize: 13, color: C.gray500, fontWeight: 500 }}>
            {loading ? "Loading..." :
              results.length === entries.length ? `${results.length} sources` : `${results.length} of ${entries.length} sources`}
          </p>
        </div>

        {!loading && results.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
            <p style={{ ...font, fontSize: 18, fontWeight: 600, marginBottom: 8, color: C.dark }}>No matches</p>
            <p style={{ fontSize: 14, color: C.gray500, marginBottom: 20 }}>Try a different question or clear your filters.</p>
            <button onClick={clearAll} style={{ ...font, background: C.accent, border: "none", color: "#fff", padding: "10px 24px", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>Clear all filters</button>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
              {visible.map(item => (
                <Card key={item.id} item={item} isExpanded={expanded === item.id}
                  onToggle={() => setExpanded(expanded === item.id ? null : item.id)} />
              ))}
            </div>
            {totalPages > 1 && (
              <nav aria-label="Pagination" style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 36 }}>
                {page > 1 && <PgBtn label="← Prev" onClick={() => setPage(page - 1)} />}
                <span style={{ ...font, fontSize: 13, color: C.gray500, padding: "8px 14px", display: "flex", alignItems: "center", fontWeight: 500 }}>
                  {page} of {totalPages}
                </span>
                {page < totalPages && <PgBtn label="Next →" onClick={() => setPage(page + 1)} />}
              </nav>
            )}
          </>
        )}
      </main>

      {/* ===== FOOTER ===== */}
      <footer style={{
        background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)",
        padding: "48px 28px", textAlign: "center",
      }}>
        <p style={{ ...font, fontSize: 18, fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: "-0.02em" }}>
          AI and the Dusk of Humans
        </p>
        <p style={{ ...font, fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 8 }}>
          A living reading list, curated by Juan Camilo Serpa
        </p>
        <p style={{ ...font, fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 14 }}>
          McGill University · Master of Management in Analytics
        </p>
      </footer>
    </div>
  );
}


// ===== SUB-COMPONENTS =====

function StartCard({ item }) {
  const [hover, setHover] = useState(false);
  const tm = TYPE_META[item.type] || { label: item.type, color: C.gray600, icon: "📄" };
  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ textDecoration: "none", color: "inherit" }}>
      <article style={{
        borderRadius: 14, overflow: "hidden",
        background: C.white,
        border: `1px solid ${hover ? C.accent + "40" : C.gray200}`,
        boxShadow: hover ? `0 8px 24px rgba(99,102,241,0.1)` : `0 1px 3px rgba(0,0,0,0.05)`,
        transition: "all 0.25s ease",
        transform: hover ? "translateY(-2px)" : "none",
        display: "flex", flexDirection: "column",
      }}>
        {/* Gradient bar */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${tm.color}, ${tm.color}60)` }} />

        <div style={{ padding: "18px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{
              ...font, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
              color: tm.color, padding: "2px 8px", borderRadius: 4, background: tm.bg,
            }}>
              {tm.icon} {tm.label}
            </span>
            <span style={{ ...font, fontSize: 11, color: C.gray400, fontWeight: 500 }}>{item.time}</span>
          </div>

          <h3 style={{ ...font, fontSize: 15, fontWeight: 700, lineHeight: 1.35, margin: "0 0 8px", color: C.dark, letterSpacing: "-0.01em" }}>
            {item.title}
          </h3>

          <p style={{ ...font, fontSize: 13, color: C.gray600, margin: "0 0 12px", lineHeight: 1.55, flex: 1 }}>
            {item.hook}
          </p>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ ...font, fontSize: 11, color: C.gray400 }}>
              {item.source} · {item.year}
            </span>
            <span style={{ ...font, fontSize: 11, color: C.warm, fontWeight: 700 }}>⭐ Start Here</span>
          </div>
        </div>
      </article>
    </a>
  );
}


function Card({ item, isExpanded, onToggle }) {
  const [hover, setHover] = useState(false);
  const tm = TYPE_META[item.type] || { label: item.type, color: C.gray600, icon: "📄", bg: C.gray100 };
  const dm = DIFF_META[item.difficulty] || { label: "", color: C.gray500, icon: "" };
  const chapterObj = CHAPTERS.find(c => c.id === item.chapter);
  const chapterLabel = chapterObj?.short || item.chapter;

  return (
    <article
      onClick={onToggle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: "20px 22px",
        borderRadius: 14,
        background: C.white,
        border: `1px solid ${isExpanded ? C.accent + "30" : (hover ? C.gray300 : C.gray200)}`,
        boxShadow: hover || isExpanded ? `0 4px 16px rgba(0,0,0,0.06)` : "0 1px 2px rgba(0,0,0,0.03)",
        cursor: "pointer",
        transition: "all 0.2s ease",
        transform: hover && !isExpanded ? "translateY(-1px)" : "none",
      }}
    >
      <div style={{ display: "flex", gap: 16 }}>
        {/* Type icon badge */}
        <div style={{
          width: 48, minWidth: 48, height: 48, borderRadius: 12,
          background: tm.bg, border: `1px solid ${tm.color}15`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, flexShrink: 0,
        }}>
          {tm.icon}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Meta row */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
            <span style={{
              ...font, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em",
              color: tm.color,
            }}>
              {tm.label}
            </span>
            <span style={{ color: C.gray300 }}>·</span>
            <span style={{ ...font, fontSize: 12, color: C.gray500 }}>{item.time}</span>
            <span style={{ color: C.gray300 }}>·</span>
            <span style={{ ...font, fontSize: 12, color: dm.color, fontWeight: 500 }}>{dm.label}</span>
            <span style={{ flex: 1 }} />
            <span style={{ ...font, fontSize: 11, color: C.gray400, fontWeight: 500 }}>{chapterLabel} · {item.year}</span>
          </div>

          {/* Title */}
          <h3 style={{ ...font, fontSize: 17, fontWeight: 700, lineHeight: 1.35, margin: "0 0 2px", color: C.dark, letterSpacing: "-0.02em" }}>
            {item.title}
            {item.startHere && <span style={{ marginLeft: 8, fontSize: 13, color: C.warm }}>⭐</span>}
          </h3>

          {/* Author line */}
          <p style={{ ...font, fontSize: 12, color: C.gray500, margin: "0 0 8px", fontWeight: 500 }}>
            {item.author}{item.source ? ` · ${item.source}` : ""}
          </p>

          {/* Hook */}
          <p style={{ ...font, fontSize: 14, lineHeight: 1.6, color: C.gray800, margin: 0, fontWeight: 400 }}>
            {item.hook}
          </p>

          {/* Expanded content */}
          {isExpanded && (
            <div style={{ marginTop: 18 }}>
              {/* Why it matters */}
              {item.why_it_matters && (
                <div style={{
                  padding: "14px 16px", background: C.accentLight, borderRadius: 10,
                  marginBottom: 14, borderLeft: `3px solid ${C.accent}`,
                }}>
                  <p style={{ ...font, fontSize: 11, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>Why it matters for the book</p>
                  <p style={{ ...font, fontSize: 13, lineHeight: 1.6, color: C.gray800, margin: 0 }}>{item.why_it_matters}</p>
                </div>
              )}

              {/* Summary */}
              {item.summary && (
                <p style={{ ...font, fontSize: 13, lineHeight: 1.65, color: C.gray600, margin: "0 0 14px" }}>
                  {item.summary}
                </p>
              )}

              {/* Tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 16 }}>
                {(item.keywords || []).map(kw => (
                  <span key={kw} style={{
                    ...font, fontSize: 11, padding: "3px 10px", borderRadius: 6,
                    background: C.gray100, color: C.gray600, fontWeight: 500,
                  }}>{kw}</span>
                ))}
                {(item.questions || []).map(q => {
                  const qObj = QUESTIONS.find(x => x.label === q);
                  return (
                    <span key={q} style={{
                      ...font, fontSize: 11, padding: "3px 10px", borderRadius: 6,
                      background: C.accentLight, color: C.accent, fontWeight: 500,
                      display: "inline-flex", alignItems: "center", gap: 3,
                    }}>
                      {qObj?.icon} {q}
                    </span>
                  );
                })}
              </div>

              {/* CTA button */}
              <a href={item.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                style={{
                  ...font, fontSize: 13, fontWeight: 600, color: "#fff", textDecoration: "none",
                  display: "inline-flex", alignItems: "center", gap: 7,
                  padding: "10px 22px", borderRadius: 10, background: C.accent,
                  transition: "background 0.2s", boxShadow: `0 2px 8px ${C.accentGlow}`,
                }}
                onMouseEnter={e => e.target.style.background = C.accentDark}
                onMouseLeave={e => e.target.style.background = C.accent}
              >
                {item.type === "podcast" ? "🎧 Listen" : item.type === "video" ? "▶️ Watch" : "📖 Read"} the source
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}


function FRow({ label, children, last }) {
  return (
    <fieldset style={{ marginBottom: last ? 0 : 14, border: "none", padding: 0 }}>
      <legend style={{ ...font, fontSize: 11, color: C.gray500, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>{label}</legend>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{children}</div>
    </fieldset>
  );
}

function FilterTag({ label, active, onClick, color }) {
  return (
    <button onClick={onClick} style={{
      ...font, fontSize: 12, padding: "5px 12px", borderRadius: 8,
      background: active ? (color + "12") : "transparent",
      border: `1px solid ${active ? color + "30" : C.gray200}`,
      color: active ? color : C.gray600, cursor: "pointer",
      transition: "all 0.15s", fontWeight: active ? 600 : 500,
    }}>{label}</button>
  );
}

function PgBtn({ label, onClick }) {
  return (
    <button onClick={onClick} style={{
      ...font, padding: "8px 18px", borderRadius: 10,
      background: C.white,
      border: `1px solid ${C.gray200}`,
      color: C.gray800, cursor: "pointer", fontSize: 13, fontWeight: 600,
      transition: "all 0.15s",
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    }}>{label}</button>
  );
}
