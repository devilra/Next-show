import React, { useState } from "react";
import { Star, Play, Image as ImageIcon, Plus } from "lucide-react";
import { FaPlay } from "react-icons/fa";
import VideoPlayer from "../Components/VideoPlayer";
import MovieDescriptionSection from "./MovieDescriptionSection";

const MovieDetailsHeader = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const trailerUrl = "https://youtu.be/zdu0YzzJ10o?si=tEbfZkJtD4F5ELlk";

  const getYouTubeID = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeID(trailerUrl);
  const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className="bg-[#121212] text-white min-h-screen font-sans">
      {/* 1. Movie Title and Ratings Section - Responsive Flex */}
      <div className="py-4 md:py-6 flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-semibold mb-2">
            Idly Kadai
          </h1>
          <div className="flex flex-wrap gap-3 text-gray-400 text-xs md:text-sm">
            <span>Original title: Idli Kadai</span>
            <span>2025</span>
            <span>2h 28m</span>
          </div>
        </div>

        {/* Ratings - Mobile-la overflow aagama iruka flex-row */}
        <div className="flex gap-6 md:gap-8 w-full md:w-auto justify-start md:justify-end border-t border-gray-800 pt-4 md:pt-0 md:border-none">
          <div className="text-center">
            <span className="text-[10px] md:text-xs font-bold text-gray-400 block tracking-widest uppercase">
              IMDb RATING
            </span>
            <div className="flex items-center gap-2 mt-1">
              <Star
                className="text-yellow-500 fill-yellow-500"
                size={20}
                md={24}
              />
              <div className="text-left">
                <span className="text-lg md:text-xl font-bold">6.5</span>
                <span className="text-gray-400 text-xs md:text-sm">/10</span>
                <p className="text-[10px] text-gray-500">6K</p>
              </div>
            </div>
          </div>
          <div className="text-center">
            <span className="text-[10px] md:text-xs font-bold text-gray-400 block tracking-widest uppercase">
              YOUR RATING
            </span>
            <button className="flex items-center gap-2 mt-1 text-blue-500 font-semibold hover:bg-white/5 p-1 md:p-2 rounded">
              <Star size={20} md={24} />
              <span className="text-sm md:text-base">Rate</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Visuals Section - Mobile-la stack aagum */}
      <div className="flex flex-col md:grid md:grid-cols-12 gap-2 md:h-[450px]">
        {/* Poster & Sidebar Horizontal on Mobile, Vertical on Desktop */}
        <div className="order-2 md:order-1 lg:order-none md:col-span-3 grid grid-cols-12 gap-2 h-[150px] md:h-full">
          {/* Poster */}
          <div className="col-span-4 md:col-span-12 relative group overflow-hidden rounded-lg cursor-pointer">
            <img
              src="/movie/idly.jpg"
              alt="Poster"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-0 left-0 p-1 md:p-2 bg-black/40">
              <Plus size={20} />
            </div>
          </div>

          {/* Sidebar Buttons (Videos/Photos) - Mobile-la poster pakathula varum */}
          <div className="col-span-8 md:hidden flex gap-2">
            <div className="flex-1 bg-[#252525] rounded-lg flex flex-col items-center justify-center gap-1">
              <Play size={24} />
              <span className="text-[10px] font-bold uppercase">1 Video</span>
            </div>
            <div className="flex-1 bg-[#252525] rounded-lg flex flex-col items-center justify-center gap-1">
              <ImageIcon size={24} />
              <span className="text-[10px] font-bold uppercase">31 Photos</span>
            </div>
          </div>
        </div>

        {/* Video Player Area - Main Focus */}
        <div className="order-1 md:order-2 lg:order-none md:col-span-7 bg-black relative rounded-lg group overflow-hidden aspect-video md:aspect-auto">
          {isPlaying ? (
            <div className="w-full h-full">
              <VideoPlayer
                videoOptions={{
                  autoplay: true,
                  controls: true,
                  responsive: true,
                  fluid: true,
                  techOrder: ["youtube"],
                  sources: [{ src: trailerUrl, type: "video/youtube" }],
                }}
                onVideoEnd={() => setIsPlaying(false)}
              />
            </div>
          ) : (
            <div
              className="w-full h-full relative cursor-pointer"
              onClick={() => setIsPlaying(true)}
            >
              <img
                src={thumbnail}
                alt="Thumbnail"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-black/50 border border-white/20 p-4 md:p-5 rounded-full backdrop-blur-sm">
                    <FaPlay size={24} className="text-white ml-1" />
                  </div>
                  <span className="text-white font-bold tracking-widest uppercase text-[10px] md:text-sm shadow-lg">
                    Play Trailer
                  </span>
                </div>
              </div>
              {/* <div className="absolute bottom-4 left-4 hidden md:block">
                <h2 className="text-2xl tracking-[0.5rem] font-light uppercase opacity-90">
                  D H A N U S H
                </h2>
              </div> */}
            </div>
          )}
        </div>

        {/* Desktop Sidebar (Only visible on MD up) */}
        <div className="hidden md:flex md:col-span-2 flex-col gap-2">
          <div className="flex-1 bg-[#252525] rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#333]">
            <Play size={32} />
            <span className="text-xs font-bold uppercase">1 Video</span>
          </div>
          <div className="flex-1 rounded-lg bg-[#252525] flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#333]">
            <ImageIcon size={32} />
            <span className="text-xs font-bold uppercase">31 Photos</span>
          </div>
        </div>
      </div>

      {/* 3. Description Section */}
      <div className="py-6">
        <MovieDescriptionSection />
      </div>
    </div>
  );
};

export default MovieDetailsHeader;
