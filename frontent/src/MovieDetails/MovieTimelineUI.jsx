import { useState, useRef, useEffect, useCallback } from "react";
import { movie } from "./timeLineStaticData";
import {
  CHAR_COLORS,
  CUSTOM_CSS,
  EMOTION_CONFIG,
  ICONS,
  ROLE_BADGE,
  TYPE_CONFIG,
} from "./movieTimelineCss";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtTime = (m) => {
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return h > 0 ? `${h}h ${String(mm).padStart(2, "0")}m` : `${m}m`;
};
const initials = (name) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
const charColor = (id) =>
  CHAR_COLORS[(parseInt(id.replace("c", ""), 10) - 1) % CHAR_COLORS.length];

// ─── Movie Header ─────────────────────────────────────────────────────────────
function MovieHeader() {
  const [showFull, setShowFull] = useState(false);
  const year = new Date(movie.release_date).getFullYear();

  return (
    <div className="relative rounded-2xl overflow-hidden mb-6 border border-zinc-700/40 bg-zinc-900">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-blue-400 to-teal-400" />
      <div className="flex gap-5 p-5">
        <div
          className="w-16 h-24 rounded-xl flex-shrink-0 flex flex-col items-center justify-center border border-purple-700/40"
          style={{ background: "linear-gradient(160deg,#312e81,#1e3a5f)" }}
        >
          <span className="text-base font-black text-white tracking-widest">
            {movie.title.slice(0, 2).toUpperCase()}
          </span>
          <span className="text-[10px] text-purple-300 mt-1">{year}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h1 className="text-xl font-black text-white tracking-tight">
              {movie.title}
            </h1>
            <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border bg-amber-950 text-amber-300 border-amber-700 flex-shrink-0">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              {movie.rating}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
              {movie.industry}
            </span>
            {movie.language.map((l) => (
              <span
                key={l}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-800"
              >
                {l}
              </span>
            ))}
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
              {year}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
              {movie.duration_minutes} min
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {showFull ? movie.plot.full : movie.plot.short}{" "}
            <button
              onClick={() => setShowFull((v) => !v)}
              className="text-purple-400 hover:text-purple-300 text-[10px] font-semibold transition-colors underline underline-offset-2"
            >
              {showFull ? "less" : "more"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function StatsRow() {
  const twists = movie.timelines.filter((t) => t.is_twist).length;
  const avgImp = (
    movie.timelines.reduce((s, t) => s + t.importance_score, 0) /
    movie.timelines.length
  ).toFixed(1);
  const stats = [
    { label: "Scenes", value: movie.timelines.length, color: "text-blue-400" },
    { label: "Twists", value: twists, color: "text-amber-400" },
    { label: "Avg score", value: `${avgImp}/10`, color: "text-purple-400" },
    {
      label: "Runtime",
      value: `${movie.duration_minutes}m`,
      color: "text-teal-400",
    },
  ];
  return (
    <div className="grid grid-cols-4 gap-2 mb-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-xl p-3 bg-zinc-900 border border-zinc-700/40 text-center"
        >
          <p className="text-[10px] text-zinc-500 mb-0.5">{s.label}</p>
          <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Cast ─────────────────────────────────────────────────────────────────────
function CharacterRoster() {
  return (
    <div className="mb-6">
      <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-2">
        Cast
      </p>
      <div className="flex flex-wrap gap-2">
        {movie.characters.map((ch) => {
          const cc = charColor(ch.id);
          const rc = ROLE_BADGE[ch.role] || ROLE_BADGE.Supporting;
          return (
            <div
              key={ch.id}
              className="flex items-center gap-2 bg-zinc-900 border border-zinc-700/40 rounded-xl px-2.5 py-1.5"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 ${cc}`}
              >
                {initials(ch.name)}
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-100 leading-none">
                  {ch.name}
                </p>
                <p className="text-[10px] text-zinc-500 mt-0.5">
                  {ch.actor.name}
                </p>
              </div>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold border ${rc}`}
              >
                {ch.role}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Progress strip ───────────────────────────────────────────────────────────
function ProgressStrip({ activeId }) {
  const sorted = [...movie.timelines].sort(
    (a, b) => a.sequence_order - b.sequence_order,
  );
  return (
    <div className="mb-5">
      <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-1.5">
        Story arc
      </p>
      <div className="flex gap-0.5 h-2 rounded-full overflow-hidden bg-zinc-800">
        {sorted.map((s) => {
          const tc = TYPE_CONFIG[s.type] || TYPE_CONFIG.action;
          const pct = (
            ((s.end_time - s.start_time) / movie.duration_minutes) *
            100
          ).toFixed(1);
          return (
            <div
              key={s.id}
              title={s.title}
              style={{
                flex: pct,
                background: tc.accent,
                opacity: activeId === s.id ? 1 : 0.55,
                transition: "opacity .2s",
              }}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap gap-3 mt-1.5">
        {Object.entries(TYPE_CONFIG).map(([key, val]) => (
          <span
            key={key}
            className="flex items-center gap-1 text-[10px] text-zinc-500"
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: val.accent }}
            />
            {val.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Scene Detail Panel ───────────────────────────────────────────────────────
function SceneDetail({ scene }) {
  if (!scene) return null;
  const tc = TYPE_CONFIG[scene.type] || TYPE_CONFIG.action;
  const ec = EMOTION_CONFIG[scene.emotion_type] || EMOTION_CONFIG.intense;

  return (
    <div
      className="fade-in mt-4 rounded-2xl border border-zinc-700/50 overflow-hidden"
      style={{ background: `${tc.bg}cc` }}
    >
      <div className="h-0.5 w-full" style={{ background: tc.accent }} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <p className="text-xs font-mono text-zinc-500 mb-1">
              {fmtTime(scene.start_time)} – {fmtTime(scene.end_time)}
            </p>
            <h3 className="text-base font-black text-white leading-tight">
              {scene.title}
            </h3>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tc.badgeCls}`}
            >
              {tc.label}
            </span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${ec}`}
            >
              {scene.emotion_type}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {scene.is_twist && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-orange-950 text-orange-300 border-orange-800">
              twist
            </span>
          )}
          {scene.is_climax && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-red-950 text-red-300 border-red-800">
              climax
            </span>
          )}
          {scene.is_flashback && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-amber-950 text-amber-300 border-amber-800">
              flashback
            </span>
          )}
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed mb-3">
          {scene.description}
        </p>

        {scene.famous_dialogue && (
          <div
            className="rounded-xl p-3 bg-zinc-800/70 mb-3 border-l-2"
            style={{ borderLeftColor: tc.accent }}
          >
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
              Famous dialogue
            </p>
            <p className="text-sm text-zinc-200 italic">
              "{scene.famous_dialogue}"
            </p>
          </div>
        )}

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex flex-wrap gap-1.5">
            {scene.characters_involved.map((c) => (
              <span
                key={c.id}
                className={`flex items-center gap-1.5 text-[10px] rounded-full px-2 py-0.5 font-semibold ${charColor(c.id)}`}
              >
                {initials(c.name)} {c.name}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-3 h-3 text-zinc-500 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-[10px] text-zinc-400">
              {scene.location_name}
            </span>
            <div className="w-24 h-1.5 bg-zinc-700 rounded-full overflow-hidden ml-2">
              <div
                className="h-1.5 rounded-full"
                style={{
                  width: `${Math.round((scene.importance_score / 10) * 100)}%`,
                  background: tc.accent,
                }}
              />
            </div>
            <span className="text-[10px] text-zinc-500">
              {scene.importance_score}/10
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Vertical Timeline ──────────────────────────────────────────────────────
function VerticalTimeline({ sorted, activeId, onSelect }) {
  const [selectedScene, setSelectedScene] = useState(null);
  const [modalPosition, setModalPosition] = useState({
    top: 0,
    left: 0,
    placement: "mobile-above",
  });
  const timelineRef = useRef(null);
  const modalRef = useRef(null);

  const handleSceneClick = (scene, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const timelineRect = timelineRef.current.getBoundingClientRect();
    const isMobile = window.innerWidth < 768;
    const popupWidth = isMobile
      ? Math.min(448, timelineRect.width - 16)
      : Math.min(520, Math.max(360, rect.left - 24));
    const centeredLeft = rect.left - timelineRect.left + rect.width / 2;
    const safeLeft = Math.min(
      Math.max(centeredLeft, popupWidth / 2 + 8),
      timelineRect.width - popupWidth / 2 - 8,
    );
    const gap = 12;

    if (selectedScene?.id === scene.id) {
      setSelectedScene(null);
      onSelect(null);
      return;
    }

    setModalPosition({
      top: isMobile
        ? rect.top - timelineRect.top - gap
        : rect.top - timelineRect.top + rect.height / 2,
      left: isMobile ? safeLeft : rect.left - timelineRect.left - gap,
      width: popupWidth,
      placement: isMobile ? "mobile-above" : "desktop-left",
    });
    setSelectedScene(scene);
    onSelect(scene);
  };

  const closeModal = useCallback(() => {
    setSelectedScene(null);
    onSelect(null);
  }, [onSelect]);

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    if (selectedScene) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedScene, closeModal]);

  return (
    <div ref={timelineRef} className="select-none relative">
      {/* vertical line */}
      <div
        className="absolute left-6 top-0 bottom-0 w-0.5"
        style={{
          background:
            "linear-gradient(to bottom,transparent,#3f3f46 5%,#3f3f46 95%,transparent)",
        }}
      />

      {sorted.map((scene) => {
        const tc = TYPE_CONFIG[scene.type] || TYPE_CONFIG.action;
        const isActive = activeId === scene.id;

        return (
          <div
            key={scene.id}
            className="relative flex items-center mb-8 last:mb-0"
          >
            {/* dot on line */}
            <div
              className={`relative z-10 flex items-center justify-center rounded-full border-2 flex-shrink-0 ${isActive ? "pulse-active" : ""}`}
              style={{
                width: 28,
                height: 28,
                background: isActive ? tc.bg : tc.dotBg,
                borderColor: tc.accent,
                color: tc.accent,
                boxShadow: isActive
                  ? `0 0 0 3px #09090b, 0 0 12px ${tc.glow}`
                  : "0 0 0 3px #09090b",
                transition: "all .2s",
                left: 6,
                transform: "translateX(-50%)",
              }}
            >
              <span style={{ transform: "scale(0.75)" }}>
                {ICONS[scene.type] || ICONS.action}
              </span>
            </div>

            {/* card */}
            <div
              className={`scene-card rounded-xl border cursor-pointer overflow-hidden ml-12 ${isActive ? "active border-zinc-500" : "border-zinc-700/40 hover:border-zinc-600"}`}
              style={{
                background: isActive ? `${tc.bg}ee` : "#1c1c1f",
                width: "calc(100% - 3rem)",
                boxShadow: isActive ? `0 0 18px ${tc.glow}` : "none",
              }}
              onClick={(e) => handleSceneClick(scene, e)}
            >
              <div className="h-0.5 w-full" style={{ background: tc.accent }} />
              <div className="p-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span style={{ color: tc.accent }} className="flex-shrink-0">
                    {ICONS[scene.type] || ICONS.action}
                  </span>
                  <p className="text-[10px] font-mono text-zinc-500">
                    {fmtTime(scene.start_time)}
                  </p>
                  {(scene.is_twist || scene.is_climax) && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-orange-950 text-orange-300 border border-orange-800 flex-shrink-0">
                      {scene.is_climax ? "climax" : "twist"}
                    </span>
                  )}
                </div>
                <p className="text-sm font-bold text-zinc-100 leading-tight mb-1">
                  {scene.title}
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                  {scene.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      {/* Modal Popup */}
      {selectedScene && (
        <div
          ref={modalRef}
          className="timeline-popup-scroll absolute z-30 bg-zinc-900 border border-zinc-700/50 rounded-2xl shadow-2xl max-h-96 overflow-y-auto transition-all duration-300 ease-out"
          style={{
            top: `${modalPosition.top}px`,
            left: `${modalPosition.left}px`,
            width: `${modalPosition.width}px`,
            scrollbarWidth: "thin",
            scrollbarColor: "#52525b transparent",
            transform:
              modalPosition.placement === "desktop-left"
                ? "translate(-100%, -50%)"
                : modalPosition.placement === "mobile-above"
                  ? "translate(-50%, -100%)"
                  : "translateX(-50%)",
            opacity: 1,
          }}
        >
          <style>{`
            .timeline-popup-scroll::-webkit-scrollbar {
              width: 4px;
            }
            .timeline-popup-scroll::-webkit-scrollbar-track {
              background: transparent;
            }
            .timeline-popup-scroll::-webkit-scrollbar-thumb {
              background: #52525b;
              border-radius: 999px;
            }
            .timeline-popup-scroll::-webkit-scrollbar-thumb:hover {
              background: #71717a;
            }
          `}</style>
          <SceneDetail scene={selectedScene} />
        </div>
      )}
    </div>
  );
}

// ─── Horizontal Timeline ──────────────────────────────────────────────────────
function HorizontalTimeline({ sorted, activeId, onSelect }) {
  const scrollRef = useRef(null);
  const [scrollPct, setScrollPct] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, scrollLeft: 0 });

  // sync scroll progress for custom scrollbar thumb
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setScrollPct(max > 0 ? el.scrollLeft / max : 0);
  };

  // drag-to-scroll on the custom thumb
  const onThumbMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, scrollLeft: scrollRef.current.scrollLeft });
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e) => {
      const el = scrollRef.current;
      if (!el) return;
      const dx = e.clientX - dragStart.x;
      const ratio =
        (el.scrollWidth - el.clientWidth) /
        (el.parentElement.clientWidth * 0.8);
      el.scrollLeft = dragStart.scrollLeft + dx * ratio;
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDragging, dragStart]);

  // scroll active card into view
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !activeId) return;
    const card = el.querySelector(`[data-id="${activeId}"]`);
    if (card)
      card.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
  }, [activeId]);

  return (
    <div className="select-none">
      {/* scrollable area */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="ht-scroll overflow-x-auto overflow-y-visible pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* hide native scrollbar, use custom below */}
        <style>{`.ht-scroll::-webkit-scrollbar{display:none}`}</style>

        <div
          className="relative flex items-center"
          style={{
            minWidth: "max-content",
            paddingBottom: "16px",
            paddingTop: "16px",
          }}
        >
          {/* horizontal line */}
          <div
            className="absolute left-0 right-0"
            style={{
              top: "calc(50% + 10px)",
              height: "2px",
              background:
                "linear-gradient(90deg,transparent,#3f3f46 5%,#3f3f46 95%,transparent)",
            }}
          />

          {sorted.map((scene, idx) => {
            const tc = TYPE_CONFIG[scene.type] || TYPE_CONFIG.action;
            const isActive = activeId === scene.id;
            const isEven = idx % 2 === 0;

            return (
              <div
                key={scene.id}
                data-id={scene.id}
                className="relative flex flex-col items-center mx-2 first:ml-4 last:mr-4"
                style={{ width: 140 }}
              >
                {/* card — alternates above/below line */}
                <div
                  className={`scene-card w-full rounded-xl border cursor-pointer overflow-hidden ${isActive ? "active border-zinc-500" : "border-zinc-700/40 hover:border-zinc-600"}`}
                  style={{
                    background: isActive ? `${tc.bg}ee` : "#1c1c1f",
                    order: isEven ? 1 : 3,
                    marginBottom: isEven ? "8px" : 0,
                    marginTop: isEven ? 0 : "8px",
                    boxShadow: isActive ? `0 0 18px ${tc.glow}` : "none",
                  }}
                  onClick={() => onSelect(scene)}
                >
                  <div
                    className="h-0.5 w-full"
                    style={{ background: tc.accent }}
                  />
                  <div className="p-2.5">
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span
                        style={{ color: tc.accent }}
                        className="flex-shrink-0"
                      >
                        {ICONS[scene.type] || ICONS.action}
                      </span>
                      {(scene.is_twist || scene.is_climax) && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-orange-950 text-orange-300 border border-orange-800 flex-shrink-0">
                          {scene.is_climax ? "climax" : "twist"}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-bold text-zinc-100 leading-tight mb-1 line-clamp-2">
                      {scene.title}
                    </p>
                    <p className="text-[10px] font-mono text-zinc-500">
                      {fmtTime(scene.start_time)}
                    </p>
                  </div>
                </div>

                {/* dot on line */}
                <div
                  className={`relative z-10 flex items-center justify-center rounded-full border-2 flex-shrink-0 ${isActive ? "pulse-active" : ""}`}
                  style={{
                    order: 2,
                    width: 28,
                    height: 28,
                    background: isActive ? tc.bg : tc.dotBg,
                    borderColor: tc.accent,
                    color: tc.accent,
                    boxShadow: isActive
                      ? `0 0 0 3px #09090b, 0 0 12px ${tc.glow}`
                      : "0 0 0 3px #09090b",
                    transition: "all .2s",
                  }}
                >
                  <span style={{ transform: "scale(0.75)" }}>
                    {ICONS[scene.type] || ICONS.action}
                  </span>
                </div>

                {/* sequence number */}
                <span
                  className="text-[9px] font-black text-zinc-600 mt-1"
                  style={{ order: isEven ? 4 : 0 }}
                >
                  {String(scene.sequence_order).padStart(2, "0")}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* custom scrollbar */}
      <div className="relative mt-1 mx-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="absolute top-0 h-full rounded-full scrollbar-thumb-track transition-colors"
          style={{
            width: "20%",
            left: `${scrollPct * 80}%`,
            background: isDragging ? "#a78bfa" : "#52525b",
            cursor: isDragging ? "grabbing" : "grab",
            transition: isDragging ? "none" : "left .05s, background .2s",
          }}
          onMouseDown={onThumbMouseDown}
        />
      </div>
      <p className="text-center text-[10px] text-zinc-600 mt-1.5">
        scroll to view · click a card to expand
      </p>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function MovieTimeline({ movie: propMovie }) {
  const [activeScene, setActiveScene] = useState(null);

  // Use prop timelines if available, else static
  const timelineData =
    propMovie && propMovie.timelines && propMovie.timelines.length > 0
      ? propMovie.timelines
      : movie.timelines;

  // Guard: if no timeline data
  if (!timelineData || timelineData.length === 0) {
    return (
      <div className="text-zinc-500 text-sm text-center py-4">
        No timeline data available
      </div>
    );
  }

  const sorted = [...timelineData].sort(
    (a, b) => a.sequence_order - b.sequence_order,
  );

  const handleSelect = (scene) => {
    if (!scene) {
      setActiveScene(null);
      return;
    }

    setActiveScene((prev) => (prev?.id === scene.id ? null : scene));
  };

  return (
    <>
      <style>{CUSTOM_CSS}</style>
      <div className="text-zinc-100 ">
        <ProgressStrip activeId={activeScene?.id} />

        <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-3">
          Scene timeline
        </p>

        <div className="bg-zinc-900 border border-zinc-700/40 rounded-2xl p-4">
          <VerticalTimeline
            sorted={sorted}
            activeId={activeScene?.id}
            onSelect={handleSelect}
          />
        </div>
      </div>
    </>
  );
}
