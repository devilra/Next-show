import React, { useState, useRef } from "react";
import {
  FaArrowRight,
  FaArrowLeft,
  FaEye,
  FaHeart,
  FaRegHeart,
  FaCamera,
} from "react-icons/fa";
import { BsStars, BsLightningChargeFill } from "react-icons/bs";
import { MdVerified } from "react-icons/md";
import { HiSparkles } from "react-icons/hi2";
import { RiUserStarFill } from "react-icons/ri";

// ── THEME ─────────────────────────────────────────────────
const GOLD = "#C9A84C";
const GOLD2 = "#F0C75E";
const BG = "#080a0f";
const CARD = "#0e1118";

// ── CELEBRITY DATA ────────────────────────────────────────
const celebrities = [
  {
    id: 1,
    name: "Vijay",
    handle: "@actorvijay",
    verified: true,
    role: "Actor · Director",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=900&q=80",
    newsCount: 24,
    latestTag: "🔴 Breaking",
    latestTagColor: "#EF4444",
    headline:
      "Thalapathy 69 title revealed — fans break the internet within minutes",
    subline: "Pan-India release confirmed. European schedule begins Q3.",
    views: "84K",
    likes: 4200,
    timeAgo: "2 hrs ago",
    specialty: "Tamil Cinema",
    buzz: 98,
  },
  {
    id: 2,
    name: "Rajinikanth",
    handle: "@superstarrajini",
    verified: true,
    role: "Actor · Icon",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=900&q=80",
    newsCount: 18,
    latestTag: "💥 Record",
    latestTagColor: "#F59E0B",
    headline:
      "Coolie crosses ₹500 Cr — the legend rewrites box office history once again",
    subline: "Fastest Tamil film ever. Lokesh's universe keeps winning.",
    views: "175K",
    likes: 9800,
    timeAgo: "3 days ago",
    specialty: "Box Office",
    buzz: 95,
  },
  {
    id: 3,
    name: "Suriya",
    handle: "@actorsuriya",
    verified: true,
    role: "Actor · Producer",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=900&q=80",
    newsCount: 11,
    latestTag: "⭐ Review",
    latestTagColor: "#10B981",
    headline:
      "Retro opens to massive ovation — critics call it his finest performance yet",
    subline:
      "Period drama delivers on every front. Audiences give standing ovation.",
    views: "52K",
    likes: 3100,
    timeAgo: "1 day ago",
    specialty: "Drama",
    buzz: 87,
  },
  {
    id: 4,
    name: "Dhanush",
    handle: "@dhanushkraja",
    verified: true,
    role: "Actor · Director · Singer",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=900&q=80",
    newsCount: 9,
    latestTag: "📢 Official",
    latestTagColor: "#6366F1",
    headline:
      "Dhanush announces directorial venture — self-written script confirmed",
    subline: "Multi-lingual project. Shooting begins by end of 2026.",
    views: "38K",
    likes: 1900,
    timeAgo: "4 days ago",
    specialty: "Pan India",
    buzz: 82,
  },
  {
    id: 5,
    name: "Kamal Haasan",
    handle: "@ikamalhaasan",
    verified: true,
    role: "Actor · Auteur",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1512070679279-8988d32161be?w=900&q=80",
    newsCount: 15,
    latestTag: "🎬 Release",
    latestTagColor: "#8B5CF6",
    headline:
      "Indian 3 release date locked — Kamal promises the most ambitious chapter",
    subline: "OTT date also confirmed. Shankar's magnum opus lands in 15 days.",
    views: "61K",
    likes: 2700,
    timeAgo: "5 hrs ago",
    specialty: "Iconic Cinema",
    buzz: 91,
  },
  {
    id: 6,
    name: "Nayanthara",
    handle: "@nayantharaofficial",
    verified: true,
    role: "Actress · Producer",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=900&q=80",
    newsCount: 13,
    latestTag: "👑 Exclusive",
    latestTagColor: "#EC4899",
    headline: "Nayanthara's production house bags biggest OTT deal of the year",
    subline: "Lady Superstar expands empire with ₹120Cr streaming deal.",
    views: "44K",
    likes: 3400,
    timeAgo: "2 days ago",
    specialty: "OTT & Cinema",
    buzz: 88,
  },
];

