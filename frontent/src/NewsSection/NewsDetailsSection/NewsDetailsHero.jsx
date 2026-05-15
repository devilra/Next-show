import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronRight,
  Share2,
  Clock,
  Calendar,
  User,
  Tag,
  ChevronLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";
import { motion } from "framer-motion";
import moment from "moment";
import { ImSpinner9 } from "react-icons/im";

const highlights = [
  {
    title: "Thalapathy Vijay's TVK secures historic mandate in local polls",
    time: "2h ago",
    img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80",
  },
  {
    title: "Ajith Kumar's Racing film titled 'Gladiators'; Motion poster out",
    time: "5h ago",
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80",
  },
  {
    title: "Top 10 Must-Watch Tamil Thrillers on OTT this Weekend",
    time: "10h ago",
    img: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&q=80",
  },
  {
    title: "Kollywood Box Office: Summer 2026 releases line-up revealed",
    time: "12h ago",
    img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80",
  },
];

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return "/placeholder.jpg";
  }

  // ======================================================
  // ✅ GOOGLE / CLOUD / FULL URL
  // ======================================================

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // ======================================================
  // ✅ LOCAL UPLOAD IMAGE
  // ======================================================

  return `${IMAGE_BASE_URL}${imagePath}`;
};

// ======================================================
// ✅ YOUTUBE EMBED URL
// ======================================================

const getYoutubeEmbedUrl = (url) => {
  if (!url) return "";

  try {
    // ======================================================
    // ✅ SHORT URL
    // ======================================================

    if (url.includes("youtu.be")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];

      return `https://www.youtube.com/embed/${videoId}`;
    }

    // ======================================================
    // ✅ NORMAL URL
    // ======================================================

    if (url.includes("youtube.com/watch")) {
      const urlObj = new URL(url);

      const videoId = urlObj.searchParams.get("v");

      return `https://www.youtube.com/embed/${videoId}`;
    }

    // ======================================================
    // ✅ ALREADY EMBED
    // ======================================================

    if (url.includes("youtube.com/embed")) {
      return url;
    }

    return url;
  } catch (error) {
    return "";
  }
};

const getRelativeTime = (date) => {
  if (!date) return "";

  return moment(date).fromNow();
};

// ─────────────────────────────────────────────────────────
// GENERIC AUTO-SCROLL CAROUSEL HOOK
// ─────────────────────────────────────────────────────────
function useCarousel(total, interval = 4000) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const start = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % total);
    }, interval);
  }, [total, interval]);

  useEffect(() => {
    if (!paused) start();
    return () => clearInterval(timerRef.current);
  }, [paused, start]);

  const go = (idx) => {
    setCurrent(idx);
    start(); // reset timer after manual nav
  };

  const prev = () => go((current - 1 + total) % total);
  const next = () => go((current + 1) % total);

  return { current, prev, next, go, setPaused };
}

