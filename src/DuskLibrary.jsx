import { useState, useMemo, useEffect, useCallback, useRef } from "react";

// ============================================================
// "AI AND THE DUSK OF HUMANS" — THE RESEARCH ARCHIVE
// v3: Enhanced UI/UX with animations, grid layout, better
// typography, improved filtering, and visual polish
// ============================================================

// --- PALETTE (from Visual Design System, extended) ---
const C = {
  cream: "#f7f3eb",
  softWhite: "#fffdf9",
  fog: "#e8e2d8",
  red: "#b83a2a",
  redGlow: "#b83a2a0d",
  redSoft: "#b83a2a1a",
  redHover: "#a03020",
  ink: "#2a2118",
  inkSoft: "#3d332a",
  pencil: "#6b5e52",
  pencilLight: "#9b8d7f",
  pencilFaint: "#bfb5a8",
  charcoal: "#1a1612",
  charcoalSoft: "#2a231c",
  gold: "#d4a853",
  goldSoft: "#d4a85320",
  rule: "#d8cfc3",
  ruleFaint: "#e6dfd6",
  shadow: "rgba(42,33,24,0.06)",
  shadowMd: "rgba(42,33,24,0.1)",
};

const serif = { fontFamily: "'Playfair Display', Georgia, 'Palatino Linotype', serif" };
const sans = { fontFamily: "'Source Sans 3', system-ui, -apple-system, 'Segoe UI', sans-serif" };

// --- 11 BROWSING QUESTIONS ---
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

// --- 8 MEDIA TYPES ---
const TYPE_META = {
  article:  { label: "Article",  icon: "📄", bg: "#f7f3eb", border: "#6b5e52" },
  paper:    { label: "Research", icon: "🔬", bg: "#e8e2d8", border: "#6b5e52" },
  podcast:  { label: "Podcast",  icon: "🎙️", bg: "#f0e8f5", border: "#7b5e8a" },
  video:    { label: "Video",    icon: "🎬", bg: "#e8eff5", border: "#4a6a8a" },
  book:     { label: "Book",     icon: "📚", bg: "#f5f0e0", border: "#8a7a4a" },
  report:   { label: "Report",   icon: "📊", bg: "#e8f0e8", border: "#5a7a5a" },
  legal:    { label: "Legal",    icon: "⚖️", bg: "#f5e8e8", border: "#8a5a5a" },
  series:   { label: "Series",   icon: "📺", bg: "#f5ede0", border: "#8a6a4a" },
};

// --- SOURCE → DOMAIN MAP (for favicons) ---
const SOURCE_DOMAIN = {
  "The New York Times": "nytimes.com",
  "The Atlantic": "theatlantic.com",
  "The Atlantic Festival": "theatlantic.com",
  "The Economist": "economist.com",
  "The Guardian": "theguardian.com",
  "CNBC": "cnbc.com",
  "NPR Consider This": "npr.org",
  "MIT News": "mit.edu",
  "MIT Technology Review": "technologyreview.com",
  "MIT Press / Knopf": "mitpress.mit.edu",
  "Science": "science.org",
  "Science Advances": "science.org",
  "Scientific Reports (Nature)": "nature.com",
  "Frontiers in Psychology": "frontiersin.org",
  "Trends in Ecology & Evolution": "cell.com",
  "Behavioral and Brain Sciences": "cambridge.org",
  "Technological Forecasting and Social Change": "sciencedirect.com",
  "The Quarterly Journal of Economics": "academic.oup.com",
  "arXiv": "arxiv.org",
  "arXiv (Google Research)": "arxiv.org",
  "arXiv (NeurIPS 2017)": "arxiv.org",
  "arXiv (Stanford, NeurIPS 2023)": "arxiv.org",
  "TED Talks": "ted.com",
  "Lex Fridman Podcast": "lexfridman.com",
  "Freakonomics Radio": "freakonomics.com",
  "The Ezra Klein Show": "nytimes.com",
  "Hard Fork": "nytimes.com",
  "Making Sense with Sam Harris": "samharris.org",
  "Your Undivided Attention": "humanetech.com",
  "Edge.org": "edge.org",
  "Brookings Institution": "brookings.edu",
  "World Economic Forum": "weforum.org",
  "Boston Consulting Group": "bcg.com",
  "PwC Global AI Jobs Barometer": "pwc.com",
  "Air Street Capital": "airstreet.com",
  "Houghton Mifflin Harcourt": "hmhco.com",
  "PublicAffairs (Hachette)": "hachettebookgroup.com",
  "Personal Essay (Dario Amodei)": "darioamodei.com",
  "National Security Archive": "nsarchive.gwu.edu",
  "U.S. District Court, Southern District of New York": "uscourts.gov",
};

function sourceFavicon(source) {
  const domain = SOURCE_DOMAIN[source];
  if (!domain) return null;
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
}

