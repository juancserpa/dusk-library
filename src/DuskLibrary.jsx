import { useState, useMemo, useEffect, useCallback } from "react";

// ============================================================
// "AI AND THE DUSK OF HUMANS" — THE RESEARCH ARCHIVE
// v2: loads from JSON, 11 questions, 20 emoji keywords,
// chapter browsing, card anatomy per design system
// ============================================================

// --- PALETTE (from Visual Design System) ---
const C = {
  cream: "#f7f3eb",
  softWhite: "#fffdf9",
  fog: "#e8e2d8",
  red: "#b83a2a",
  redGlow: "#b83a2a0d",
  redSoft: "#b83a2a1a",
  ink: "#2a2118",
  inkSoft: "#3d332a",
  pencil: "#6b5e52",
  pencilLight: "#9b8d7f",
  pencilFaint: "#bfb5a8",
  charcoal: "#1a1612",
  gold: "#d4a853",
  rule: "#d8cfc3",
  ruleFaint: "#e6dfd6",
};

const serif = { fontFamily: "'Georgia', 'Palatino Linotype', serif" };
const sans = { fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif" };

// --- 11 BROWSING QUESTIONS (exact strings from schema) ---
const QUESTIONS = [
  { label: "Will AI take my job?",                    icon: "💼", color: "#5a7a6b" },
  { label: "How fast is this happening?",             icon: "⏱️", color: "#7a6a4a" },
  { label: "What happens to meaning and purpose?",    icon: "💔", color: "#8a5a6a" },
  { label: "Is AI actually dangerous?",               icon: "⚠️", color: "#8a5a5a" },
  { label: "Can AI think or feel?",                   icon: "🤖", color: "#6b5e8a" },
  { label: "How do I actually use AI well?",          icon: "🔧", color: "#4a6a8a" },
  { label: "What happens to love and connection?",    icon: "❤️", color: "#8a5a6a" },
  { label: "Who controls AI?",                        icon: "🏛️", color: "#5a5a7a" },
  { label: "What happens to education?",              icon: "🎓", color: "#5a6a7a" },
  { label: "What does AI cost the planet?",           icon: "🌍", color: "#5a7a5a" },
  { label: "Am I still the real me?",                 icon: "🪞", color: "#7a6a4a" },
];

// --- 8 MEDIA TYPES (exact strings from schema) ---
const TYPE_META = {
  article:  { label: "Article",  bg: "#f7f3eb", border: "#6b5e52" },
  paper:    { label: "Research", bg: "#e8e2d8", border: "#6b5e52" },
  podcast:  { label: "Podcast",  bg: "#f0e8f5", border: "#7b5e8a" },
  video:    { label: "Video",    bg: "#e8eff5", border: "#4a6a8a" },
  book:     { label: "Book",     bg: "#f5f0e0", border: "#8a7a4a" },
  report:   { label: "Report",   bg: "#e8f0e8", border: "#5a7a5a" },
  legal:    { label: "Legal",    bg: "#f5e8e8", border: "#8a5a5a" },
  series:   { label: "Series",   bg: "#f5ede0", border: "#8a6a4a" },
};

// --- 3 DIFFICULTY LEVELS (exact strings from schema) ---
const DIFF_META = {
  quick:    { label: "Quick read",  color: "#5a7a6b" },
  moderate: { label: "Moderate",    color: "#8a7a4a" },
  deep:     { label: "Deep dive",   color: "#4a6a8a" },
};

// --- CHAPTERS ---
const CHAPTERS = [
  { id: "prologue", label: "Prologue", short: "Prologue" },
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

// --- DATA LOADING (from JSON files per coding standards) ---
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

// --- MAIN COMPONENT ---
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
  const [showStartHere, setShowStartHere] = useState(true);
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
    r.sort((a, b) => (b.startHere ? 1 : 0) - (a.startHere ? 1 : 0));
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
    <div style={{ ...serif, minHeight: "100vh", background: C.cream, color: C.ink }}>
      {/* HERO */}
      <header style={{ background: C.softWhite, borderBottom: `1px solid ${C.rule}` }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "52px 28px 40px", textAlign: "center" }}>
          <h1 style={{ margin: 0, lineHeight: 1.08 }}>
            <span style={{ display: "block", fontSize: "clamp(44px, 6vw, 64px)", fontWeight: 700, color: C.red, letterSpacing: "0.02em", fontStyle: "italic" }}>AI</span>
            <span style={{ display: "block", fontSize: "clamp(17px, 2.3vw, 24px)", fontWeight: 700, color: C.ink, letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 4 }}>and the Dusk of Humans</span>
          </h1>
          <p style={{ ...sans, fontSize: 13, color: C.pencilLight, fontStyle: "italic", marginTop: 14 }}>Surviving as the Second-Smartest Species</p>
          <div style={{ width: 36, height: 2.5, background: C.red, margin: "22px auto 16px", borderRadius: 1 }} />
          <p style={{ ...sans, fontSize: 11, color: C.pencilFaint, letterSpacing: "0.18em", textTransform: "uppercase" }}>The Research Archive</p>
          <p style={{ ...serif, fontSize: 15, lineHeight: 1.65, color: C.pencil, maxWidth: 540, margin: "24px auto 0" }}>
            {loading ? "Loading..." : (
              <>
                {entries.length.toLocaleString()} articles, podcasts, papers, and books on AI and what it means for the rest of us.
                Browse by question, keyword, or chapter — or start with our picks below.
              </>
            )}
          </p>
        </div>
      </header>

      {/* START HERE */}
      {showStartHere && startHereItems.length > 0 && (
        <section style={{ maxWidth: 800, margin: "0 auto", padding: "32px 28px 8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h2 style={{ ...sans, fontSize: 12, fontWeight: 600, color: C.red, letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>If you read nothing else</h2>
              <p style={{ ...sans, fontSize: 11, color: C.pencilFaint, marginTop: 3 }}>{startHereItems.length} essential starting points, hand-picked</p>
            </div>
            <button onClick={() => setShowStartHere(false)} aria-label="Hide Start Here section" style={{ ...sans, fontSize: 11, color: C.pencilFaint, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Hide</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
            {startHereItems.map(item => <StartCard key={item.id} item={item} />)}
          </div>
          <div style={{ height: 1, background: C.rule, margin: "28px 0 0" }} />
        </section>
      )}

      {/* CHAPTER TABS */}
      {activeChapters.length > 1 && (
        <section style={{ maxWidth: 800, margin: "0 auto", padding: "24px 28px 0" }}>
          <h2 style={{ ...sans, fontSize: 11, fontWeight: 500, color: C.pencilFaint, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Browse by chapter</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            <button onClick={() => setSelChapter(null)} style={{ ...sans, fontSize: 11, padding: "5px 12px", borderRadius: 4, cursor: "pointer", background: !selChapter ? C.redSoft : "transparent", border: `1px solid ${!selChapter ? C.red + "40" : C.ruleFaint}`, color: !selChapter ? C.red : C.pencil }}>All</button>
            {activeChapters.map(ch => {
              const count = entries.filter(e => e.chapter === ch.id).length;
              return (
                <button key={ch.id} onClick={() => setSelChapter(selChapter === ch.id ? null : ch.id)} style={{ ...sans, fontSize: 11, padding: "5px 12px", borderRadius: 4, cursor: "pointer", background: selChapter === ch.id ? C.redSoft : "transparent", border: `1px solid ${selChapter === ch.id ? C.red + "40" : C.ruleFaint}`, color: selChapter === ch.id ? C.red : C.pencil }}>
                  {ch.short} <span style={{ fontSize: 10, opacity: 0.6 }}>({count})</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* QUESTION BROWSE */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "24px 28px 0" }}>
        <h2 style={{ ...sans, fontSize: 11, fontWeight: 500, color: C.pencilFaint, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Browse by question</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {QUESTIONS.map(q => {
            const active = selQ.includes(q.label);
            const count = entries.filter(i => (i.questions || []).includes(q.label)).length;
            if (count === 0) return null;
            return (
              <button key={q.label} onClick={() => tog(setSelQ, q.label)} style={{ ...sans, fontSize: 12, padding: "7px 14px", borderRadius: 5, background: active ? q.color + "14" : C.softWhite, border: `1px solid ${active ? q.color + "50" : C.rule}`, color: active ? q.color : C.pencil, cursor: "pointer", transition: "all 0.12s", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 13 }}>{q.icon}</span>
                {q.label}
                <span style={{ ...sans, fontSize: 10, color: active ? q.color : C.pencilFaint, opacity: 0.7 }}>({count})</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* SEARCH + FILTERS */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: `${C.cream}ee`, backdropFilter: "blur(10px)", borderBottom: `1px solid ${C.ruleFaint}`, padding: "12px 0", marginTop: 20 }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 28px" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200, display: "flex", alignItems: "center", gap: 8, background: C.softWhite, border: `1px solid ${C.rule}`, borderRadius: 5, padding: "8px 12px", boxShadow: "0 1px 3px rgba(42,33,24,0.04)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.pencilLight} strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
              <input type="text" placeholder="Search titles, authors, hooks..." value={search} onChange={e => setSearch(e.target.value)} aria-label="Search references" style={{ ...serif, flex: 1, background: "none", border: "none", fontSize: 14, color: C.ink, outline: "none" }} />
              {search && <button onClick={() => setSearch("")} aria-label="Clear search" style={{ background: "none", border: "none", color: C.pencilLight, cursor: "pointer", fontSize: 18, lineHeight: 1 }}>&times;</button>}
            </div>
            <button onClick={() => setFiltersOpen(!filtersOpen)} style={{ ...sans, fontSize: 11, padding: "8px 12px", borderRadius: 5, cursor: "pointer", background: hasFilters ? C.redSoft : C.softWhite, border: `1px solid ${hasFilters ? C.red + "40" : C.rule}`, color: hasFilters ? C.red : C.pencil, display: "flex", alignItems: "center", gap: 5, boxShadow: "0 1px 3px rgba(42,33,24,0.04)" }}>
              Filters
              {(selTypes.length + selDiff.length + selKw.length > 0) && <span style={{ background: C.red, color: C.softWhite, borderRadius: "50%", width: 16, height: 16, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700 }}>{selTypes.length + selDiff.length + selKw.length}</span>}
            </button>
            <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort entries" style={{ ...sans, fontSize: 11, padding: "8px 10px", borderRadius: 5, background: C.softWhite, border: `1px solid ${C.rule}`, color: C.pencil, cursor: "pointer" }}>
              <option value="chapter">By chapter</option>
              <option value="year">Newest first</option>
              <option value="title">A→Z</option>
            </select>
            {hasFilters && <button onClick={clearAll} style={{ ...sans, fontSize: 11, color: C.red, background: "none", border: "none", cursor: "pointer" }}>Clear all</button>}
          </div>
          {filtersOpen && (
            <div style={{ marginTop: 10, padding: "14px 16px", background: C.softWhite, border: `1px solid ${C.rule}`, borderRadius: 6 }}>
              <FRow label="Type">{Object.entries(TYPE_META).map(([t, m]) => (<FilterTag key={t} label={m.label} active={selTypes.includes(t)} color={m.border} onClick={() => tog(setSelTypes, t)} />))}</FRow>
              <FRow label="Difficulty">{Object.entries(DIFF_META).map(([d, m]) => (<FilterTag key={d} label={m.label} active={selDiff.includes(d)} color={m.color} onClick={() => tog(setSelDiff, d)} />))}</FRow>
              {allKeywords.length > 0 && (<FRow label="Keywords" last>{allKeywords.map(kw => (<FilterTag key={kw} label={kw} active={selKw.includes(kw)} color={C.pencil} onClick={() => tog(setSelKw, kw)} />))}</FRow>)}
            </div>
          )}
        </div>
      </div>

      {/* RESULTS */}
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "24px 28px 80px" }}>
        <p style={{ ...sans, fontSize: 11, color: C.pencilFaint, marginBottom: 20 }}>
          {loading ? "Loading references..." : results.length === entries.length ? `All ${results.length} sources` : `${results.length} of ${entries.length}`}
        </p>
        {!loading && results.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px 0", color: C.pencilLight }}>
            <p style={{ fontSize: 16, marginBottom: 12 }}>Nothing matches those filters.</p>
            <button onClick={clearAll} style={{ ...sans, background: "none", border: `1px solid ${C.rule}`, color: C.red, padding: "7px 16px", borderRadius: 5, cursor: "pointer", fontSize: 12 }}>Clear all</button>
          </div>
        ) : (
          <>
            {visible.map((item, idx) => (
              <Card key={item.id} item={item} isExpanded={expanded === item.id} onToggle={() => setExpanded(expanded === item.id ? null : item.id)} isLast={idx === visible.length - 1} />
            ))}
            {totalPages > 1 && (
              <nav aria-label="Pagination" style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 32 }}>
                {page > 1 && <PgBtn label="←" onClick={() => setPage(page - 1)} />}
                {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                  let p;
                  if (totalPages <= 10) p = i + 1;
                  else { const start = Math.max(1, Math.min(page - 4, totalPages - 9)); p = start + i; }
                  return <PgBtn key={p} label={p} active={p === page} onClick={() => setPage(p)} />;
                })}
                {page < totalPages && <PgBtn label="→" onClick={() => setPage(page + 1)} />}
              </nav>
            )}
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${C.rule}`, background: C.charcoal, padding: "32px 28px", textAlign: "center" }}>
        <div style={{ width: 30, height: 2, background: C.red, margin: "0 auto 12px", borderRadius: 1 }} />
        <p style={{ ...sans, fontSize: 11, color: C.pencilLight, letterSpacing: "0.15em", textTransform: "uppercase" }}>Juan Camilo Bastin</p>
        <p style={{ fontSize: 13, color: C.pencilFaint, marginTop: 6, fontStyle: "italic", maxWidth: 440, margin: "6px auto 0" }}>A living database that fed the book — built without writing a single line of code.</p>
        <p style={{ ...sans, fontSize: 10, color: C.pencil, marginTop: 10 }}>McGill University · Master of Management in Analytics</p>
      </footer>
    </div>
  );
}

// ===== SUB-COMPONENTS =====

function StartCard({ item }) {
  const tm = TYPE_META[item.type] || { label: item.type, bg: C.fog, border: C.pencil };
  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
      <article style={{ padding: "16px 18px", borderRadius: 6, background: C.softWhite, border: `1px solid ${C.rule}`, borderLeft: item.startHere ? `2px solid ${C.red}` : `1px solid ${C.rule}`, transition: "all 0.15s", cursor: "pointer", minHeight: 140, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ ...sans, fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: tm.border, display: "flex", alignItems: "center", gap: 3 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: tm.border, opacity: 0.5 }} />{tm.label}
          </span>
          <span style={{ ...sans, fontSize: 9, color: C.pencilFaint }}>{item.time}</span>
        </div>
        <h3 style={{ ...serif, fontSize: 14, fontWeight: 600, lineHeight: 1.35, margin: "0 0 6px", color: C.ink, flex: 1 }}>{item.title}</h3>
        <p style={{ ...sans, fontSize: 11, color: C.pencilLight, margin: "0 0 6px" }}>{item.author ? `${item.author} · ` : ""}{item.source}{item.year ? ` · ${item.year}` : ""}</p>
        <div style={{ ...sans, fontSize: 10, color: C.gold, fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>★ Start Here</div>
      </article>
    </a>
  );
}

function Card({ item, isExpanded, onToggle, isLast }) {
  const tm = TYPE_META[item.type] || { label: item.type, bg: C.fog, border: C.pencil };
  const dm = DIFF_META[item.difficulty] || { label: "", color: C.pencil };
  const qs = QUESTIONS.filter(q => (item.questions || []).includes(q.label));
  const chapterLabel = CHAPTERS.find(c => c.id === item.chapter)?.short || item.chapter;

  return (
    <article onClick={onToggle} style={{ padding: "20px 0 18px", borderBottom: isLast ? "none" : `1px solid ${C.ruleFaint}`, borderLeft: item.startHere ? `2px solid ${C.red}` : "2px solid transparent", paddingLeft: item.startHere ? 16 : 0, cursor: "pointer", transition: "background 0.15s" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7, flexWrap: "wrap" }}>
        <span style={{ ...sans, fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", padding: "2px 8px", borderRadius: 3, background: tm.bg, border: `1px solid ${tm.border}25`, color: tm.border }}>{tm.label}</span>
        <span style={{ ...sans, fontSize: 9, padding: "2px 8px", borderRadius: 3, background: dm.color + "12", color: dm.color, border: `1px solid ${dm.color}25` }}>{dm.label}</span>
        <span style={{ ...sans, fontSize: 10, color: C.pencilFaint }}>{item.time}</span>
        <span style={{ flex: 1 }} />
        <span style={{ ...sans, fontSize: 10, color: C.pencilFaint }}>{chapterLabel}</span>
        {item.year && <span style={{ ...sans, fontSize: 10, color: C.pencilFaint }}>· {item.year}</span>}
      </div>
      <h3 style={{ ...serif, fontSize: 17, fontWeight: 600, lineHeight: 1.35, margin: "0 0 4px", color: C.ink }}>{item.title}</h3>
      <p style={{ ...sans, fontSize: 12, color: C.pencilLight, margin: "0 0 10px" }}>{item.author ? `${item.author} · ` : ""}{item.source}{item.publisher && item.publisher !== item.source ? ` (${item.publisher})` : ""}</p>
      <p style={{ ...serif, fontSize: 14.5, lineHeight: 1.6, color: C.inkSoft, margin: "0 0 8px", fontStyle: "italic" }}>"{item.hook}"</p>
      {item.why_it_matters && (<p style={{ ...sans, fontSize: 12.5, lineHeight: 1.5, color: C.pencil, margin: "0 0 10px" }}><span style={{ fontWeight: 600, color: C.pencilLight }}>Why it matters: </span>{item.why_it_matters}</p>)}
      {(item.keywords || []).length > 0 && (<div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>{item.keywords.map(kw => (<span key={kw} style={{ ...sans, fontSize: 10, padding: "2px 8px", borderRadius: 3, background: C.fog, color: C.pencil }}>{kw}</span>))}</div>)}
      {qs.length > 0 && (<div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{qs.map(q => (<span key={q.label} style={{ ...sans, fontSize: 10, padding: "2px 8px", borderRadius: 3, background: C.cream, border: `1px solid ${C.ruleFaint}`, color: C.red, display: "inline-flex", alignItems: "center", gap: 3 }}><span style={{ fontSize: 10 }}>{q.icon}</span> {q.label}</span>))}</div>)}
      {item.startHere && (<div style={{ ...sans, fontSize: 10, color: C.gold, fontWeight: 600, marginTop: 6, display: "flex", alignItems: "center", gap: 3 }}>★ Start Here</div>)}
      {isExpanded && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px dashed ${C.rule}` }}>
          {item.summary && (<p style={{ ...sans, fontSize: 12, lineHeight: 1.55, color: C.pencil, margin: "0 0 12px" }}>{item.summary}</p>)}
          <a href={item.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ ...sans, fontSize: 12, color: C.red, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 4, border: `1px solid ${C.red}30`, background: C.redGlow }}>
            {item.type === "podcast" ? "Listen" : item.type === "video" ? "Watch" : "Read"} source
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        </div>
      )}
    </article>
  );
}

function FRow({ label, children, last }) {
  return (
    <fieldset style={{ marginBottom: last ? 0 : 12, border: "none", padding: 0 }}>
      <legend style={{ ...sans, fontSize: 9, color: C.pencilFaint, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.12em" }}>{label}</legend>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>{children}</div>
    </fieldset>
  );
}

function FilterTag({ label, active, onClick, color }) {
  return (
    <button onClick={onClick} style={{ ...sans, fontSize: 11, padding: "3px 10px", borderRadius: 3, background: active ? (color + "14") : "transparent", border: `1px solid ${active ? color + "40" : C.ruleFaint}`, color: active ? color : C.pencil, cursor: "pointer", transition: "all 0.12s" }}>{label}</button>
  );
}

function PgBtn({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{ ...sans, minWidth: 30, height: 30, borderRadius: 4, background: active ? C.redSoft : "transparent", border: `1px solid ${active ? C.red + "30" : C.ruleFaint}`, color: active ? C.red : C.pencilLight, cursor: "pointer", fontSize: 12 }}>{label}</button>
  );
}
