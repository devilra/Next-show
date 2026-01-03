import React from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux"; // Redux state-la irunthu data edukka
import { FaUserAlt, FaVideo, FaCalendarAlt } from "react-icons/fa";

const NewsHome = () => {
  // Homepage blogs data-vai useSelector moolama edukka
  const { activeBlogs } = useSelector((state) => state.blogSection);

  return (
    <div className="pt-28 pb-20 px-6 md:px-14 bg-black min-h-screen text-white">
      {/* Header Section */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p
            // initial={{ opacity: 0 }}
            // animate={{ opacity: 1 }}
            className="text-orange-500 font-bold tracking-widest uppercase text-sm mb-2"
          >
            Latest Headlines
          </p>
          <h2
            // initial={{ opacity: 0, y: 10 }}
            // animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black italic tracking-tighter"
          >
            CINEMA{" "}
            <span className="text-orange-500 text-outline">CHRONICLES</span>
          </h2>
        </div>
        <div className="h-[2px] flex-1 bg-gradient-to-r from-orange-500/50 to-transparent hidden md:block mb-4 ml-6"></div>
      </div>

      {/* Modern Card Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {activeBlogs?.map((blog, index) => (
          <div
            key={blog.id}
            // initial={{ opacity: 0, scale: 0.95 }}
            // whileInView={{ opacity: 1, scale: 1 }}
            // viewport={{ once: true }}
            // transition={{ delay: index * 0.1 }}
            className="group relative flex flex-col md:flex-row bg-[#111] rounded-3xl overflow-hidden border border-white/5 hover:border-orange-500/30 transition-all duration-500"
          >
            {/* Image Section */}
            <div className="w-full md:w-2/5 h-64 md:h-auto overflow-hidden relative">
              <img
                src={blog.bannerImage}
                alt={blog.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black md:bg-gradient-to-r md:from-transparent md:to-black/20"></div>

              {/* Floating Date Badge */}
              <div className="absolute top-4 left-4 bg-orange-600/90 backdrop-blur-md px-3 py-1 rounded-lg flex items-center gap-2 text-xs font-bold">
                <FaCalendarAlt /> {blog.newsDate}
              </div>
            </div>

            {/* Content Section */}
            <div className="w-full md:w-3/5 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-orange-400 transition-colors">
                  {blog.title}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                  {blog.shortDescription}
                </p>

                {/* Movie Info Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full text-[10px] text-gray-300 border border-white/10">
                    <FaVideo className="text-orange-500" /> Dir:{" "}
                    {blog.directedBy}
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full text-[10px] text-gray-300 border border-white/10">
                    <FaUserAlt className="text-orange-500" />{" "}
                    {blog.starCast.split(",")[0]}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-black bg-orange-500 flex items-center justify-center text-[10px] font-bold">
                    NS
                  </div>
                </div>
                <button className="relative overflow-hidden group/btn px-6 py-2 rounded-full bg-white text-black font-bold text-xs hover:bg-orange-500 hover:text-white transition-all">
                  FULL STORY
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Style for Text Outline (Optional) */}
      <style>{`
        .text-outline {
          -webkit-text-stroke: 1px #f97316;
          color: transparent;
        }
      `}</style>
    </div>
  );
};

export default NewsHome;
