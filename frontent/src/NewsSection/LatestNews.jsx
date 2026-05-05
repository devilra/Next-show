import React, { useState, useRef, useEffect } from "react";
import { FaArrowRight, FaArrowLeft, FaEye, FaRegClock } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { BsPlayCircleFill } from "react-icons/bs";

// ── ACCENT ──────────────────────────────────────
const ACCENT = "#e85d26";

// ── DATA (8 cards) ───────────────────────────────
const newsData = [
  {
    id: 1,
    title:
      "Leo 2 — Official Sequel Announced, Lokesh Kanagaraj Confirms Return",
    summary:
      "The hyperlinked universe expands. An ensemble that promises to outshine the original in every way.",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=900&q=80",
    category: "Trending",
    tag: "🔥 HOT",
    date: "May 03, 2026",
    readTime: "5 min",
    views: "84.1K",
    hasVideo: false,
  },
  {
    id: 2,
    title: "Vijay's Next Movie — Title & Cast Announcement Stuns the Internet",
    summary:
      "Fans go into overdrive as the official title reveal breaks records across all social platforms.",
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80",
    category: "Breaking",
    tag: "🔴 LIVE",
    date: "May 02, 2026",
    readTime: "3 min",
    views: "52K",
    hasVideo: true,
  },
  {
    id: 3,
    title: "Rajinikanth's New Project Confirmed — Shoot Starts Next Month",
    summary:
      "Superstar confirms a high-profile project with a director whose last film swept global box offices.",
    image:
      "https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=600&q=80",
    category: "Cinema",
    tag: "📢 OFFICIAL",
    date: "May 01, 2026",
    readTime: "4 min",
    views: "39K",
    hasVideo: false,
  },
  {
    id: 4,
    title: "Top 10 Tamil Movies Dominating Box Office This Week",
    summary:
      "A detailed look at the films ruling multiplexes and single screens across Tamil Nadu and beyond.",
    image:
      "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=600&q=80",
    category: "Top List",
    tag: "📊 CHART",
    date: "Apr 30, 2026",
    readTime: "6 min",
    views: "28K",
    hasVideo: false,
  },
  {
    id: 5,
    title: "OTT Releases This Weekend — Your Complete Watchlist",
    summary:
      "From dark thrillers to feel-good comedies — everything hitting streaming platforms this week.",
    image:
      "https://images.unsplash.com/photo-1512070679279-8988d32161be?w=600&q=80",
    category: "OTT",
    tag: "📺 STREAM",
    date: "Apr 29, 2026",
    readTime: "3 min",
    views: "19K",
    hasVideo: false,
  },
  {
    id: 6,
    title: "Mission: Impossible 8 Final Trailer — The Internet Explodes",
    summary:
      "Tom Cruise's most death-defying stunt sequence yet has Twitter and Reddit in absolute chaos.",
    image:
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&q=80",
    category: "Hollywood",
    tag: "🎬 MUST SEE",
    date: "Apr 28, 2026",
    readTime: "4 min",
    views: "71K",
    hasVideo: true,
  },
  {
    id: 7,
    title: "Coolie Breaks ₹500 Cr — Rajinikanth's Biggest Action Spectacle",
    summary:
      "Lokesh's hyperlinked universe strikes gold again as the film rewrites Tamil cinema box office history.",
    image:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80",
    category: "Box Office",
    tag: "💥 RECORD",
    date: "Apr 27, 2026",
    readTime: "5 min",
    views: "175K",
    hasVideo: false,
  },
  {
    id: 8,
    title: "Suzhal Season 3 — Casting Begins, New Showrunner Revealed",
    summary:
      "The beloved Tamil crime thriller is officially back with bold new creative leadership at the helm.",
    image:
      "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=600&q=80",
    category: "Web Series",
    tag: "👑 BUZZ",
    date: "Apr 26, 2026",
    readTime: "3 min",
    views: "62K",
    hasVideo: false,
  },
];

