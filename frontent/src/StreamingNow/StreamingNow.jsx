import React, { useEffect, useState } from "react";
import StreamingUpcommingMovies from "./StreamingUpcommingMovies";
import StreamingNewRelease from "./StreamingNewRelease";
import { useDispatch, useSelector } from "react-redux";
import Nprogress from "nprogress";
import { fetchActiveStreaming } from "../redux/StreamingNowSlice/StreamVideo";
import { unwrapResult } from "@reduxjs/toolkit";
import { fetchStreamingNowPage } from "../redux/CentralizedMovieSlice/CentralizedMovieSlice";
import LoadingComponents from "../Components/LoadingComponents";
import StreamingTrailer from "./StreamingTrailer";
import { useQuery } from "@tanstack/react-query";
import api from "../api";

const StreamingNow = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("newRelease");

  const { streamingData } = useSelector((state) => state.centralizedMovies);

  const {
    data: homeMoviesData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["json-upload-movies"],
    queryFn: async () => {
      const response = await api.get("/admin/get-public-home-data");
      console.log("New Movies Data", response.data.data);
      return response.data.data;
    },
  });

  //console.log(streamingData);

  const tabs = [
    { key: "newRelease", label: "New Release" },
    { key: "upcoming", label: "Upcoming" },
    { key: "trending", label: "Trending" },
  ];

  useEffect(() => {
    const fetchAllHomeData = async () => {
      try {
        Nprogress.start();
        await Promise.all([
          dispatch(fetchActiveStreaming()).then(unwrapResult),
          dispatch(fetchStreamingNowPage()).then(unwrapResult),
        ]);
      } catch (error) {
        console.error("Home Page Parallel Fetch Error:", error);
      } finally {
        Nprogress.done();
      }
    };
    fetchAllHomeData();
  }, [dispatch]);

  // Loading Screen
  if (isLoading) {
    return <LoadingComponents />;
  }

  // Error handle (Optional)
  if (isError) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p className="text-red-500">Failed to load content. Please try again</p>
      </div>
    );
  }

  return (
    <div className="mt-16">
      <div className="rounded-[28px] border border-white/10 shadow-2xl shadow-black/30 overflow-hidden">
        <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-zinc-950 px-5 py-6 md:px-8 md:py-8">
          <div className="flex flex-wrap items-center gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-full px-5 py-3 text-sm font-semibold transition cursor-pointer select-auto duration-200 ${
                  activeTab === tab.key
                    ? "bg-orange-500 shadow-lg shadow-orange-500/30 "
                    : "bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 px-0 py-2 md:px-2">
          {activeTab === "newRelease" && (
            <StreamingNewRelease
              newReleases={streamingData.newReleases}
              newStreaming={homeMoviesData?.streaming?.newRelease}
            />
          )}

          {activeTab === "upcoming" && (
            <StreamingUpcommingMovies
              upcoming={streamingData.upcoming}
              upcomingStream={homeMoviesData?.streaming?.upcoming}
            />
          )}

          {activeTab === "trending" && (
            <StreamingTrailer
              newReleases={streamingData.newReleases}
              trendingStream={homeMoviesData?.streaming?.trending}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StreamingNow;
