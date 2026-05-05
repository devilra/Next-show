import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaAngleRight, FaEye, FaPlay } from "react-icons/fa";

const TABS = ["All", "Movies", "Web Series", "OTT", "Box Office"];

const activeBlogs = [
  {
    id: 1,
    rank: 1,
    isTop: true,
    category: "Movies",
    // catColor: "#ef4444",
    // catBg: "rgba(239,68,68,0.15)",
    title:
      "Thalapathy 69 — Official Title & Jaw-Dropping First Look Unveiled by Lyca Productions",
    newsDate: "2 hrs ago",
    views: "48.2K",
    hasVideo: false,
    bannerImage:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&q=70",
  },
  {
    id: 2,
    rank: 2,
    isTop: true,
    category: "Web Series",
    // catColor: "#3b82f6",
    // catBg: "rgba(59,130,246,0.15)",
    title:
      "Avengers: Doomsday — Full Cast Locked, Official Trailer Drops Tomorrow",
    newsDate: "5 hrs ago",
    views: "210K",
    hasVideo: true,
    bannerImage:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&q=70",
  },
  {
    id: 3,
    rank: 3,
    isTop: true,
    category: "OTT",
    // catColor: "#8b5cf6",
    // catBg: "rgba(139,92,246,0.15)",
    title:
      "Dune: Prophecy Season 2 — The Sisterhood's Darkest Chapter Begins Tonight",
    newsDate: "Yesterday",
    views: "95K",
    hasVideo: true,
    bannerImage:
      "https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=300&q=70",
  },
  {
    id: 4,
    rank: 4,
    isTop: false,
    category: "Web Series",
    // catColor: "#10b981",
    // catBg: "rgba(16,185,129,0.15)",
    title: "Suzhal Season 3 — Casting Begins with a Shocking New Showrunner",
    newsDate: "2 days ago",
    views: "62K",
    hasVideo: false,
    bannerImage:
      "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=300&q=70",
  },
  {
    id: 5,
    rank: 5,
    isTop: false,
    category: "Box Office",
    // catColor: "#f59e0b",
    // catBg: "rgba(245,158,11,0.15)",
    title:
      "Coolie Crosses ₹500 Cr Worldwide — Rajinikanth's Biggest Action Spectacle",
    newsDate: "3 days ago",
    views: "175K",
    hasVideo: false,
    bannerImage:
      "https://images.unsplash.com/photo-1512070679279-8988d32161be?w=300&q=70",
  },
  {
    id: 6,
    rank: 6,
    isTop: false,
    category: "Movies",
    // catColor: "#ec4899",
    // catBg: "rgba(236,72,153,0.15)",
    title:
      "Kamal Haasan's Indian 3 Gets a Surprise OTT Release Date Announcement",
    newsDate: "3 days ago",
    views: "41K",
    hasVideo: false,
    bannerImage:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&q=70",
  },
  {
    id: 7,
    rank: 7,
    isTop: false,
    // category: "Web Series",
    // catColor: "#3b82f6",
    catBg: "rgba(59,130,246,0.15)",
    title:
      "Mission Impossible 8 Final Trailer — Tom Cruise's Most Dangerous Stunt Yet",
    newsDate: "4 days ago",
    views: "88K",
    hasVideo: true,
    bannerImage:
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&q=70",
  },
];

const NewsTrending = () => {
  const [activeTab, setActiveTab] = useState("All");

  const filtered =
    activeTab === "All"
      ? activeBlogs
      : activeBlogs.filter((b) => b.category === activeTab);

  return (
    <div className="w-full h-auto md:h-[74vh] mt-5 md:mt-20 bg-[#0d1017] flex flex-col border-t md:border-t-0 md:border-l border-gray-800/50">
      {/* ── HEADER ── */}
      <div className="px-5 py-3 border-b border-gray-800/50 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-2">
          {/* <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> */}
          <h3 className="text-gray-400 uppercase text-[11px] font-bold tracking-[1px]">
            Trending Movies
          </h3>
        </div>
        {/* <Link
          to="/news"
          className="text-gray-500 uppercase text-[10px] font-bold tracking-[0.1em] flex items-center gap-1 hover:text-white transition-colors"
        >
          See All <FaAngleRight size={9} />
        </Link> */}
      </div>

      {/* ── FILTER TABS ── */}
      {/* <div className="flex gap-1.5 px-5 py-2 border-b border-gray-800/40 flex-shrink-0 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide whitespace-nowrap transition-all border ${
              activeTab === tab
                ? "bg-white/10 text-white border-white/25"
                : "text-white/35 border-white/10 hover:text-white/65"
            }`}
          >
            {tab}
          </button>
        ))}
      </div> */}

      {/* ── NEWS LIST ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {filtered.map((blog) => (
          <div
            key={blog.id}
            className="flex gap-3 px-5 py-3 cursor-pointer hover:bg-white/[0.05] border-b border-white/[0.04] last:border-b-0 group items-start transition-colors"
          >
            {/* Rank */}
            <span
              className={`text-[11px] text-white/50  pt-0.5 min-w-[18px]
            
              `}
            >
              {String(blog.rank).padStart(2, "0")}
            </span>

            {/* Body */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span
                  className="text-[12px]  uppercase tracking-wide px-1.5 py-0.5 rounded-full"
                  //   style={{ color: blog.catColor, background: blog.catBg }}
                >
                  {blog.category}
                </span>
              </div>
              <h4 className="text-[11px] pl-1  text-white/50 leading-snug mb-1 line-clamp-2 transition-colors">
                {blog.title}
              </h4>
              <div className="flex items-center pl-1 gap-2 text-[10px] text-white/25">
                <span>{blog.newsDate}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <FaEye
                    size={9}
                    style={{ color: blog.catColor, opacity: 0.7 }}
                  />
                  {blog.views}
                </span>
              </div>
            </div>

            {/* Thumbnail */}
            <div className="relative shrink-0 w-[64px] h-[46px] rounded-lg overflow-hidden border border-white/[0.07]">
              <img
                src={blog.bannerImage}
                alt=""
                className="w-full h-full object-cover transition-all duration-500 grayscale-[0.3] group-hover:scale-110 group-hover:grayscale-0"
                loading="lazy"
              />
              {blog.hasVideo && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity">
                  <FaPlay size={8} className="text-white ml-0.5" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── FOOTER ── */}
      {/* <div className="px-5 py-2.5 border-t border-gray-800/40 flex-shrink-0 flex justify-between items-center">
        <span className="text-[10px] text-white/20 font-semibold tracking-wide">
          Updated 2 min ago
        </span>
        <button className="text-[10px] text-white/30 hover:text-white font-semibold bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 rounded-md px-2.5 py-1 transition-all">
          Refresh
        </button>
      </div> */}
    </div>
  );
};

export default NewsTrending;
