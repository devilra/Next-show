import React from "react";
import NewsHero from "./NewsHero";
import NewsTrending from "./NewsTrending";
import LatestNews from "./LatestNews";
import CelebrityNews from "./CelebrityNews";
import RecentlyViewed from "./RecentlyViews";
import WatchLater from "./WatchLater";
import { useQueries } from "@tanstack/react-query";
import api from "../api";
import LoadingComponents from "../Components/LoadingComponents";

const NewsPage = () => {
  // ======================================================
  // ✅ PARALLEL API CALLS
  // ======================================================
  const results = useQueries({
    queries: [
      {
        queryKey: ["hero-trending-news"],
        queryFn: async () => {
          const response = await api.get("/admin/hero-trending-news");
          // console.log("Hero-Trending-news", response.data.data);
          return response.data.data;
        },
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        retry: false,
      },
      // ======================================================
      // ✅ TRENDING NEWS
      // ======================================================
      {
        queryKey: ["trending-news"],
        queryFn: async () => {
          const response = await api.get("/admin/trending-news");
          // console.log("trending news", response.data.data);
          return response.data.data;
        },
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        retry: false,
      },
      // ======================================================
      // ✅ LATEST NEWS
      // ======================================================
      {
        queryKey: ["latest-news"],
        queryFn: async () => {
          const response = await api.get("/admin/latest-news");
          // console.log("Latest news", response.data.data);
          return response.data.data;
        },
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        retry: false,
      },
    ],
  });

  // ======================================================
  // ✅ RESPONSES
  // ======================================================
  const heroNewsResponse = results[0];
  const trendingNewsResponse = results[1];
  const latestNewsResponse = results[2];

  // ======================================================
  // ✅ FIRST PAGE LOADING ONLY
  // ======================================================
  const allLoading = results.every((query) => query.isLoading);

  if (allLoading) {
    return <LoadingComponents />;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row min-h-screen bg-black">
        {/* LEFT: Hero — takes remaining space */}
        <div className="flex-1 min-w-0">
          <NewsHero
            heroNews={heroNewsResponse?.data || []}
            isError={heroNewsResponse.isError}
            error={heroNewsResponse.error}
            isLoading={heroNewsResponse.isLoading}
            refetch={heroNewsResponse.refetch}
          />
        </div>

        {/* RIGHT: Trending — fixed width on desktop, full width on mobile */}
        <div className="w-full md:w-[32%] md:max-w-sm">
          <NewsTrending
            trendingNews={trendingNewsResponse?.data || []}
            isError={trendingNewsResponse.isError}
            error={trendingNewsResponse.error}
            isLoading={trendingNewsResponse.isLoading}
            refetch={trendingNewsResponse.refetch}
          />
        </div>
      </div>
      <LatestNews
        latestNews={latestNewsResponse?.data || []}
        isError={latestNewsResponse.isError}
        error={latestNewsResponse.error}
        isLoading={latestNewsResponse.isLoading}
        refetch={latestNewsResponse.refetch}
      />
      <WatchLater />
      <RecentlyViewed />
    </div>
  );
};

export default NewsPage;
