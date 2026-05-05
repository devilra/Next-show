import { useState, useEffect, useRef } from "react";
import { CiShare2 } from "react-icons/ci";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import {
  FaPlay,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaWhatsapp,
  FaTwitter,
  FaLink,
  FaTimes,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { MdVerified, MdOpenInNew } from "react-icons/md";
import { BsBookmark, BsBookmarkFill, BsPlayCircleFill } from "react-icons/bs";

// ─────────────────────────────────────────────────────────
// DUMMY DATA
// ─────────────────────────────────────────────────────────
const heroNews = [
  {
    id: 1,
    thumbnail:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&q=80",
    mobileThumbnail:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
    category: "Breaking News",
    categoryColor: "#EF4444",
    badge: "🔴 Live",
    isBreaking: true,
    isVerified: true,
    title:
      "Thalapathy 69 — Official Title & Jaw-Dropping First Look Unveiled by Lyca Productions",
    summary:
      "Vijay's ambitious next project finally gets its official title reveal alongside a striking first look poster. The pan-India film, backed by Lyca Productions, is set to begin its major shoot schedule across Chennai and multiple European locations starting Q3 this year.",
    author: "Karthik Rajan",
    authorAvatar: "KR",
    date: "May 2, 2026 · 2 hrs ago",
    rating: "8.4",
    readTime: "4 min read",
    viewCount: "48.2K",
    saveCount: "1.2K",
    tags: ["Tamil", "Vijay", "Lyca", "First Look"],
    relatedMovie: { title: "Thalapathy 69", slug: "thalapathy-69" },
    hasVideo: false,
    reactions: { fire: 2100, wow: 840, heart: 430 },
  },
  {
    id: 2,
    thumbnail:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1600&q=80",
    mobileThumbnail:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80",
    category: "Hollywood",
    categoryColor: "#3B82F6",
    badge: "🔥 Trending",
    isBreaking: false,
    isVerified: true,
    title:
      "Avengers: Doomsday — Full Cast Locked In, Official Trailer Drops Tomorrow at Midnight",
    summary:
      "Marvel Studios officially confirms the massive ensemble cast for the most anticipated crossover event in cinema history. Robert Downey Jr.'s return as a reimagined villain has shattered social media with over 50 million reactions in under 24 hours.",
    author: "Priya Sundaram",
    authorAvatar: "PS",
    date: "May 2, 2026 · 5 hrs ago",
    rating: "9.1",
    readTime: "6 min read",
    viewCount: "210K",
    saveCount: "8.4K",
    countdown: "Trailer in 32 days",
    tags: ["Hollywood", "Marvel", "RDJ"],
    relatedMovie: { title: "Avengers: Doomsday", slug: "avengers-doomsday" },
    hasVideo: true,
    reactions: { fire: 9800, wow: 4200, heart: 2100 },
  },
  {
    id: 3,
    thumbnail:
      "https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=1600&q=80",
    mobileThumbnail:
      "https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=800&q=80",
    category: "OTT Exclusive",
    categoryColor: "#8B5CF6",
    badge: "⚡ New Drop",
    isVerified: false,
    title:
      "Dune: Prophecy Season 2 — The Sisterhood's Darkest Chapter Begins Streaming Tonight",
    summary:
      "HBO Max's critically acclaimed prequel series returns with a darker, more expansive second season. The Bene Gesserit sisterhood faces its most existential threat yet as ancient secrets unravel across the known universe.",
    author: "Meera Krishnan",
    authorAvatar: "MK",
    date: "May 1, 2026 · Yesterday",
    rating: "8.8",
    readTime: "5 min read",
    viewCount: "95K",
    saveCount: "3.1K",
    tags: ["OTT", "Sci-Fi", "HBO"],
    relatedMovie: { title: "Dune: Prophecy S2", slug: "dune-prophecy-s2" },
    hasVideo: true,
    reactions: { fire: 3400, wow: 1800, heart: 920 },
  },
  {
    id: 4,
    thumbnail:
      "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=1600&q=80",
    mobileThumbnail:
      "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800&q=80",
    category: "Web Series",
    categoryColor: "#10B981",
    badge: "👑 Buzz",
    isVerified: true,
    title:
      "Suzhal Season 3 — Casting Begins with a Shocking New Showrunner Announcement",
    summary:
      "The beloved Tamil crime thriller is officially back. Producers announced a brand-new showrunner who promises to take the series in a bold new direction while honoring the gripping tone fans fell in love with.",
    author: "Arun Selvam",
    authorAvatar: "AS",
    date: "Apr 30, 2026 · 2 days ago",
    rating: "9.0",
    readTime: "3 min read",
    viewCount: "62K",
    saveCount: "2.8K",
    tags: ["Tamil", "Crime", "Amazon Prime"],
    relatedMovie: { title: "Suzhal S3", slug: "suzhal-s3" },
    hasVideo: false,
    reactions: { fire: 2800, wow: 1100, heart: 670 },
  },
  {
    id: 5,
    thumbnail:
      "https://images.unsplash.com/photo-1512070679279-8988d32161be?w=1600&q=80",
    mobileThumbnail:
      "https://images.unsplash.com/photo-1512070679279-8988d32161be?w=800&q=80",
    category: "Box Office",
    categoryColor: "#F59E0B",
    badge: "💥 Smash Hit",
    isVerified: true,
    title:
      "Coolie Crosses ₹500 Cr Worldwide — Rajinikanth Delivers the Biggest Action Spectacle of the Decade",
    summary:
      "Superstar Rajinikanth's high-octane action thriller has officially become the fastest Tamil film to cross the ₹500 crore mark globally. Director Lokesh Kanagaraj's signature hyperlinked universe expands in ways that left audiences absolutely stunned.",
    author: "Divya Nair",
    authorAvatar: "DN",
    date: "Apr 29, 2026 · 3 days ago",
    rating: "8.7",
    readTime: "7 min read",
    viewCount: "175K",
    saveCount: "6.2K",
    tags: ["Tamil", "Rajinikanth", "Box Office"],
    relatedMovie: { title: "Coolie", slug: "coolie-2026" },
    hasVideo: false,
    reactions: { fire: 7200, wow: 3100, heart: 1800 },
  },
];

// ─────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────

function RatingStars({ value }) {
  const full = Math.floor(parseFloat(value) / 2);
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-2.5 h-2.5 ${i < full ? "text-amber-400" : "text-white/20"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-amber-400 font-bold text-[11px] ml-1">{value}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// SHARE MODAL
// ─────────────────────────────────────────────────────────

function ShareModal({ title, onClose }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
      style={{ background: "rgba(0,0,0,0.75)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-5"
        style={{ background: "#111" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-white font-semibold text-sm">Share Article</p>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition"
          >
            <FaTimes size={13} />
          </button>
        </div>
        <p className="text-zinc-500 text-xs mb-5 line-clamp-2 leading-relaxed">
          {title}
        </p>
        <div className="grid grid-cols-3 gap-3 mb-2">
          {[
            {
              icon: <FaWhatsapp size={18} />,
              label: "WhatsApp",
              color: "#25D366",
            },
            {
              icon: <FaTwitter size={16} />,
              label: "Twitter / X",
              color: "#1D9BF0",
            },
            {
              icon: <FaLink size={14} />,
              label: copied ? "Copied!" : "Copy Link",
              color: "#8B5CF6",
            },
          ].map((s) => (
            <button
              key={s.label}
              onClick={copy}
              className="flex flex-col items-center gap-2 py-3.5 rounded-xl transition"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <span style={{ color: s.color }}>{s.icon}</span>
              <span className="text-zinc-400 text-[10px]">{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// EMOJI REACTIONS
// ─────────────────────────────────────────────────────────

function ReactionRow({ initial }) {
  const [counts, setCounts] = useState(initial);
  const [active, setActive] = useState(null);
  const fmt = (n) => (n >= 1000 ? (n / 1000).toFixed(1) + "K" : n);
  const react = (key) => {
    if (active === key) {
      setCounts((c) => ({ ...c, [key]: c[key] - 1 }));
      setActive(null);
    } else {
      setCounts((c) => {
        const next = { ...c, [key]: c[key] + 1 };
        if (active) next[active] = Math.max(0, next[active] - 1);
        return next;
      });
      setActive(key);
    }
  };
  return (
    <div className="flex items-center gap-1.5">
      {[
        { key: "fire", emoji: "🔥" },
        { key: "wow", emoji: "😮" },
        { key: "heart", emoji: "❤️" },
      ].map(({ key, emoji }) => (
        <button
          key={key}
          onClick={() => react(key)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all"
          style={{
            fontSize: 10,
            fontWeight: 500,
            background:
              active === key
                ? "rgba(255,255,255,0.2)"
                : "rgba(255,255,255,0.08)",
            border: "0.5px solid rgba(255,255,255,0.12)",
            transform: active === key ? "scale(1.08)" : "scale(1)",
          }}
        >
          <span style={{ fontSize: 13 }}>{emoji}</span>
          <span className="text-white/65">{fmt(counts[key])}</span>
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// MAIN HERO COMPONENT
// ─────────────────────────────────────────────────────────

const NewsHero = ({ news: externalNews }) => {
  const data = externalNews ? [externalNews] : heroNews;

  const [current, setCurrent] = useState(0);
  const [saved, setSaved] = useState({});
  const [animating, setAnimating] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [muted, setMuted] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const timerRef = useRef(null);
  const touchStart = useRef(null);

  const news = data[current];

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const goTo = (idx) => {
    if (animating || idx === current) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 350);
  };

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(
      () => setCurrent((c) => (c + 1) % data.length),
      6500,
    );
  };

  useEffect(() => {
    if (data.length <= 1) return;
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [data.length]);

  const nav = (fn) => {
    fn();
    startTimer();
  };

  // Swipe support
  const onTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (!touchStart.current) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      nav(() =>
        goTo(
          diff > 0
            ? (current + 1) % data.length
            : (current - 1 + data.length) % data.length,
        ),
      );
    }
    touchStart.current = null;
  };

  return (
    <>
      <div className="w-full space-y-2.5 mt-20 md:space-y-3">
        {/* ── HERO CARD ── */}
        <div
          className="relative w-full overflow-hidden  group select-none"
          style={{
            height: isMobile ? "45vh" : "74vh",
            minHeight: isMobile ? 280 : 420,
          }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* BG IMAGE */}
          <img
            key={news.id}
            src={isMobile ? news.mobileThumbnail : news.thumbnail}
            alt="hero"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              transition: "opacity 0.45s ease",
              opacity: animating ? 0 : 1,
              transform: "scale(1.04)",
            }}
          />

          {/* GRADIENT OVERLAYS */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.1) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)",
            }}
          />

          {/* ── TOP ROW ── */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-start justify-between px-4 md:px-10 pt-4 md:pt-6">
            {/* Left: badge + countdown */}
            <div className="flex flex-col gap-2">
              {/* <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] md:text-[10px] font-bold tracking-widest uppercase rounded-full border border-white/20 backdrop-blur-md text-white"
                style={{ background: `${news.categoryColor}30` }}
              >
                {news.isBreaking && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                )}
                {news.badge}
              </span> */}
              {/* {news.countdown && (
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-semibold text-blue-200 rounded-full backdrop-blur-md"
                  style={{
                    background: "rgba(59,130,246,0.25)",
                    border: "0.5px solid rgba(59,130,246,0.4)",
                  }}
                >
                  ⏱ {news.countdown}
                </span>
              )} */}
            </div>

            {/* Right: mute btn + slide counter */}
            <div className="flex items-center gap-2">
              {news.hasVideo && (
                <button
                  onClick={() => setMuted((m) => !m)}
                  className="p-2 rounded-full text-white transition"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    border: "0.5px solid rgba(255,255,255,0.2)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {muted ? (
                    <FaVolumeMute size={11} />
                  ) : (
                    <FaVolumeUp size={11} />
                  )}
                </button>
              )}
              {/* {data.length > 1 && (
                <span
                  className="text-[10px] text-white/50 font-mono tracking-widest px-2 py-1 rounded-full backdrop-blur-md"
                  style={{ background: "rgba(0,0,0,0.3)" }}
                >
                  {String(current + 1).padStart(2, "0")} /{" "}
                  {String(data.length).padStart(2, "0")}
                </span>
              )} */}
            </div>
          </div>

          {/* ── CONTENT AREA ── */}
          <div
            className="absolute bottom-0 left-0 right-0 z-10 flex flex-col px-4 md:px-10 pb-5 md:pb-10"
            style={{
              transition: "opacity 0.35s ease, transform 0.35s ease",
              opacity: animating ? 0 : 1,
              transform: animating ? "translateY(10px)" : "translateY(0)",
            }}
          >
            {/* Category pill */}
            {/* <span
              className="inline-block w-fit px-2.5 py-0.5 text-[9px] md:text-[10px] font-black tracking-widest uppercase rounded-full text-white mb-2 md:mb-3"
              style={{ background: news.categoryColor }}
            >
              {news.category}
            </span> */}

            {/* Title */}
            <h1
              className=" text-white leading-tight tracking-tight mb-2 md:mb-3"
              style={{
                fontSize: isMobile
                  ? "clamp(17px,5vw,22px)"
                  : "clamp(20px,3.2vw,30px)",
                maxWidth: 700,
              }}
            >
              {news.title}
            </h1>

            {/* Summary */}
            <p
              className="hidden sm:block text-zinc-300/90 leading-relaxed mb-3 md:mb-4"
              style={{ fontSize: isMobile ? 12 : 14, maxWidth: 620 }}
            >
              {news.summary}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <RatingStars value={news.rating} />
              <span className="text-white/15">|</span>

              {/* Author */}
              <div className="flex items-center gap-1.5">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                  style={{ background: news.categoryColor }}
                >
                  {news.authorAvatar}
                </span>
                <span className="text-[10px] md:text-[11px] text-zinc-400">
                  {news.author}
                </span>
                {news.isVerified && (
                  <MdVerified
                    className="text-blue-400"
                    style={{ fontSize: 11 }}
                  />
                )}
              </div>

              <span className="text-white/15">·</span>
              <span className="text-[10px] md:text-[11px] text-zinc-500">
                {news.date}
              </span>

              {/* Desktop extras */}
              <span className="text-white/15 hidden md:inline">|</span>
              <span className="hidden md:flex items-center gap-1 text-[11px] text-zinc-400">
                <FaEye style={{ fontSize: 10 }} /> {news.viewCount}
              </span>
              <span className="text-white/15 hidden md:inline">|</span>
              <span className="hidden md:flex items-center gap-1 text-[11px] text-zinc-400">
                <HiSparkles
                  className="text-amber-400"
                  style={{ fontSize: 12 }}
                />
                {news.readTime}
              </span>
              <span className="text-white/15 hidden md:inline">|</span>
              {/* <span className="hidden md:flex items-center gap-1 text-[11px] text-zinc-400">
                🔖 {news.saveCount}
              </span> */}
            </div>

            {/* Mobile stats row */}
            {/* <div className="flex md:hidden items-center gap-3 mb-2.5 text-[10px] text-zinc-500">
              <span className="flex items-center gap-1">
                <FaEye style={{ fontSize: 9 }} />
                {news.viewCount}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <HiSparkles
                  style={{ fontSize: 10 }}
                  className="text-amber-400"
                />
                {news.readTime}
              </span>
              <span>·</span>
              <span>🔖 {news.saveCount}</span>
            </div> */}

            {/* Tags */}
            {/* <div className="flex gap-1.5 mb-3 md:mb-4 flex-wrap">
              {news.tags.map((t) => (
                <span
                  key={t}
                  className="text-[9px] md:text-[10px] px-2 py-0.5 rounded-full text-white/65 backdrop-blur-sm"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "0.5px solid rgba(255,255,255,0.15)",
                  }}
                >
                  #{t}
                </span>
              ))}
            </div> */}

            {/* Reactions */}
            <div className="mb-3 md:mb-5">
              <ReactionRow initial={news.reactions} />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
              {/* READ MORE */}
              <button
                className="flex items-center gap-1.5 md:gap-2 cursor-pointer text-white font-bold rounded-xl transition-all duration-200"
                style={{
                  // background: `linear-gradient(135deg, ${news.categoryColor}, ${news.categoryColor}bb)`,
                  // boxShadow: `0 0 18px ${news.categoryColor}44`,
                  // fontSize: isMobile ? 11 : 13,
                  // padding: isMobile ? "9px 16px" : "11px 22px",
                  background: "rgba(255,255,255,0.1)",
                  border: `0.5px solid rgba(255,255,255,0.2)`,
                  fontSize: isMobile ? 11 : 13,
                  padding: isMobile ? "9px 14px" : "11px 18px",
                }}
              >
                <FaPlay style={{ fontSize: isMobile ? 9 : 10 }} />
                READ MORE
              </button>

              {/* SAVE */}
              <button
                onClick={() =>
                  setSaved((s) => ({ ...s, [news.id]: !s[news.id] }))
                }
                className="flex items-center gap-1.5 md:gap-2 rounded-xl text-white transition backdrop-blur-md"
                style={{
                  background: saved[news.id]
                    ? "rgba(239,68,68,0.2)"
                    : "rgba(255,255,255,0.1)",
                  border: `0.5px solid ${saved[news.id] ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.2)"}`,
                  fontSize: isMobile ? 11 : 13,
                  padding: isMobile ? "9px 14px" : "11px 18px",
                }}
              >
                {saved[news.id] ? (
                  <BsBookmarkFill
                    className="text-red-400"
                    style={{ fontSize: isMobile ? 11 : 13 }}
                  />
                ) : (
                  <BsBookmark style={{ fontSize: isMobile ? 15 : 15 }} />
                )}
                <span className="hidden sm:inline">
                  {saved[news.id] ? "SAVED" : "SAVE"}
                </span>
              </button>

              {/* SHARE */}
              <button
                onClick={() => setShareOpen(true)}
                className="rounded-xl text-white transition backdrop-blur-md"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "0.5px solid rgba(255,255,255,0.2)",
                  padding: isMobile ? "9px 12px" : "11px 14px",
                }}
              >
                <CiShare2 style={{ fontSize: isMobile ? 16 : 18 }} />
              </button>

              {/* VIEW MOVIE PAGE */}
              {/* {news.relatedMovie && (
                <button
                  className="flex items-center gap-1.5 rounded-xl text-white transition backdrop-blur-md"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "0.5px solid rgba(255,255,255,0.18)",
                    fontSize: isMobile ? 10 : 12,
                    padding: isMobile ? "9px 12px" : "11px 16px",
                  }}
                >
                  <BsPlayCircleFill style={{ fontSize: isMobile ? 11 : 13 }} />
                  <span className="hidden sm:inline">Movie Page</span>
                  <MdOpenInNew style={{ fontSize: 10 }} />
                </button>
              )} */}
            </div>
          </div>

          {/* ── ARROWS (desktop) ── */}
          {data.length > 1 && (
            <>
              <button
                onClick={() =>
                  nav(() => goTo((current - 1 + data.length) % data.length))
                }
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all"
                style={{
                  background: "rgba(0,0,0,0.45)",
                  border: "0.5px solid rgba(255,255,255,0.15)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <FaChevronLeft size={12} />
              </button>
              <button
                onClick={() => nav(() => goTo((current + 1) % data.length))}
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all"
                style={{
                  background: "rgba(0,0,0,0.45)",
                  border: "0.5px solid rgba(255,255,255,0.15)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <FaChevronRight size={12} />
              </button>
            </>
          )}

          {/* ── PROGRESS BAR ── */}
          {data.length > 1 && (
            <div
              className="absolute bottom-0 left-0 right-0 z-20 h-[2px]"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              <div
                key={current}
                className="h-full bg-zinc-700"
                style={{
                  // background: news.categoryColor,
                  animation: "nsProgress 6.5s linear forwards",
                }}
              />
            </div>
          )}
        </div>

        {/* ── THUMBNAIL STRIP + DOTS ── */}
        {data.length > 1 &&
          (() => {
            const scrollRef = useRef(null);

            const scrollBy = (dir) => {
              if (scrollRef.current) {
                scrollRef.current.scrollBy({
                  left: dir * 120,
                  behavior: "smooth",
                });
              }
            };

            return (
              <div className="flex items-center gap-2 px-1">
                {/* LEFT ARROW */}
                <button
                  onClick={() => {
                    scrollBy(-1);
                    nav(() => goTo((current - 1 + data.length) % data.length));
                  }}
                  className="shrink-0 flex items-center justify-center rounded-full text-white transition-all"
                  style={{
                    width: 22,
                    height: 22,
                    background: "rgba(255,255,255,0.08)",
                    border: "0.5px solid rgba(255,255,255,0.15)",
                    display: isMobile
                      ? "flex"
                      : data.length > 6
                        ? "flex"
                        : "none",
                  }}
                >
                  <FaChevronLeft size={8} />
                </button>

                {/* THUMBNAILS */}
                <div
                  ref={scrollRef}
                  className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-1"
                >
                  {data.map((item, i) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        goTo(i);
                        startTimer();
                      }}
                      className="relative overflow-hidden rounded-lg border-2 border-zinc-500 shrink-0 transition-all duration-300"
                      style={{
                        width:
                          i === current
                            ? isMobile
                              ? 64
                              : 80
                            : isMobile
                              ? 40
                              : 52,
                        height: isMobile ? 34 : 40,
                        opacity: i === current ? 1 : 0.45,
                      }}
                    >
                      <img
                        src={item.mobileThumbnail}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      {i === current && (
                        <>
                          <div
                            className="absolute inset-0"
                            style={{ background: "rgba(0,0,0,0.25)" }}
                          />
                          <div className="absolute bottom-0 left-0 bg-black right-0 h-[2px]" />
                        </>
                      )}
                    </button>
                  ))}
                </div>

                {/* RIGHT ARROW */}
                <button
                  onClick={() => {
                    scrollBy(1);
                    nav(() => goTo((current + 1) % data.length));
                  }}
                  className="shrink-0 flex items-center justify-center rounded-full text-white transition-all"
                  style={{
                    width: 22,
                    height: 22,
                    background: "rgba(255,255,255,0.08)",
                    border: "0.5px solid rgba(255,255,255,0.15)",
                    display: isMobile
                      ? "flex"
                      : data.length > 6
                        ? "flex"
                        : "none",
                  }}
                >
                  <FaChevronRight size={8} />
                </button>

                <div className="flex-1" />

                {/* DOTS */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {data.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        goTo(i);
                        startTimer();
                      }}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: i === current ? 18 : 5,
                        height: 5,
                        background: "rgba(255,255,255,0.5)",
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })()}
      </div>

      {shareOpen && (
        <ShareModal title={news.title} onClose={() => setShareOpen(false)} />
      )}

      <style>{`
        @keyframes nsProgress { from { width: 0% } to { width: 100% } }
        .no-scrollbar::-webkit-scrollbar { display: none }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none }
      `}</style>
    </>
  );
};

export default NewsHero;
