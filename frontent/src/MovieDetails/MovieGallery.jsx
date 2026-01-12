import React from "react";
import { ChevronRight, Plus } from "lucide-react";

const MovieGallery = () => {
  // Youtube Video IDs list (Ithu dynamic-ah namma mathikalaam)
  const videoIds = [
    //"vpAR9raWe-BcQYvB", // Main Trailer
    "zdu0YzzJ10o", // Teaser
    "zdu0YzzJ10o", // Song 1
    "zdu0YzzJ10o", // BTS
    "zdu0YzzJ10o", // Promo 1
    "zdu0YzzJ10o", // Promo 2
    "zdu0YzzJ10o", // Interview
    "zdu0YzzJ10o", // Event
  ];

  // YouTube Thumbnail URL function
  const getYTThumbnail = (id) =>
    `https://img.youtube.com/vi/${id}/mqdefault.jpg`;

  return (
    <div className="py-8 bg-[#121212] max-w-4xl text-white">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4 group cursor-pointer">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center">
            Photos{" "}
            <span className="text-gray-500 ml-3 font-normal text-xl">31</span>
            <ChevronRight
              className="ml-2 group-hover:text-yellow-500 transition-colors"
              size={28}
            />
          </h2>
        </div>

        {/* <button className="flex items-center gap-2 text-blue-400 font-semibold hover:bg-blue-400/10 px-4 py-2 rounded-md transition-colors text-sm md:text-base">
          <Plus size={20} />
          Add photo
        </button> */}
      </div>

      {/* Responsive Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {videoIds.map((id, index) => (
          <div
            key={index}
            className={`relative overflow-hidden rounded-lg cursor-pointer group bg-zinc-900
              ${index === 3 ? "md:col-span-2 md:row-span-1" : ""} 
              ${index === 4 ? "md:col-span-1 md:row-span-1" : ""}
            `}
          >
            {/* YouTube Thumbnail Image */}
            <img
              src={getYTThumbnail(id)}
              alt={`Gallery item ${index + 1}`}
              className="w-full h-full object-cover aspect-video md:aspect-auto md:h-48 group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
            />

            {/* Overlay for +Count (Last Image-ku mattum) */}
            {index === videoIds.length - 1 && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">+23</span>
                <span className="text-[10px] uppercase tracking-widest font-bold">
                  Photos
                </span>
              </div>
            )}

            {/* Hover overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieGallery;
