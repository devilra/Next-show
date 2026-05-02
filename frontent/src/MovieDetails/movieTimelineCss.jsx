export const TYPE_CONFIG = {
  action: {
    bg: "#1e3a5f",
    accent: "#60a5fa",
    glow: "rgba(96,165,250,0.25)",
    badgeCls: "bg-blue-950 text-blue-300 border-blue-800",
    label: "Action",
    dotBg: "#0c2a47",
  },
  drama: {
    bg: "#2d1b4e",
    accent: "#a78bfa",
    glow: "rgba(167,139,250,0.25)",
    badgeCls: "bg-purple-950 text-purple-300 border-purple-800",
    label: "Drama",
    dotBg: "#1e1035",
  },
  romance: {
    bg: "#4a1535",
    accent: "#f472b6",
    glow: "rgba(244,114,182,0.25)",
    badgeCls: "bg-pink-950 text-pink-300 border-pink-800",
    label: "Romance",
    dotBg: "#350d26",
  },
  flashback: {
    bg: "#3d2a0a",
    accent: "#fbbf24",
    glow: "rgba(251,191,36,0.25)",
    badgeCls: "bg-amber-950 text-amber-300 border-amber-800",
    label: "Flashback",
    dotBg: "#2a1c04",
  },
  climax: {
    bg: "#4a1010",
    accent: "#f87171",
    glow: "rgba(248,113,113,0.3)",
    badgeCls: "bg-red-950 text-red-300 border-red-800",
    label: "Climax",
    dotBg: "#350808",
  },
  comedy: {
    bg: "#1a3320",
    accent: "#4ade80",
    glow: "rgba(74,222,128,0.2)",
    badgeCls: "bg-green-950 text-green-300 border-green-800",
    label: "Comedy",
    dotBg: "#0f2215",
  },
};

export const EMOTION_CONFIG = {
  intense: "bg-red-950 text-red-300 border-red-800",
  romantic: "bg-pink-950 text-pink-300 border-pink-800",
  nostalgic: "bg-amber-950 text-amber-300 border-amber-800",
  sad: "bg-purple-950 text-purple-300 border-purple-800",
  happy: "bg-green-950 text-green-300 border-green-800",
  tense: "bg-blue-950 text-blue-300 border-blue-800",
  humorous: "bg-lime-950 text-lime-300 border-lime-800",
};

export const CHAR_COLORS = [
  "bg-blue-800 text-blue-100",
  "bg-teal-800 text-teal-100",
  "bg-green-800 text-green-100",
  "bg-orange-800 text-orange-100",
  "bg-amber-800 text-amber-100",
  "bg-purple-800 text-purple-100",
  "bg-pink-800 text-pink-100",
];

export const ROLE_BADGE = {
  Protagonist: "bg-teal-900 text-teal-200 border-teal-700",
  Antagonist: "bg-red-900 text-red-200 border-red-700",
  Supporting: "bg-zinc-800 text-zinc-300 border-zinc-600",
};

// ─── Icons ────────────────────────────────────────────────────────────────────
export const ICONS = {
  action: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  drama: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
    </svg>
  ),
  flashback: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
    </svg>
  ),
  climax: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z" />
    </svg>
  ),
  comedy: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
    </svg>
  ),
  romance: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  ),
};

// ─── Custom CSS injected once ─────────────────────────────────────────────────
export const CUSTOM_CSS = `
  .ht-scroll::-webkit-scrollbar { height: 6px; }
  .ht-scroll::-webkit-scrollbar-track { background: #27272a; border-radius: 99px; }
  .ht-scroll::-webkit-scrollbar-thumb { background: #52525b; border-radius: 99px; transition: background .2s; }
  .ht-scroll::-webkit-scrollbar-thumb:hover { background: #a78bfa; }
  .ht-scroll { scrollbar-width: thin; scrollbar-color: #52525b #27272a; }
  .scene-card { transition: transform .2s ease, box-shadow .2s ease; }
  .scene-card:hover { transform: translateY(-4px); }
  .scene-card.active { transform: translateY(-4px); }
  @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  .fade-in { animation: fadeIn .25s ease forwards; }
  @keyframes pulse-dot { 0%,100%{ box-shadow: 0 0 0 0 rgba(167,139,250,0); } 50%{ box-shadow: 0 0 0 5px rgba(167,139,250,0.15); } }
  .pulse-active { animation: pulse-dot 2s infinite; }
  .scrollbar-thumb-track { cursor: grab; }
`;
