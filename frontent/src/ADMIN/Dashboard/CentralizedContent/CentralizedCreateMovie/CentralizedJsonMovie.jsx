import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  FaCode,
  FaBell,
  FaFilm,
  FaPlus,
  FaCircleInfo,
  FaClock,
} from "react-icons/fa6";
import { AiOutlineLoading } from "react-icons/ai";
import { HiOutlineDotsVertical } from "react-icons/hi"; // 3-dot icon
import { motion, AnimatePresence } from "framer-motion"; // Framer motion
import NProgress from "nprogress";

import api from "../../../../api";
import { FaEdit, FaTrash } from "react-icons/fa";

const CentralizedJsonMovie = ({ setAlert, onMovieSelect }) => {
  // எந்த மூவிக்கு மெனு ஓப்பனா இருக்குனு டிராக் பண்ண state
  const [activeMenu, setActiveMenu] = useState(null);
  const queryClient = useQueryClient();

  // console.log(activeMenu);

  // 1. YouTube Thumbnail Generator Function
  const getYouTubeThumbnail = (url) => {
    if (!url) return "https://via.placeholder.com/480x360?text=No+Trailer";
    const regExp =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\b\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`
      : "https://via.placeholder.com/480x360?text=Invalid+URL";
  };

  // 2. Date Formatter Function (Feb 10 2026 format)
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
      .format(date)
      .replace(",", "");
  };

  const {
    data: allJsonMovies,
    isError,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["json-upload-movies"],
    queryFn: async () => {
      const response = await api.get("/admin/get-all-json-movies");
      console.log(response.data);
      return response.data;
    },
  });

  // 2. Movie Details Fetch Mutation
  // Idhu card click pannum pothu mattum trigger aagum
  const movieDetailsMutation = useMutation({
    mutationFn: async (slug) => {
      // Backend route-ku slug-ai params-ah anuppuroam
      const response = await api.get(
        `/admin/get-movie-admin-details-by-slug/${slug}`,
      );
      // console.log(response.data);
      return response.data;
    },
    onSuccess: (data) => {
      onMovieSelect(data.data);
    },
    onError: (error) => {
      // console.log(error.response?.data?.message);
      setAlert(
        "error",
        error.response?.data?.message || "Something went wrong!",
      );
    },
  });

  const moveToTrashMutation = useMutation({
    mutationFn: async (movieId) => {
      NProgress.start();

      // Inga reason matrum adminName context-ku etha mathiri kuduthukonga
      const response = await api.delete(`/admin/delete-movie/${movieId}`, {
        data: {
          reason: "Moved by Admin from Dashboard",
          adminName: "Admin",
        },
      });

      console.log(response.data);
      return response.data;
    },
    onSuccess: async (data) => {
      // 2. Success na NProgress mudiyanum
      NProgress.done();
      // 🔥 Ippo queryClient use panni cache-ai invalidate pannurom
      // Ithu 'json-upload-movies' key vacha ellā queries-aiyum 'stale' (old) nu mark panni
      // thirumba fresh-ah background-la fetch panni data-vai update pannum.
      // 🔥 Rendu query-aiyum parallel-ah refresh panrom
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["json-upload-movies"] }),
        queryClient.invalidateQueries({ queryKey: ["trash-movies"] }),
      ]);
      setAlert("info", data.message || "Movie moved to trash!");
      setActiveMenu(null);
    },
    onError: (error) => {
      NProgress.done();
      setAlert(
        "error",
        error.response?.data?.message || "Error moving to trash",
      );
      setActiveMenu(null);
    },
  });

  return (
    <div className="bg-gray-60 min-h-[400px] flex flex-col rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* 1. INTERNAL COMPONENT HEADER (Navbar mathiri) */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-orange-100 to-orange-400 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3 text-black/60">
          <div className="bg-white/20 p-2 rounded-lg">
            <FaFilm size={18} />
          </div>
          <div>
            <h2 className="font-bold text-sm uppercase tracking-wider">
              Movie Management
            </h2>
            <p className="text-[13px] text-orange-500 opacity-80">
              Centralized JSON System
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Notification Icon */}
          <div className="relative text-white cursor-pointer p-1 ">
            <FaBell size={18} className="animate-bell-shake" />
            <span className="absolute text-[12px] -top-1 -right-2 bg-white text-orange-600  font-bold h-4 w-4 flex items-center justify-center rounded-full">
              2
            </span>
          </div>
        </div>
      </div>

      {/* 2. SCROLLABLE CONTENT AREA */}
      <div
        className="flex-1 overflow-y-auto p-3 bg-white custom-scrollbar"
        style={{ maxHeight: "calc(100vh - 200px)" }}
      >
        {/* 🔥 GLOBAL OVERLAY: மெனு ஓப்பனாக இருக்கும்போது மட்டும் இது தெரியும் */}
        {activeMenu && (
          <div
            className="absolute inset-0 z-30 bg-transparent cursor-default"
            onClick={(e) => {
              e.stopPropagation(); // மெனு க்ளோஸ் ஆகும்போது டீடைல்ஸ் பக்கம் போகாமல் தடுக்கும்
              setActiveMenu(null);
            }}
          />
        )}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-orange-400">
            <div className="animate-spin mb-4">
              <AiOutlineLoading size={40} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allJsonMovies?.data?.map((movie) => (
              <div
                key={movie.id}
                onClick={() => {
                  if (!activeMenu) {
                    movieDetailsMutation.mutate(movie.slug);
                  }
                }}
                className={`bg-[#111] relative text-white rounded-[20px] cursor-pointer p-4 flex gap-4 border border-gray-800 transition-all shadow-xl group ${!activeMenu && "hover:border-orange-500/50"}`}
              >
                {/* 🔥 3-DOT BUTTON */}
                <div className="absolute top-4 right-1 z-40">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Card click-ஐ தடுக்கும்
                      setActiveMenu(activeMenu === movie.id ? null : movie.id);
                    }}
                    className="p-1 cursor-pointer hover:bg-white/10 rounded-full transition-colors text-gray-200 hover:text-white"
                  >
                    <HiOutlineDotsVertical size={18} />
                  </button>

                  {/* 🔥 DROPDOWN MENU (Framer Motion) */}
                  <AnimatePresence>
                    {activeMenu === movie.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        className="absolute -right-10 w-44 bg-neutral-600 border border-gray-700 rounded-xl shadow-2xl "
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();

                            setActiveMenu(null);
                          }}
                          className="w-full flex items-center cursor-pointer gap-1 px-2 transition-all duration-300 py-2 text-[14px] hover:bg-orange-500 rounded-lg "
                        >
                          <FaEdit size={14} /> Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Mutation-ai trigger pandrom
                            moveToTrashMutation.mutate(movie.id);
                          }}
                          style={{
                            // Response vara varaikkum pointer events-ai block pandrom
                            pointerEvents: moveToTrashMutation.isPending
                              ? "none"
                              : "auto",
                            opacity: moveToTrashMutation.isPending ? 0.7 : 1,
                          }}
                          className="w-full flex items-center cursor-pointer gap-1 px-2 transition-all duration-300 py-2 text-[14px] hover:bg-orange-500 rounded-lg "
                        >
                          {moveToTrashMutation.isPending ? (
                            <AiOutlineLoading
                              className="animate-spin"
                              size={14}
                            />
                          ) : (
                            <FaTrash size={14} />
                          )}{" "}
                          Move To Trash
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {/* Left Side: Thumbnail with Date Overlay */}
                <div className="relative w-28 h-28 shrink-0">
                  <div className="w-full h-full rounded-2xl overflow-hidden border border-gray-700">
                    <img
                      src={getYouTubeThumbnail(movie.trailerUrl)}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  {/* Date Badge (07 APR 2026 style) */}
                </div>

                {/* Right Side: Movie Details */}
                <div className="flex flex-col flex-1 overflow-hidden">
                  <h3 className="text-2xl font-bold truncate tracking-wider  transition-colors">
                    {movie.title}
                  </h3>
                  {/* <div className="mt-2 space-y-1.5">
                    <div className="flex items-center gap-2 text-gray-400">
                      <FaCircleInfo size={10} className="text-orange-500" />
                      <p className="text-[11px] font-medium leading-none">
                        Director :{" "}
                        <span className="text-gray-200">{movie.director}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <FaCircleInfo size={10} className="text-orange-500" />
                      <p className="text-[11px] font-medium leading-none truncate">
                        Cast :{" "}
                        <span className="text-gray-200">
                          {movie.cast.split(",").slice(0, 2).join(",")}...
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <FaCircleInfo size={10} className="text-orange-500" />
                      <p className="text-[11px] font-medium leading-none">
                        Genres :{" "}
                        <span className="text-gray-200">
                          {Array.isArray(movie.genres)
                            ? movie.genres.join(", ")
                            : "N/A"}
                        </span>
                      </p>
                    </div>
                  </div> */}
                  {/* Footer Time info */}
                  <div className="mt-3 pt-2 border-t border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[9px]">
                      <FaClock size={8} />
                      <span>
                        {new Date(movie.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <span className="text-[8px] bg-gray-800 px-2 py-0.5 rounded uppercase font-bold text-orange-400">
                      {movie.releaseMode}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CentralizedJsonMovie;
