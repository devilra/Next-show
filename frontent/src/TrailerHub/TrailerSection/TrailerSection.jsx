import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  FaFire,
  FaPlay,
  FaEye,
  FaHeart,
  FaCalendarAlt,
  FaBell,
  FaClock,
  FaChartBar,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

// ─── Mock Data ────────────────────────────────────────────────
const MEDIA_TYPE_CONFIG = {
  GLIMPSE: { label: "Glimpse", color: "#a78bfa", bg: "rgba(167,139,250,0.15)" },
  TEASER: { label: "Teaser", color: "#38bdf8", bg: "rgba(56,189,248,0.15)" },
  TEASER_2: {
    label: "Teaser 2",
    color: "#34d399",
    bg: "rgba(52,211,153,0.15)",
  },
  TRAILER: { label: "Trailer", color: "#ff7a00", bg: "rgba(255,122,0,0.15)" },
  TRAILER_2: {
    label: "Trailer 2",
    color: "#fb923c",
    bg: "rgba(251,146,60,0.15)",
  },
  FINAL_TRAILER: {
    label: "Final Trailer",
    color: "#f43f5e",
    bg: "rgba(244,63,94,0.15)",
  },
};

const MOCK_VIDEOS = [
  // January
  {
    id: 1,
    month: 1,
    title: "Ego Raman — Glimpse",
    type: "GLIMPSE",
    views: "320K",
    likes: "12K",
    date: "Jan 05, 2026",
    duration: "1:42",
    thumb: "#1a0533",
    year: 2026,
  },
  {
    id: 2,
    month: 1,
    title: "Ego Raman — Teaser",
    type: "TEASER",
    views: "1.2M",
    likes: "45K",
    date: "Jan 18, 2026",
    duration: "1:58",
    thumb: "#0d1a3a",
    year: 2026,
  },
  // February
  {
    id: 3,
    month: 2,
    title: "Patriot — Glimpse",
    type: "GLIMPSE",
    views: "500K",
    likes: "21K",
    date: "Feb 02, 2026",
    duration: "1:30",
    thumb: "#1a0d0d",
    year: 2026,
  },
  {
    id: 4,
    month: 2,
    title: "Patriot — Teaser",
    type: "TEASER",
    views: "2.1M",
    likes: "88K",
    date: "Feb 14, 2026",
    duration: "2:05",
    thumb: "#0d2233",
    year: 2026,
  },
  {
    id: 5,
    month: 2,
    title: "Patriot — Teaser 2",
    type: "TEASER_2",
    views: "1.8M",
    likes: "74K",
    date: "Feb 22, 2026",
    duration: "2:11",
    thumb: "#1a1a0a",
    year: 2026,
  },
  // March
  {
    id: 6,
    month: 3,
    title: "Parimala and Co — Glimpse",
    type: "GLIMPSE",
    views: "280K",
    likes: "10K",
    date: "Mar 08, 2026",
    duration: "1:25",
    thumb: "#0a1a1a",
    year: 2026,
  },
  {
    id: 7,
    month: 3,
    title: "Parimala and Co — Teaser",
    type: "TEASER",
    views: "950K",
    likes: "38K",
    date: "Mar 20, 2026",
    duration: "1:55",
    thumb: "#1a000d",
    year: 2026,
  },
  // April
  {
    id: 8,
    month: 4,
    title: "Double Occupancy — Teaser",
    type: "TEASER",
    views: "1.1M",
    likes: "42K",
    date: "Apr 04, 2026",
    duration: "2:00",
    thumb: "#001a0a",
    year: 2026,
  },
  {
    id: 9,
    month: 4,
    title: "Double Occupancy — Trailer",
    type: "TRAILER",
    views: "3.4M",
    likes: "130K",
    date: "Apr 20, 2026",
    duration: "2:35",
    thumb: "#1a1000",
    year: 2026,
  },
  // May
  {
    id: 10,
    month: 5,
    title: "Habeebi — Glimpse",
    type: "GLIMPSE",
    views: "450K",
    likes: "18K",
    date: "May 02, 2026",
    duration: "1:32",
    thumb: "#0d0033",
    year: 2026,
  },
  {
    id: 11,
    month: 5,
    title: "Habeebi — Teaser",
    type: "TEASER",
    views: "1.9M",
    likes: "80K",
    date: "May 10, 2026",
    duration: "2:10",
    thumb: "#001a1a",
    year: 2026,
  },
  {
    id: 12,
    month: 5,
    title: "Habeebi — Teaser 2",
    type: "TEASER_2",
    views: "2.2M",
    likes: "95K",
    date: "May 18, 2026",
    duration: "2:20",
    thumb: "#1a0a00",
    year: 2026,
  },
  {
    id: 13,
    month: 5,
    title: "Habeebi — Trailer",
    type: "TRAILER",
    views: "4.8M",
    likes: "210K",
    date: "May 26, 2026",
    duration: "2:48",
    thumb: "#000d1a",
    year: 2026,
  },
  // June
  {
    id: 14,
    month: 6,
    title: "Peddi — Glimpse",
    type: "GLIMPSE",
    views: "600K",
    likes: "25K",
    date: "Jun 01, 2026",
    duration: "1:45",
    thumb: "#0d1a00",
    year: 2026,
  },
  {
    id: 15,
    month: 6,
    title: "Peddi — Teaser",
    type: "TEASER",
    views: "2.8M",
    likes: "115K",
    date: "Jun 02, 2026",
    duration: "2:15",
    thumb: "#1a0d1a",
    year: 2026,
  },
  {
    id: 16,
    month: 6,
    title: "Peddi — Trailer",
    type: "TRAILER",
    views: "8.2M",
    likes: "412K",
    date: "Jun 04, 2026",
    duration: "3:02",
    thumb: "#001a33",
    year: 2026,
  },
  {
    id: 17,
    month: 6,
    title: "Peddi — Trailer 2",
    type: "TRAILER_2",
    views: "5.1M",
    likes: "230K",
    date: "Jun 05, 2026",
    duration: "2:58",
    thumb: "#1a1a00",
    year: 2026,
  },
  {
    id: 18,
    month: 6,
    title: "Peddi — Final Trailer",
    type: "FINAL_TRAILER",
    views: "6.3M",
    likes: "310K",
    date: "Jun 06, 2026",
    duration: "3:15",
    thumb: "#330000",
    year: 2026,
  },
];