// --- 3 DIFFICULTY LEVELS ---
const DIFF_META = {
  quick:    { label: "Quick read",  color: "#5a7a6b", icon: "⚡" },
  moderate: { label: "Moderate",    color: "#8a7a4a", icon: "📖" },
  deep:     { label: "Deep dive",   color: "#4a6a8a", icon: "🔍" },
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
  const [viewMode, setViewMode] = useState("list"); // "list" or "grid"
  const resultsRef = useRef(null);
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
  const activeFilterCount = selQ.length + selKw.length + selTypes.length + selDiff.length + (selChapter ? 1 : 0);

  const clearAll = useCallback(() => {
    setSelQ([]); setSelKw([]); setSelTypes([]); setSelDiff([]); setSelChapter(null); setSearch("");
  }, []);

  const tog = (set, v) => set(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);

  const scrollToResults = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Type stats for the stats bar
  const typeStats = useMemo(() => {
    const counts = {};
    entries.forEach(e => { counts[e.type] = (counts[e.type] || 0) + 1; });
    return counts;
  }, [entries]);

  return (
    <div style={{ ...sans, minHeight: "100vh", background: C.cream, color: C.ink }}>
      {/* HERO */}
      <header style={{
        background: `linear-gradient(180deg, ${C.charcoal} 0%, ${C.charcoalSoft} 100%)`,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative background pattern */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.03,
          backgroundImage: `radial-gradient(circle at 20% 50%, ${C.red} 1px, transparent 1px), radial-gradient(circle at 80% 20%, ${C.red} 1px, transparent 1px)`,
          backgroundSize: "60px 60px, 80px 80px",
        }} />
        <div style={{
          maxWidth: 900, margin: "0 auto", padding: "36px 32px 32px",
          textAlign: "center", position: "relative", zIndex: 1,
          animation: "fadeInUp 0.6s ease-out",
        }}>
          <div style={{
            display: "inline-block", padding: "6px 20px", borderRadius: 20,
            background: `${C.red}20`, border: `1px solid ${C.red}30`,
            marginBottom: 16,
          }}>
            <span style={{ ...sans, fontSize: 11, fontWeight: 600, color: C.red, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              The Research Archive
            </span>
          </div>

          <h1 style={{ margin: "0 0 6px", lineHeight: 1.1 }}>
            <span style={{
              ...serif, display: "block",
              fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700,
              color: "#fff", letterSpacing: "-0.01em",
            }}>
              AI <span style={{ color: C.red, fontStyle: "italic" }}>&</span> the Dusk
            </span>
            <span style={{
              ...serif, display: "block",
              fontSize: "clamp(18px, 2.5vw, 26px)", fontWeight: 400,
              color: C.pencilLight, letterSpacing: "0.02em",
              marginTop: 4, fontStyle: "italic",
            }}>
              of Humans
            </span>
          </h1>

          <p style={{
            ...sans, fontSize: 14, color: C.pencilFaint,
            fontWeight: 300, marginTop: 20, letterSpacing: "0.04em",
          }}>
            Surviving as the Second-Smartest Species
          </p>

          <div style={{ width: 40, height: 2, background: `linear-gradient(90deg, transparent, ${C.red}, transparent)`, margin: "16px auto", borderRadius: 1 }} />

          <p style={{
            ...serif, fontSize: 15, lineHeight: 1.6,
            color: C.pencilLight, maxWidth: 560, margin: "0 auto",
            fontStyle: "italic",
          }}>
            {loading ? (
              <span style={{ animation: "pulse 1.5s infinite" }}>Loading the archive...</span>
            ) : (
              <>
                <span style={{ color: "#fff", fontWeight: 600, fontSize: 20 }}>{entries.length.toLocaleString()}</span>
                {" "}articles, podcasts, papers & books on AI and what it means for the rest of us.
              </>
            )}
          </p>

          {/* Stats ribbon */}
          {!loading && entries.length > 0 && (
            <div style={{
              display: "flex", justifyContent: "center", gap: 16,
              marginTop: 16, flexWrap: "wrap",
              animation: "fadeIn 0.8s ease-out 0.3s both",
            }}>
              {Object.entries(TYPE_META).map(([type, meta]) => {
                const count = typeStats[type];
                if (!count) return null;
                return (
                  <button key={type} onClick={() => { tog(setSelTypes, type); scrollToResults(); }}
                    style={{
                      ...sans, fontSize: 11, color: C.pencilFaint, background: "none",
                      border: "none", cursor: "pointer", display: "flex", alignItems: "center",
                      gap: 5, padding: "4px 8px", borderRadius: 4,
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = `${C.red}20`; }}
                    onMouseLeave={e => { e.currentTarget.style.color = C.pencilFaint; e.currentTarget.style.background = "none"; }}
                  >
                    <span style={{ fontSize: 13 }}>{meta.icon}</span>
                    <span style={{ fontWeight: 600, color: "inherit" }}>{count}</span>
                    <span style={{ opacity: 0.7 }}>{meta.label}s</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </header>

      {/* START HERE */}
      {showStartHere && startHereItems.length > 0 && (
        <section style={{
          maxWidth: 900, margin: "0 auto", padding: "40px 32px 8px",
          animation: "fadeInUp 0.5s ease-out 0.2s both",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
            <div>
              <h2 style={{
                ...sans, fontSize: 11, fontWeight: 600, color: C.red,
                letterSpacing: "0.14em", textTransform: "uppercase", margin: 0,
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <span style={{ fontSize: 14 }}>★</span> If you read nothing else
              </h2>
              <p style={{ ...sans, fontSize: 12, color: C.pencilLight, marginTop: 5 }}>
                {startHereItems.length} essential starting points, hand-picked from the archive
              </p>
            </div>
            <button onClick={() => setShowStartHere(false)} aria-label="Hide Start Here section"
              style={{
                ...sans, fontSize: 11, color: C.pencilFaint, background: "none",
                border: `1px solid ${C.ruleFaint}`, borderRadius: 4,
                padding: "5px 12px", cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.rule; e.currentTarget.style.color = C.pencil; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.ruleFaint; e.currentTarget.style.color = C.pencilFaint; }}
            >
              Hide section
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 16 }}>
            {startHereItems.map((item, idx) => <StartCard key={item.id} item={item} index={idx} />)}
          </div>
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.rule}, transparent)`, margin: "36px 0 0" }} />
        </section>
      )}

      {/* CHAPTER TABS */}
      {activeChapters.length > 1 && (
        <section style={{ maxWidth: 900, margin: "0 auto", padding: "28px 32px 0" }}>
          <h2 style={{
            ...sans, fontSize: 11, fontWeight: 500, color: C.pencilFaint,
            letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12,
          }}>
            Browse by chapter
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            <button className="ch-tab" onClick={() => setSelChapter(null)}
              style={{
                ...sans, fontSize: 12, padding: "7px 16px", borderRadius: 6,
                cursor: "pointer", fontWeight: !selChapter ? 600 : 400,
                background: !selChapter ? C.red : "transparent",
                border: `1px solid ${!selChapter ? C.red : C.ruleFaint}`,
                color: !selChapter ? "#fff" : C.pencil,
              }}>
              All
            </button>
            {activeChapters.map(ch => {
              const count = entries.filter(e => e.chapter === ch.id).length;
              const active = selChapter === ch.id;
              return (
                <button key={ch.id} className="ch-tab"
                  onClick={() => setSelChapter(active ? null : ch.id)}
                  style={{
                    ...sans, fontSize: 12, padding: "7px 14px", borderRadius: 6,
                    cursor: "pointer", fontWeight: active ? 600 : 400,
                    background: active ? C.redSoft : "transparent",
                    border: `1px solid ${active ? C.red + "50" : C.ruleFaint}`,
                    color: active ? C.red : C.pencil,
                  }}>
                  {ch.short}
                  <span style={{ fontSize: 10, opacity: 0.5, marginLeft: 4 }}>({count})</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* QUESTION BROWSE */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "28px 32px 0" }}>
        <h2 style={{
          ...sans, fontSize: 11, fontWeight: 500, color: C.pencilFaint,
          letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14,
        }}>
          Browse by question
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {QUESTIONS.map(q => {
            const active = selQ.includes(q.label);
            const count = entries.filter(i => (i.questions || []).includes(q.label)).length;
            if (count === 0) return null;
            return (
              <button key={q.label} className="q-chip"
                onClick={() => tog(setSelQ, q.label)}
                style={{
                  ...sans, fontSize: 12.5, padding: "8px 16px", borderRadius: 20,
                  background: active ? q.color + "18" : C.softWhite,
                  border: `1.5px solid ${active ? q.color + "60" : C.rule}`,
                  color: active ? q.color : C.pencil,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 7,
                  fontWeight: active ? 600 : 400,
                  boxShadow: active ? `0 2px 8px ${q.color}15` : "0 1px 3px rgba(42,33,24,0.04)",
                }}>
                <span style={{ fontSize: 15 }}>{q.icon}</span>
                {q.label}
                <span style={{
                  ...sans, fontSize: 10, fontWeight: 600,
                  color: active ? q.color : C.pencilFaint,
                  background: active ? q.color + "15" : C.fog,
                  padding: "1px 6px", borderRadius: 8,
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* SIDEBAR + RESULTS LAYOUT */}
      <div ref={resultsRef} className="sidebar-layout" style={{
        maxWidth: 1200, margin: "0 auto", padding: "28px 32px 0",
        display: "flex", gap: 28, alignItems: "flex-start",
      }}>
        {/* LEFT SIDEBAR */}
        <aside style={{
          width: 260, minWidth: 260, flexShrink: 0,
          position: "sticky", top: 16, zIndex: 40,
          maxHeight: "calc(100vh - 32px)", overflowY: "auto",
          background: C.softWhite,
          border: `1px solid ${C.rule}`,
          borderRadius: 12,
          padding: "20px 18px",
          boxShadow: "0 2px 12px rgba(42,33,24,0.05)",
          display: "flex", flexDirection: "column", gap: 16,
        }}>
          {/* Search input */}
          <div>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: C.cream, border: `1.5px solid ${C.rule}`,
              borderRadius: 8, padding: "9px 12px",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.pencilLight} strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
              </svg>
              <input type="text" placeholder="Search..."
                value={search} onChange={e => setSearch(e.target.value)}
                aria-label="Search references"
                style={{
                  ...sans, flex: 1, background: "none", border: "none",
                  fontSize: 13, color: C.ink, outline: "none",
                  fontWeight: 400, width: "100%",
                }}
              />
              {search && (
                <button onClick={() => setSearch("")} aria-label="Clear search"
                  style={{
                    background: C.fog, border: "none", color: C.pencil,
                    cursor: "pointer", fontSize: 13, lineHeight: 1,
                    width: 20, height: 20, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                  ×
                </button>
              )}
            </div>
          </div>

          {/* View + Sort row */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{
              display: "flex", borderRadius: 6, overflow: "hidden",
              border: `1.5px solid ${C.rule}`, flex: "0 0 auto",
            }}>
              <button onClick={() => setViewMode("list")} aria-label="List view"
                style={{
                  ...sans, padding: "7px 10px", cursor: "pointer",
                  background: viewMode === "list" ? C.redSoft : "transparent",
                  border: "none", color: viewMode === "list" ? C.red : C.pencilLight,
                  display: "flex", alignItems: "center",
                }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </button>
              <button onClick={() => setViewMode("grid")} aria-label="Grid view"
                style={{
                  ...sans, padding: "7px 10px", cursor: "pointer",
                  background: viewMode === "grid" ? C.redSoft : "transparent",
                  border: "none", borderLeft: `1px solid ${C.rule}`,
                  color: viewMode === "grid" ? C.red : C.pencilLight,
                  display: "flex", alignItems: "center",
                }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                </svg>
              </button>
            </div>
            <select value={sort} onChange={e => setSort(e.target.value)}
              aria-label="Sort entries"
              style={{
                ...sans, fontSize: 11, padding: "8px 24px 8px 10px", borderRadius: 6,
                background: "transparent", border: `1.5px solid ${C.rule}`,
                color: C.pencil, cursor: "pointer", fontWeight: 500, flex: 1,
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%239b8d7f' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 8px center",
              }}>
              <option value="chapter">By chapter</option>
              <option value="year">Newest first</option>
              <option value="title">A → Z</option>
            </select>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: C.ruleFaint }} />

          {/* Type filters */}
          <FRow label="Type">
            {Object.entries(TYPE_META).map(([t, m]) => (
              <FilterTag key={t} label={`${m.icon} ${m.label}`} active={selTypes.includes(t)} color={m.border} onClick={() => tog(setSelTypes, t)} />
            ))}
          </FRow>

          {/* Difficulty filters */}
          <FRow label="Difficulty">
            {Object.entries(DIFF_META).map(([d, m]) => (
              <FilterTag key={d} label={`${m.icon} ${m.label}`} active={selDiff.includes(d)} color={m.color} onClick={() => tog(setSelDiff, d)} />
            ))}
          </FRow>

          {/* Keyword filters */}
          {allKeywords.length > 0 && (
            <FRow label="Keywords" last>
              {allKeywords.map(kw => (
                <FilterTag key={kw} label={kw} active={selKw.includes(kw)} color={C.pencil} onClick={() => tog(setSelKw, kw)} />
              ))}
            </FRow>
          )}

          {/* Active filter chips */}
          {hasFilters && (
            <>
              <div style={{ height: 1, background: C.ruleFaint }} />
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ ...sans, fontSize: 10, fontWeight: 600, color: C.pencilLight, textTransform: "uppercase", letterSpacing: "0.14em" }}>Active filters</span>
                  <button onClick={clearAll}
                    style={{
                      ...sans, fontSize: 10, fontWeight: 600,
                      color: C.red, background: "none",
                      border: "none", cursor: "pointer",
                      textDecoration: "underline", textUnderlineOffset: 2,
                    }}>
                    Clear all
                  </button>
                </div>
                <div style={{
                  display: "flex", flexWrap: "wrap", gap: 5,
                  animation: "fadeIn 0.2s ease-out",
                }}>
                  {selChapter && (
                    <ActiveChip label={CHAPTERS.find(c => c.id === selChapter)?.short || selChapter}
                      onRemove={() => setSelChapter(null)} color={C.red} />
                  )}
                  {selQ.map(q => {
                    const qd = QUESTIONS.find(x => x.label === q);
                    return <ActiveChip key={q} label={`${qd?.icon || ""} ${q}`} onRemove={() => tog(setSelQ, q)} color={qd?.color || C.pencil} />;
                  })}
                  {selTypes.map(t => (
                    <ActiveChip key={t} label={TYPE_META[t]?.label || t} onRemove={() => tog(setSelTypes, t)} color={TYPE_META[t]?.border || C.pencil} />
                  ))}
                  {selDiff.map(d => (
                    <ActiveChip key={d} label={DIFF_META[d]?.label || d} onRemove={() => tog(setSelDiff, d)} color={DIFF_META[d]?.color || C.pencil} />
                  ))}
                  {selKw.map(kw => (
                    <ActiveChip key={kw} label={kw} onRemove={() => tog(setSelKw, kw)} color={C.pencil} />
                  ))}
                  {search && (
                    <ActiveChip label={`"${search}"`} onRemove={() => setSearch("")} color={C.ink} />
                  )}
                </div>
              </div>
            </>
          )}
        </aside>

        {/* RESULTS */}
        <main style={{ flex: 1, minWidth: 0, paddingBottom: 80 }}>
        {/* Results count bar */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 20,
        }}>
          <p style={{ ...sans, fontSize: 13, color: C.pencilLight, fontWeight: 500 }}>
            {loading ? (
              <span style={{ animation: "pulse 1.5s infinite" }}>Loading references...</span>
            ) : results.length === entries.length
              ? `Showing all ${results.length} sources`
              : `${results.length} of ${entries.length} sources`
            }
          </p>
          {totalPages > 1 && (
            <p style={{ ...sans, fontSize: 12, color: C.pencilFaint }}>
              Page {page} of {totalPages}
            </p>
          )}
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{
                padding: 24, borderRadius: 10,
                background: C.softWhite, border: `1px solid ${C.ruleFaint}`,
              }}>
                <div className="skeleton" style={{ width: 80, height: 12, marginBottom: 12 }} />
                <div className="skeleton" style={{ width: "70%", height: 18, marginBottom: 10 }} />
                <div className="skeleton" style={{ width: "50%", height: 12, marginBottom: 10 }} />
                <div className="skeleton" style={{ width: "90%", height: 40 }} />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && results.length === 0 && (
          <div style={{
            textAlign: "center", padding: "64px 24px",
            background: C.softWhite, borderRadius: 12,
            border: `1px dashed ${C.rule}`,
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p style={{ ...serif, fontSize: 20, color: C.ink, marginBottom: 8 }}>No matches found</p>
            <p style={{ ...sans, fontSize: 14, color: C.pencilLight, marginBottom: 24, maxWidth: 360, margin: "0 auto 24px" }}>
              Try adjusting your filters or search terms to discover more sources.
            </p>
            <button onClick={clearAll}
              style={{
                ...sans, background: C.red, border: "none",
                color: "#fff", padding: "10px 24px", borderRadius: 8,
                cursor: "pointer", fontSize: 13, fontWeight: 600,
                transition: "all 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = C.redHover}
              onMouseLeave={e => e.currentTarget.style.background = C.red}
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <>
            {viewMode === "grid" ? (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 16,
              }}>
                {visible.map((item, idx) => (
                  <GridCard key={item.id} item={item} index={idx}
                    isExpanded={expanded === item.id}
                    onToggle={() => setExpanded(expanded === item.id ? null : item.id)}
                  />
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {visible.map((item, idx) => (
                  <Card key={item.id} item={item}
                    isExpanded={expanded === item.id}
                    onToggle={() => setExpanded(expanded === item.id ? null : item.id)}
                    isLast={idx === visible.length - 1}
                    index={idx}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <nav aria-label="Pagination" style={{
                display: "flex", justifyContent: "center", alignItems: "center",
                gap: 6, marginTop: 40, paddingTop: 24,
                borderTop: `1px solid ${C.ruleFaint}`,
              }}>
                <PgBtn label="← Prev" onClick={() => { setPage(page - 1); scrollToResults(); }} disabled={page <= 1} />
                <div style={{ display: "flex", gap: 4 }}>
                  {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                    let p;
                    if (totalPages <= 10) p = i + 1;
                    else { const start = Math.max(1, Math.min(page - 4, totalPages - 9)); p = start + i; }
                    return <PgBtn key={p} label={p} active={p === page} onClick={() => { setPage(p); scrollToResults(); }} />;
                  })}
                </div>
                <PgBtn label="Next →" onClick={() => { setPage(page + 1); scrollToResults(); }} disabled={page >= totalPages} />
              </nav>
            )}
          </>
        )}
      </main>
      </div>

      {/* FOOTER */}
      <footer style={{
        borderTop: `1px solid ${C.rule}`,
        background: `linear-gradient(180deg, ${C.charcoal} 0%, #0f0d0a 100%)`,
        padding: "48px 32px", textAlign: "center",
      }}>
        <div style={{
          width: 40, height: 2,
          background: `linear-gradient(90deg, transparent, ${C.red}, transparent)`,
          margin: "0 auto 20px", borderRadius: 1,
        }} />
        <p style={{
          ...sans, fontSize: 12, color: C.pencilLight,
          letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600,
        }}>
          Juan Camilo Bastin
        </p>
        <p style={{
          ...serif, fontSize: 15, color: C.pencilFaint,
          marginTop: 10, fontStyle: "italic",
          maxWidth: 480, margin: "10px auto 0",
          lineHeight: 1.6,
        }}>
          A living database that fed the book — built without writing a single line of code.
        </p>
        <p style={{ ...sans, fontSize: 11, color: C.pencil, marginTop: 16 }}>
          McGill University · Master of Management in Analytics
        </p>
        <div style={{
          ...sans, fontSize: 10, color: C.pencilFaint, marginTop: 20,
          opacity: 0.5,
        }}>
          {entries.length > 0 && `${entries.length.toLocaleString()} sources across ${activeChapters.length} chapters`}
        </div>
      </footer>
    </div>
  );
}

// ===== SUB-COMPONENTS =====

function ActiveChip({ label, onRemove, color }) {
  return (
    <span style={{
      ...{ fontFamily: "'Source Sans 3', system-ui, sans-serif" },
      fontSize: 11, fontWeight: 500,
      padding: "3px 8px 3px 10px", borderRadius: 12,
      background: color + "12", border: `1px solid ${color}30`,
      color: color, display: "inline-flex", alignItems: "center", gap: 5,
      animation: "fadeIn 0.15s ease-out",
    }}>
      {label}
      <button onClick={onRemove} aria-label={`Remove filter: ${label}`}
        style={{
          background: color + "20", border: "none", color: color,
          cursor: "pointer", fontSize: 12, lineHeight: 1,
          width: 16, height: 16, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.background = color + "40"}
        onMouseLeave={e => e.currentTarget.style.background = color + "20"}
      >
        ×
      </button>
    </span>
  );
}

function StartCard({ item, index }) {
  const tm = TYPE_META[item.type] || { label: item.type, icon: "📄", bg: C.fog, border: C.pencil };
  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer"
      style={{ textDecoration: "none", color: "inherit", animation: `fadeInUp 0.4s ease-out ${index * 0.08}s both` }}>
      <article className="start-card-hover" style={{
        padding: "20px 22px", borderRadius: 10,
        background: C.softWhite,
        border: `1px solid ${C.rule}`,
        borderLeft: `3px solid ${C.red}`,
        cursor: "pointer", minHeight: 160,
        display: "flex", flexDirection: "column",
        boxShadow: "0 2px 8px rgba(42,33,24,0.04)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Gold star badge */}
        <div style={{
          position: "absolute", top: 12, right: 12,
          width: 28, height: 28, borderRadius: "50%",
          background: C.goldSoft, border: `1px solid ${C.gold}40`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13,
        }}>
          ★
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{
            ...{ fontFamily: "'Source Sans 3', system-ui, sans-serif" },
            fontSize: 10, fontWeight: 600, textTransform: "uppercase",
            letterSpacing: "0.08em", padding: "3px 10px", borderRadius: 4,
            background: tm.bg, border: `1px solid ${tm.border}25`, color: tm.border,
            display: "flex", alignItems: "center", gap: 4,
          }}>
            <span style={{ fontSize: 11 }}>{tm.icon}</span>{tm.label}
          </span>
          <span style={{
            ...{ fontFamily: "'Source Sans 3', system-ui, sans-serif" },
            fontSize: 10, color: C.pencilFaint,
          }}>{item.time}</span>
        </div>

        <h3 style={{
          ...{ fontFamily: "'Playfair Display', Georgia, serif" },
          fontSize: 15, fontWeight: 700, lineHeight: 1.4,
          margin: "0 0 8px", color: C.ink, flex: 1,
          paddingRight: 32,
        }}>
          {item.title}
        </h3>

        <div style={{
          ...sans, fontSize: 12, color: C.pencilLight, margin: "0 0 8px", lineHeight: 1.4,
          display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap",
        }}>
          {item.author && <span>{item.author}</span>}
          {item.author && <span style={{ opacity: 0.4 }}>·</span>}
          <span style={{
            fontSize: 13, fontWeight: 700, color: "#8b6914",
            background: "#d4a85318", padding: "2px 8px", borderRadius: 4,
            display: "inline-flex", alignItems: "center", gap: 5,
          }}>
            {sourceFavicon(item.source) && (
              <img src={sourceFavicon(item.source)} alt="" width="14" height="14"
                style={{ borderRadius: 2, flexShrink: 0 }}
                onError={e => { e.target.style.display = "none"; }} />
            )}
            {item.source}
          </span>
          {item.year && <span style={{ opacity: 0.4 }}>·</span>}
          {item.year && <span style={{ fontWeight: 600, color: C.pencil }}>{item.year}</span>}
        </div>

        <div style={{
          ...{ fontFamily: "'Source Sans 3', system-ui, sans-serif" },
          fontSize: 11, color: C.red, fontWeight: 600,
          display: "flex", alignItems: "center", gap: 5,
          marginTop: "auto",
        }}>
          {item.type === "podcast" ? "Listen" : item.type === "video" ? "Watch" : "Read"} →
        </div>
      </article>
    </a>
  );
}

function Card({ item, isExpanded, onToggle, isLast, index }) {
  const tm = TYPE_META[item.type] || { label: item.type, icon: "📄", bg: C.fog, border: C.pencil };
  const dm = DIFF_META[item.difficulty] || { label: "", icon: "", color: C.pencil };
  const qs = QUESTIONS.filter(q => (item.questions || []).includes(q.label));
  const chapterLabel = CHAPTERS.find(c => c.id === item.chapter)?.short || item.chapter;

  return (
    <article onClick={onToggle}
      style={{
        padding: "22px 24px", margin: "0 0 2px",
        borderRadius: 10,
        background: isExpanded ? C.softWhite : "transparent",
        border: `1px solid ${isExpanded ? C.rule : "transparent"}`,
        borderLeft: item.startHere ? `3px solid ${C.red}` : `3px solid transparent`,
        cursor: "pointer",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: isExpanded ? "0 4px 16px rgba(42,33,24,0.06)" : "none",
        animation: `fadeInUp 0.3s ease-out ${index * 0.03}s both`,
      }}
      onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.background = C.softWhite + "80"; }}
      onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.background = "transparent"; }}
    >
      {/* Top row: badges */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
        <span style={{
          ...{ fontFamily: "'Source Sans 3', system-ui, sans-serif" },
          fontSize: 10, fontWeight: 600, textTransform: "uppercase",
          letterSpacing: "0.06em", padding: "3px 10px", borderRadius: 4,
          background: tm.bg, border: `1px solid ${tm.border}25`, color: tm.border,
          display: "flex", alignItems: "center", gap: 4,
        }}>
          <span style={{ fontSize: 11 }}>{tm.icon}</span>{tm.label}
        </span>
        <span style={{
          ...{ fontFamily: "'Source Sans 3', system-ui, sans-serif" },
          fontSize: 10, padding: "3px 10px", borderRadius: 4,
          background: dm.color + "12", color: dm.color,
          border: `1px solid ${dm.color}25`,
          display: "flex", alignItems: "center", gap: 4,
        }}>
          <span style={{ fontSize: 10 }}>{dm.icon}</span>{dm.label}
        </span>
        <span style={{
          ...{ fontFamily: "'Source Sans 3', system-ui, sans-serif" },
          fontSize: 11, color: C.pencilFaint,
        }}>{item.time}</span>
        <span style={{ flex: 1 }} />
        <span style={{
          ...{ fontFamily: "'Source Sans 3', system-ui, sans-serif" },
          fontSize: 11, color: C.pencilFaint,
          padding: "2px 8px", borderRadius: 4,
          background: C.fog + "80",
        }}>
          {chapterLabel}
        </span>
        {/* Expand indicator */}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.pencilFaint} strokeWidth="2" strokeLinecap="round"
          style={{ transition: "transform 0.25s", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>

      {/* Title */}
      <h3 style={{
        ...{ fontFamily: "'Playfair Display', Georgia, serif" },
        fontSize: 18, fontWeight: 700, lineHeight: 1.35,
        margin: "0 0 8px", color: C.ink,
      }}>
        {item.title}
      </h3>

      {/* Source & Date — prominent with favicon */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
        margin: "0 0 12px",
      }}>
        <span style={{
          ...sans, fontSize: 14, fontWeight: 700, color: "#8b6914",
          padding: "4px 14px", borderRadius: 6,
          background: "#d4a85318", border: `1px solid #d4a85328`,
          display: "inline-flex", alignItems: "center", gap: 8,
        }}>
          {sourceFavicon(item.source) && (
            <img src={sourceFavicon(item.source)} alt="" width="18" height="18"
              style={{ borderRadius: 3, flexShrink: 0 }}
              onError={e => { e.target.style.display = "none"; }} />
          )}
          {item.source}{item.publisher && item.publisher !== item.source ? ` (${item.publisher})` : ""}
        </span>
        {item.year && (
          <span style={{
            ...sans, fontSize: 13, fontWeight: 700, color: C.inkSoft,
            padding: "4px 10px", borderRadius: 6,
            background: C.fog, border: `1px solid ${C.rule}`,
          }}>
            {item.month ? `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][item.month - 1]} ` : ""}{item.year}
          </span>
        )}
        {item.author && (
          <span style={{ ...sans, fontSize: 12, color: C.pencil }}>
            {item.author}
          </span>
        )}
      </div>

      {/* Hook quote */}
      <div style={{
        padding: "10px 16px", margin: "0 0 10px",
        borderLeft: `2px solid ${C.red}40`,
        borderRadius: "0 4px 4px 0",
        background: C.redGlow,
      }}>
        <p style={{
          ...{ fontFamily: "'Playfair Display', Georgia, serif" },
          fontSize: 14.5, lineHeight: 1.65, color: C.inkSoft,
          margin: 0, fontStyle: "italic",
        }}>
          "{item.hook}"
        </p>
      </div>

      {/* Why it matters */}
      {item.why_it_matters && (
        <p style={{
          ...{ fontFamily: "'Source Sans 3', system-ui, sans-serif" },
          fontSize: 13, lineHeight: 1.55, color: C.pencil, margin: "0 0 12px",
        }}>
          <span style={{ fontWeight: 600, color: C.red, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>Why it matters </span>
          <br />
          {item.why_it_matters}
        </p>
      )}

      {/* Keywords */}
      {(item.keywords || []).length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
          {item.keywords.map(kw => (
            <span key={kw} style={{
              ...{ fontFamily: "'Source Sans 3', system-ui, sans-serif" },
              fontSize: 10, padding: "3px 9px", borderRadius: 4,
              background: C.fog, color: C.pencil,
              border: `1px solid ${C.ruleFaint}`,
            }}>{kw}</span>
          ))}
        </div>
      )}

      {/* Questions */}
      {qs.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {qs.map(q => (
            <span key={q.label} style={{
              ...{ fontFamily: "'Source Sans 3', system-ui, sans-serif" },
              fontSize: 10, padding: "3px 9px", borderRadius: 12,
              background: q.color + "10", border: `1px solid ${q.color}20`,
              color: q.color, display: "inline-flex", alignItems: "center", gap: 4,
            }}>
              <span style={{ fontSize: 10 }}>{q.icon}</span> {q.label}
            </span>
          ))}
        </div>
      )}

      {/* Start here badge */}
      {item.startHere && (
        <div style={{
          ...{ fontFamily: "'Source Sans 3', system-ui, sans-serif" },
          fontSize: 11, color: C.gold, fontWeight: 600, marginTop: 8,
          display: "flex", alignItems: "center", gap: 4,
          padding: "4px 10px", borderRadius: 4,
          background: C.goldSoft, width: "fit-content",
        }}>
          ★ Start Here
        </div>
      )}

      {/* Expanded content */}
      {isExpanded && (
        <div style={{
          marginTop: 18, paddingTop: 18,
          borderTop: `1px solid ${C.ruleFaint}`,
          animation: "fadeIn 0.25s ease-out",
        }}>
          {item.summary && (
            <p style={{
              ...{ fontFamily: "'Source Sans 3', system-ui, sans-serif" },
              fontSize: 13, lineHeight: 1.65, color: C.pencil, margin: "0 0 16px",
              background: C.cream, padding: "14px 16px", borderRadius: 8,
            }}>
              {item.summary}
            </p>
          )}
          <a href={item.url} target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="source-link"
            style={{
              ...{ fontFamily: "'Source Sans 3', system-ui, sans-serif" },
              fontSize: 13, fontWeight: 600, color: "#fff",
              textDecoration: "none", display: "inline-flex",
              alignItems: "center", gap: 8,
              padding: "10px 20px", borderRadius: 8,
              background: C.red,
              boxShadow: "0 2px 8px rgba(184,58,42,0.2)",
            }}>
            {item.type === "podcast" ? "🎙️ Listen to source" : item.type === "video" ? "🎬 Watch source" : "📄 Read source"}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>
      )}
    </article>
  );
}

function GridCard({ item, index, isExpanded, onToggle }) {
  const tm = TYPE_META[item.type] || { label: item.type, icon: "📄", bg: C.fog, border: C.pencil };
  const dm = DIFF_META[item.difficulty] || { label: "", icon: "", color: C.pencil };
  const chapterLabel = CHAPTERS.find(c => c.id === item.chapter)?.short || item.chapter;

  return (
    <article className="card-hover" onClick={onToggle}
      style={{
        padding: "20px 22px", borderRadius: 10,
        background: C.softWhite,
        border: `1px solid ${isExpanded ? C.red + "30" : C.rule}`,
        borderTop: `3px solid ${item.startHere ? C.red : tm.border}`,
        cursor: "pointer",
        display: "flex", flexDirection: "column",
        boxShadow: "0 2px 8px rgba(42,33,24,0.04)",
        animation: `fadeInUp 0.3s ease-out ${index * 0.04}s both`,
      }}>
      {/* Badge row */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
        <span style={{
          ...{ fontFamily: "'Source Sans 3', system-ui, sans-serif" },
          fontSize: 10, fontWeight: 600, textTransform: "uppercase",
          letterSpacing: "0.06em", padding: "3px 8px", borderRadius: 4,
          background: tm.bg, color: tm.border,
          display: "flex", alignItems: "center", gap: 3,
        }}>
          <span style={{ fontSize: 10 }}>{tm.icon}</span>{tm.label}
        </span>
        <span style={{
          ...{ fontFamily: "'Source Sans 3', system-ui, sans-serif" },
          fontSize: 10, padding: "3px 8px", borderRadius: 4,
          background: dm.color + "12", color: dm.color,
        }}>
          {dm.label}
        </span>
        <span style={{ flex: 1 }} />
        <span style={{
          ...{ fontFamily: "'Source Sans 3', system-ui, sans-serif" },
          fontSize: 10, color: C.pencilFaint,
        }}>
          {chapterLabel}
        </span>
      </div>

      {/* Title */}
      <h3 style={{
        ...{ fontFamily: "'Playfair Display', Georgia, serif" },
        fontSize: 15, fontWeight: 700, lineHeight: 1.35,
        margin: "0 0 8px", color: C.ink,
      }}>
        {item.title}
      </h3>

      {/* Source & Date — prominent with favicon */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap",
        margin: "0 0 10px",
      }}>
        <span style={{
          ...sans, fontSize: 12, fontWeight: 700, color: "#8b6914",
          padding: "3px 10px", borderRadius: 5,
          background: "#d4a85318", border: `1px solid #d4a85328`,
          display: "inline-flex", alignItems: "center", gap: 6,
        }}>
          {sourceFavicon(item.source) && (
            <img src={sourceFavicon(item.source)} alt="" width="14" height="14"
              style={{ borderRadius: 2, flexShrink: 0 }}
              onError={e => { e.target.style.display = "none"; }} />
          )}
          {item.source}
        </span>
        {item.year && (
          <span style={{
            ...sans, fontSize: 11, fontWeight: 700, color: C.inkSoft,
            padding: "3px 8px", borderRadius: 5,
            background: C.fog, border: `1px solid ${C.rule}`,
          }}>
            {item.month ? `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][item.month - 1]} ` : ""}{item.year}
          </span>
        )}
        {item.author && (
          <span style={{ ...sans, fontSize: 10, color: C.pencil }}>
            {item.author}
          </span>
        )}
      </div>

      {/* Hook (truncated in grid) */}
      <p style={{
        ...{ fontFamily: "'Playfair Display', Georgia, serif" },
        fontSize: 13, lineHeight: 1.55, color: C.inkSoft,
        margin: "0 0 10px", fontStyle: "italic",
        display: "-webkit-box", WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical", overflow: "hidden",
        flex: 1,
      }}>
        "{item.hook}"
      </p>

      {/* Bottom info */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        paddingTop: 10, borderTop: `1px solid ${C.ruleFaint}`, marginTop: "auto",
      }}>
        <span style={{
          ...{ fontFamily: "'Source Sans 3', system-ui, sans-serif" },
          fontSize: 10, color: C.pencilFaint,
        }}>
          {item.time}
        </span>
        {item.startHere && (
          <span style={{
            ...{ fontFamily: "'Source Sans 3', system-ui, sans-serif" },
            fontSize: 10, color: C.gold, fontWeight: 600,
          }}>
            ★ Start Here
          </span>
        )}
        <span style={{
          ...{ fontFamily: "'Source Sans 3', system-ui, sans-serif" },
          fontSize: 11, color: C.red, fontWeight: 600,
        }}>
          {isExpanded ? "Less ↑" : "More →"}
        </span>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div style={{
          marginTop: 14, paddingTop: 14,
          borderTop: `1px solid ${C.ruleFaint}`,
          animation: "fadeIn 0.25s ease-out",
        }}>
          {item.why_it_matters && (
            <p style={{
              ...{ fontFamily: "'Source Sans 3', system-ui, sans-serif" },
              fontSize: 12, lineHeight: 1.55, color: C.pencil, margin: "0 0 10px",
            }}>
              <span style={{ fontWeight: 600, color: C.red, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>Why it matters</span>
              <br />{item.why_it_matters}
            </p>
          )}
          {item.summary && (
            <p style={{
              ...{ fontFamily: "'Source Sans 3', system-ui, sans-serif" },
              fontSize: 12, lineHeight: 1.55, color: C.pencil, margin: "0 0 12px",
              background: C.cream, padding: "10px 12px", borderRadius: 6,
            }}>
              {item.summary}
            </p>
          )}
          <a href={item.url} target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="source-link"
            style={{
              ...{ fontFamily: "'Source Sans 3', system-ui, sans-serif" },
              fontSize: 12, fontWeight: 600, color: "#fff",
              textDecoration: "none", display: "inline-flex",
              alignItems: "center", gap: 6,
              padding: "8px 16px", borderRadius: 6,
              background: C.red,
            }}>
            {item.type === "podcast" ? "🎙️ Listen" : item.type === "video" ? "🎬 Watch" : "📄 Read"} source
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>
      )}
    </article>
  );
}

function FRow({ label, children, last }) {
  return (
    <fieldset style={{ marginBottom: last ? 0 : 16, border: "none", padding: 0 }}>
      <legend style={{
        ...{ fontFamily: "'Source Sans 3', system-ui, sans-serif" },
        fontSize: 10, fontWeight: 600, color: C.pencilLight,
        marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.14em",
      }}>{label}</legend>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{children}</div>
    </fieldset>
  );
}

function FilterTag({ label, active, onClick, color }) {
  return (
    <button className="filter-btn" onClick={onClick}
      style={{
        ...{ fontFamily: "'Source Sans 3', system-ui, sans-serif" },
        fontSize: 12, padding: "5px 14px", borderRadius: 6,
        fontWeight: active ? 600 : 400,
        background: active ? (color + "14") : "transparent",
        border: `1.5px solid ${active ? color + "50" : C.ruleFaint}`,
        color: active ? color : C.pencil,
        cursor: "pointer",
        boxShadow: active ? `0 1px 4px ${color}15` : "none",
      }}>
      {label}
    </button>
  );
}

function PgBtn({ label, active, onClick, disabled }) {
  return (
    <button className="pg-btn" onClick={disabled ? undefined : onClick}
      style={{
        ...{ fontFamily: "'Source Sans 3', system-ui, sans-serif" },
        minWidth: typeof label === "number" ? 36 : "auto",
        height: 36, padding: "0 12px", borderRadius: 8,
        fontWeight: active ? 700 : 500,
        background: active ? C.red : "transparent",
        border: `1.5px solid ${active ? C.red : disabled ? C.ruleFaint : C.rule}`,
        color: active ? "#fff" : disabled ? C.pencilFaint : C.pencil,
        cursor: disabled ? "default" : "pointer",
        fontSize: 12, opacity: disabled ? 0.5 : 1,
      }}>
      {label}
    </button>
  );
}
