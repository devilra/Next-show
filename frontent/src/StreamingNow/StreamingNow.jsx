import React from "react";
import NewVideoSection from "../NewMovies/NewVideoSection";
import UpcomingMoviesCarousel from "../NewMovies/UpcomingMoviesCarousel";
import NewReleaseMoviesCarousel from "../NewMovies/NewReleaseMoviesCarousel";

const StreamingNow = () => {
  return (
    <div>
      <NewVideoSection />
      <UpcomingMoviesCarousel />
      <NewReleaseMoviesCarousel />
    </div>
  );
};

export default StreamingNow;
