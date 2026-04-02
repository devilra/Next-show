import React from "react";
import VideoSection from "./VideoSection/VideoSection";
import BlogSection from "./BlogSection/BlogSection";
import HomeStream from "./HomeStream/HomeStream";
import HomeMovies from "./HomeMovies/HomeMovies";
import HomeTrailers from "./HomeTrailers/HomeTrailers";

const HomeContent = () => {
  return (
    <div>
      <VideoSection />
      <BlogSection />
      <HomeStream />
      <HomeMovies />
      <HomeTrailers />
    </div>
  );
};

export default HomeContent;
