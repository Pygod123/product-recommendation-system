import { useState } from "react";
import axios from "axios";

const suggestions = [
  "Phone under $300",
  "Phone under $500",
  "Good device under $400",
  "Best smartphone",
];

function App() {
  const [preference, setPreference] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [query, setQuery] = useState("");

  const getRecommendations = async (pref) => {
    const searchTerm = pref || preference;
    if (!searchTerm.trim()) return;
    setLoading(true);
    setSearched(false);
    setQuery(searchTerm);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/recommend`, {
        preference: searchTerm,
      });
      setRecommendations(response.data.recommendation);
    } catch (e) {
      setRecommendations([]);
    }
    setLoading(false);
    setSearched(true);
  };

  const handleChip = (chip) => {
    setPreference(chip);
    getRecommendations(chip);
  };

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .search-input:focus {
          outline: none;
          border-color: #5C6AC4 !important;
          box-shadow: 0 0 0 3px rgba(92, 106, 196, 0.15) !important;
        }
        .search-btn:hover {
          background: #4A56B0 !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(92, 106, 196, 0.4) !important;
        }
        .search-btn:active { transform: translateY(0); }

        .chip:hover {
          background: #5C6AC4 !important;
          color: #fff !important;
          border-color: #5C6AC4 !important;
          transform: translateY(-1px);
        }

        .product-card {
          animation: fadeUp 0.3s ease both;
        }
        .product-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.08) !important;
          border-color: #5C6AC4 !important;
        }

        .score-bar-fill {
          background: linear-gradient(90deg, #5C6AC4, #9B8EF0);
          height: 4px;
          border-radius: 2px;
          transition: width 1s ease;
        }
      `}</style>

      {/* Background decoration */}
      <div style={styles.bgDecor1} />
      <div style={styles.bgDecor2} />

      <div style={styles.container}>

        {/* Header */}
        <header style={styles.header}>
          <div style={styles.logoRow}>
            <div style={styles.logoMark}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  fill="#fff" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={styles.logoText}>SmartPick</span>
          </div>
          <div style={styles.aiBadge}>
            <span style={styles.aiBadgeDot} />
            AI · HuggingFace
          </div>
        </header>

        {/* Hero */}
        <section style={styles.hero}>
          <h1 style={styles.heroTitle}>Find your perfect<br /><span style={styles.heroAccent}>product match</span></h1>
          <p style={styles.heroSub}>Describe what you need in plain English — our AI does the rest</p>
        </section>

        {/* Search Card */}
        <div style={styles.searchCard}>
          <label style={styles.searchLabel}>What are you looking for?</label>
          <div style={styles.searchRow}>
            <div style={styles.inputWrapper}>
              <svg style={styles.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                className="search-input"
                style={styles.input}
                type="text"
                placeholder="e.g. best phone under $400 with good camera"
                value={preference}
                onChange={(e) => setPreference(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && getRecommendations()}
              />
            </div>
            <button className="search-btn" style={styles.searchBtn} onClick={() => getRecommendations()}>
              Search
            </button>
          </div>

          <div style={styles.suggestionsRow}>
            <span style={styles.suggestionsLabel}>Try:</span>
            {suggestions.map((s) => (
              <span key={s} className="chip" style={styles.chip} onClick={() => handleChip(s)}>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={styles.loadingArea}>
            <div style={styles.loadingCards}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ ...styles.skeletonCard, animationDelay: `${i * 0.15}s` }}>
                  <div style={styles.skeletonThumb} />
                  <div style={styles.skeletonLines}>
                    <div style={{ ...styles.skeletonLine, width: '60%' }} />
                    <div style={{ ...styles.skeletonLine, width: '40%', height: 10 }} />
                  </div>
                  <div style={{ ...styles.skeletonLine, width: 50, alignSelf: 'center' }} />
                </div>
              ))}
            </div>
            <p style={styles.loadingText}>Finding best matches…</p>
          </div>
        )}

        {/* Results */}
        {!loading && searched && (
          <div style={styles.resultsArea}>
            <div style={styles.resultsHeader}>
              <div>
                <p style={styles.resultsFor}>Results for</p>
                <p style={styles.resultsQuery}>"{query}"</p>
              </div>
              <div style={styles.countPill}>{recommendations.length} found</div>
            </div>

            {recommendations.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                    <path d="M8 11h6M11 8v6" stroke="#C4B5FD" strokeWidth="1.5"/>
                  </svg>
                </div>
                <p style={styles.emptyTitle}>No products found</p>
                <p style={styles.emptyHint}>Try a different query or use one of the suggestions above</p>
              </div>
            ) : (
              <div style={styles.cardGrid}>
                {recommendations.map((item, idx) => (
                  <div
                    key={item.id}
                    className="product-card"
                    style={{ ...styles.productCard, animationDelay: `${idx * 0.07}s` }}
                  >
                    <div style={styles.productThumb}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5C6AC4" strokeWidth="1.5">
                        <rect x="5" y="2" width="14" height="20" rx="2"/>
                        <path d="M12 18h.01"/>
                      </svg>
                    </div>
                    <div style={styles.productInfo}>
                      <p style={styles.productName}>{item.name}</p>
                      <span style={styles.categoryPill}>{item.category}</span>
                    </div>
                    <div style={styles.productPriceCol}>
                      <span style={styles.productPrice}>${item.price}</span>
                      <span style={styles.productPriceLabel}>USD</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty state before search */}
        {!loading && !searched && (
          <div style={styles.idleState}>
            <div style={styles.idleGrid}>
              {["📱 Phones", "💻 Laptops", "🎧 Audio", "📷 Cameras"].map(label => (
                <div key={label} style={styles.idleTile}>{label}</div>
              ))}
            </div>
            <p style={styles.idleHint}>Search across thousands of products</p>
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F7F7FB",
    fontFamily: "'DM Sans', sans-serif",
    position: "relative",
    overflow: "hidden",
    padding: "2rem 1rem 4rem",
  },
  bgDecor1: {
    position: "fixed", top: -120, right: -120,
    width: 400, height: 400, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(92,106,196,0.08) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  bgDecor2: {
    position: "fixed", bottom: -80, left: -80,
    width: 300, height: 300, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(155,142,240,0.07) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  container: {
    maxWidth: 560,
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  header: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between", marginBottom: "2.5rem",
  },
  logoRow: { display: "flex", alignItems: "center", gap: 10 },
  logoMark: {
    width: 36, height: 36, borderRadius: 10,
    background: "linear-gradient(135deg, #5C6AC4, #9B8EF0)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  logoText: {
    fontFamily: "'Syne', sans-serif", fontWeight: 700,
    fontSize: 18, color: "#1A1A2E", letterSpacing: "-0.02em",
  },
  aiBadge: {
    display: "flex", alignItems: "center", gap: 6,
    background: "#fff", border: "1px solid #E5E7EB",
    borderRadius: 20, padding: "5px 12px",
    fontSize: 11, fontWeight: 500, color: "#6B7280",
    letterSpacing: "0.02em",
  },
  aiBadgeDot: {
    width: 6, height: 6, borderRadius: "50%",
    background: "#22C55E",
    boxShadow: "0 0 0 2px rgba(34,197,94,0.3)",
    display: "inline-block",
    animation: "pulse 2s infinite",
  },
  hero: { marginBottom: "2rem", textAlign: "left" },
  heroTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "clamp(28px, 5vw, 36px)",
    fontWeight: 800, color: "#1A1A2E",
    lineHeight: 1.15, margin: "0 0 12px",
    letterSpacing: "-0.03em",
  },
  heroAccent: {
    background: "linear-gradient(90deg, #5C6AC4, #9B8EF0)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  heroSub: {
    fontSize: 15, color: "#6B7280",
    margin: 0, fontWeight: 300, lineHeight: 1.6,
  },
  searchCard: {
    background: "#fff",
    border: "1px solid #E5E7EB",
    borderRadius: 20,
    padding: "1.5rem",
    marginBottom: "1.5rem",
    boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
  },
  searchLabel: {
    display: "block", fontSize: 13, fontWeight: 500,
    color: "#374151", marginBottom: 10, letterSpacing: "-0.01em",
  },
  searchRow: { display: "flex", gap: 8 },
  inputWrapper: { flex: 1, position: "relative", display: "flex", alignItems: "center" },
  inputIcon: {
    position: "absolute", left: 12, color: "#9CA3AF",
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    border: "1.5px solid #E5E7EB",
    borderRadius: 12, padding: "11px 14px 11px 38px",
    fontSize: 14, background: "#FAFAFA",
    color: "#1A1A2E", fontFamily: "'DM Sans', sans-serif",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  searchBtn: {
    background: "#5C6AC4",
    color: "#fff", border: "none",
    borderRadius: 12, padding: "11px 20px",
    fontSize: 14, fontWeight: 500,
    cursor: "pointer", whiteSpace: "nowrap",
    fontFamily: "'DM Sans', sans-serif",
    transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
    boxShadow: "0 4px 14px rgba(92,106,196,0.3)",
  },
  suggestionsRow: {
    display: "flex", flexWrap: "wrap", alignItems: "center",
    gap: 6, marginTop: 12,
  },
  suggestionsLabel: { fontSize: 11, color: "#9CA3AF", fontWeight: 500 },
  chip: {
    background: "#F3F4F6", border: "1px solid #E5E7EB",
    borderRadius: 20, padding: "5px 12px",
    fontSize: 12, color: "#374151",
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.15s ease",
  },
  loadingArea: { textAlign: "center" },
  loadingCards: { display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 },
  skeletonCard: {
    background: "#fff", border: "1px solid #E5E7EB",
    borderRadius: 16, padding: "14px 16px",
    display: "flex", alignItems: "center", gap: 14,
    animation: "pulse 1.5s ease infinite",
  },
  skeletonThumb: {
    width: 44, height: 44, borderRadius: 12,
    background: "#E5E7EB", flexShrink: 0,
  },
  skeletonLines: { flex: 1, display: "flex", flexDirection: "column", gap: 8 },
  skeletonLine: {
    height: 13, background: "#E5E7EB", borderRadius: 6,
  },
  loadingText: { fontSize: 13, color: "#9CA3AF", margin: 0 },
  resultsArea: { animation: "fadeUp 0.3s ease" },
  resultsHeader: {
    display: "flex", alignItems: "flex-end",
    justifyContent: "space-between", marginBottom: 14,
  },
  resultsFor: { fontSize: 11, color: "#9CA3AF", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.06em" },
  resultsQuery: { fontSize: 16, fontWeight: 600, color: "#1A1A2E", margin: 0, letterSpacing: "-0.02em" },
  countPill: {
    background: "#EEF0FB", color: "#5C6AC4",
    fontSize: 12, fontWeight: 600,
    padding: "5px 12px", borderRadius: 20,
  },
  cardGrid: { display: "flex", flexDirection: "column", gap: 10 },
  productCard: {
    background: "#fff", border: "1px solid #E5E7EB",
    borderRadius: 16, padding: "14px 18px",
    display: "flex", alignItems: "center", gap: 14,
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
  },
  productThumb: {
    width: 48, height: 48, borderRadius: 12,
    background: "#EEF0FB",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  productInfo: { flex: 1 },
  productName: {
    fontSize: 15, fontWeight: 500, color: "#1A1A2E",
    margin: "0 0 5px", letterSpacing: "-0.01em",
  },
  categoryPill: {
    fontSize: 11, fontWeight: 500,
    background: "#F3F4F6", color: "#6B7280",
    borderRadius: 20, padding: "3px 10px",
    display: "inline-block",
  },
  productPriceCol: {
    display: "flex", flexDirection: "column", alignItems: "flex-end",
  },
  productPrice: {
    fontSize: 20, fontWeight: 700, color: "#5C6AC4",
    letterSpacing: "-0.03em", lineHeight: 1,
  },
  productPriceLabel: { fontSize: 10, color: "#9CA3AF", marginTop: 2, fontWeight: 500 },
  emptyState: {
    background: "#fff", border: "1px solid #E5E7EB",
    borderRadius: 20, padding: "3rem 2rem",
    textAlign: "center",
  },
  emptyIcon: {
    width: 56, height: 56, borderRadius: "50%",
    background: "#F3F4F6",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 14px",
  },
  emptyTitle: { fontSize: 16, fontWeight: 600, color: "#1A1A2E", margin: "0 0 6px" },
  emptyHint: { fontSize: 13, color: "#9CA3AF", margin: 0 },
  idleState: { textAlign: "center", paddingTop: "1rem" },
  idleGrid: {
    display: "grid", gridTemplateColumns: "repeat(2, 1fr)",
    gap: 10, marginBottom: 16,
  },
  idleTile: {
    background: "#fff", border: "1px solid #E5E7EB",
    borderRadius: 14, padding: "16px",
    fontSize: 14, color: "#374151", fontWeight: 400,
    textAlign: "left",
  },
  idleHint: { fontSize: 12, color: "#9CA3AF", margin: 0 },
};

export default App;