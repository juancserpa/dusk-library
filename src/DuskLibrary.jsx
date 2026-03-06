import { useState, useMemo, useEffect, useCallback } from "react";
// ============================================================
// "AI AND THE DUSK OF HUMANS" — THE RESEARCH ARCHIVE
// v6: Book promotion hero, About section, enhanced footer
// ============================================================
const C = {
  bg: "#f8f8fa",
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
  accent: "#6366f1",
  accentSoft: "#6366f115",
  accentLight: "#eef2ff",
  accentGlow: "#6366f130",
  accentDark: "#4f46e5",
  warm: "#f97316",
  warmSoft: "#fff7ed",
  green: "#10b981",
  rose: "#f43f5e",
  sky: "#0ea5e9",
  violet: "#8b5cf6",
  amber: "#f59e0b",
  sidebar: "#fafafe",
  heroDeep: "#0a0a1a",
};
const font = { fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', system-ui, sans-serif" };
const mono = { fontFamily: "'SF Mono', 'Fira Code', 'Courier New', monospace" };
const serif = { fontFamily: "'Georgia', 'Palatino', 'Times New Roman', serif" };
// --- 11 BROWSING QUESTIONS ---
const QUESTIONS = [
  { label: "Will AI take my job?",                 icon: "\u{1F4BC}", gradient: "linear-gradient(135deg, #10b981, #059669)" },
  { label: "How fast is this happening?",          icon: "\u26A1", gradient: "linear-gradient(135deg, #f59e0b, #d97706)" },
  { label: "What happens to meaning and purpose?", icon: "\u{1F52E}", gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)" },
  { label: "Is AI actually dangerous?",            icon: "\u{1F534}", gradient: "linear-gradient(135deg, #f43f5e, #e11d48)" },
  { label: "Can AI think or feel?",                icon: "\u{1F9E0}", gradient: "linear-gradient(135deg, #6366f1, #4f46e5)" },
  { label: "How do I actually use AI well?",       icon: "\u{1F6E0}", gradient: "linear-gradient(135deg, #0ea5e9, #0284c7)" },
  { label: "What happens to love and connection?", icon: "\u{1F49C}", gradient: "linear-gradient(135deg, #ec4899, #db2777)" },
  { label: "Who controls AI?",                     icon: "\u2696\uFE0F", gradient: "linear-gradient(135deg, #64748b, #475569)" },
  { label: "What happens to education?",           icon: "\u{1F4DA}", gradient: "linear-gradient(135deg, #14b8a6, #0d9488)" },
  { label: "What does AI cost the planet?",        icon: "\u{1F331}", gradient: "linear-gradient(135deg, #22c55e, #16a34a)" },
  { label: "Am I still the real me?",              icon: "\u{1FA9E}", gradient: "linear-gradient(135deg, #a855f7, #9333ea)" },
];
const TYPE_META = {
  article:  { label: "Article",  color: "#f43f5e", bg: "#fef2f2", icon: "\u{1F4F0}" },
  paper:    { label: "Research", color: "#6366f1", bg: "#eef2ff", icon: "\u{1F52C}" },
  podcast:  { label: "Podcast",  color: "#8b5cf6", bg: "#f5f3ff", icon: "\u{1F3A7}" },
  video:    { label: "Video",    color: "#0ea5e9", bg: "#f0f9ff", icon: "\u25B6\uFE0F"  },
  book:     { label: "Book",     color: "#f59e0b", bg: "#fffbeb", icon: "\u{1F4D6}" },
  report:   { label: "Report",   color: "#10b981", bg: "#ecfdf5", icon: "\u{1F4CA}" },
  legal:    { label: "Legal",    color: "#64748b", bg: "#f8fafc", icon: "\u2696\uFE0F"  },
  series:   { label: "Series",   color: "#ec4899", bg: "#fdf2f8", icon: "\u{1F4FA}" },
};
const DIFF_META = {
  quick:    { label: "Quick read",  color: "#10b981", icon: "\u26A1" },
  moderate: { label: "Moderate",    color: "#f59e0b", icon: "\u{1F4D6}" },
  deep:     { label: "Deep dive",   color: "#6366f1", icon: "\u{1F3CA}" },
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
  const [selChapters, setSelChapters] = useState([]);
  const [sort, setSort] = useState("chapter");
  const [expanded, setExpanded] = useState(null);
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAbout, setShowAbout] = useState(false);
  const PER = 15;
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
  const chapterCounts = useMemo(() => {
    const counts = {};
    entries.forEach(e => { counts[e.chapter] = (counts[e.chapter] || 0) + 1; });
    return counts;
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
    if (selChapters.length) r = r.filter(i => selChapters.includes(i.chapter));
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
  }, [entries, debouncedSearch, selQ, selKw, selTypes, selDiff, selChapters, sort]);
  const totalPages = Math.ceil(results.length / PER);
  const visible = results.slice((page - 1) * PER, page * PER);
  useEffect(() => setPage(1), [debouncedSearch, selQ, selKw, selTypes, selDiff, selChapters]);
  const startHereItems = useMemo(() => entries.filter(i => i.startHere), [entries]);
  const hasFilters = selQ.length > 0 || selKw.length > 0 || selTypes.length > 0 || selDiff.length > 0 || selChapters.length > 0 || search;
  const clearAll = useCallback(() => {
    setSelQ([]); setSelKw([]); setSelTypes([]); setSelDiff([]); setSelChapters([]); setSearch("");
  }, []);
  const tog = (set, v) => set(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);
  const togChapter = (chId) => setSelChapters(p => p.includes(chId) ? p.filter(x => x !== chId) : [...p, chId]);
  const filterCount = selTypes.length + selDiff.length + selKw.length + selChapters.length;
  // Type stats
  const typeStats = useMemo(() => {
    const counts = {};
    entries.forEach(e => { counts[e.type] = (counts[e.type] || 0) + 1; });
    return counts;
  }, [entries]);
  return (
    <div style={{ ...font, minHeight: "100vh", background: C.bg, color: C.dark }}>
      {/* Global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&display=swap');
        @media (max-width: 860px) {
          .dusk-sidebar { display: none !important; }
          .dusk-layout { display: block !important; }
          .dusk-mobile-chapters { display: flex !important; }
          .dusk-hero-split { flex-direction: column !important; align-items: center !important; text-align: center !important; }
          .dusk-hero-cover { max-width: 220px !important; margin-bottom: 24px !important; }
          .dusk-hero-text { align-items: center !important; }
          .dusk-about-grid { grid-template-columns: 1fr !important; }
          .dusk-footer-split { flex-direction: column !important; align-items: center !important; text-align: center !important; gap: 32px !important; }
        }
        .dusk-sidebar::-webkit-scrollbar { width: 3px; }
        .dusk-sidebar::-webkit-scrollbar-track { background: transparent; }
        .dusk-sidebar::-webkit-scrollbar-thumb { background: ${C.gray300}; border-radius: 3px; }
        .dusk-mobile-chapters { display: none !important; }
        .dusk-sidebar-btn:hover { background: ${C.gray100} !important; }
        .dusk-sidebar-btn.active { background: ${C.accentLight} !important; color: ${C.accent} !important; font-weight: 600 !important; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gentlePulse {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.06; }
        }
        @keyframes coverGlow {
          0%, 100% { box-shadow: 0 25px 80px rgba(99,102,241,0.15), 0 8px 32px rgba(0,0,0,0.4); }
          50% { box-shadow: 0 30px 90px rgba(99,102,241,0.25), 0 10px 40px rgba(0,0,0,0.5); }
        }
        .dusk-cover-hover:hover {
          transform: perspective(800px) rotateY(-4deg) rotateX(2deg) scale(1.03) !important;
        }
      `}</style>
      {/* ===== CINEMATIC HERO ===== */}
      <header style={{
        background: `linear-gradient(165deg, #07071a 0%, #0f0f2d 30%, #151538 60%, #1a1a3e 100%)`,
        position: "relative", overflow: "hidden",
      }}>
        {/* Ambient grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          animation: "gentlePulse 8s ease-in-out infinite",
        }} />
        {/* Top-right glow */}
        <div style={{
          position: "absolute", top: "-20%", right: "-10%",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(99,102,241,0.08), transparent 70%)",
          pointerEvents: "none",
        }} />
        {/* Bottom-left warm glow */}
        <div style={{
          position: "absolute", bottom: "-30%", left: "-10%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(249,115,22,0.05), transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "56px 32px 48px", position: "relative" }}>
          {/* Main hero split: cover + text */}
          <div className="dusk-hero-split" style={{
            display: "flex", gap: 48, alignItems: "center",
          }}>
            {/* Book cover */}
            <div className="dusk-hero-cover" style={{ flexShrink: 0, animation: "fadeInUp 0.8s ease-out" }}>
              <div
                className="dusk-cover-hover"
                style={{
                  width: 240,
                  borderRadius: 6,
                  overflow: "hidden",
                  animation: "coverGlow 6s ease-in-out infinite",
                  transition: "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
                  cursor: "default",
                }}
              >
                <img
                  src="/cover.jpg"
                  alt="AI and the Dusk of Humans — Book Cover"
                  style={{
                    width: "100%", height: "auto", display: "block",
                  }}
                />
              </div>
            </div>
            {/* Hero text */}
            <div className="dusk-hero-text" style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start",
              animation: "fadeInUp 0.8s ease-out 0.15s both",
            }}>
              {/* Badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px",
                borderRadius: 20, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
                marginBottom: 20,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
                <span style={{ ...font, fontSize: 11, color: "rgba(255,255,255,0.55)", fontWeight: 500, letterSpacing: "0.02em" }}>
                  {loading ? "Loading..." : `${entries.length} sources \u00B7 The Research Archive`}
                </span>
              </div>
              <h1 style={{ margin: "0 0 6px", lineHeight: 1.1 }}>
                <span style={{
                  display: "block", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800,
                  color: "#ffffff", letterSpacing: "-0.03em",
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}>
                  AI and the Dusk
                </span>
                <span style={{
                  display: "block", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800,
                  color: "#ffffff", letterSpacing: "-0.03em",
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}>
                  of Humans
                </span>
              </h1>
              <p style={{
                ...font, fontSize: "clamp(13px, 1.8vw, 15px)", lineHeight: 1.5,
                color: "rgba(255,255,255,0.5)", fontWeight: 400, fontStyle: "italic",
                margin: "4px 0 16px",
              }}>
                Surviving as the Second-Smartest Species
              </p>
              <p style={{
                ...font, fontSize: "clamp(14px, 2vw, 16px)", lineHeight: 1.7,
                color: "rgba(255,255,255,0.6)", maxWidth: 480, margin: "0 0 20px", fontWeight: 400,
              }}>
                This is the <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>intellectual backbone</span> of the book &mdash; every claim traced to its source,
                every argument mapped to the research that shaped it.
              </p>
              {/* Blockquote */}
              <div style={{
                borderLeft: "2px solid rgba(99,102,241,0.5)",
                paddingLeft: 16, marginBottom: 22,
              }}>
                <p style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "clamp(14px, 1.8vw, 17px)", fontStyle: "italic",
                  color: "rgba(255,255,255,0.65)", lineHeight: 1.6, margin: 0,
                }}>
                  &ldquo;We mastered prompts and plugins; we didn&rsquo;t master our days.&rdquo;
                </p>
                <p style={{
                  ...font, fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 6,
                }}>
                  &mdash; from the Prologue
                </p>
              </div>
              {/* Author */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, border: "1px solid rgba(255,255,255,0.1)",
                }}>
                  <span style={{ color: "rgba(255,255,255,0.7)" }}>JC</span>
                </div>
                <div>
                  <p style={{ ...font, fontSize: 13, color: "rgba(255,255,255,0.75)", fontWeight: 600, margin: 0 }}>
                    Juan Camilo Serpa
                  </p>
                  <p style={{ ...font, fontSize: 11, color: "rgba(255,255,255,0.35)", margin: "2px 0 0" }}>
                    McGill University &middot; Desautels Faculty of Management
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* About toggle */}
          <div style={{
            marginTop: 36, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20,
            animation: "fadeInUp 0.8s ease-out 0.3s both",
          }}>
            <button
              onClick={() => setShowAbout(!showAbout)}
              style={{
                ...font, background: "none", border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.55)", fontSize: 12, fontWeight: 500,
                padding: "8px 18px", borderRadius: 20, cursor: "pointer",
                transition: "all 0.25s", display: "inline-flex", alignItems: "center", gap: 8,
                letterSpacing: "0.01em",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
            >
              {showAbout ? "Hide" : "About this archive"}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                style={{ transition: "transform 0.3s", transform: showAbout ? "rotate(180deg)" : "rotate(0deg)" }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {/* About content */}
            {showAbout && (
              <div style={{
                marginTop: 20,
                animation: "fadeInUp 0.4s ease-out",
              }}>
                <div className="dusk-about-grid" style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16,
                }}>
                  <AboutCard
                    icon="\u{1F52C}"
                    title="Traceable Claims"
                    text="Every major claim in the book links to a primary source \u2014 a paper, an article, a podcast episode. No hand-waving."
                  />
                  <AboutCard
                    icon="\u{1F9ED}"
                    title="Guided Exploration"
                    text="Filter by the questions that keep you up at night, browse by chapter, or discover sources across difficulty levels."
                  />
                  <AboutCard
                    icon="\u{1F331}"
                    title="Living Archive"
                    text="This archive grows alongside the book. New sources, updated links, and reader-suggested additions keep it current."
                  />
                </div>
                {/* Stats row */}
                <div style={{
                  display: "flex", gap: 24, marginTop: 20, flexWrap: "wrap", justifyContent: "center",
                }}>
                  {[
                    { n: entries.length, label: "Sources" },
                    { n: activeChapters.length, label: "Chapters" },
                    { n: Object.keys(typeStats).length, label: "Media Types" },
                    { n: QUESTIONS.length, label: "Questions" },
                  ].map(s => (
                    <div key={s.label} style={{ textAlign: "center" }}>
                      <div style={{
                        ...font, fontSize: 22, fontWeight: 800, color: "rgba(255,255,255,0.85)",
                        letterSpacing: "-0.02em",
                      }}>
                        {loading ? "\u2014" : s.n}
                      </div>
                      <div style={{ ...font, fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Question pills */}
          <div style={{ maxWidth: 720, margin: "30px auto 0", textAlign: "center", animation: "fadeInUp 0.8s ease-out 0.45s both" }}>
            <p style={{ ...font, fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.3)", marginBottom: 12, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              What are you curious about?
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
              {QUESTIONS.map(q => {
                const active = selQ.includes(q.label);
                const count = entries.filter(i => (i.questions || []).includes(q.label)).length;
                if (count === 0 && !loading) return null;
                return (
                  <button
                    key={q.label}
                    onClick={() => tog(setSelQ, q.label)}
                    style={{
                      ...font, fontSize: 12, fontWeight: active ? 600 : 450,
                      padding: "6px 13px", borderRadius: 16,
                      background: active ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${active ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.08)"}`,
                      color: active ? "#fff" : "rgba(255,255,255,0.5)",
                      cursor: "pointer", transition: "all 0.2s ease",
                      display: "flex", alignItems: "center", gap: 5,
                      backdropFilter: "blur(8px)",
                    }}
                    onMouseEnter={e => { if (!active) { e.target.style.background = "rgba(255,255,255,0.08)"; e.target.style.color = "rgba(255,255,255,0.75)"; }}}
                    onMouseLeave={e => { if (!active) { e.target.style.background = "rgba(255,255,255,0.04)"; e.target.style.color = "rgba(255,255,255,0.5)"; }}}
                  >
                    <span style={{ fontSize: 13 }}>{q.icon}</span>
                    {q.label}
                    {count > 0 && (
                      <span style={{
                        ...mono, fontSize: 9, fontWeight: 600,
                        background: active ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)",
                        color: active ? "#fff" : "rgba(255,255,255,0.35)",
                        padding: "1px 5px", borderRadius: 6, marginLeft: 1,
                      }}>{count}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>
      {/* ===== SEARCH BAR (sticky) ===== */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: `rgba(248,248,250,0.88)`, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        borderBottom: `1px solid ${C.gray200}`, padding: "10px 0",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {/* Search */}
            <div style={{
              flex: 1, minWidth: 200, display: "flex", alignItems: "center", gap: 8,
              background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 10,
              padding: "8px 12px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.gray400} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
              <input type="text" placeholder="Search title, author, topic..."
                value={search} onChange={e => setSearch(e.target.value)}
                aria-label="Search references"
                style={{ ...font, flex: 1, background: "none", border: "none", fontSize: 13, color: C.dark, outline: "none", fontWeight: 400 }}
                onFocus={e => { e.target.parentNode.style.borderColor = C.accent; e.target.parentNode.style.boxShadow = `0 0 0 3px ${C.accentGlow}`; }}
                onBlur={e => { e.target.parentNode.style.borderColor = C.gray200; e.target.parentNode.style.boxShadow = "0 1px 2px rgba(0,0,0,0.03)"; }}
              />
              {search && <button onClick={() => setSearch("")} aria-label="Clear search" style={{ background: "none", border: "none", color: C.gray400, cursor: "pointer", fontSize: 16, lineHeight: 1, padding: 2 }}>&times;</button>}
            </div>
            {/* Sort */}
            <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort entries" style={{
              ...font, fontSize: 12, padding: "8px 10px", borderRadius: 8,
              background: C.white, border: `1px solid ${C.gray200}`, color: C.gray600, cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)", fontWeight: 500,
            }}>
              <option value="chapter">By chapter</option>
              <option value="year">Newest first</option>
              <option value="title">A &rarr; Z</option>
            </select>
            {/* Results count */}
            <span style={{ ...font, fontSize: 12, color: C.gray500, fontWeight: 500, whiteSpace: "nowrap" }}>
              {loading ? "..." :
                results.length === entries.length ? `${results.length} sources` : `${results.length} of ${entries.length}`}
            </span>
            {hasFilters && (
              <button onClick={clearAll} style={{ ...font, fontSize: 12, color: C.accent, background: "none", border: "none", cursor: "pointer", fontWeight: 600, padding: "4px 2px", whiteSpace: "nowrap" }}>
                Clear all
              </button>
            )}
          </div>
          {/* Mobile chapter pills (hidden on desktop) */}
          <div className="dusk-mobile-chapters" style={{ display: "none", gap: 5, flexWrap: "wrap", marginTop: 8 }}>
            {activeChapters.map(ch => {
              const active = selChapters.includes(ch.id);
              return (
                <button key={ch.id} onClick={() => togChapter(ch.id)} style={{
                  ...font, fontSize: 11, padding: "4px 10px", borderRadius: 6,
                  background: active ? C.accentLight : "transparent",
                  border: `1px solid ${active ? C.accent + "40" : C.gray200}`,
                  color: active ? C.accent : C.gray600, cursor: "pointer", fontWeight: active ? 600 : 500,
                }}>{ch.short}</button>
              );
            })}
          </div>
        </div>
      </div>
      {/* Active filters display */}
      {(selQ.length > 0 || selChapters.length > 0) && (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "12px 24px 0" }}>
          <div style={{ display: "flex", gap: 5, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ ...font, fontSize: 11, color: C.gray500, fontWeight: 500 }}>Active:</span>
            {selQ.map(q => {
              const qObj = QUESTIONS.find(x => x.label === q);
              return (
                <span key={q} style={{
                  ...font, fontSize: 11, padding: "3px 8px 3px 6px", borderRadius: 6,
                  background: C.accentLight, color: C.accent, fontWeight: 600,
                  display: "inline-flex", alignItems: "center", gap: 3, border: `1px solid ${C.accent}20`,
                }}>
                  {qObj?.icon} {q}
                  <button onClick={() => tog(setSelQ, q)} style={{ background: "none", border: "none", color: C.accent, cursor: "pointer", fontSize: 13, lineHeight: 1, marginLeft: 2 }}>&times;</button>
                </span>
              );
            })}
            {selChapters.map(ch => {
              const chObj = CHAPTERS.find(c => c.id === ch);
              return (
                <span key={ch} style={{
                  ...font, fontSize: 11, padding: "3px 8px 3px 6px", borderRadius: 6,
                  background: "#f0fdf4", color: "#16a34a", fontWeight: 600,
                  display: "inline-flex", alignItems: "center", gap: 3, border: "1px solid #16a34a20",
                }}>
                  {chObj?.short || ch}
                  <button onClick={() => togChapter(ch)} style={{ background: "none", border: "none", color: "#16a34a", cursor: "pointer", fontSize: 13, lineHeight: 1, marginLeft: 2 }}>&times;</button>
                </span>
              );
            })}
          </div>
        </div>
      )}
      {/* ===== SIDEBAR + MAIN LAYOUT ===== */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 24px 80px" }}>
        <div className="dusk-layout" style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
          {/* --- LEFT SIDEBAR --- */}
          <aside className="dusk-sidebar" style={{
            width: 210, minWidth: 210, flexShrink: 0,
            position: "sticky", top: 60, alignSelf: "flex-start",
            maxHeight: "calc(100vh - 76px)", overflowY: "auto",
          }}>
            {/* Chapters */}
            <div style={{
              background: C.white, borderRadius: 12,
              border: `1px solid ${C.gray200}`,
              boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
              overflow: "hidden", marginBottom: 12,
            }}>
              <div style={{
                padding: "12px 14px 8px",
                borderBottom: `1px solid ${C.gray100}`,
              }}>
                <h2 style={{ ...font, fontSize: 11, fontWeight: 700, color: C.gray500, margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Chapters
                </h2>
              </div>
              <div style={{ padding: "4px 6px" }}>
                {activeChapters.map(ch => {
                  const active = selChapters.includes(ch.id);
                  const count = chapterCounts[ch.id] || 0;
                  return (
                    <button
                      key={ch.id}
                      className={`dusk-sidebar-btn${active ? " active" : ""}`}
                      onClick={() => togChapter(ch.id)}
                      style={{
                        ...font, fontSize: 12, fontWeight: active ? 600 : 450,
                        padding: "7px 10px", borderRadius: 7, width: "100%",
                        background: active ? C.accentLight : "transparent",
                        border: "none", color: active ? C.accent : C.gray800,
                        cursor: "pointer", transition: "all 0.12s",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        textAlign: "left",
                      }}
                    >
                      <span>{ch.short}</span>
                      <span style={{
                        ...mono, fontSize: 10, color: active ? C.accent : C.gray400,
                        fontWeight: 500,
                      }}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Type filter */}
            <div style={{
              background: C.white, borderRadius: 12,
              border: `1px solid ${C.gray200}`,
              boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
              overflow: "hidden", marginBottom: 12,
            }}>
              <div style={{
                padding: "12px 14px 8px",
                borderBottom: `1px solid ${C.gray100}`,
              }}>
                <h2 style={{ ...font, fontSize: 11, fontWeight: 700, color: C.gray500, margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Type
                </h2>
              </div>
              <div style={{ padding: "4px 6px" }}>
                {Object.entries(TYPE_META).map(([t, m]) => {
                  const active = selTypes.includes(t);
                  const count = entries.filter(e => e.type === t).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={t}
                      className={`dusk-sidebar-btn${active ? " active" : ""}`}
                      onClick={() => tog(setSelTypes, t)}
                      style={{
                        ...font, fontSize: 12, fontWeight: active ? 600 : 450,
                        padding: "6px 10px", borderRadius: 7, width: "100%",
                        background: active ? (m.color + "12") : "transparent",
                        border: "none", color: active ? m.color : C.gray800,
                        cursor: "pointer", transition: "all 0.12s",
                        display: "flex", alignItems: "center", gap: 7,
                        textAlign: "left",
                      }}
                    >
                      <span style={{ fontSize: 13 }}>{m.icon}</span>
                      <span style={{ flex: 1 }}>{m.label}</span>
                      <span style={{ ...mono, fontSize: 10, color: active ? m.color : C.gray400, fontWeight: 500 }}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Depth filter */}
            <div style={{
              background: C.white, borderRadius: 12,
              border: `1px solid ${C.gray200}`,
              boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
              overflow: "hidden", marginBottom: 12,
            }}>
              <div style={{
                padding: "12px 14px 8px",
                borderBottom: `1px solid ${C.gray100}`,
              }}>
                <h2 style={{ ...font, fontSize: 11, fontWeight: 700, color: C.gray500, margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Depth
                </h2>
              </div>
              <div style={{ padding: "4px 6px" }}>
                {Object.entries(DIFF_META).map(([d, m]) => {
                  const active = selDiff.includes(d);
                  return (
                    <button
                      key={d}
                      className={`dusk-sidebar-btn${active ? " active" : ""}`}
                      onClick={() => tog(setSelDiff, d)}
                      style={{
                        ...font, fontSize: 12, fontWeight: active ? 600 : 450,
                        padding: "6px 10px", borderRadius: 7, width: "100%",
                        background: active ? (m.color + "12") : "transparent",
                        border: "none", color: active ? m.color : C.gray800,
                        cursor: "pointer", transition: "all 0.12s",
                        display: "flex", alignItems: "center", gap: 7,
                        textAlign: "left",
                      }}
                    >
                      <span style={{ fontSize: 13 }}>{m.icon}</span>
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Start Here section */}
            {startHereItems.length > 0 && (
              <div style={{
                background: C.white, borderRadius: 12,
                border: `1px solid ${C.gray200}`,
                boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                overflow: "hidden",
              }}>
                <div style={{
                  padding: "12px 14px 8px",
                  borderBottom: `1px solid ${C.gray100}`,
                  background: `linear-gradient(135deg, ${C.warmSoft}, #fff8f0)`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 12 }}>{"\u2B50"}</span>
                    <h2 style={{ ...font, fontSize: 11, fontWeight: 700, color: C.dark, margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      Start Here
                    </h2>
                    <span style={{ ...mono, fontSize: 10, color: C.gray400 }}>{startHereItems.length}</span>
                  </div>
                </div>
                <div style={{ padding: "4px 0" }}>
                  {startHereItems.map((item, idx) => (
                    <SidebarItem key={item.id} item={item} isLast={idx === startHereItems.length - 1} />
                  ))}
                </div>
              </div>
            )}
          </aside>
          {/* --- MAIN CARD LIST --- */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {!loading && results.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>{"\u{1F50D}"}</div>
                <p style={{ ...font, fontSize: 17, fontWeight: 600, marginBottom: 6, color: C.dark }}>No matches</p>
                <p style={{ fontSize: 13, color: C.gray500, marginBottom: 18 }}>Try a different question or clear your filters.</p>
                <button onClick={clearAll} style={{ ...font, background: C.accent, border: "none", color: "#fff", padding: "9px 22px", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Clear all filters</button>
              </div>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
                  {visible.map(item => (
                    <Card key={item.id} item={item} isExpanded={expanded === item.id}
                      onToggle={() => setExpanded(expanded === item.id ? null : item.id)} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <nav aria-label="Pagination" style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 32 }}>
                    {page > 1 && <PgBtn label="\u2190 Prev" onClick={() => setPage(page - 1)} />}
                    <span style={{ ...font, fontSize: 12, color: C.gray500, padding: "8px 12px", display: "flex", alignItems: "center", fontWeight: 500 }}>
                      {page} of {totalPages}
                    </span>
                    {page < totalPages && <PgBtn label="Next \u2192" onClick={() => setPage(page + 1)} />}
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      {/* ===== ENHANCED FOOTER ===== */}
      <footer style={{
        background: "linear-gradient(165deg, #0a0a1a 0%, #121230 50%, #1a1a3e 100%)",
        padding: "56px 32px", position: "relative", overflow: "hidden",
      }}>
        {/* Subtle grid */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.02,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }} />
        <div className="dusk-footer-split" style={{
          maxWidth: 900, margin: "0 auto", position: "relative",
          display: "flex", gap: 48, alignItems: "center",
        }}>
          {/* Footer cover (smaller) */}
          <div style={{ flexShrink: 0 }}>
            <img
              src="/cover.jpg"
              alt="AI and the Dusk of Humans"
              style={{
                width: 140, borderRadius: 4,
                boxShadow: "0 15px 50px rgba(0,0,0,0.5), 0 5px 20px rgba(99,102,241,0.1)",
              }}
            />
          </div>
          {/* Footer text */}
          <div style={{ flex: 1 }}>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 24, fontWeight: 700, color: "rgba(255,255,255,0.9)",
              margin: "0 0 10px", letterSpacing: "-0.02em",
            }}>
              AI and the Dusk of Humans
            </h2>
            <p style={{
              ...font, fontSize: 14, lineHeight: 1.65, color: "rgba(255,255,255,0.45)",
              margin: "0 0 16px", maxWidth: 420,
            }}>
              A field guide for the species that built its replacement.
              Forthcoming &mdash; sign up to be notified.
            </p>
            {/* CTA area */}
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <a
                href="mailto:juan.serpa@mcgill.ca?subject=Dusk%20of%20Humans%20%E2%80%94%20Notify%20Me"
                style={{
                  ...font, fontSize: 13, fontWeight: 600, color: "#fff", textDecoration: "none",
                  padding: "10px 22px", borderRadius: 8, background: C.accent,
                  display: "inline-flex", alignItems: "center", gap: 6,
                  transition: "all 0.2s", boxShadow: `0 4px 16px ${C.accentGlow}`,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = C.accentDark; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = C.accent; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                Get Notified
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            </div>
            <div style={{
              marginTop: 24, paddingTop: 18,
              borderTop: "1px solid rgba(255,255,255,0.06)",
              display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap",
            }}>
              <p style={{ ...font, fontSize: 11, color: "rgba(255,255,255,0.25)", margin: 0 }}>
                Juan Camilo Serpa &middot; McGill University
              </p>
              <p style={{ ...font, fontSize: 11, color: "rgba(255,255,255,0.15)", margin: 0 }}>
                A living archive &mdash; {entries.length} sources and counting
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
// ===== SUB-COMPONENTS =====
function AboutCard({ icon, title, text }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 12, padding: "18px 16px",
      transition: "all 0.25s",
    }}>
      <span style={{ fontSize: 20, display: "block", marginBottom: 10 }}>{icon}</span>
      <h3 style={{
        ...font, fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.85)",
        margin: "0 0 6px", letterSpacing: "-0.01em",
      }}>
        {title}
      </h3>
      <p style={{
        ...font, fontSize: 12, lineHeight: 1.6, color: "rgba(255,255,255,0.4)",
        margin: 0,
      }}>
        {text}
      </p>
    </div>
  );
}
function SidebarItem({ item, isLast }) {
  const [hover, setHover] = useState(false);
  const tm = TYPE_META[item.type] || { label: item.type, color: C.gray600, icon: "\u{1F4C4}" };
  const chapterObj = CHAPTERS.find(c => c.id === item.chapter);
  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: "block", textDecoration: "none", color: "inherit",
        padding: "8px 12px",
        borderBottom: isLast ? "none" : `1px solid ${C.gray100}`,
        background: hover ? C.gray100 + "80" : "transparent",
        transition: "background 0.15s",
      }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
        <span style={{
          fontSize: 12, width: 22, height: 22, borderRadius: 5,
          background: tm.bg, display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, marginTop: 1,
        }}>
          {tm.icon}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            ...font, fontSize: 11, fontWeight: 600, lineHeight: 1.35,
            margin: 0, color: hover ? C.accent : C.dark,
            transition: "color 0.15s", letterSpacing: "-0.01em",
            overflow: "hidden", textOverflow: "ellipsis",
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          }}>
            {item.title}
          </h3>
          <p style={{
            ...font, fontSize: 10, color: C.gray500, margin: "2px 0 0",
            lineHeight: 1.3, fontWeight: 450,
          }}>
            {chapterObj?.short || item.chapter} &middot; {item.time}
          </p>
        </div>
      </div>
    </a>
  );
}
function Card({ item, isExpanded, onToggle }) {
  const [hover, setHover] = useState(false);
  const tm = TYPE_META[item.type] || { label: item.type, color: C.gray600, icon: "\u{1F4C4}", bg: C.gray100 };
  const dm = DIFF_META[item.difficulty] || { label: "", color: C.gray500, icon: "" };
  const chapterObj = CHAPTERS.find(c => c.id === item.chapter);
  const chapterLabel = chapterObj?.short || item.chapter;
  return (
    <article
      onClick={onToggle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: "16px 18px",
        borderRadius: 12,
        background: C.white,
        border: `1px solid ${isExpanded ? C.accent + "30" : (hover ? C.gray300 : C.gray200)}`,
        boxShadow: hover || isExpanded ? `0 3px 12px rgba(0,0,0,0.05)` : "0 1px 2px rgba(0,0,0,0.02)",
        cursor: "pointer",
        transition: "all 0.2s ease",
        transform: hover && !isExpanded ? "translateY(-1px)" : "none",
      }}
    >
      <div style={{ display: "flex", gap: 14 }}>
        {/* Type icon badge */}
        <div style={{
          width: 42, minWidth: 42, height: 42, borderRadius: 10,
          background: tm.bg, border: `1px solid ${tm.color}15`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, flexShrink: 0,
        }}>
          {tm.icon}
        </div>
        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Meta row */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3, flexWrap: "wrap" }}>
            <span style={{
              ...font, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em",
              color: tm.color,
            }}>
              {tm.label}
            </span>
            <span style={{ color: C.gray300, fontSize: 10 }}>&middot;</span>
            <span style={{ ...font, fontSize: 11, color: C.gray500 }}>{item.time}</span>
            <span style={{ color: C.gray300, fontSize: 10 }}>&middot;</span>
            <span style={{ ...font, fontSize: 11, color: dm.color, fontWeight: 500 }}>{dm.label}</span>
            <span style={{ flex: 1 }} />
            <span style={{ ...font, fontSize: 10, color: C.gray400, fontWeight: 500 }}>{chapterLabel} &middot; {item.year}</span>
          </div>
          {/* Title */}
          <h3 style={{ ...font, fontSize: 15, fontWeight: 700, lineHeight: 1.35, margin: "0 0 2px", color: C.dark, letterSpacing: "-0.02em" }}>
            {item.title}
            {item.startHere && <span style={{ marginLeft: 6, fontSize: 12, color: C.warm }}>{"\u2B50"}</span>}
          </h3>
          {/* Author line */}
          <p style={{ ...font, fontSize: 11, color: C.gray500, margin: "0 0 6px", fontWeight: 500 }}>
            {item.author}{item.source ? ` \u00B7 ${item.source}` : ""}
          </p>
          {/* Hook */}
          <p style={{ ...font, fontSize: 13, lineHeight: 1.55, color: C.gray800, margin: 0, fontWeight: 400 }}>
            {item.hook}
          </p>
          {/* Expanded content */}
          {isExpanded && (
            <div style={{ marginTop: 14 }}>
              {item.why_it_matters && (
                <div style={{
                  padding: "12px 14px", background: C.accentLight, borderRadius: 8,
                  marginBottom: 12, borderLeft: `3px solid ${C.accent}`,
                }}>
                  <p style={{ ...font, fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Why it matters for the book</p>
                  <p style={{ ...font, fontSize: 12, lineHeight: 1.55, color: C.gray800, margin: 0 }}>{item.why_it_matters}</p>
                </div>
              )}
              {item.summary && (
                <p style={{ ...font, fontSize: 12, lineHeight: 1.6, color: C.gray600, margin: "0 0 12px" }}>
                  {item.summary}
                </p>
              )}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 }}>
                {(item.keywords || []).map(kw => (
                  <span key={kw} style={{
                    ...font, fontSize: 10, padding: "2px 8px", borderRadius: 5,
                    background: C.gray100, color: C.gray600, fontWeight: 500,
                  }}>{kw}</span>
                ))}
                {(item.questions || []).map(q => {
                  const qObj = QUESTIONS.find(x => x.label === q);
                  return (
                    <span key={q} style={{
                      ...font, fontSize: 10, padding: "2px 8px", borderRadius: 5,
                      background: C.accentLight, color: C.accent, fontWeight: 500,
                      display: "inline-flex", alignItems: "center", gap: 2,
                    }}>
                      {qObj?.icon} {q}
                    </span>
                  );
                })}
              </div>
              <a href={item.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                style={{
                  ...font, fontSize: 12, fontWeight: 600, color: "#fff", textDecoration: "none",
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "8px 18px", borderRadius: 8, background: C.accent,
                  transition: "background 0.2s", boxShadow: `0 2px 8px ${C.accentGlow}`,
                }}
                onMouseEnter={e => e.target.style.background = C.accentDark}
                onMouseLeave={e => e.target.style.background = C.accent}
              >
                {item.type === "podcast" ? "\u{1F3A7} Listen" : item.type === "video" ? "\u25B6\uFE0F Watch" : "\u{1F4D6} Read"} the source
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
function PgBtn({ label, onClick }) {
  return (
    <button onClick={onClick} style={{
      ...font, padding: "7px 16px", borderRadius: 8,
      background: C.white,
      border: `1px solid ${C.gray200}`,
      color: C.gray800, cursor: "pointer", fontSize: 12, fontWeight: 600,
      transition: "all 0.15s",
      boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
    }}>{label}</button>
  );
}