const UPCOMING = [
  {
    id: 1,
    movie: "Habeebi",
    type: "FINAL_TRAILER",
    releaseDate: new Date("2026-06-12T06:00:00+05:30"),
  },
  {
    id: 2,
    movie: "Double Occupancy",
    type: "TRAILER_2",
    releaseDate: new Date("2026-06-15T06:00:00+05:30"),
  },
  {
    id: 3,
    movie: "Parimala and Co",
    type: "FINAL_TRAILER",
    releaseDate: new Date("2026-06-20T06:00:00+05:30"),
  },
];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const TYPE_FILTERS = ["All", "GLIMPSE", "TEASER", "TRAILER", "FINAL_TRAILER"];

// ─── Helpers ──────────────────────────────────────────────────
function formatCountdown(target) {
  const diff = target - Date.now();
  if (diff <= 0) return { d: "00", h: "00", m: "00", s: "00" };
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const p = (n) => String(n).padStart(2, "0");
  return { d: p(d), h: p(h), m: p(m), s: p(s) };
}

// ─── Sub-components ───────────────────────────────────────────

function MediaBadge({ type, size = "sm" }) {
  const cfg = MEDIA_TYPE_CONFIG[type] || MEDIA_TYPE_CONFIG.TRAILER;
  return (
    <span
      style={{
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.color}40`,
        fontSize: size === "sm" ? "10px" : "12px",
        padding: size === "sm" ? "2px 8px" : "4px 12px",
        borderRadius: "20px",
        fontWeight: 600,
        letterSpacing: "0.5px",
        whiteSpace: "nowrap",
      }}
    >
      {cfg.label}
    </span>
  );
}

function StatChip({ icon, value }) {
  return (
    <span className="flex items-center gap-1 text-gray-400 text-xs">
      {icon} {value}
    </span>
  );
}

function AnimatedCounter({ target }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / 40);
    const t = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(t);
      } else setCount(start);
    }, 30);
    return () => clearInterval(t);
  }, [inView, target]);
  return <span ref={ref}>{count}</span>;
}

// ─── Countdown Timer ──────────────────────────────────────────
function CountdownTimer({ releaseDate }) {
  const [time, setTime] = useState(formatCountdown(releaseDate));
  useEffect(() => {
    const t = setInterval(() => setTime(formatCountdown(releaseDate)), 1000);
    return () => clearInterval(t);
  }, [releaseDate]);
  const box = (val, lbl) => (
    <div className="flex flex-col items-center">
      <div
        style={{
          background: "rgba(255,122,0,0.12)",
          border: "1px solid rgba(255,122,0,0.3)",
          color: "#ff7a00",
          fontWeight: 700,
          fontSize: "18px",
          width: "44px",
          height: "44px",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {val}
      </div>
      <span className="text-gray-500 text-[9px] mt-1 uppercase tracking-wider">
        {lbl}
      </span>
    </div>
  );
  return (
    <div className="flex gap-2 items-end">
      {box(time.d, "Days")}{" "}
      <span className="text-orange-500 font-bold mb-3">:</span>
      {box(time.h, "Hrs")}{" "}
      <span className="text-orange-500 font-bold mb-3">:</span>
      {box(time.m, "Min")}{" "}
      <span className="text-orange-500 font-bold mb-3">:</span>
      {box(time.s, "Sec")}
    </div>
  );
}

// ─── Video Card ───────────────────────────────────────────────
function VideoCard({ video, featured = false, onClick }) {
  const [liked, setLiked] = useState(false);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      onClick={() => onClick(video)}
      className="group cursor-pointer relative flex flex-col"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "14px",
        overflow: "hidden",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Thumbnail */}
      <div
        className="relative overflow-hidden"
        style={{
          height: featured ? "200px" : "150px",
          background: `linear-gradient(135deg, ${video.thumb} 0%, #111 100%)`,
        }}
      >
        {/* Glow on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,122,0,0.18) 0%, transparent 70%)",
          }}
        />
        {/* Play */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(255,122,0,0.9)",
              boxShadow: "0 0 24px rgba(255,122,0,0.5)",
            }}
          >
            <FaPlay className="text-white text-sm ml-1" />
          </motion.div>
        </motion.div>
        {/* Duration badge */}
        <div
          className="absolute bottom-2 right-2 text-[10px] text-white px-1.5 py-0.5 rounded"
          style={{ background: "rgba(0,0,0,0.7)" }}
        >
          {video.duration}
        </div>
        {/* Type badge top-left */}
        <div className="absolute top-2 left-2">
          <MediaBadge type={video.type} />
        </div>
        {/* Gradient overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 h-12"
          style={{
            background:
              "linear-gradient(0deg,rgba(0,0,0,0.7) 0%,transparent 100%)",
          }}
        />
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <p className="text-white text-sm font-medium leading-snug line-clamp-2">
          {video.title}
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <StatChip icon={<FaEye className="text-xs" />} value={video.views} />
          <StatChip
            icon={<FaCalendarAlt className="text-xs" />}
            value={video.date}
          />
        </div>
        <div className="flex items-center justify-between mt-auto pt-1">
          <StatChip
            icon={<FaClock className="text-xs" />}
            value={video.duration}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLiked(!liked);
            }}
            className="flex items-center gap-1 text-xs transition-all"
            style={{ color: liked ? "#ff7a00" : "rgba(255,255,255,0.4)" }}
          >
            <FaHeart style={{ fontSize: "11px" }} /> {video.likes}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Timeline ─────────────────────────────────────────────────
function RelaseTimeline({ videos }) {
  const sorted = [...videos].sort((a, b) => {
    const order = Object.keys(MEDIA_TYPE_CONFIG);
    return order.indexOf(a.type) - order.indexOf(b.type);
  });
  return (
    <div className="relative overflow-x-auto pb-2">
      <div className="flex items-start gap-0 min-w-max px-1">
        {sorted.map((v, i) => {
          const cfg = MEDIA_TYPE_CONFIG[v.type];
          return (
            <div key={v.id} className="flex items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col items-center"
                style={{ width: "120px" }}
              >
                {/* Node */}
                <div
                  className="w-3 h-3 rounded-full mb-2 relative"
                  style={{
                    background: cfg.color,
                    boxShadow: `0 0 10px ${cfg.color}80`,
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{ background: cfg.color, opacity: 0.3 }}
                  />
                </div>
                {/* Card */}
                <div
                  className="p-2.5 rounded-xl text-center"
                  style={{
                    background: cfg.bg,
                    border: `1px solid ${cfg.color}35`,
                    width: "110px",
                  }}
                >
                  <span
                    style={{
                      color: cfg.color,
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.5px",
                    }}
                  >
                    {cfg.label.toUpperCase()}
                  </span>
                  <p className="text-white text-xs mt-1 font-medium leading-snug line-clamp-2">
                    {v.title.split(" — ")[0]}
                  </p>
                  <p className="text-gray-400 text-[10px] mt-1">{v.date}</p>
                  <p className="text-gray-500 text-[10px]">{v.views} views</p>
                </div>
              </motion.div>
              {/* Connector line */}
              {i < sorted.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: i * 0.08 + 0.1, duration: 0.3 }}
                  className="h-px w-8 origin-left"
                  style={{
                    background: `linear-gradient(90deg, ${cfg.color}60, ${MEDIA_TYPE_CONFIG[sorted[i + 1]?.type]?.color || "#ff7a00"}60)`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Featured Hero ────────────────────────────────────────────
function FeaturedHero({ video, onClick }) {
  if (!video) return null;
  const cfg = MEDIA_TYPE_CONFIG[video.type];
  return (
    <motion.div
      key={video.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => onClick(video)}
      className="relative cursor-pointer overflow-hidden"
      style={{
        borderRadius: "18px",
        minHeight: "380px",
        background: `linear-gradient(135deg, ${video.thumb} 0%, #0a0a0f 100%)`,
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 60%, rgba(255,122,0,0.12) 0%, transparent 65%), radial-gradient(ellipse at 75% 25%, rgba(167,139,250,0.08) 0%, transparent 55%)",
        }}
      />
      {/* Film grain */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg,rgba(0,0,0,0.92) 0%,rgba(0,0,0,0.35) 45%,transparent 100%)",
        }}
      />

      {/* Top badges */}
      <div className="absolute top-4 left-4 flex gap-2 items-center">
        <motion.div
          animate={{ opacity: [1, 0.6, 1] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-semibold"
          style={{ background: "#ff7a00" }}
        >
          <FaFire className="text-xs" /> Trending
        </motion.div>
        <MediaBadge type={video.type} size="md" />
      </div>

      {/* Center play */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(255,122,0,0.88)",
            boxShadow:
              "0 0 0 14px rgba(255,122,0,0.15), 0 0 40px rgba(255,122,0,0.4)",
          }}
        >
          <FaPlay className="text-white text-xl ml-1" />
        </motion.div>
        <span className="text-white text-xs font-semibold uppercase tracking-widest opacity-80">
          Play Trailer
        </span>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h2 className="text-white text-2xl font-bold mb-2 leading-tight">
          {video.title}
        </h2>
        <div className="flex flex-wrap gap-4 mb-4">
          <StatChip icon={<FaEye />} value={`${video.views} views`} />
          <StatChip icon={<FaHeart />} value={`${video.likes} likes`} />
          <StatChip icon={<FaCalendarAlt />} value={video.date} />
          <StatChip icon={<FaClock />} value={video.duration} />
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-lg"
          style={{
            background: "linear-gradient(135deg,#ff7a00,#ff4500)",
            boxShadow: "0 4px 20px rgba(255,122,0,0.4)",
          }}
        >
          <FaPlay className="text-xs" /> Watch Trailer
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Trending Sidebar ─────────────────────────────────────────
function TrendingSidebar({ videos }) {
  const sorted = [...videos]
    .sort((a, b) => parseFloat(b.views) - parseFloat(a.views))
    .slice(0, 5);
  return (
    <div>
      <h3 className="text-white text-sm font-bold mb-3 flex items-center gap-2">
        <FaChartBar style={{ color: "#ff7a00" }} /> Trending This Month
      </h3>
      <div className="flex flex-col gap-2">
        {sorted.map((v, i) => {
          const cfg = MEDIA_TYPE_CONFIG[v.type];
          return (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex gap-3 items-center p-2.5 rounded-xl cursor-pointer group"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
              whileHover={{
                background: "rgba(255,122,0,0.07)",
                borderColor: "rgba(255,122,0,0.3)",
              }}
            >
              {/* Rank */}
              <div
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: i === 0 ? "#ff7a00" : "rgba(255,255,255,0.08)",
                  color: i === 0 ? "#fff" : "rgba(255,255,255,0.5)",
                }}
              >
                {i + 1}
              </div>
              {/* Thumb */}
              <div
                className="w-12 h-9 rounded-lg flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg,${v.thumb},#111)`,
                }}
              />
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium truncate">
                  {v.title}
                </p>
                <div className="flex gap-2 mt-0.5">
                  <span className="text-gray-500 text-[10px] flex items-center gap-0.5">
                    <FaEye className="text-[9px]" />
                    {v.views}
                  </span>
                  <MediaBadge type={v.type} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Month Stats ──────────────────────────────────────────────
function MonthStats({ videos }) {
  const counts = {
    total: videos.length,
    trailers: videos.filter((v) => v.type.includes("TRAILER")).length,
    teasers: videos.filter((v) => v.type.includes("TEASER")).length,
    glimpses: videos.filter((v) => v.type === "GLIMPSE").length,
    final: videos.filter((v) => v.type === "FINAL_TRAILER").length,
  };
  const stats = [
    { label: "Total", value: counts.total, color: "#ff7a00" },
    { label: "Trailers", value: counts.trailers, color: "#fb923c" },
    { label: "Teasers", value: counts.teasers, color: "#38bdf8" },
    { label: "Glimpses", value: counts.glimpses, color: "#a78bfa" },
    { label: "Final", value: counts.final, color: "#f43f5e" },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map((s) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl p-4 text-center"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${s.color}25`,
          }}
        >
          <div className="text-2xl font-bold mb-1" style={{ color: s.color }}>
            <AnimatedCounter target={s.value} />
          </div>
          <div className="text-gray-400 text-xs uppercase tracking-wider">
            {s.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Upcoming Card ────────────────────────────────────────────
function UpcomingCard({ item }) {
  const [notified, setNotified] = useState(false);
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-white text-sm font-semibold">{item.movie}</p>
          <div className="mt-1">
            <MediaBadge type={item.type} />
          </div>
        </div>
        <HiSparkles
          style={{ color: "#ff7a00", fontSize: "18px", flexShrink: 0 }}
        />
      </div>
      <CountdownTimer releaseDate={item.releaseDate} />
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setNotified(!notified)}
        className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-xs font-semibold transition-all"
        style={{
          background: notified ? "rgba(255,122,0,0.2)" : "rgba(255,122,0,0.1)",
          border: `1px solid ${notified ? "#ff7a00" : "rgba(255,122,0,0.3)"}`,
          color: notified ? "#ff7a00" : "rgba(255,255,255,0.7)",
        }}
      >
        <FaBell className="text-xs" />
        {notified ? "Notified ✓" : "Notify Me"}
      </motion.button>
    </div>
  );
}

// ─── Play Modal ───────────────────────────────────────────────
function PlayModal({ video, onClose }) {
  if (!video) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl rounded-2xl overflow-hidden"
          style={{
            background: "#0a0a0f",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {/* Video area */}
          <div
            className="w-full flex items-center justify-center relative"
            style={{
              height: "300px",
              background: `linear-gradient(135deg, ${video.thumb} 0%, #111 100%)`,
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(255,122,0,0.9)",
                boxShadow: "0 0 40px rgba(255,122,0,0.5)",
              }}
            >
              <FaPlay className="text-white text-xl ml-1" />
            </motion.div>
            <div className="absolute top-4 right-4">
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(0,0,0,0.6)",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                <FaTimes className="text-xs" />
              </button>
            </div>
          </div>
          {/* Info */}
          <div className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <MediaBadge type={video.type} size="md" />
            </div>
            <h3 className="text-white text-lg font-bold mb-2">{video.title}</h3>
            <div className="flex flex-wrap gap-4">
              <StatChip icon={<FaEye />} value={`${video.views} views`} />
              <StatChip icon={<FaHeart />} value={`${video.likes} likes`} />
              <StatChip icon={<FaCalendarAlt />} value={video.date} />
              <StatChip icon={<FaClock />} value={video.duration} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function TrailerSection() {
  const currentMonth = new Date().getMonth() + 1;
  const [activeMonth, setActiveMonth] = useState(currentMonth);
  const [activeType, setActiveType] = useState("All");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const monthSwiperRef = useRef(null);

  const monthVideos = MOCK_VIDEOS.filter((v) => v.month === activeMonth);
  const filteredVideos =
    activeType === "All"
      ? monthVideos
      : monthVideos.filter((v) => {
          if (activeType === "TEASER")
            return v.type === "TEASER" || v.type === "TEASER_2";
          if (activeType === "TRAILER")
            return v.type === "TRAILER" || v.type === "TRAILER_2";
          return v.type === activeType;
        });

  const featuredVideo = [...monthVideos].sort(
    (a, b) => parseFloat(b.views) - parseFloat(a.views),
  )[0];

  return (
    <div
      style={{
        background: "#070709",
        minHeight: "100vh",
        color: "#fff",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <PlayModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-1">
            <FaFire style={{ color: "#ff7a00", fontSize: "22px" }} />
            <h1
              className="text-white font-bold"
              style={{ fontSize: "clamp(22px,4vw,32px)" }}
            >
              Trailer Hub
            </h1>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full ml-1"
              style={{
                background: "rgba(255,122,0,0.15)",
                color: "#ff7a00",
                border: "1px solid rgba(255,122,0,0.3)",
              }}
            >
              BETA
            </span>
          </div>
          <p className="text-gray-400 text-sm">
            Watch every promotional video released before the movie hits
            theaters.
          </p>
        </motion.div>

        {/* ── Month Filter ── */}
        <div className="mb-5 relative">
          <Swiper
            modules={[FreeMode, Navigation]}
            freeMode
            slidesPerView="auto"
            spaceBetween={8}
            onSwiper={(swiper) => {
              monthSwiperRef.current = swiper;
              const idx = activeMonth - 1;
              setTimeout(() => swiper.slideTo(Math.max(0, idx - 2), 400), 100);
            }}
            className="!px-1 !py-1"
          >
            {MONTHS.map((m, i) => {
              const hasContent = MOCK_VIDEOS.some((v) => v.month === i + 1);
              const isActive = activeMonth === i + 1;
              return (
                <SwiperSlide key={m} style={{ width: "auto" }}>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setActiveMonth(i + 1);
                      setActiveType("All");
                      monthSwiperRef.current?.slideTo(Math.max(0, i - 2), 400);
                    }}
                    className="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all relative"
                    style={{
                      background: isActive
                        ? "linear-gradient(135deg,#ff7a00,#ff4500)"
                        : hasContent
                          ? "rgba(255,255,255,0.06)"
                          : "rgba(255,255,255,0.02)",
                      color: isActive
                        ? "#fff"
                        : hasContent
                          ? "rgba(255,255,255,0.7)"
                          : "rgba(255,255,255,0.25)",
                      border: isActive
                        ? "none"
                        : "1px solid rgba(255,255,255,0.08)",
                      boxShadow: isActive
                        ? "0 0 20px rgba(255,122,0,0.4)"
                        : "none",
                    }}
                  >
                    {m}
                    {hasContent && !isActive && (
                      <span
                        className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full"
                        style={{
                          background: "#ff7a00",
                          transform: "translate(25%,-25%)",
                        }}
                      />
                    )}
                  </motion.button>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* ── Type Filter ── */}
        <div className="flex gap-2 flex-wrap mb-7">
          {TYPE_FILTERS.map((t) => {
            const isActive = activeType === t;
            const cfg = t !== "All" ? MEDIA_TYPE_CONFIG[t] : null;
            return (
              <motion.button
                key={t}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveType(t)}
                className="relative px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: isActive
                    ? cfg
                      ? cfg.bg
                      : "rgba(255,122,0,0.15)"
                    : "rgba(255,255,255,0.04)",
                  color: isActive
                    ? cfg
                      ? cfg.color
                      : "#ff7a00"
                    : "rgba(255,255,255,0.5)",
                  border: isActive
                    ? `1px solid ${cfg ? cfg.color : "#ff7a00"}50`
                    : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: isActive
                    ? `0 0 16px ${cfg ? cfg.color : "#ff7a00"}30`
                    : "none",
                }}
              >
                {t === "All" ? "All" : (MEDIA_TYPE_CONFIG[t]?.label ?? t)}
                {isActive && (
                  <motion.div
                    layoutId="typeUnderline"
                    className="absolute -bottom-0.5 left-2 right-2 h-0.5 rounded-full"
                    style={{ background: cfg ? cfg.color : "#ff7a00" }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* ── Main Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          {/* Left */}
          <div className="flex flex-col gap-8">
            {/* Featured */}
            {monthVideos.length > 0 ? (
              <AnimatePresence mode="wait">
                <FeaturedHero
                  key={featuredVideo?.id}
                  video={featuredVideo}
                  onClick={setSelectedVideo}
                />
              </AnimatePresence>
            ) : (
              <div
                className="rounded-2xl flex items-center justify-center text-gray-500 text-sm"
                style={{
                  minHeight: "300px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                No releases this month yet.
              </div>
            )}

            {/* Timeline */}
            {monthVideos.length > 1 && (
              <div>
                <h3 className="text-white text-sm font-bold mb-4 flex items-center gap-2">
                  <span
                    style={{
                      width: "3px",
                      height: "14px",
                      background: "#ff7a00",
                      borderRadius: "2px",
                      display: "inline-block",
                    }}
                  />
                  Release Timeline
                </h3>
                <RelaseTimeline videos={monthVideos} />
              </div>
            )}

            {/* Month Stats */}
            {monthVideos.length > 0 && (
              <div>
                <h3 className="text-white text-sm font-bold mb-4 flex items-center gap-2">
                  <span
                    style={{
                      width: "3px",
                      height: "14px",
                      background: "#ff7a00",
                      borderRadius: "2px",
                      display: "inline-block",
                    }}
                  />
                  Month Stats
                </h3>
                <MonthStats videos={monthVideos} />
              </div>
            )}

            {/* Video Grid */}
            <div>
              <h3 className="text-white text-sm font-bold mb-4 flex items-center gap-2">
                <span
                  style={{
                    width: "3px",
                    height: "14px",
                    background: "#ff7a00",
                    borderRadius: "2px",
                    display: "inline-block",
                  }}
                />
                All Videos{" "}
                {filteredVideos.length > 0 && (
                  <span
                    style={{ color: "rgba(255,255,255,0.35)", fontWeight: 400 }}
                  >
                    ({filteredVideos.length})
                  </span>
                )}
              </h3>
              {filteredVideos.length > 0 ? (
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredVideos.map((v) => (
                      <VideoCard
                        key={v.id}
                        video={v}
                        onClick={setSelectedVideo}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <div
                  className="rounded-xl p-8 text-center text-gray-500 text-sm"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  No{" "}
                  {activeType !== "All"
                    ? MEDIA_TYPE_CONFIG[activeType]?.label
                    : ""}{" "}
                  videos this month.
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Trending */}
            {monthVideos.length > 0 && (
              <div
                className="rounded-2xl p-4"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <TrendingSidebar videos={monthVideos} />
              </div>
            )}

            {/* Upcoming */}
            <div>
              <h3 className="text-white text-sm font-bold mb-3 flex items-center gap-2">
                <FaClock style={{ color: "#ff7a00" }} /> Upcoming Releases
              </h3>
              <div className="flex flex-col gap-3">
                {UPCOMING.map((u) => (
                  <UpcomingCard key={u.id} item={u} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
