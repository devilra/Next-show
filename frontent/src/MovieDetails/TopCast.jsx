import React, { useState } from "react";
import { ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TopCast = ({ movie }) => {
  const [activePopup, setActivePopup] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const castOrder = movie?.cast
    ? movie.cast.split(",").map((c) => c.trim())
    : [];

  const castList = castOrder
    .map((name) =>
      movie?.castDetails?.find(
        (c) => c.name?.toLowerCase() === name.toLowerCase(),
      ),
    )
    .filter(Boolean);

  // Mobile slicing logic
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const displayList = isMobile && !isExpanded ? castList.slice(0, 6) : castList;

  const handleCastClick = (castId) => {
    setActivePopup(castId);
    setTimeout(() => {
      setActivePopup(null);
    }, 3000);
  };

  return (
    <div className="py-8 bg-[#121212] z-0 text-white max-w-4xl">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4 group cursor-pointer">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center">
            Top Cast{" "}
            <ChevronRight
              className="ml-2 group-hover:text-yellow-500 transition-colors"
              size={28}
            />
          </h2>
        </div>
      </div>

      {/* Cast Grid with Layout Animation */}
      <motion.div
        layout // Ithu thaan items shift aagumbothu smooth animation kudukkum
        className="grid grid-cols-2 gap-x-4 md:gap-x-12 gap-y-8"
      >
        <AnimatePresence mode="popLayout">
          {displayList.map((person, index) => {
            const profileImgSrc = person.profileImage
              ? person.profileImage
              : person.gender === "Female"
                ? "/female.jpg"
                : "/male.png";

            const isPopupOpen = activePopup === person.castId;

            return (
              <motion.div
                layout // Each card layout change-aiyum animate pannum
                key={person.castId || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex flex-col md:flex-row items-center max-w-md  md:items-center gap-3 md:gap-4 group cursor-pointer text-center md:text-left"
                onClick={() => handleCastClick(person.castId)}
              >
                {/* Circular Image */}
                <div className="relative shrink-0">
                  <div className="w-20 h-20 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-transparent group-hover:border-gray-600 transition-all shadow-lg">
                    <img
                      src={profileImgSrc}
                      alt={person.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <AnimatePresence>
                    {isPopupOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: -10 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap bg-yellow-500 text-black px-3 py-1.5 rounded-lg text-xs font-bold shadow-xl"
                      >
                        Profile Under Progress
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-500 rotate-45" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Name and Role */}
                <div className="flex flex-col justify-center min-w-0 w-full">
                  <span className="text-[13px] md:text-lg hover:underline decoration-1 underline-offset-4 truncate md:whitespace-normal">
                    {person.name}
                  </span>
                  <span className="text-gray-400 text-xs md:text-sm truncate md:whitespace-normal">
                    {person.characterName || person.roleCategory}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Toggle Button */}
      {castList.length > 6 && (
        <div className="mt-8 md:hidden flex justify-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-6 py-2 border border-gray-700 rounded-full text-sm font-semibold hover:bg-white/5 transition-colors active:scale-95 duration-200"
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp size={16} />
              </>
            ) : (
              <>
                Show More <ChevronDown size={16} />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default TopCast;