// ── CARD ─────────────────────────────────────────
function NewsCard({ item }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative overflow-hidden cursor-pointer flex-shrink-0"
      style={{
        width: 290,
        height: 390,
        borderRadius: 16,
        border: `0.5px solid ${hovered ? ACCENT + "70" : "rgba(255,255,255,0.07)"}`,
        transition: "border-color 0.25s, transform 0.25s, box-shadow 0.25s",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        boxShadow: hovered
          ? `0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px ${ACCENT}20`
          : "0 4px 24px rgba(0,0,0,0.3)",
        scrollSnapAlign: "start",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <img
        src={item.image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transition: "transform 0.7s ease",
          transform: hovered ? "scale(1.09)" : "scale(1)",
        }}
      />

      {/* Gradients */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0.08) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${ACCENT}14 0%, transparent 55%)`,
        }}
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2.5px]"
        style={{
          background: hovered ? ACCENT : "rgba(255,255,255,0.1)",
          transition: "background 0.25s",
        }}
      />

      {/* Video badge */}
      {item.hasVideo && (
        <div className="absolute top-4 right-4">
          <BsPlayCircleFill
            size={28}
            style={{
              color: ACCENT,
              filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.8))",
              opacity: hovered ? 1 : 0.7,
              transition: "opacity 0.2s",
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-5">
        {/* Tags */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-sm text-white"
            style={{ background: ACCENT, letterSpacing: "0.1em" }}
          >
            {item.tag}
          </span>
          <span
            className="text-[9px] font-bold uppercase tracking-wide px-2 py-1 rounded-sm"
            style={{
              color: ACCENT,
              background: "rgba(232,93,38,0.14)",
              border: `0.5px solid ${ACCENT}35`,
            }}
          >
            {item.category}
          </span>
        </div>

        {/* Title */}
        <h3
          className="font-black leading-snug mb-2"
          style={{
            fontSize: 14.5,
            color: hovered ? "#FCD9C8" : "#fff",
            transition: "color 0.2s",
            lineHeight: 1.35,
          }}
        >
          {item.title}
        </h3>

        {/* Summary */}
        <p
          className="text-[11px] leading-relaxed mb-3 line-clamp-2"
          style={{ color: "rgba(255,255,255,0.42)" }}
        >
          {item.summary}
        </p>

        {/* Meta */}
        <div
          className="flex items-center gap-2.5"
          style={{ color: "rgba(255,255,255,0.32)", fontSize: 10 }}
        >
          <span className="flex items-center gap-1">
            <FaRegClock size={9} style={{ color: ACCENT, opacity: 0.75 }} />
            {item.readTime}
          </span>
          <span style={{ color: "rgba(255,255,255,0.12)" }}>·</span>
          <span className="flex items-center gap-1">
            <FaEye size={9} style={{ color: ACCENT, opacity: 0.75 }} />
            {item.views}
          </span>
          <span style={{ color: "rgba(255,255,255,0.12)" }}>·</span>
          <span>{item.date}</span>
        </div>

        {/* Read more reveal on hover */}
        <div
          className="flex items-center gap-1.5 mt-2.5 text-[10px] font-bold uppercase tracking-widest overflow-hidden"
          style={{
            color: ACCENT,
            maxHeight: hovered ? 24 : 0,
            opacity: hovered ? 1 : 0,
            transition: "max-height 0.3s ease, opacity 0.3s ease",
          }}
        >
          Read Article <FaArrowRight size={8} />
        </div>
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ───────────────────────────────
const LatestNews = () => {
  const scrollRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);

  const CARD_W = 306; // 290 + 16 gap

  const syncState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    setActiveIdx(Math.round(el.scrollLeft / CARD_W));
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", syncState, { passive: true });
    syncState();
    return () => el.removeEventListener("scroll", syncState);
  }, []);

  const scroll = (dir) =>
    scrollRef.current?.scrollBy({ left: dir * CARD_W * 2, behavior: "smooth" });
  const goTo = (i) =>
    scrollRef.current?.scrollTo({ left: i * CARD_W, behavior: "smooth" });

  return (
    <section
      className="text-white pt-5"
      style={{
        // background: "#0b0e14",
        borderTop: "0.5px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* ── HEADER ── */}
      <div className="flex items-end justify-between mb-8 px-4 md:px-10">
        {/* Title */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1">
            <div
              style={{
                width: 28,
                height: 3,
                background: ACCENT,
                borderRadius: 99,
              }}
            />
            <div
              style={{
                width: 16,
                height: 3,
                background: ACCENT,
                opacity: 0.35,
                borderRadius: 99,
              }}
            />
          </div>
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.25em] mb-0.5"
              style={{ color: ACCENT }}
            >
              NextShow Exclusive
            </p>
            <h2
              className="font-black uppercase leading-none"
              style={{
                fontSize: "clamp(22px, 4vw, 34px)",
                letterSpacing: "-0.02em",
              }}
            >
              Latest News
            </h2>
          </div>
        </div>

        {/* Controls */}
        {/* <div className="flex items-center gap-2">
        
          <button
            onClick={() => scroll(-1)}
            disabled={!canLeft}
            className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200"
            style={{
              background: canLeft
                ? "rgba(232,93,38,0.15)"
                : "rgba(255,255,255,0.04)",
              border: `0.5px solid ${canLeft ? ACCENT + "50" : "rgba(255,255,255,0.08)"}`,
              color: canLeft ? ACCENT : "rgba(255,255,255,0.18)",
              cursor: canLeft ? "pointer" : "not-allowed",
            }}
          >
            <FaArrowLeft size={12} />
          </button>

         
          <button
            onClick={() => scroll(1)}
            disabled={!canRight}
            className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200"
            style={{
              background: canRight
                ? "rgba(232,93,38,0.15)"
                : "rgba(255,255,255,0.04)",
              border: `0.5px solid ${canRight ? ACCENT + "50" : "rgba(255,255,255,0.08)"}`,
              color: canRight ? ACCENT : "rgba(255,255,255,0.18)",
              cursor: canRight ? "pointer" : "not-allowed",
            }}
          >
            <FaArrowRight size={12} />
          </button>

         
          <a
            href="/news"
            className="hidden md:flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-lg transition-all duration-200 ml-1"
            style={{
              color: ACCENT,
              border: `0.5px solid ${ACCENT}50`,
              background: "rgba(232,93,38,0.08)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(232,93,38,0.18)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(232,93,38,0.08)")
            }
          >
            View All <FaArrowRight size={9} />
          </a>
        </div> */}
      </div>

      {/* ── CAROUSEL ── */}
      <div className="relative">
        {/* Left edge fade */}
        <div
          className="absolute left-0 top-0 bottom-0 w-14 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to right, #0b0e14, transparent)",
            opacity: canLeft ? 1 : 0,
            transition: "opacity 0.3s",
          }}
        />
        {/* Right edge fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to left, #0b0e14, transparent)",
          }}
        />

        {/* Scrollable track */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto px-4 md:px-10 pb-2"
          style={{
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {newsData.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
          {/* Spacer so last card scrolls fully into view */}
          <div style={{ flexShrink: 0, width: 16 }} />
        </div>
      </div>

      {/* ── DOTS ── */}
      {/* <div className="flex items-center justify-center gap-2 mt-5 px-4">
        {newsData.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === activeIdx ? 22 : 6,
              height: 6,
              borderRadius: 99,
              background: i === activeIdx ? ACCENT : "rgba(255,255,255,0.14)",
              border: "none",
              padding: 0,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div> */}

      {/* ── MOBILE VIEW ALL ── */}
      {/* <div className="md:hidden mt-6 px-4">
        <button
          className="w-full py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"
          style={{ background: ACCENT, color: "#fff" }}
        >
          <HiSparkles size={12} /> View All News
        </button>
      </div> */}

      <style>{`div::-webkit-scrollbar{display:none}`}</style>
    </section>
  );
};

export default LatestNews;
