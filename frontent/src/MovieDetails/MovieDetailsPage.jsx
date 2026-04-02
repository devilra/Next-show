import React, { useEffect, useState } from "react";
import MovieDetailsHeader from "./MovieDetailsHeader";
import MovieGallery from "./MovieGallery";
import TopCast from "./TopCast";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Nprogress from "nprogress";
import { fetchMovieBySlug } from "../redux/CentralizedMovieSlice/CentralizedMovieSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import LoadingComponents from "../Components/LoadingComponents";

const MovieDetailsPage = () => {
  const { slug } = useParams();
  const [isPageLoading, setIsPageLoading] = useState(false);
  const dispatch = useDispatch();

  // Redux state-la irunthu details-ah edukirom
  const { currentMovie, isPublicLoading, isPublicError, message } = useSelector(
    (state) => state.centralizedMovies
  );

  console.log(currentMovie);

  useEffect(() => {
    const fetchFullMovieDetails = async () => {
      // 🛑 Guard: slug illana API call poga koodathu
      if (!slug || slug === "undefined") {
        console.error("Slug is missing in the URL!");
        return;
      }
      // Oru vela vera movie data munnadiye iruntha current slug kooda match aagutha nu check panrom
      if (currentMovie && currentMovie.slug === slug) {
        setIsPageLoading(false);
        return;
      }

      try {
        setIsPageLoading(true);
        Nprogress.start();

        await dispatch(fetchMovieBySlug(slug)).then(unwrapResult);
      } catch (error) {
        console.error("Movie Details Parallel Fetch Error:", error);
      } finally {
        setIsPageLoading(false);
        Nprogress.done();
      }
    };

    if (slug) {
      fetchFullMovieDetails();
    }
  }, [dispatch, slug, currentMovie?.slug]);

  // Loading Screen
  if (isPageLoading) {
    return <LoadingComponents />;
  }

  // Error vantha handle panna
  if (isPublicError) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500 bg-[#121212]">
        {message || "Movie Not Found"}
      </div>
    );
  }

  // Data illa na onnum kaatatha
  if (!currentMovie) return null;

  return (
    <div className="mt-16 max-w-7xl mx-auto px-4 md:px-6">
      <MovieDetailsHeader movie={currentMovie} />
      <MovieGallery movie={currentMovie} />
      <TopCast movie={currentMovie} />
    </div>
  );
};

export default MovieDetailsPage;
