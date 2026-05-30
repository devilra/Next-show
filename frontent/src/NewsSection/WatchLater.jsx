import React, { useState, useRef, useEffect } from "react";
import { FaArrowRight, FaArrowLeft, FaRegClock } from "react-icons/fa";
import { BsPlayCircleFill } from "react-icons/bs";
import { ImSpinner9 } from "react-icons/im";
import { Link } from "react-router-dom";
import { RiBookmarkFill } from "react-icons/ri";
import moment from "moment";

// ── ACCENT ──────────────────────────────────────
const ACCENT = "#e85d26";

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const getImageUrl = (imagePath) => {
  if (!imagePath) return "/placeholder.jpg";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  return `${IMAGE_BASE_URL}${imagePath}`;
};

const getRelativeTime = (date) => {
  return moment(date).fromNow();
};

// ── CARD ─────────────────────────────────────────
function WatchLaterCard({ item }) {
  const [hovered, setHovered] = useState(false);

  // item here is the news object inside each watchLaterNews entry
  const news = item?.news;

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
        src={getImageUrl(news?.newsImages?.[0])}
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
      {/* {news?.videoUrl?.length > 0 && (
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
      )} */}

      {/* Bookmark badge — top left */}
      <div className="absolute top-4 left-4">
        <div
          className="flex items-center justify-center w-7 h-7 rounded-full"
          style={{
            background: `${ACCENT}22`,
            border: `0.5px solid ${ACCENT}50`,
            backdropFilter: "blur(8px)",
          }}
        >
          <RiBookmarkFill size={12} style={{ color: ACCENT }} />
        </div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-5">
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
          {news?.title}
        </h3>

        {/* Summary */}
        <p
          className="text-[11px] leading-relaxed mb-3 line-clamp-2"
          style={{ color: "rgba(255,255,255,0.42)" }}
        >
          {news?.shortDescription}
        </p>

        {/* Meta */}
        <div
          className="flex items-center gap-2.5"
          style={{ color: "rgba(255,255,255,0.32)", fontSize: 10 }}
        >
          <span className="flex items-center gap-1">
            <FaRegClock size={9} style={{ color: ACCENT, opacity: 0.75 }} />
            {news?.readTime}
          </span>
          <span className="w-1 h-1 rounded-full bg-zinc-600" />
          <span>{news?.publishedDate}</span>
          <span className="w-1 h-1 rounded-full bg-zinc-600" />
          <span>{getRelativeTime(item?.createdAt)}</span>
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
const WatchLater = ({
  watchLaterNews = [],
  isLoading,
  isError,
  error,
  refetch,
}) => {
  const scrollRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const CARD_W = 306; // 290 + 16 gap

  const syncState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
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

  if (isLoading) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <ImSpinner9 className="text-orange-500 text-4xl animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full min-h-[400px] flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
          <span className="text-red-500 text-xl">!</span>
        </div>
        <h2 className="text-white text-lg mb-3">Failed to load watch later</h2>
        <button
          onClick={() => refetch()}
          className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 transition text-white text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section
      className="text-white pt-5"
      style={{
        borderTop: "0.5px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* ── HEADER ── */}
      <div className="flex items-end justify-between mb-8 px-4 md:px-10">
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
              EXCLUSIVE SAVED
            </p>
            <h2
              className="font-black uppercase leading-none"
              style={{
                fontSize: "clamp(22px, 4vw, 34px)",
                letterSpacing: "-0.02em",
              }}
            >
              Read Later
            </h2>
          </div>
        </div>
      </div>

      {/* ── CAROUSEL ── */}
      <div className="relative">
        {/* ── EMPTY STATE ── */}
        {!isLoading && !isError && watchLaterNews?.length === 0 && (
          <div className="w-full min-h-[400px] flex flex-col items-center justify-center text-center">
            <div className="text-5xl mb-5">🔖</div>
            <h2 className="text-white text-2xl font-black mb-3 uppercase tracking-wide">
              No Saved Articles
            </h2>
            <p className="text-white/35 text-sm md:text-base max-w-md leading-relaxed">
              Articles you save will appear here. Start bookmarking news to read
              later.
            </p>
          </div>
        )}

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
          {watchLaterNews.map((item) => (
            <Link
              key={item?.id}
              to={`/news/${item?.news?.slug}`}
              className="block"
            >
              <WatchLaterCard item={item} />
            </Link>
          ))}
          {/* Spacer */}
          <div style={{ flexShrink: 0, width: 16 }} />
        </div>
      </div>

      <style>{`div::-webkit-scrollbar{display:none}`}</style>
    </section>
  );
};

export default WatchLater;
