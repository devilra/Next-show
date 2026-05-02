import React, { useEffect, useState } from "react";
import UpcomingMoviesCarousel from "./UpcomingMoviesCarousel";
import NewReleaseMoviesCarousel from "./NewReleaseMoviesCarousel";
import NewMoviesTrailerCarousel from "./NewMoviesTrailerCarousel";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import Nprogress from "nprogress";
import { fetchNewMoviesPage } from "../redux/CentralizedMovieSlice/CentralizedMovieSlice";
import LoadingComponents from "../Components/LoadingComponents";
import { useQuery } from "@tanstack/react-query";
import api from "../api";

const NewMovies = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("newReleases");
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [sortOption, setSortOption] = useState("Popular");
  const [autoPlay, setAutoPlay] = useState(true);

  // Redux state-la irunthu data-vai edukkirom
  const { newMoviesData, isPublicError } = useSelector(
    (state) => state.centralizedMovies,
  );

  const {
    data: homeMoviesData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["json-upload-movies"],
    queryFn: async () => {
      const response = await api.get("/admin/get-public-home-data");
      return response.data.data;
    },
  });

  const tabs = [
    { key: "newReleases", label: "New Releases" },
    { key: "upcoming", label: "Upcoming" },
    { key: "trending", label: "Trending" },
  ];

  const newReleases = newMoviesData?.newReleases ?? [];
  const upcoming = homeMoviesData?.theatrical?.upcoming ?? [];
  const trending = homeMoviesData?.theatrical?.trending ?? [];

  const hasData =
    newReleases.length > 0 || upcoming.length > 0 || trending.length > 0;

  // console.log(newMoviesData);
  // Data irukkannu check pannikirom (to avoid re-fetching)
  // const hasData =
  //   newMoviesData.upcoming?.length > 0 || newMoviesData.newReleases?.length > 0;

  useEffect(() => {
    const fetchAllNewMoviesData = async () => {
      // Data munnadiye iruntha fetch panna thavai illai
      if (hasData) {
        setIsPageLoading(false);
        return;
      }

      try {
        setIsPageLoading(true);
        Nprogress.start();

        // Promise.all use panni parallel fetch pandrom
        // Unga slice-la ithu ore API call thaan,
        // aana innum extra calls (videos/ads) add panna ithu helpful-aa irukkum.
        await dispatch(fetchNewMoviesPage()).then(unwrapResult);
        // Inga vera ethavathu fetch thalaivara iruntha add pannikalam
      } catch (error) {
        console.error("New Movies Page Parallel Fetch Error:", error);
      } finally {
        setIsPageLoading(false);
        Nprogress.done();
      }
    };

    fetchAllNewMoviesData();
  }, [dispatch, hasData]);

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
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
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

            {/* <div className="flex flex-wrap items-center gap-3 justify-between">
              <div className="hidden gap-2 text-sm text-slate-300 sm:flex">
                <span className="rounded-full bg-white/5 px-3 py-2">
                  New {newReleases.length}
                </span>
                <span className="rounded-full bg-white/5 px-3 py-2">
                  Upcoming {upcoming.length}
                </span>
                <span className="rounded-full bg-white/5 px-3 py-2">
                  Trending {trending.length}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-full bg-white/5 px-3 py-2 text-sm text-slate-300">
                  Sort:
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="ml-2 bg-transparent outline-none text-slate-100"
                  >
                    <option value="Popular">Popular</option>
                    <option value="Latest">Latest</option>
                    <option value="Anticipated">Anticipated</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => setAutoPlay((prev) => !prev)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition duration-200 ${
                    autoPlay
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  Auto-play {autoPlay ? "On" : "Off"}
                </button>
              </div>
            </div> */}
          </div>
        </div>

        <div className="border-t border-white/10 px-0 py-2 md:px-2">
          {/* <div className="mb-4 px-5 md:px-0">
            <span className="rounded-full bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-400">
              Showing {tabs.find((tab) => tab.key === activeTab)?.label}
            </span>
          </div> */}

          {activeTab === "newReleases" && (
            <NewReleaseMoviesCarousel
              newReleases={newReleases}
              newMovies={homeMoviesData?.theatrical?.newRelease ?? []}
            />
          )}

          {activeTab === "upcoming" && (
            <UpcomingMoviesCarousel
              upcomingMovies={upcoming}
              upcomming={upcoming}
            />
          )}

          {activeTab === "trending" && (
            <NewMoviesTrailerCarousel trendingMovies={trending} />
          )}

          {!hasData && (
            <div className="flex min-h-[260px] items-center justify-center rounded-[24px] bg-[#111827] px-6 py-12 text-center">
              <p className="text-slate-400">
                No content available yet. Please check back soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewMovies;
