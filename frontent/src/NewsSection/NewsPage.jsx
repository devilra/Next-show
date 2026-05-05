import React from "react";
import NewsHero from "./NewsHero";
import NewsTrending from "./NewsTrending";
import LatestNews from "./LatestNews";
import CelebrityNews from "./CelebrityNews";
import RecentlyViewed from "./RecentlyViews";
import WatchLater from "./WatchLater";

const NewsPage = () => {
  return (
    <div>
      <div className="flex flex-col md:flex-row min-h-screen bg-black">
        {/* LEFT: Hero — takes remaining space */}
        <div className="flex-1 min-w-0">
          <NewsHero />
        </div>

        {/* RIGHT: Trending — fixed width on desktop, full width on mobile */}
        <div className="w-full md:w-[32%] md:max-w-sm">
          <NewsTrending />
        </div>
      </div>
      <LatestNews />
      <WatchLater />
      <RecentlyViewed />
    </div>
  );
};

export default NewsPage;
