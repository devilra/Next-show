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
import MovieTimelineUI from "./MovieTimelineUI";
import MovieDescriptionSection from "./MovieDescriptionSection";
import MovieTimeline from "./MovieTimelineUI";
import { useMutation } from "@tanstack/react-query";
import api from "../api";

const MovieDetailsPage = () => {
  const { slug } = useParams();
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [movieData, setMovieData] = useState(null);
  const dispatch = useDispatch();
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  // Redux state-la irunthu details-ah edukirom
  const { currentMovie, isPublicLoading, isPublicError, message } = useSelector(
    (state) => state.centralizedMovies,
  );

  // console.log("CURRENT MOVIE", currentMovie);

  // useEffect(() => {
  //   const fetchFullMovieDetails = async () => {
  //     // 🛑 Guard: slug illana API call poga koodathu
  //     if (!slug || slug === "undefined") {
  //       console.error("Slug is missing in the URL!");
  //       return;
  //     }
  //     // Oru vela vera movie data munnadiye iruntha current slug kooda match aagutha nu check panrom
  //     if (currentMovie && currentMovie.slug === slug) {
  //       setIsPageLoading(false);
  //       return;
  //     }

  //     try {
  //       setIsPageLoading(true);
  //       Nprogress.start();

  //       await dispatch(fetchMovieBySlug(slug)).then(unwrapResult);
  //     } catch (error) {
  //       console.error("Movie Details Parallel Fetch Error:", error);
  //     } finally {
  //       setIsPageLoading(false);
  //       Nprogress.done();
  //     }
  //   };

  //   if (slug) {
  //     fetchFullMovieDetails();
  //   }
  // }, [dispatch, slug, currentMovie?.slug]);

  // ✅ 1. useMutation Function to fetch movie data by slug

  // console.log("Movie Data", movieData);

  const movieDetailsMutation = useMutation({
    mutationFn: async (movieSlug) => {
      Nprogress.start();
      setIsPageLoading(true);
      const response = await api.get(
        `/admin/get-movie-admin-details-by-slug/${movieSlug}`,
      );
      console.log(response.data);
      return response.data.data;
    },
    onSuccess: (data) => {
      setMovieData(data);
      Nprogress.done();
      setIsPageLoading(false);
    },
    onError: (error) => {
      console.error("Fetch Movie Error:", error);
      Nprogress.done();
      setIsPageLoading(false);
    },
  });

  useEffect(() => {
    if (slug && slug !== "undefined") {
      movieDetailsMutation.mutate(slug);
    }
  }, [slug]);

  useEffect(() => {
    const releaseDate =
      movieData?.theattheatreReleaseDate || movieData?.ottReleaseDate;

    let releaseYear = "";
    if (releaseDate) {
      releaseYear = releaseDate.match(/\d{4}/)?.[0] || "";
    }

    if (movieData?.title) {
      document.title = releaseYear
        ? `NextShow | ${movieData.title} (${releaseYear})`
        : `NextShow | ${movieData.title}`;
    }
  }, [movieData]);

  // Loading Screen
  if (isPageLoading) {
    return <LoadingComponents />;
  }

  // Error vantha handle panna
  if (movieDetailsMutation.isError) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500 bg-[#121212]">
        {message || "Movie Not Found"}
      </div>
    );
  }

  // Data illa na onnum kaatatha
  if (!movieData) return null;

  return (
    <div className="mt-16 max-w-7xl mx-auto px-4 md:px-6">
      <MovieDetailsHeader movie={movieData} />
      <MovieDescriptionSection
        movie={movieData}
        isRatingModalOpen={isRatingModalOpen}
        setIsRatingModalOpen={setIsRatingModalOpen}
      />

      {/* 2. Main Content Grid (Split into Left & Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-8 ">
        {/* LEFT SIDE (8 Columns): Gallery, Description, Cast */}
        <div className="lg:col-span-8 space-y-12">
          <MovieGallery movie={movieData} />

          <TopCast movie={movieData} />
        </div>

        {/* RIGHT SIDE (4 Columns): Movie Timeline (Sidebar) */}
        <div className="lg:col-span-4">
          {!isRatingModalOpen && <MovieTimeline movie={movieData} />}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;
