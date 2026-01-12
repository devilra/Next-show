import React from "react";
import MovieDetailsHeader from "./MovieDetailsHeader";
import MovieGallery from "./MovieGallery";
import TopCast from "./TopCast";

const MovieDetailsPage = () => {
  return (
    <div className="mt-16 max-w-7xl mx-auto px-4 md:px-6">
      <MovieDetailsHeader />
      <MovieGallery />
      <TopCast />
    </div>
  );
};

export default MovieDetailsPage;