// ── BUZZ BAR ──────────────────────────────────────────────
function BuzzBar({ value }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="text-[9px] font-black uppercase tracking-widest"
        style={{ color: GOLD, minWidth: 28 }}
      >
        {value}%
      </span>
      <div
        className="flex-1 rounded-full overflow-hidden"
        style={{ height: 3, background: "rgba(255,255,255,0.08)" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${value}%`,
            background: `linear-gradient(to right, ${GOLD}, ${GOLD2})`,
            transition: "width 1s ease",
          }}
        />
      </div>
      <BsLightningChargeFill
        style={{ color: GOLD, fontSize: 9, opacity: 0.7 }}
      />
    </div>
  );
}

// ── CELEBRITY CARD ─────────────────────────────────────────
function CelebCard({ celeb }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(celeb.likes);
  const [hovered, setHovered] = useState(false);

  const toggleLike = (e) => {
    e.stopPropagation();
    setLiked((l) => !l);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
  };

  const fmt = (n) => (n >= 1000 ? (n / 1000).toFixed(1) + "K" : n);

  return (
    <div
      className="relative flex-shrink-0 cursor-pointer overflow-hidden group"
      style={{
        width: 310,
        borderRadius: 20,
        background: CARD,
        border: `0.5px solid ${hovered ? GOLD + "55" : "rgba(255,255,255,0.07)"}`,
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered
          ? `0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px ${GOLD}22, 0 0 40px ${GOLD}10`
          : "0 4px 20px rgba(0,0,0,0.4)",
        scrollSnapAlign: "start",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── COVER IMAGE ── */}
      <div className="relative overflow-hidden" style={{ height: 160 }}>
        <img
          src={celeb.coverImage}
          alt=""
          className="w-full h-full object-cover"
          style={{
            transition: "transform 0.7s ease",
            transform: hovered ? "scale(1.08)" : "scale(1)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(14,17,24,0.9) 100%)",
          }}
        />

        {/* Gold shimmer line */}
        <div
          className="absolute top-0 left-0 right-0 h-[1.5px]"
          style={{
            background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`,
            opacity: hovered ? 1 : 0.4,
            transition: "opacity 0.3s",
          }}
        />

        {/* Latest tag */}
        <div className="absolute top-3 left-3">
          <span
            className="text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full text-white"
            style={{
              background: celeb.latestTagColor,
              boxShadow: `0 2px 12px ${celeb.latestTagColor}60`,
            }}
          >
            {celeb.latestTag}
          </span>
        </div>

        {/* Like button */}
        <button
          onClick={toggleLike}
          className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all duration-200"
          style={{
            background: liked ? "rgba(239,68,68,0.25)" : "rgba(0,0,0,0.45)",
            border: `0.5px solid ${liked ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.15)"}`,
            backdropFilter: "blur(8px)",
          }}
        >
          {liked ? (
            <FaHeart style={{ color: "#EF4444", fontSize: 10 }} />
          ) : (
            <FaRegHeart
              style={{ color: "rgba(255,255,255,0.6)", fontSize: 10 }}
            />
          )}
          <span
            style={{
              color: liked ? "#EF4444" : "rgba(255,255,255,0.5)",
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            {fmt(likeCount)}
          </span>
        </button>

        {/* News count pill */}
        <div className="absolute bottom-3 right-3">
          <span
            className="flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-full"
            style={{
              background: "rgba(0,0,0,0.6)",
              color: GOLD2,
              border: `0.5px solid ${GOLD}40`,
              backdropFilter: "blur(8px)",
            }}
          >
            <FaCamera size={8} /> {celeb.newsCount} stories
          </span>
        </div>
      </div>

      {/* ── AVATAR + NAME ── */}
      <div className="flex items-end gap-3 px-4 -mt-8 mb-3 relative z-10">
        <div className="relative shrink-0">
          <img
            src={celeb.avatar}
            alt=""
            className="w-16 h-16 object-cover"
            style={{
              borderRadius: 14,
              border: `2px solid ${GOLD}`,
              boxShadow: `0 0 16px ${GOLD}40`,
              filter: "saturate(1.1)",
            }}
          />
          {celeb.verified && (
            <div
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: "#1D9BF0", border: "1.5px solid #0e1118" }}
            >
              <MdVerified style={{ color: "#fff", fontSize: 11 }} />
            </div>
          )}
        </div>
        <div className="pb-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-black text-white text-[15px] leading-none">
              {celeb.name}
            </h3>
          </div>
          <p
            className="text-[10px] mt-0.5"
            style={{ color: GOLD, opacity: 0.8 }}
          >
            {celeb.handle}
          </p>
          <p
            className="text-[10px] mt-0.5"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            {celeb.role}
          </p>
        </div>
      </div>

      {/* ── HEADLINE ── */}
      <div className="px-4 mb-4">
        {/* Divider with star */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="flex-1 h-px"
            style={{
              background: `linear-gradient(to right, ${GOLD}40, transparent)`,
            }}
          />
          <BsStars style={{ color: GOLD, fontSize: 10, opacity: 0.7 }} />
          <div
            className="flex-1 h-px"
            style={{
              background: `linear-gradient(to left, ${GOLD}40, transparent)`,
            }}
          />
        </div>

        <p
          className="font-bold leading-snug mb-1.5 line-clamp-2"
          style={{
            color: hovered ? "#F5E0C0" : "rgba(255,255,255,0.85)",
            fontSize: 13,
            transition: "color 0.2s",
          }}
        >
          {celeb.headline}
        </p>
        <p
          className="text-[11px] line-clamp-1"
          style={{ color: "rgba(255,255,255,0.38)" }}
        >
          {celeb.subline}
        </p>
      </div>

      {/* ── BUZZ METER ── */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span
            className="text-[9px] font-black uppercase tracking-widest"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Buzz Meter
          </span>
          <span
            className="text-[9px]"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            {celeb.specialty}
          </span>
        </div>
        <BuzzBar value={celeb.buzz} />
      </div>

      {/* ── FOOTER ── */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderTop: "0.5px solid rgba(255,255,255,0.05)" }}
      >
        <div
          className="flex items-center gap-3"
          style={{ color: "rgba(255,255,255,0.28)", fontSize: 10 }}
        >
          <span className="flex items-center gap-1">
            <FaEye size={9} style={{ color: GOLD, opacity: 0.6 }} />{" "}
            {celeb.views}
          </span>
          <span style={{ color: "rgba(255,255,255,0.1)" }}>·</span>
          <span>{celeb.timeAgo}</span>
        </div>

        <button
          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all duration-200"
          style={{
            color: hovered ? BG : GOLD,
            background: hovered
              ? `linear-gradient(135deg, ${GOLD}, ${GOLD2})`
              : `${GOLD}14`,
            border: `0.5px solid ${GOLD}40`,
          }}
        >
          Full Profile <FaArrowRight size={8} />
        </button>
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────
const CelebrityNews = () => {
  const scrollRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);

  const CARD_W = 326; // 310 + 16 gap

  const syncState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    setActiveIdx(Math.round(el.scrollLeft / CARD_W));
  };

  React.useEffect(() => {
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
      className="py-14 text-white"
      style={{
        // background: BG,
        borderTop: "0.5px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* ── HEADER ── */}
      <div className="flex items-end justify-between mb-10 px-4 md:px-10">
        <div className="flex items-center gap-4">
          {/* Gold accent mark */}
          <div className="relative">
            <RiUserStarFill style={{ color: GOLD, fontSize: 28 }} />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(circle, ${GOLD}30 0%, transparent 70%)`,
                filter: "blur(6px)",
              }}
            />
          </div>
          <div>
            <p
              className="text-[9px] font-black uppercase tracking-[0.3em] mb-1"
              style={{ color: GOLD, letterSpacing: "0.3em" }}
            >
              ✦ Spotlight
            </p>
            <h2
              className="font-black uppercase leading-none"
              style={{
                fontSize: "clamp(22px, 4vw, 34px)",
                letterSpacing: "-0.02em",
              }}
            >
              Celebrity{" "}
              <span
                style={{
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`,
                  backgroundClip: "text",
                }}
              >
                News
              </span>
            </h2>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {[
            { dir: -1, can: canLeft, icon: <FaArrowLeft size={12} /> },
            { dir: 1, can: canRight, icon: <FaArrowRight size={12} /> },
          ].map(({ dir, can, icon }) => (
            <button
              key={dir}
              onClick={() => scroll(dir)}
              disabled={!can}
              className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200"
              style={{
                background: can ? `${GOLD}18` : "rgba(255,255,255,0.04)",
                border: `0.5px solid ${can ? GOLD + "50" : "rgba(255,255,255,0.08)"}`,
                color: can ? GOLD : "rgba(255,255,255,0.15)",
                cursor: can ? "pointer" : "not-allowed",
              }}
            >
              {icon}
            </button>
          ))}

          <a
            href="/celebrities"
            className="hidden md:flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-lg transition-all duration-200 ml-1"
            style={{
              color: GOLD,
              border: `0.5px solid ${GOLD}40`,
              background: `${GOLD}10`,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = `${GOLD}20`)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = `${GOLD}10`)
            }
          >
            All Celebs <FaArrowRight size={9} />
          </a>
        </div>
      </div>

      {/* ── CAROUSEL ── */}
      <div className="relative">
        {/* Left fade */}
        <div
          className="absolute left-0 top-0 bottom-0 w-14 z-10 pointer-events-none"
          style={{
            background: `linear-gradient(to right, ${BG}, transparent)`,
            opacity: canLeft ? 1 : 0,
            transition: "opacity 0.3s",
          }}
        />
        {/* Right fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{ background: `linear-gradient(to left, ${BG}, transparent)` }}
        />

        {/* Scrollable track */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto px-4 md:px-10 pb-3"
          style={{
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {celebrities.map((celeb) => (
            <CelebCard key={celeb.id} celeb={celeb} />
          ))}
          <div style={{ flexShrink: 0, width: 16 }} />
        </div>
      </div>

      {/* ── GOLD DOTS ── */}
      <div className="flex items-center justify-center gap-2 mt-6 px-4">
        {celebrities.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === activeIdx ? 22 : 6,
              height: 6,
              borderRadius: 99,
              background:
                i === activeIdx
                  ? `linear-gradient(to right, ${GOLD}, ${GOLD2})`
                  : "rgba(255,255,255,0.12)",
              border: "none",
              padding: 0,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* ── MOBILE VIEW ALL ── */}
      <div className="md:hidden mt-6 px-4">
        <button
          className="w-full py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"
          style={{
            background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`,
            color: BG,
          }}
        >
          <HiSparkles size={12} /> View All Celebrities
        </button>
      </div>

      <style>{`div::-webkit-scrollbar{display:none}`}</style>
    </section>
  );
};

export default CelebrityNews;
