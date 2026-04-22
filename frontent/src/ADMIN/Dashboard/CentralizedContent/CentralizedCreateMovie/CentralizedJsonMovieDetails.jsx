import React from "react";
import {
  FaXmark,
  FaYoutube,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaUsers,
  FaLanguage,
  FaTicket,
  FaArrowLeft, // Back icon-க்காக இதையும் சேர்த்துக்கோங்க
} from "react-icons/fa6";

const CentralizedJsonMovieDetails = ({ movie, onClose }) => {
  if (!movie) return null;

  return (
    <div className="w-full min-h-screen  relative ">
      <div className="w-full overflow-y-auto  shadow-2xl pt-10">
        {/* 1. Banner Section */}
        <div className="relative h-64 md:h-80 w-full bg-gray-900">
          {/* 🔥 BACK BUTTON (Top Right) */}
          <button
            onClick={onClose}
            className="absolute -top-9.5  left-0  flex items-center gap-2 bg-orange-500 hover:bg-orange-600 cursor-pointer backdrop-blur-md text-white px-4 py-2 rounded-md border border-white/20 transition-all active:scale-95 shadow-lg"
          >
            <FaArrowLeft size={14} />
            <span className="text-xs font-bold uppercase tracking-wider">
              Back
            </span>
          </button>

          <img
            src={movie.bannerImage || "https://via.placeholder.com/1200x400"}
            className="w-full h-full object-cover opacity-60"
            alt="banner"
          />
          <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-white to-transparent">
            <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">
              {movie.title}
            </h1>
            <div className="flex gap-2 mt-2">
              {movie.genres?.map((g, i) => (
                <span
                  key={i}
                  className="text-[10px] bg-orange-500 text-white px-3 py-1 rounded-full font-bold uppercase"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Content Grid */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Side: Main Info */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FaTicket className="text-orange-500" /> Storyline
              </h3>
              <p className="text-gray-500 mt-2 leading-relaxed text-sm">
                {movie.longDescription ||
                  "No description available for this movie."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-[10px] text-gray-400 uppercase font-bold">
                  Director
                </p>
                <p className="text-sm font-bold text-gray-700">
                  {movie.director}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-[10px] text-gray-400 uppercase font-bold">
                  Music Director
                </p>
                <p className="text-sm font-bold text-gray-700">
                  {movie.musicDirector}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-3">
                <FaUsers className="text-orange-500" /> Cast Members
              </h3>
              <p className="text-sm text-gray-600 italic">{movie.cast}</p>
            </div>
          </div>

          {/* Right Side: Quick Stats */}
          <div className="space-y-4">
            <div className="bg-orange-50 p-6 rounded-[24px] border border-orange-100">
              <h4 className="font-bold text-orange-600 mb-4 flex items-center gap-2">
                <FaMoneyBillWave /> Box Office
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Budget</span>
                  <span className="text-xs font-bold">
                    {movie.boxOffice?.budget || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Verdict</span>
                  <span
                    className={`text-xs font-black uppercase ${
                      movie.boxOffice?.verdict === "Hit"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {movie.boxOffice?.verdict || "TBA"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href={movie.trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100"
              >
                <FaYoutube size={20} /> Watch Trailer
              </a>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                <FaLanguage className="text-gray-400" />
                <span className="text-xs font-bold text-gray-600">
                  {movie.language?.join(" / ")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <p className="text-[10px] text-gray-400">Database ID: #{movie.id}</p>
          <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">
            Status: {movie.movieStatus}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CentralizedJsonMovieDetails;
