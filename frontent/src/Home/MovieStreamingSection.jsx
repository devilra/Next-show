import React, { useEffect, useState } from "react";
import StreamingReviewCard from "./StreamingReviewCard";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const MovieStreamingSection = ({ activeItems, streamingData }) => {
  const [showAllNew, setShowAllNew] = useState(false);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [showAllTrending, setShowAllTrending] = useState(false);

  // const upcomingMovies = activeItems.filter((m) => m.streamType === "UPCOMING");
  // const newReleases = activeItems.filter((m) => m.streamType === "NEW");
  // const trendingNow = activeItems.filter((m) => m.streamType === "TRENDING");

  // ✅ Redux data-vai command panniyaachu.
  // Ippo query data-vai mattum 3 variables-la store panrom.
  const upcomingMovies = streamingData?.upcoming || [];
  const newReleases = streamingData?.newRelease || [];
  const trendingNow = streamingData?.trending || [];

  // console.log("StreamingData", streamingData);

  const [isOpen, setIsOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState({
    mainTitle: "Streaming Now",
    subTitle: "",
    data: [],
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto"; // Scroll-ah thirumba enable pannum
    }
  }, [isOpen]);

  // ✅ LIMIT LOGIC
  const visibleNew = showAllNew ? newReleases : newReleases.slice(0, 5);
  const visibleUpcomming = showAllUpcoming
    ? upcomingMovies
    : upcomingMovies.slice(0, 5);
  const visibleTrendingNow = showAllTrending
    ? trendingNow
    : trendingNow.slice(0, 5);

  const openDrawer = (title, data) => {
    setSidebarContent({ mainTitle: "Streaming Now", subTitle: title, data });
    setIsOpen(true);
  };

  // ✅ Empty State Component (Clean & Center aligned)
  const EmptyState = ({ message }) => (
    <div className="flex-1 flex flex-col gap-3 max-h-[330px] justify-center opacity-30 group">
      <div className="text-5xl font-black text-white/10 uppercase tracking-[0.2em] select-none group-hover:text-orange-400/10 transition-colors">
        Empty
      </div>
      <p className="text-gray-500 italic text-[11px]  uppercase tracking-widest mt-[-10px]">
        {message}
      </p>
    </div>
  );

  return (
    <div className="bg-[#0f0f0f] pt-3 px-4 md:px-8 border-t border-gray-800">
      <h2 className="text-white text-xl mb-2 font-black uppercase tracking-wider">
        Streaming Now
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 border border-yellow-500/20 p-5 rounded-xl bg-[#0a0a0a]">
        {/* NEW MOVIES ✅ UPDATED */}
        <div className="flex flex-col">
          <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-[0.2em] border-l-4 border-orange-400 pl-3">
            New movies
          </h3>

          <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2 custom-scrollbar">
            {visibleNew.length > 0 ? (
              <>
                {visibleNew.map((movie) => (
                  <StreamingReviewCard key={movie.id} review={movie} />
                ))}

                {/* ✅ SHOW ALL BUTTON */}
                {newReleases.length > 5 && !showAllNew && (
                  <button
                    onClick={() => openDrawer("New Movies", newReleases)}
                    className="w-full py-2 text-sm bg-white/10 hover:bg-white/20 text-white rounded-lg cursor-pointer transition"
                  >
                    Show All
                  </button>
                )}
              </>
            ) : (
              <EmptyState message="No new movies found" />
            )}
          </div>
        </div>

        {/* UPCOMING (UNCHANGED) */}
        <div className="flex flex-col">
          <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-[0.2em] border-l-4 border-orange-400 pl-3">
            Upcoming
          </h3>

          <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2 custom-scrollbar">
            {visibleUpcomming.length > 0 ? (
              <>
                {visibleUpcomming.map((movie) => (
                  <StreamingReviewCard key={movie.id} review={movie} />
                ))}

                {/* ✅ SHOW ALL BUTTON */}
                {upcomingMovies.length > 5 && !showAllUpcoming && (
                  <button
                    onClick={() =>
                      openDrawer("Upcoming Movies", upcomingMovies)
                    }
                    className="w-full py-2 text-sm bg-white/10 hover:bg-white/20 text-white rounded-lg cursor-pointer transition"
                  >
                    Show All
                  </button>
                )}
              </>
            ) : (
              <EmptyState message="No new movies found" />
            )}
          </div>
        </div>

        {/* TRENDING (UNCHANGED) */}
        <div className="flex flex-col">
          <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-[0.2em] border-l-4 border-orange-400 pl-3">
            Trending Now
          </h3>

          <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2 custom-scrollbar">
            {visibleTrendingNow.length > 0 ? (
              <>
                {visibleTrendingNow.map((movie) => (
                  <StreamingReviewCard key={movie.id} review={movie} />
                ))}

                {trendingNow.length > 5 && !showAllTrending && (
                  <button
                    onClick={() => openDrawer("Trending Now", trendingNow)}
                    className="w-full py-2 text-sm bg-white/10 hover:bg-white/20 text-white rounded-lg transition cursor-pointer"
                  >
                    Show All
                  </button>
                )}
              </>
            ) : (
              <EmptyState message="No new movies found" />
            )}
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/10 backdrop-blur-md z-[99]"
              />

              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 h-full w-full max-w-[450px] bg-[#0f0f0f] border-l border-gray-800 shadow-2xl z-[100] flex flex-col"
              >
                {/* ✅ Design Header Section */}
                <div className="p-6 border-b border-gray-800 bg-[#121212]">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] font-bold mb-1">
                        {sidebarContent.mainTitle}
                      </p>
                      <h3 className="text-orange-400 font-black text-2xl uppercase tracking-wider">
                        {sidebarContent.subTitle}
                      </h3>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                {/* Sidebar Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-4">
                  {sidebarContent.data.map((movie, index) => (
                    <motion.div
                      key={movie.id}
                      // initial={{ opacity: 0, y: 20 }}
                      // animate={{ opacity: 1, y: 0 }}
                      // transition={{ delay: index * 0.05 }}
                    >
                      <StreamingReviewCard review={movie} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <style jsx="true">{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a084ff;
        }
      `}</style>
    </div>
  );
};

export default MovieStreamingSection;
