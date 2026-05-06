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

// ─────────────────────────────────────────────────────────
// DUMMY DATA
// ─────────────────────────────────────────────────────────
const articleImages = [
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&q=80",
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&q=80",
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&q=80",
  "https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=1200&q=80",
];

const articleVideos = [
  {
    id: 1,
    thumb:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&q=80",
    label: "Official Teaser — Kaaviya Kaadhal",
    duration: "1:42",
  },
  {
    id: 2,
    thumb:
      "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=1200&q=80",
    label: "Behind the Scenes — Day 1 Shoot",
    duration: "3:18",
  },
  {
    id: 3,
    thumb:
      "https://images.unsplash.com/photo-1512070679279-8988d32161be?w=1200&q=80",
    label: "Director Interview — Hariharasuthan",
    duration: "5:05",
  },
  // {
  //   id: 3,
  //   thumb:
  //     "https://images.unsplash.com/photo-1512070679279-8988d32161be?w=1200&q=80",
  //   label: "Director Interview — Hariharasuthan",
  //   duration: "5:05",
  // },
  // {
  //   id: 3,
  //   thumb:
  //     "https://images.unsplash.com/photo-1512070679279-8988d32161be?w=1200&q=80",
  //   label: "Director Interview — Hariharasuthan",
  //   duration: "5:05",
  // },
];

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
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
          style={{
            opacity: i === current ? 1 : 0,
            transform: i === current ? "scale(1)" : "scale(1.03)",
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

// ─────────────────────────────────────────────────────────
// VIDEO CAROUSEL
// ─────────────────────────────────────────────────────────
function VideoCarousel({ videos }) {
  const { current, prev, next, go, setPaused } = useCarousel(
    videos.length,
    5000,
  );
  const [playing, setPlaying] = useState(null);
  const touchStart = useRef(null);

  if (!videos || videos.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Label */}
      <div className="flex items-center gap-2">
        <div
          style={{
            width: 3,
            height: 18,
            background: "#f97316",
            borderRadius: 99,
          }}
        />
        <p className="text-sm font-semibold text-white/70">Video Coverage</p>
      </div>

      {/* ── MAIN VIDEO PLAYER ── */}
      <div
        className="relative rounded-2xl overflow-hidden border border-white/10"
        style={{ aspectRatio: "16/9", background: "#111" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={(e) => {
          touchStart.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (!touchStart.current) return;
          const diff = touchStart.current - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
          touchStart.current = null;
        }}
      >
        {/* Slides */}
        {videos.map((video, i) => (
          <div
            key={video.id}
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              opacity: i === current ? 1 : 0,
              pointerEvents: i === current ? "auto" : "none",
            }}
          >
            <img
              src={video.thumb}
              alt=""
              className="w-full h-full object-cover"
              style={{ filter: "brightness(0.45)" }}
            />

            {/* Play button */}
            {playing !== video.id ? (
              <button
                onClick={() => setPlaying(video.id)}
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                  style={{
                    background: "#f97316",
                    boxShadow: "0 0 32px rgba(249,115,22,0.5)",
                  }}
                >
                  <Play size={22} className="text-white ml-1" />
                </div>
                <span className="text-white/70 text-xs font-medium">
                  {video.label}
                </span>
              </button>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div
                  className="text-white/60 text-sm font-medium px-6 py-3 rounded-xl"
                  style={{
                    background: "rgba(0,0,0,0.6)",
                    border: "0.5px solid rgba(255,255,255,0.1)",
                  }}
                >
                  ▶ Playing: {video.label}
                </div>
              </div>
            )}

            {/* Duration badge */}
            <div
              className="absolute bottom-3 right-4 text-[10px] font-bold px-2 py-1 rounded"
              style={{
                background: "rgba(0,0,0,0.7)",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {video.duration}
            </div>
          </div>
        ))}

        {/* Arrows — only when multiple */}
        {videos.length > 1 && (
          <div className="absolute inset-0 group z-20 pointer-events-none">
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full items-center justify-center hidden group-hover:flex pointer-events-auto transition-all"
              style={{
                background: "rgba(0,0,0,0.55)",
                border: "0.5px solid rgba(255,255,255,0.15)",
                color: "#fff",
                backdropFilter: "blur(8px)",
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full items-center justify-center hidden group-hover:flex pointer-events-auto transition-all"
              style={{
                background: "rgba(0,0,0,0.55)",
                border: "0.5px solid rgba(255,255,255,0.15)",
                color: "#fff",
                backdropFilter: "blur(8px)",
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Progress bar */}
        {videos.length > 1 && (
          <div
            className="absolute bottom-0 left-0 right-0 h-[2px]"
            style={{ background: "rgba(255,255,255,0.08)", zIndex: 30 }}
          >
            <div
              key={current}
              className="h-full bg-orange-500"
              style={{ animation: "imgProgress 5s linear forwards" }}
            />
          </div>
        )}
      </div>

      {/* ── THUMBNAIL STRIP — fixed 120px width, flex-wrap ── */}
      {videos.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {videos.map((v, i) => (
            <button
              key={v.id}
              onClick={() => {
                go(i);
                setPlaying(null);
              }}
              className="relative overflow-hidden rounded-xl flex-shrink-0 transition-all duration-200"
              style={{
                width: 120,
                height: 70,
                border: `1px solid ${i === current ? "#f97316" : "rgba(255,255,255,0.08)"}`,
                opacity: i === current ? 1 : 0.45,
                boxShadow:
                  i === current ? "0 0 10px rgba(249,115,22,0.3)" : "none",
              }}
            >
              {/* Thumbnail image */}
              <img
                src={v.thumb}
                alt=""
                className="w-full h-full object-cover transition-transform duration-500"
                style={{
                  transform: i === current ? "scale(1.05)" : "scale(1)",
                }}
              />

              {/* Overlay + play icon */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  background:
                    i === current ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.52)",
                }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      i === current ? "#f97316" : "rgba(255,255,255,0.2)",
                  }}
                >
                  <Play size={9} className="text-white ml-0.5" />
                </div>
              </div>

              {/* Label */}
              <div
                className="absolute bottom-0 left-0 right-0 px-1.5 py-1"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
                }}
              >
                <p
                  className="text-[8px] font-medium line-clamp-1 text-left"
                  style={{
                    color: i === current ? "#fff" : "rgba(255,255,255,0.45)",
                  }}
                >
                  {v.label}
                </p>
              </div>

              {/* Active bottom bar */}
              {i === current && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-orange-500" />
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
const NewsDetailHero = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300">
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
              Kaaviya Kaadhal: A New Era of Romantic Cinema Begins with Shanthi
              Talkies
            </motion.h1>

            {/* Short Summary Section */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-zinc-400 text-lg md:text-xl leading-relaxed mt-4 font-medium"
            >
              A nostalgic trip back to 90s romance, reimagined for the Gen-Z
              era. Discover how Bharath and Saanve Megghana bring this poetic
              vision to life.
            </motion.p>

            {/* ── TAGS ── */}
            <div
              className="flex flex-wrap gap-2 pt-6"
              style={{ borderTop: "0.5px solid rgba(255,255,255,0.07)" }}
            >
              {[
                "Cinema",
                "Bharath",
                "New Release",
                "Tamil Cinema",
                "Kollywood",
              ].map((tag) => (
                <span
                  key={tag}
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
                <span className="text-zinc-400 text-xs">By Admin</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={13} className="text-zinc-600" />
                <span className="text-xs">May 06, 2026</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={13} className="text-zinc-600" />
                <span className="text-xs">4 min read</span>
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
              <ImageCarousel images={articleImages} />
            </motion.div>

            {/* ── ARTICLE BODY ── */}
            <motion.article
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-5 text-[15px] leading-[1.85]"
              style={{ color: "rgba(161,161,170,0.9)" }}
            >
              <p>
                <span
                  className="float-left text-6xl font-black mr-3 leading-none"
                  style={{
                    color: "#f97316",
                    fontFamily: "Georgia, serif",
                    lineHeight: "0.8",
                  }}
                >
                  T
                </span>
                he upcoming project from Shanthi Talkies has officially been
                titled{" "}
                <span className="text-white font-semibold">
                  Kaaviya Kaadhal
                </span>
                , marking the banner's fourth production venture. Featuring
                Bharath and Saanve Megghana, the film promises a fresh
                combination under a romantic premise.
              </p>

              <p>
                Director Hariharasuthan, known for his unique storytelling, has
                envisioned this project as a tribute to classic 90s romance but
                with a modern twist that appeals to the Gen-Z audience. The
                music by{" "}
                <span className="text-white font-medium">Nivas K Prasanna</span>{" "}
                is already creating waves in industry circles.
              </p>

              {/* Pull quote */}
              <blockquote
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
              </blockquote>

              <p>
                Technically, the film is backed by strong names like{" "}
                <span className="text-white font-medium">Theni Eswar</span> for
                cinematography and{" "}
                <span className="text-white font-medium">Ganesh Siva</span> for
                editing. The first look poster, featuring the leads in a vibrant
                setting, has already garnered millions of impressions on social
                media.
              </p>
            </motion.article>

            {/* ── VIDEO CAROUSEL ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <VideoCarousel videos={articleVideos} />
            </motion.div>
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Highlights */}
              <section
                className="p-5 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "0.5px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div
                    style={{
                      width: 3,
                      height: 20,
                      background: "#f97316",
                      borderRadius: 99,
                    }}
                  />
                  <h2 className="text-[13px] font-black text-white uppercase tracking-widest">
                    Highlights
                  </h2>
                </div>

                <div className="space-y-5">
                  {highlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3 cursor-pointer group"
                      style={{
                        paddingBottom: idx < highlights.length - 1 ? 16 : 0,
                        borderBottom:
                          idx < highlights.length - 1
                            ? "0.5px solid rgba(255,255,255,0.05)"
                            : "none",
                      }}
                    >
                      <div
                        className="shrink-0 overflow-hidden rounded-xl"
                        style={{
                          width: 76,
                          height: 58,
                          border: "0.5px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <img
                          src={item.img}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          alt=""
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4
                          className="text-[12px] font-semibold leading-snug line-clamp-2 transition-colors"
                          style={{ color: "rgba(255,255,255,0.75)" }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = "#f97316")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color =
                              "rgba(255,255,255,0.75)")
                          }
                        >
                          {item.title}
                        </h4>
                        <p
                          className="text-[10px] mt-1.5 flex items-center gap-1"
                          style={{ color: "rgba(255,255,255,0.25)" }}
                        >
                          <Clock size={9} /> {item.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Newsletter */}
              <section
                className="p-6 rounded-2xl text-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(109,40,217,0.6), rgba(29,78,216,0.6))",
                  border: "0.5px solid rgba(139,92,246,0.3)",
                }}
              >
                <h3 className="text-[15px] font-black text-white mb-1">
                  Join the Club
                </h3>
                <p className="text-white/60 text-xs mb-5 leading-relaxed">
                  Get the latest movie updates directly in your inbox.
                </p>
                <div className="flex flex-col gap-2.5">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="px-4 py-2.5 rounded-xl text-xs text-white outline-none transition-all"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      border: "0.5px solid rgba(255,255,255,0.2)",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,255,255,0.18)")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,255,255,0.1)")
                    }
                  />
                  <button
                    className="py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                    style={{ background: "#fff", color: "#1a1a2e" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f97316";
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fff";
                      e.currentTarget.style.color = "#1a1a2e";
                    }}
                  >
                    Subscribe
                  </button>
                </div>
              </section>

              {/* Quick Navigation */}
              <section
                className="p-5 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "0.5px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div
                    style={{
                      width: 3,
                      height: 16,
                      background: "#f97316",
                      borderRadius: 99,
                    }}
                  />
                  <p className="text-[11px] font-black text-white uppercase tracking-widest">
                    Quick Navigation
                  </p>
                </div>
                <div className="flex flex-col gap-1.5">
                  {[
                    "Celebrity Gossip",
                    "Box Office Report",
                    "Coming Soon",
                    "VFX Masterclass",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex justify-between items-center px-3 py-2.5 rounded-xl cursor-pointer transition-all group"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "0.5px solid transparent",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.07)";
                        e.currentTarget.style.borderColor =
                          "rgba(255,255,255,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.03)";
                        e.currentTarget.style.borderColor = "transparent";
                      }}
                    >
                      <span
                        className="text-[12px] font-medium"
                        style={{ color: "rgba(255,255,255,0.5)" }}
                      >
                        {item}
                      </span>
                      <ChevronRight
                        size={14}
                        style={{
                          color: "rgba(255,255,255,0.2)",
                          transition: "all 0.2s",
                        }}
                        className="group-hover:text-orange-500 group-hover:translate-x-0.5"
                      />
                    </div>
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
