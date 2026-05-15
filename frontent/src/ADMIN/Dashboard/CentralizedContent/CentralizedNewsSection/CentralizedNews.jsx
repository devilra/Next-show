import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  FaCode,
  FaBell,
  FaFilm,
  FaPlus,
  FaCircleInfo,
  FaClock,
  FaCloudArrowUp,
} from "react-icons/fa6";
import { AiOutlineLoading } from "react-icons/ai";
import { HiOutlineDotsVertical } from "react-icons/hi"; // 3-dot icon
import { motion, AnimatePresence } from "framer-motion"; // Framer motion
import NProgress from "nprogress";

import api from "../../../../api";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MdNewspaper } from "react-icons/md";

const CentralizedNews = ({ setAlert, onMovieSelect, setShowNewsUpload }) => {
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
    data: allNews,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["centralized-news"],
    queryFn: async () => {
      const response = await api.get("/admin/get-all-news");
      console.log(response.data);
      return response.data;
    },
  });

  const newsDetailsMutation = useMutation({
    mutationFn: async (slug) => {
      const response = await api.get(`/admin/get-news-details/${slug}`);
      return response.data;
    },
    onSuccess: (data) => {
      setSelectedNews(data.data);
      setAlert({ type: "info", message: "News details loaded." });
    },
    onError: (error) => {
      setAlert({
        type: "error",
        message:
          error.response?.data?.message || "Unable to load news details.",
      });
    },
  });

  const deleteNewsMutation = useMutation({
    mutationFn: async (newsId) => {
      const response = await api.delete(`/admin/delete-news/${newsId}`);
      return response.data;
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ["centralized-news"] });
      setAlert({ type: "info", message: data.message || "News deleted." });
      setActiveMenu(null);
    },
    onError: (error) => {
      setAlert({
        type: "error",
        message: error.response?.data?.message || "Unable to delete news.",
      });
      setActiveMenu(null);
    },
  });

  return (
    <div className="bg-gray-60 min-h-[400px] flex flex-col rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* 1. INTERNAL COMPONENT HEADER (Navbar mathiri) */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-orange-100 to-orange-400 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3 text-black/60">
          <div className="bg-white/20 p-2 rounded-lg">
            <MdNewspaper size={18} />
          </div>
          <div>
            <h2 className="font-bold text-sm uppercase tracking-wider">
              News Management
            </h2>
            <p className="text-[13px] text-orange-500 opacity-80">
              Centralized News System
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Upload Movies Button */}
          <button
            onClick={() => setShowNewsUpload(true)}
            className="
      flex items-center gap-2
        cursor-pointer
      bg-black/20
      hover:bg-black/30

      text-white

      px-4 py-2

      rounded-xl

      border border-white/10

      text-[12px]
      font-semibold

      transition-all duration-300
    "
          >
            <FaCloudArrowUp size={14} />
            Upload News
          </button>

          {/* Notification Icon */}
          <div className="relative text-white cursor-pointer p-1">
            <FaBell size={18} className="animate-bell-shake" />

            <span
              className="
        absolute
        text-[12px]
        -top-1
        -right-2

        bg-white
        text-orange-600

        font-bold

        h-4 w-4

        flex items-center justify-center

        rounded-full
      "
            >
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
            {allNews?.data?.map((news) => (
              <div
                key={news.id}
                onClick={() => {
                  if (!activeMenu) {
                    newsDetailsMutation.mutate(news.slug);
                  }
                }}
                className={`bg-[#111] relative text-white rounded-[20px] cursor-pointer p-4 flex gap-4 border border-gray-800 transition-all shadow-xl group ${!activeMenu && "hover:border-orange-500/50"}`}
              >
                <div className="absolute top-4 right-1 z-40">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenu(activeMenu === news.id ? null : news.id);
                    }}
                    className="p-1 cursor-pointer hover:bg-white/10 rounded-full transition-colors text-gray-200 hover:text-white"
                  >
                    <HiOutlineDotsVertical size={18} />
                  </button>

                  <AnimatePresence>
                    {activeMenu === news.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        className="absolute -right-10 w-44 bg-neutral-600 border border-gray-700 rounded-xl shadow-2xl"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setAlert({
                              type: "info",
                              message: "Edit News flow will be added soon.",
                            });
                            setActiveMenu(null);
                          }}
                          className="w-full flex items-center cursor-pointer gap-1 px-2 transition-all duration-300 py-2 text-[14px] hover:bg-orange-500 rounded-lg"
                        >
                          <FaEdit size={14} /> Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNewsMutation.mutate(news.id);
                          }}
                          style={{
                            pointerEvents: deleteNewsMutation.isPending
                              ? "none"
                              : "auto",
                            opacity: deleteNewsMutation.isPending ? 0.7 : 1,
                          }}
                          className="w-full flex items-center cursor-pointer gap-1 px-2 transition-all duration-300 py-2 text-[14px] hover:bg-orange-500 rounded-lg"
                        >
                          {deleteNewsMutation.isPending ? (
                            <AiOutlineLoading
                              className="animate-spin"
                              size={14}
                            />
                          ) : (
                            <FaTrash size={14} />
                          )}
                          Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative w-28 h-28 shrink-0">
                  <div className="w-full h-full rounded-2xl overflow-hidden border border-gray-700">
                    <img
                      src={
                        Array.isArray(news.videoUrl) && news.videoUrl.length > 0
                          ? getYouTubeThumbnail(news.videoUrl[0])
                          : news.newsImages?.[0] ||
                            "https://via.placeholder.com/480x360?text=News+Image"
                      }
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col flex-1 overflow-hidden">
                  <h3 className="text-2xl font-bold truncate tracking-wider transition-colors">
                    {news.title}
                  </h3>
                  <div className="mt-3 pt-2 border-t border-gray-800 flex flex-col gap-2">
                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                      <FaClock size={10} />
                      <span>
                        {formatDate(news.publishedAt || news.createdAt)}
                      </span>
                    </div>
                    <span className="text-[8px] bg-gray-800 px-2 py-0.5 rounded uppercase font-bold text-orange-400 inline-block w-max">
                      {news.status || "UNKNOWN"}
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

export default CentralizedNews;
