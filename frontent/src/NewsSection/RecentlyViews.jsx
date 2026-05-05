import React, { useState, useRef } from "react";
import {
  FaArrowRight,
  FaArrowLeft,
  FaEye,
  FaHeart,
  FaRegHeart,
  FaClock,
} from "react-icons/fa";
import { BsStars, BsLightningChargeFill } from "react-icons/bs";
import { MdVerified } from "react-icons/md";
import { HiSparkles } from "react-icons/hi2";
import { RiHistoryFill } from "react-icons/ri";
import { MdOutlineNewspaper } from "react-icons/md";

// ── THEME ─────────────────────────────────────────────────
const CYAN = "#00C9B1";
const CYAN2 = "#4DFFD9";
const BG = "#060b0f";
const CARD = "#0a1018";

// ── RECENTLY VIEWED DATA ──────────────────────────────────
const recentlyViewedItems = [
  {
    id: 1,
    title: "Pushpa 2 smashes all-time opening week record in North India",
    handle: "@filmnews",
    verified: true,
    category: "Box Office",
    coverImage:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=900&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=200&q=80",
    readCount: 9,
    latestTag: "🔥 Trending",
    latestTagColor: "#F97316",
    headline:
      "Pushpa 2 obliterates records — Allu Arjun's mass celebration goes pan-global",
    subline: "₹1800 Cr worldwide. Re-release adds another ₹200 Cr.",
    views: "210K",
    likes: 11400,
    timeAgo: "Just now",
    specialty: "Pan India",
    buzz: 99,
    readProgress: 72,
  },
  {
    id: 2,
    title: "Zomato x Netflix collab announces food-and-stream bundle",
    handle: "@techbiz",
    verified: false,
    category: "Business",
    coverImage:
      "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=900&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=200&q=80",
    readCount: 4,
    latestTag: "💡 Deal",
    latestTagColor: "#10B981",
    headline:
      "India's biggest super-app partnership targets 500M users by 2027",
    subline: "Bundle priced at ₹349/month. Launch in Q4 2026.",
    views: "43K",
    likes: 2100,
    timeAgo: "18 min ago",
    specialty: "Tech & Biz",
    buzz: 84,
    readProgress: 100,
  },
  {
    id: 3,
    title: "ISRO successfully tests reusable launch vehicle 'Pushpak'",
    handle: "@spacenews",
    verified: true,
    category: "Science",
    coverImage:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=900&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=200&q=80",
    readCount: 7,
    latestTag: "🚀 Science",
    latestTagColor: "#6366F1",
    headline: "Pushpak lands autonomously — India's SpaceX moment arrives",
    subline: "Third consecutive success. Orbital mission planned 2027.",
    views: "67K",
    likes: 5600,
    timeAgo: "1 hr ago",
    specialty: "Space & Science",
    buzz: 93,
    readProgress: 45,
  },
  {
    id: 4,
    title: "IPL 2026: MI vs CSK final draws 500M viewers globally",
    handle: "@sportswire",
    verified: true,
    category: "Sports",
    coverImage:
      "https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=900&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1540747913346-19212a4b423f?w=200&q=80",
    readCount: 12,
    latestTag: "🏆 Final",
    latestTagColor: "#F59E0B",
    headline: "MI lifts IPL 2026 — Rohit's farewell season ends in glory",
    subline: "Super-over thriller. Most-watched cricket final ever.",
    views: "390K",
    likes: 18200,
    timeAgo: "3 hrs ago",
    specialty: "Cricket",
    buzz: 97,
    readProgress: 88,
  },
  {
    id: 5,
    title: "Apple Vision Pro 2 India launch — price slashed to ₹2.4L",
    handle: "@techwire",
    verified: true,
    category: "Technology",
    coverImage:
      "https://images.unsplash.com/photo-1512070679279-8988d32161be?w=900&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=200&q=80",
    readCount: 6,
    latestTag: "📱 Launch",
    latestTagColor: "#8B5CF6",
    headline:
      "Vision Pro 2 hits India — spatial computing finally goes mainstream",
    subline: "Pre-orders sold out in 4 minutes. Flipkart exclusive.",
    views: "88K",
    likes: 4400,
    timeAgo: "5 hrs ago",
    specialty: "Consumer Tech",
    buzz: 90,
    readProgress: 30,
  },
  {
    id: 6,
    title: "Arijit Singh breaks YouTube record — 1B views in 12 days",
    handle: "@musicnews",
    verified: false,
    category: "Music",
    coverImage:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=900&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&q=80",
    readCount: 8,
    latestTag: "🎵 Record",
    latestTagColor: "#EC4899",
    headline:
      "Arijit's 'Teri Yaad' shatters YouTube milestone — fastest ever in Asia",
    subline: "Composed in 3 days. Now trending in 34 countries.",
    views: "120K",
    likes: 7800,
    timeAgo: "Yesterday",
    specialty: "Music & Pop",
    buzz: 88,
    readProgress: 55,
  },
];