// ─────────────────────────────────────────────────────────
// IMAGE CAROUSEL
// ─────────────────────────────────────────────────────────
function ImageCarousel({ images }) {
  const { current, prev, next, go, setPaused } = useCarousel(
    images.length,
    4500,
  );
  const [animating, setAnimating] = useState(false);
  const touchStart = useRef(null);

  const navigate = (fn) => {
    if (animating) return;
    setAnimating(true);
    fn();
    setTimeout(() => setAnimating(false), 400);
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
      style={{ aspectRatio: "16/9" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        touchStart.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (!touchStart.current) return;
        const diff = touchStart.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) diff > 0 ? navigate(next) : navigate(prev);
        touchStart.current = null;
      }}
    >
      {/* Images */}
      {images.map((image, index) => (
        <img
          key={index}
          src={getImageUrl(image)}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
          style={{
            opacity: index === current ? 1 : 0,
            transform: index === current ? "scale(1)" : "scale(1.03)",
          }}
        />
      ))}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(10,10,10,0.6) 0%, transparent 50%)",
        }}
      />

      {/* Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => navigate(prev)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all opacity-0 hover:opacity-100 group-hover:opacity-100"
            style={{
              background: "rgba(0,0,0,0.55)",
              border: "0.5px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              color: "#fff",
            }}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => navigate(next)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all opacity-0 hover:opacity-100 group-hover:opacity-100"
            style={{
              background: "rgba(0,0,0,0.55)",
              border: "0.5px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              color: "#fff",
            }}
          >
            <ChevronRight size={16} />
          </button>
        </>
      )}

      {/* Hover reveal for arrows */}
      <div className="absolute inset-0 group">
        {images.length > 1 && (
          <>
            <button
              onClick={() => navigate(prev)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full items-center justify-center hidden group-hover:flex transition-all"
              style={{
                background: "rgba(0,0,0,0.55)",
                border: "0.5px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                color: "#fff",
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => navigate(next)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full items-center justify-center hidden group-hover:flex transition-all"
              style={{
                background: "rgba(0,0,0,0.55)",
                border: "0.5px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                color: "#fff",
              }}
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>

      {/* Counter + Dots */}
      <div className="absolute bottom-3 left-0 right-0 flex items-center justify-between px-4 z-10">
        <span className="text-[10px] font-bold text-white/50 font-mono">
          {String(current + 1).padStart(2, "0")} /{" "}
          {String(images.length).padStart(2, "0")}
        </span>
        {images.length > 1 && (
          <div className="flex items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                style={{
                  width: i === current ? 18 : 5,
                  height: 5,
                  borderRadius: 99,
                  background:
                    i === current ? "#f97316" : "rgba(255,255,255,0.3)",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Progress bar */}
      {images.length > 1 && (
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <div
            key={current}
            className="h-full bg-orange-500"
            style={{ animation: "imgProgress 4.5s linear forwards" }}
          />
        </div>
      )}
    </div>
  );
}

// ======================================================
// ✅ VIDEO CAROUSEL
// ======================================================

function VideoCarousel({ videos = [] }) {
  // ======================================================
  // ✅ CURRENT VIDEO KEY
  // IFRAME FORCE RE-MOUNT
  // ======================================================
  const [videoKey, setVideoKey] = useState(0);

  // ======================================================
  // ✅ YOUTUBE VIDEO ID
  // ======================================================

  const getYoutubeVideoId = (url) => {
    if (!url) return "";

    try {
      // ======================================================
      // ✅ SHORT URL
      // ======================================================

      if (url.includes("youtu.be/")) {
        return url.split("youtu.be/")[1]?.split("?")[0];
      }

      // ======================================================
      // ✅ WATCH URL
      // ======================================================

      if (url.includes("youtube.com/watch")) {
        const urlObj = new URL(url);

        return urlObj.searchParams.get("v");
      }

      // ======================================================
      // ✅ EMBED URL
      // ======================================================

      if (url.includes("youtube.com/embed/")) {
        return url.split("embed/")[1]?.split("?")[0];
      }

      return "";
    } catch (error) {
      return "";
    }
  };

  // ======================================================
  // ✅ YOUTUBE EMBED URL
  // ======================================================

  const getYoutubeEmbedUrl = (url) => {
    const videoId = getYoutubeVideoId(url);

    if (!videoId) return "";

    return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
  };

  // ======================================================
  // ✅ YOUTUBE THUMBNAIL
  // ======================================================

  const getYoutubeThumbnail = (url) => {
    const videoId = getYoutubeVideoId(url);

    if (!videoId) {
      return "/placeholder.jpg";
    }

    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  // ======================================================
  // ✅ EMPTY CHECK
  // ======================================================

  if (!videos || videos.length === 0) {
    return null;
  }

  const { current, prev, next, go, setPaused } = useCarousel(
    videos.length,
    5000,
  );

  // ======================================================
  // ✅ RESET IFRAME WHEN VIDEO CHANGES
  // PREVIOUS VIDEO STOP AAGUM
  // ======================================================
  useEffect(() => {
    setVideoKey((prevKey) => prevKey + 1);
  }, [current]);

  // ======================================================
  // ✅ CUSTOM NEXT
  // ======================================================

  const handleNext = () => {
    next();
  };

  // ======================================================
  // ✅ CUSTOM PREV
  // ======================================================

  const handlePrev = () => {
    prev();
  };

  // ======================================================
  // ✅ CUSTOM THUMB CLICK
  // ======================================================

  const handleThumbClick = (index) => {
    go(index);
  };

  return (
    <div className="space-y-4">
      {/* ====================================================== */}
      {/* ✅ LABEL */}
      {/* ====================================================== */}

      <div className="flex items-center gap-2">
        <div className="w-[3px] h-5 rounded-full bg-orange-500" />

        <p className="text-sm font-semibold text-white/70">Video Coverage</p>
      </div>

      {/* ====================================================== */}
      {/* ✅ MAIN VIDEO */}
      {/* ====================================================== */}

      <div
        className="relative rounded-2xl overflow-hidden border border-white/10 bg-black"
        style={{ aspectRatio: "16/9" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* ====================================================== */}
        {/* ✅ VIDEO SLIDES */}
        {/* ====================================================== */}

        {videos.map((video, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              opacity: current === index ? 1 : 0,
              pointerEvents: current === index ? "auto" : "none",
            }}
          >
            {/* ====================================================== */}
            {/* ✅ IFRAME */}
            {/* ====================================================== */}

            <iframe
              key={`${videoKey}-${current}`}
              src={getYoutubeEmbedUrl(video)}
              title={`video-${current}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        ))}

        {/* ====================================================== */}
        {/* ✅ NAVIGATION */}
        {/* ====================================================== */}

        {videos.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white backdrop-blur-md"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white backdrop-blur-md"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* ====================================================== */}
      {/* ✅ THUMBNAILS */}
      {/* ====================================================== */}

      {videos.length > 1 && (
        <div className="flex flex-wrap gap-3">
          {videos.map((video, index) => (
            <button
              key={index}
              onClick={() => handleThumbClick(index)}
              className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${
                current === index
                  ? "border-orange-500 opacity-100"
                  : "border-white/10 opacity-50"
              }`}
              style={{
                width: 130,
                height: 78,
              }}
            >
              {/* ====================================================== */}
              {/* ✅ THUMBNAIL */}
              {/* ====================================================== */}

              <img
                src={getYoutubeThumbnail(video)}
                alt=""
                className="w-full h-full object-cover"
              />

              {/* ====================================================== */}
              {/* ✅ OVERLAY */}
              {/* ====================================================== */}

              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                  <Play
                    size={14}
                    className="text-white ml-[2px]"
                    fill="white"
                  />
                </div>
              </div>

              {/* ====================================================== */}
              {/* ✅ ACTIVE BAR */}
              {/* ====================================================== */}

              {current === index && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-orange-500" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────
const NewsDetailHero = ({
  newsDetails,
  relatedNews,
  relatedLoading,
  relatedError,
  relatedErrorData,
  relatedRefetch,
}) => {
  // ======================================================
  // ✅ CONTENT BLOCKS
  // ======================================================

  const contentBlocks = newsDetails?.additionalFields?.contentBlocks || [];

  const [scrollProgress, setScrollProgress] = useState(0);
  const pageRef = useRef(null);

  // ======================================================
  // ✅ STRIP HTML
  // ======================================================

  const stripHtml = (html) => {
    if (!html) return "";

    return html.replace(/<[^>]*>?/gm, "");
  };

  useEffect(() => {
    let ticking = false;

    const updateScrollProgress = () => {
      if (!pageRef.current) return;

      if (!ticking) {
        requestAnimationFrame(() => {
          const element = pageRef.current;

          const rect = element.getBoundingClientRect();

          const elementTop = window.scrollY + rect.top;
          const elementHeight = element.scrollHeight;

          const scrollTop = window.scrollY;
          const windowHeight = window.innerHeight;

          const totalScrollable = elementHeight - windowHeight;

          const currentScroll = scrollTop - elementTop;

          const progress = (currentScroll / totalScrollable) * 100;

          const clampedProgress = Math.min(Math.max(progress, 0), 100);

          setScrollProgress(clampedProgress);

          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", updateScrollProgress, { passive: true });

    updateScrollProgress();

    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300" ref={pageRef}>
      <div
        className="fixed bottom-0 left-0 h-[3px] z-[9999] "
        style={{
          width: `${scrollProgress}%`,
          background: "linear-gradient(to right, #f97316, #fb923c, #fdba74)",
        }}
      />
      <style>{`
        @keyframes imgProgress { from { width: 0% } to { width: 100% } }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 py-10 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* ── LEFT: Main Content ── */}
          <div className="lg:col-span-8 space-y-8">
            {/* Category tag */}
            {/* <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white"
                style={{ background: "#f97316" }}
              >
                Cinema
              </span>
              <span className="text-zinc-600 text-xs">·</span>
              <span className="text-zinc-500 text-xs">Kollywood</span>
            </div> */}

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-[42px]  text-white leading-tight"
              style={{ letterSpacing: "-0.02em" }}
            >
              {newsDetails?.title}
            </motion.h1>

            {/* Short Summary Section */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-zinc-400 text-lg md:text-xl leading-relaxed mt-4 font-medium"
            >
              {newsDetails?.shortDescription}
            </motion.p>

            {/* ── TAGS ── */}
            <div
              className="flex flex-wrap gap-2 pt-6"
              style={{ borderTop: "0.5px solid rgba(255,255,255,0.07)" }}
            >
              {newsDetails?.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs cursor-pointer transition-all"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "0.5px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.45)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#f9731660";
                    e.currentTarget.style.color = "#f97316";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.08)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.45)";
                  }}
                >
                  <Tag size={10} /> {tag}
                </span>
              ))}
            </div>

            {/* Meta */}
            <div
              className="flex flex-wrap items-center gap-5 py-4 text-sm text-zinc-500"
              style={{
                borderTop: "0.5px solid rgba(255,255,255,0.08)",
                borderBottom: "0.5px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex items-center gap-1.5">
                <User size={13} className="text-orange-500" />
                <span className="text-zinc-400 text-xs">
                  {newsDetails?.authorName}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={13} className="text-zinc-600" />
                <span className="text-xs">{newsDetails?.formattedDate}</span>
                {/* <div>
                  <span>{getRelativeTime(newsDetails?.publishedAt)}</span>
                </div> */}
              </div>

              <div className="flex items-center gap-1.5">
                <Clock size={13} className="text-zinc-600" />
                <span className="text-xs">{newsDetails?.readTime}</span>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "0.5px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.5)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(249,115,22,0.12)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.05)")
                  }
                >
                  <Share2 size={13} /> Share
                </button>
              </div>
            </div>

            {/* ── IMAGE CAROUSEL ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <ImageCarousel images={newsDetails?.newsImages || []} />
            </motion.div>

            {/* ── ARTICLE BODY ── */}
            <motion.article
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-5 text-[15px] leading-[1.85]"
              style={{ color: "rgba(161,161,170,0.9)" }}
            >
              {/* ====================================================== */}
              {/* ✅ LONG DESCRIPTION DROP CAP */}
              {/* ====================================================== */}

              {newsDetails?.longDescription && (
                <div>
                  <p>
                    <span
                      className="float-left text-6xl font-black mr-3 leading-none"
                      style={{
                        color: "#f97316",
                        fontFamily: "Georgia, serif",
                        lineHeight: "0.8",
                      }}
                    >
                      {stripHtml(newsDetails.longDescription)
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </span>

                    {stripHtml(newsDetails.longDescription)?.slice(1)}
                  </p>
                </div>
              )}

              {/* ====================================================== */}
              {/* ✅ DYNAMIC CONTENT BLOCKS */}
              {/* ====================================================== */}

              {contentBlocks.map((block, index) => {
                // ======================================================
                // ✅ PARAGRAPH
                // ======================================================
                if (block.type === "paragraph") {
                  return (
                    <div key={index} className="space-y-4">
                      {/* ============================================= */}
                      {/* ✅ PARAGRAPH TEXT */}
                      {/* ============================================= */}

                      {block?.text && <p>{block.text}</p>}

                      {/* ============================================= */}
                      {/* ✅ NESTED LIST */}
                      {/* ============================================= */}

                      {block?.nestedList?.items?.length > 0 && (
                        <ul className="space-y-3 pl-5">
                          {block.nestedList.items.map((item, itemIndex) => (
                            <li
                              key={itemIndex}
                              className="flex items-start gap-3 text-zinc-300"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2.5 shrink-0" />

                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                }

                // ======================================================
                // ✅ QUOTE BLOCK
                // ======================================================
                if (block.type === "quote") {
                  return (
                    <blockquote
                      key={index}
                      className="my-6 pl-5 py-1"
                      style={{ borderLeft: "3px solid #f97316" }}
                    >
                      <p
                        className="text-[16px] font-medium italic"
                        style={{ color: "rgba(255,255,255,0.65)" }}
                      >
                        "{block?.text}"
                      </p>

                      <cite
                        className="text-xs mt-3 block not-italic"
                        style={{ color: "rgba(255,255,255,0.3)" }}
                      >
                        — {block?.person}
                        {block?.role ? `, ${block.role}` : ""}
                      </cite>
                    </blockquote>
                  );
                }
                // ======================================================
                // ✅ VIDEO BLOCK
                // ======================================================

                if (block.type === "video") {
                  return (
                    <div key={index}>
                      <VideoCarousel videos={block?.url || []} />
                    </div>
                  );
                }
                // ======================================================
                // ✅ DEFAULT
                // ======================================================

                return null;
              })}

              {/* <p>
                Director Hariharasuthan, known for his unique storytelling, has
                envisioned this project as a tribute to classic 90s romance but
                with a modern twist that appeals to the Gen-Z audience. The
                music by{" "}
                <span className="text-white font-medium">Nivas K Prasanna</span>{" "}
                is already creating waves in industry circles.
              </p> */}

              {/* Pull quote */}
              {/* <blockquote
                className="my-6 pl-5 py-1"
                style={{ borderLeft: "3px solid #f97316" }}
              >
                <p
                  className="text-[16px] font-medium italic"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
                  "This is a love story told through the lens of modern
                  Kollywood — grounded, emotional, and visually stunning."
                </p>
                <cite
                  className="text-xs mt-2 block not-italic"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  — Hariharasuthan, Director
                </cite>
              </blockquote> */}

              {/* <p>
                Technically, the film is backed by strong names like{" "}
                <span className="text-white font-medium">Theni Eswar</span> for
                cinematography and{" "}
                <span className="text-white font-medium">Ganesh Siva</span> for
                editing. The first look poster, featuring the leads in a vibrant
                setting, has already garnered millions of impressions on social
                media.
              </p> */}
            </motion.article>

            {/* ── VIDEO CAROUSEL ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <VideoCarousel videos={newsDetails?.videoUrl} />
            </motion.div>
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Highlights */}
              <section
                className="p-5 rounded-2xl flex flex-col overflow-hidden "
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "0.5px solid rgba(255,255,255,0.07)",
                  minHeight: "40vh",
                  maxHeight: "74vh",
                }}
              >
                <div className="flex items-center gap-3 px-5 py-3 shrink-0  mb-5">
                  <div
                    style={{
                      width: 3,
                      height: 20,
                      background: "#f97316",
                      borderRadius: 99,
                    }}
                  />
                  <h2 className="text-[13px] font-black text-white uppercase tracking-widest">
                    Related News
                  </h2>
                </div>

                <div className="space-y-5 flex-1 overflow-y-auto no-scrollbar ">
                  {/* ====================================================== */}
                  {/* ✅ LOADING */}
                  {/* ====================================================== */}

                  {relatedLoading && (
                    <div className="flex items-center justify-center min-h-[300px]">
                      <ImSpinner9 className="text-orange-500 text-2xl animate-spin" />
                    </div>
                  )}
                  {/* ====================================================== */}
                  {/* ✅ ERROR */}
                  {/* ====================================================== */}

                  {relatedError && (
                    <div className="flex flex-col items-center justify-center min-h-[300px] text-center px-4">
                      <p className="text-white/70 text-sm mb-4">
                        Failed to load related news
                      </p>

                      <button
                        onClick={relatedRefetch}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-orange-500 text-white"
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  {/* ====================================================== */}
                  {/* ✅ EMPTY STATE */}
                  {/* ====================================================== */}

                  {!relatedLoading &&
                    !relatedError &&
                    relatedNews?.length === 0 && (
                      <div className="flex items-center justify-center min-h-[250px]">
                        <p className="text-white/40 text-sm">
                          No related news available
                        </p>
                      </div>
                    )}

                  {/* ====================================================== */}
                  {/* ✅ RELATED NEWS */}
                  {/* ====================================================== */}

                  {!relatedLoading &&
                    !relatedError &&
                    relatedNews?.map((item, idx) => (
                      <Link
                        to={`/news/${item?.slug}`}
                        key={item?.id}
                        className="flex gap-3 cursor-pointer group"
                        style={{
                          paddingBottom: idx < relatedNews.length - 1 ? 16 : 0,

                          borderBottom:
                            idx < relatedNews.length - 1
                              ? "0.5px solid rgba(255,255,255,0.05)"
                              : "none",
                        }}
                      >
                        {/* ============================================== */}
                        {/* ✅ IMAGE */}
                        {/* ============================================== */}

                        <div
                          className="shrink-0 overflow-hidden rounded-xl"
                          style={{
                            width: 76,
                            height: 58,
                            border: "0.5px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          <img
                            src={getImageUrl(item?.newsImages?.[0])}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            alt={item?.title}
                          />
                        </div>

                        {/* ============================================== */}
                        {/* ✅ CONTENT */}
                        {/* ============================================== */}

                        <div className="flex-1 min-w-0">
                          {/* CATEGORY */}

                          <p className="text-[10px] uppercase tracking-widest text-orange-500 font-semibold mb-1">
                            {item?.categories?.[0]}
                          </p>

                          {/* TITLE */}

                          <h4 className="text-[12px] text-white/70 font-semibold leading-snug line-clamp-2 group-hover:text-white transition-all">
                            {item?.title}
                          </h4>

                          {/* META */}

                          <div
                            className="text-[10px] mt-2 flex items-center gap-1.5 flex-wrap"
                            style={{ color: "rgba(255,255,255,0.25)" }}
                          >
                            <span>{item?.formattedDate}</span>

                            <div className="w-1 h-1 rounded-full bg-white/20" />

                            <span>{getRelativeTime(item?.publishedAt)}</span>

                            <div className="w-1 h-1 rounded-full bg-white/20" />

                            <span className="flex items-center gap-1">
                              <Eye size={10} />
                              {item?.viewCount || 0}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailHero;
