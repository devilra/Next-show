import { useState } from "react";
// Note: Intha icons use panna 'npm install react-icons' panni irukanum.
// Illana normal emojis kooda use pannikalam.
import {
  FaBookmark,
  FaHeart,
  FaShareAlt,
  FaRegBookmark,
  FaRegHeart,
  FaEye,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";

const newsData = {
  category: "Cinema",
  title:
    "Leo 2 Official Update Released 🔥: The Cinematic Universe Expands Further",
  subtitle:
    "Director Lokesh Kanagaraj and Thalapathy Vijay are reportedly reuniting for a sequel that promises to redefine the action genre in Kollywood.",
  author: "Vicky",
  authorRole: "Senior Film Critic",
  avatar: "https://i.pravatar.cc/150?img=33",
  date: "May 4, 2026",
  readTime: "5 min read",
  views: "124.2K",
  heroImage:
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&q=80&fit=crop",
  tags: [
    "ThalapathyVijay",
    "Leo2",
    "LokeshKanagaraj",
    "CinemaUpdate",
    "Kollywood",
  ],
  paragraphs: [
    {
      heading: "The Unfinished Story",
      text: "The rumors around the sequel have been circulating since the massive success of the first installment. Official sources now hint that the pre-production work has already commenced in secret locations across Chennai and Hyderabad.",
    },
    {
      heading: "Expansion of the Universe",
      text: "Industry insiders suggest that Leo 2 will not just be a direct sequel but a massive bridge connecting multiple characters from the director's previous cinematic universe.",
    },
    {
      heading: "Technical Marvels",
      text: "The film is expected to use cutting-edge Unreal Engine 5 technology for certain high-octane action sequences, ensuring a visual experience that matches global standards.",
    },
  ],
};

const relatedNews = [
  {
    id: 1,
    category: "Movies",
    title: "Thalapathy 69 Title Announcement Date Revealed",
    time: "2h ago",
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&q=80",
  },
  {
    id: 2,
    category: "Box Office",
    title: "Coolie Crosses 500 Crores Mark in Record Time",
    time: "4h ago",
    image:
      "https://images.unsplash.com/photo-1512070679279-8988d32161be?w=300&q=80",
  },
  {
    id: 3,
    category: "OTT",
    title: "Upcoming Tamil Web Series to Watch This Weekend",
    time: "6h ago",
    image:
      "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=300&q=80",
  },
];

export default function NewsDetailsHero() {
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(1240);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    // BG Color: Gray-50 mathi Deep Black (#0d1017) kuduthurukaen
    <div className="min-h-screen bg-[#0d1017] text-white font-sans pt-10">
      {/* ── Hero Image ── */}
      <div className="w-full h-64 sm:h-80 md:h-[500px] overflow-hidden relative">
        <img
          src={newsData.heroImage}
          alt="Hero"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1017] via-transparent to-transparent" />
        <div className="absolute bottom-8 left-4 md:left-12">
          <span className="bg-orange-500 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-sm">
            {newsData.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-black mt-4 max-w-4xl leading-tight">
            {newsData.title}
          </h1>
        </div>
      </div>

      {/* ── Page Body ── */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-10">
        {/* ── LEFT: Main Article ── */}
        <main className="flex-1 min-w-0">
          {/* Article Info Card (Dark Glassmorphism style) */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 mb-8">
            <p className="text-white/60 text-lg leading-relaxed mb-6 italic border-l-4 border-orange-500 pl-4">
              {newsData.subtitle}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-6 border-t border-white/5 pt-6">
              <div className="flex items-center gap-3">
                <img
                  src={newsData.avatar}
                  alt={newsData.author}
                  className="w-12 h-12 rounded-full border-2 border-orange-500/30 p-0.5"
                />
                <div>
                  <p className="text-sm font-bold text-white">
                    {newsData.author}
                  </p>
                  <p className="text-xs text-white/40">{newsData.authorRole}</p>
                </div>
              </div>

              <div className="flex items-center gap-5 text-xs text-white/40 uppercase tracking-widest font-bold">
                <span className="flex items-center gap-1.5">
                  <FaCalendarAlt className="text-orange-500" /> {newsData.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <FaClock className="text-orange-500" /> {newsData.readTime}
                </span>
                <span className="flex items-center gap-1.5">
                  <FaEye className="text-orange-500" /> {newsData.views}
                </span>
              </div>
            </div>

            {/* Action Buttons with Orange highlights */}
            <div className="flex items-center gap-3 mt-8">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-black uppercase tracking-tighter transition border ${
                  liked
                    ? "bg-orange-500 border-orange-500 text-black"
                    : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                }`}
              >
                {liked ? <FaHeart /> : <FaRegHeart />} {likeCount}
              </button>
              <button
                onClick={() => setBookmarked(!bookmarked)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-black uppercase tracking-tighter transition border ${
                  bookmarked
                    ? "bg-white text-black border-white"
                    : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                }`}
              >
                {bookmarked ? <FaBookmark /> : <FaRegBookmark />}{" "}
                {bookmarked ? "Saved" : "Save"}
              </button>
              <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-black uppercase tracking-tighter border border-white/10 bg-white/5 hover:bg-white/10 transition">
                <FaShareAlt className="text-orange-500" /> Share
              </button>
            </div>
          </div>

          {/* Article Content */}
          <div className="space-y-10 px-2">
            {newsData.paragraphs.map((p, i) => (
              <div key={i}>
                <h2 className="text-xl font-black text-orange-500 uppercase tracking-tight mb-4">
                  {p.heading}
                </h2>
                <p className="text-white/70 leading-[1.8] text-lg">{p.text}</p>
              </div>
            ))}
          </div>

          {/* Tags (Orange hover effect) */}
          <div className="mt-12 pt-10 border-t border-white/5">
            <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">
              Trending Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {newsData.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-white/5 text-white/60 text-[11px] font-bold px-4 py-2 rounded-md hover:bg-orange-500 hover:text-black cursor-pointer transition-all"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </main>

        {/* ── RIGHT: Sidebar ── */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* Trending Sidebar */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
              <h3 className="text-xs font-black text-orange-500 uppercase tracking-widest mb-6">
                Trending in Cinema
              </h3>
              <div className="space-y-5">
                {relatedNews.map((item, i) => (
                  <div
                    key={item.id}
                    className="flex gap-4 group cursor-pointer"
                  >
                    <span className="text-2xl font-black text-white/10 group-hover:text-orange-500/50 transition-colors">
                      {i + 1}
                    </span>
                    <div>
                      <span className="text-[10px] text-orange-500 font-bold uppercase">
                        {item.category}
                      </span>
                      <p className="text-sm font-bold text-white/80 group-hover:text-orange-400 transition-colors leading-snug">
                        {item.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter (Orange Gradient) */}
            <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-2xl p-6 text-black">
              <h4 className="text-xl font-black uppercase italic leading-none mb-2">
                Join the Club
              </h4>
              <p className="text-sm font-medium mb-5 opacity-80">
                Get exclusive movie updates.
              </p>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-black/10 border border-black/20 placeholder-black/40 text-black text-sm px-4 py-3 rounded-xl outline-none mb-3"
              />
              <button className="w-full bg-black text-white font-black uppercase py-3 rounded-xl hover:bg-white hover:text-black transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