// ── BUZZ BAR ──────────────────────────────────────────────
function BuzzBar({ value }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="text-[9px] font-black uppercase tracking-widest"
        style={{ color: CYAN, minWidth: 28 }}
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
            background: `linear-gradient(to right, ${CYAN}, ${CYAN2})`,
            transition: "width 1s ease",
          }}
        />
      </div>
      <BsLightningChargeFill
        style={{ color: CYAN, fontSize: 9, opacity: 0.7 }}
      />
    </div>
  );
}

// ── PROGRESS RING ─────────────────────────────────────────
function ProgressRing({ progress }) {
  const r = 8;
  const circ = 2 * Math.PI * r;
  const dash = (progress / 100) * circ;
  return (
    <svg width={20} height={20} style={{ transform: "rotate(-90deg)" }}>
      <circle
        cx={10}
        cy={10}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={2}
      />
      <circle
        cx={10}
        cy={10}
        r={r}
        fill="none"
        stroke={progress === 100 ? CYAN2 : CYAN}
        strokeWidth={2}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── EMPTY STATE ───────────────────────────────────────────
function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center pt-20 px-8"
      style={{ minHeight: 320 }}
    >
      {/* Animated ring */}
      <div className="relative mb-6" style={{ width: 90, height: 90 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${CYAN}18 0%, transparent 70%)`,
            animation: "pulse-ring 2.4s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 8,
            borderRadius: "50%",
            border: `1.5px dashed ${CYAN}35`,
            animation: "spin-slow 12s linear infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MdOutlineNewspaper
            style={{ color: CYAN, fontSize: 30, opacity: 0.6 }}
          />
        </div>
      </div>

      <p
        className="text-[10px] font-black uppercase tracking-[0.3em] mb-2"
        style={{ color: CYAN, opacity: 0.7 }}
      >
        ✦ Nothing Yet
      </p>
      <h3
        className="font-black text-center mb-2"
        style={{
          fontSize: 20,
          color: "rgba(255,255,255,0.75)",
          letterSpacing: "-0.02em",
        }}
      >
        No Recent
      </h3>
      <p
        className="text-center text-[12px] max-w-[220px]"
        style={{ color: "rgba(255,255,255,0.3)", lineHeight: 1.7 }}
      >
        Stories you read will appear here for quick access
      </p>

      {/* Decorative dots */}
      <div className="flex items-center gap-2 mt-6">
        {[1, 0.4, 0.2].map((op, i) => (
          <div
            key={i}
            style={{
              width: i === 0 ? 20 : 6,
              height: 6,
              borderRadius: 99,
              background: `linear-gradient(to right, ${CYAN}, ${CYAN2})`,
              opacity: op,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes spin-slow {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ── NEWS CARD ─────────────────────────────────────────────
function RecentCard({ item }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likes);
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
        border: `0.5px solid ${hovered ? CYAN + "55" : "rgba(255,255,255,0.07)"}`,
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered
          ? `0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px ${CYAN}22, 0 0 40px ${CYAN}10`
          : "0 4px 20px rgba(0,0,0,0.4)",
        scrollSnapAlign: "start",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── COVER IMAGE ── */}
      <div className="relative overflow-hidden" style={{ height: 160 }}>
        <img
          src={item.coverImage}
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
              "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(10,16,24,0.92) 100%)",
          }}
        />

        {/* Cyan shimmer line */}
        <div
          className="absolute top-0 left-0 right-0 h-[1.5px]"
          style={{
            background: `linear-gradient(to right, transparent, ${CYAN}, transparent)`,
            opacity: hovered ? 1 : 0.4,
            transition: "opacity 0.3s",
          }}
        />

        {/* Latest tag */}
        <div className="absolute top-3 left-3">
          <span
            className="text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full text-white"
            style={{
              background: item.latestTagColor,
              boxShadow: `0 2px 12px ${item.latestTagColor}60`,
            }}
          >
            {item.latestTag}
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

        {/* Read count pill */}
        <div className="absolute bottom-3 right-3">
          <span
            className="flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-full"
            style={{
              background: "rgba(0,0,0,0.6)",
              color: CYAN2,
              border: `0.5px solid ${CYAN}40`,
              backdropFilter: "blur(8px)",
            }}
          >
            <FaClock size={8} /> {item.readCount} reads
          </span>
        </div>

        {/* Read progress bar at bottom of cover */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: 2.5, background: "rgba(255,255,255,0.06)" }}
        >
          <div
            style={{
              height: "100%",
              width: `${item.readProgress}%`,
              background: `linear-gradient(to right, ${CYAN}, ${CYAN2})`,
            }}
          />
        </div>
      </div>

      {/* ── THUMBNAIL + TITLE ── */}
      <div className="flex items-end gap-3 px-4 -mt-8 mb-3 relative z-10">
        <div className="relative shrink-0">
          <img
            src={item.thumbnail}
            alt=""
            className="w-16 h-16 object-cover"
            style={{
              borderRadius: 14,
              border: `2px solid ${CYAN}`,
              boxShadow: `0 0 16px ${CYAN}40`,
              filter: "saturate(1.1)",
            }}
          />
          {item.verified && (
            <div
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: "#00C9B1", border: "1.5px solid #0a1018" }}
            >
              <MdVerified style={{ color: "#fff", fontSize: 11 }} />
            </div>
          )}
          {/* Progress ring overlay */}
          <div className="absolute -top-1 -right-1">
            <ProgressRing progress={item.readProgress} />
          </div>
        </div>
        <div className="pb-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-black text-white text-[15px] leading-none">
              {item.category}
            </h3>
          </div>
          <p
            className="text-[10px] mt-0.5"
            style={{ color: CYAN, opacity: 0.8 }}
          >
            {item.handle}
          </p>
          <p
            className="text-[10px] mt-0.5"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            {item.readProgress === 100
              ? "✓ Fully read"
              : `${item.readProgress}% read`}
          </p>
        </div>
      </div>

      {/* ── HEADLINE ── */}
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div
            className="flex-1 h-px"
            style={{
              background: `linear-gradient(to right, ${CYAN}40, transparent)`,
            }}
          />
          <BsStars style={{ color: CYAN, fontSize: 10, opacity: 0.7 }} />
          <div
            className="flex-1 h-px"
            style={{
              background: `linear-gradient(to left, ${CYAN}40, transparent)`,
            }}
          />
        </div>

        <p
          className="font-bold leading-snug mb-1.5 line-clamp-2"
          style={{
            color: hovered ? "#C0F5EE" : "rgba(255,255,255,0.85)",
            fontSize: 13,
            transition: "color 0.2s",
          }}
        >
          {item.headline}
        </p>
        <p
          className="text-[11px] line-clamp-1"
          style={{ color: "rgba(255,255,255,0.38)" }}
        >
          {item.subline}
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
            {item.specialty}
          </span>
        </div>
        <BuzzBar value={item.buzz} />
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
            <FaEye size={9} style={{ color: CYAN, opacity: 0.6 }} />{" "}
            {item.views}
          </span>
          <span style={{ color: "rgba(255,255,255,0.1)" }}>·</span>
          <span>{item.timeAgo}</span>
        </div>

        <button
          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all duration-200"
          style={{
            color: hovered ? BG : CYAN,
            background: hovered
              ? `linear-gradient(135deg, ${CYAN}, ${CYAN2})`
              : `${CYAN}14`,
            border: `0.5px solid ${CYAN}40`,
          }}
        >
          Read Again <FaArrowRight size={8} />
        </button>
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────
const RecentlyViewed = ({ items = recentlyViewedItems }) => {
  const scrollRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);

  const CARD_W = 326;

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

  const isEmpty = !items || items.length === 0;

  return (
    <section
      className="pt-5 pb-14 text-white"
      style={{
        borderTop: "0.5px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* ── HEADER ── */}
      <div className="flex items-end justify-between mb-10 px-4 md:px-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <RiHistoryFill style={{ color: CYAN, fontSize: 28 }} />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(circle, ${CYAN}30 0%, transparent 70%)`,
                filter: "blur(6px)",
              }}
            />
          </div>
          <div>
            <p
              className="text-[9px] font-black uppercase tracking-[0.3em] mb-1"
              style={{ color: CYAN, letterSpacing: "0.3em" }}
            >
              ✦ History
            </p>
            <h2
              className="font-black uppercase leading-none"
              style={{
                fontSize: "clamp(22px, 4vw, 34px)",
                letterSpacing: "-0.02em",
              }}
            >
              Recently{" "}
              <span
                style={{
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  background: `linear-gradient(135deg, ${CYAN}, ${CYAN2})`,
                  backgroundClip: "text",
                }}
              >
                Viewed
              </span>
            </h2>
          </div>
        </div>

        {/* Controls — hidden when empty */}
        {/* {!isEmpty && (
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
                  background: can ? `${CYAN}18` : "rgba(255,255,255,0.04)",
                  border: `0.5px solid ${can ? CYAN + "50" : "rgba(255,255,255,0.08)"}`,
                  color: can ? CYAN : "rgba(255,255,255,0.15)",
                  cursor: can ? "pointer" : "not-allowed",
                }}
              >
                {icon}
              </button>
            ))}

            <a
              href="/recently-viewed"
              className="hidden md:flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-lg transition-all duration-200 ml-1"
              style={{
                color: CYAN,
                border: `0.5px solid ${CYAN}40`,
                background: `${CYAN}10`,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = `${CYAN}20`)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = `${CYAN}10`)
              }
            >
              View All <FaArrowRight size={9} />
            </a>
          </div>
        )} */}
      </div>

      {/* ── EMPTY STATE or CAROUSEL ── */}
      {isEmpty ? (
        <EmptyState />
      ) : (
        <>
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
              style={{
                background: `linear-gradient(to left, ${BG}, transparent)`,
              }}
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
              {items.map((item) => (
                <RecentCard key={item.id} item={item} />
              ))}
              <div style={{ flexShrink: 0, width: 16 }} />
            </div>
          </div>

          {/* ── CYAN DOTS ── */}
          {/* <div className="flex items-center justify-center gap-2 mt-6 px-4">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                style={{
                  width: i === activeIdx ? 22 : 6,
                  height: 6,
                  borderRadius: 99,
                  background:
                    i === activeIdx
                      ? `linear-gradient(to right, ${CYAN}, ${CYAN2})`
                      : "rgba(255,255,255,0.12)",
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
              style={{
                background: `linear-gradient(135deg, ${CYAN}, ${CYAN2})`,
                color: BG,
              }}
            >
              <HiSparkles size={12} /> View All Recently Viewed
            </button>
          </div> */}
        </>
      )}

      <style>{`div::-webkit-scrollbar{display:none}`}</style>
    </section>
  );
};

export default RecentlyViewed;
