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
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import api from "../api";
import { useSnackbar } from "../../context/SnackbarContext";
import { useToggleWatchlist, useWatchlistStatus } from "../hooks/useWatchlist";

const MovieDetailsPage = () => {
  const { slug } = useParams();
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [movieData, setMovieData] = useState(null);
  const dispatch = useDispatch();
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const { showSnackbar } = useSnackbar;
  const queryClient = useQueryClient();

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

  console.log("Movie Data", movieData);

  // ======================================================
  // ✅ WATCHLIST STATUS
  // ======================================================
  const {
    data: watchlistData,
    isLoading: watchlistLoading,
    isError: watchlistError,
    error: watchlistErrorMessage,
    refetch: refetchWatchlist,
  } = useWatchlistStatus({
    movieId: movieData?.id,
    enabled: !!movieData?.id,
  });

  // ======================================================
  // ✅ TOGGLE WATCHLIST
  // ======================================================
  const toggleWatchlistMutation = useToggleWatchlist({
    movieId: movieData?.id,
  });

  const isInWatchlist = watchlistData?.inWatchlist || false;
  // console.log("IsWatchList", isInWatchlist);

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

  // ======================================================
  // ✅ CHECK MARK WATCHED STATUS
  // ======================================================

  // const {
  //   data: watchedData,
  //   isLoading: watchedLoading,
  //   isError: watchedError,
  // } = useQuery({
  //   queryKey: ["mark-watched", movieData?.id],
  //   queryFn: async ({ queryKey }) => {
  //     // ============================================
  //     // ✅ GET MOVIE ID FROM QUERY KEY
  //     // ============================================
  //     const [, movieId] = queryKey;
  //     console.log("MovieID", movieId);
  //     const response = await api.get(
  //       `/auth/user/check-mark-watched/${movieId}`,
  //     );
  //     console.log("Watched Data Movie", response.data);
  //     return response.data;
  //   },
  //   // ====================================================
  //   // ✅ ONLY RUN AFTER MOVIE DATA AVAILABLE
  //   // ====================================================
  //   enabled: !!movieData?.id,
  // });

  // ======================================================
  // ✅ PARALLEL USER ACTIVITY QUERIES
  // ======================================================

  const userActivityQueries = useQueries({
    queries: [
      // ==================================================
      // ✅ MARK WATCHED STATUS
      // ==================================================
      {
        queryKey: ["mark-watched", movieData?.id],
        queryFn: async ({ queryKey }) => {
          // ============================================
          // ✅ GET MOVIE ID FROM QUERY KEY
          // ============================================
          const [, movieId] = queryKey;
          console.log("MovieID", movieId);
          const response = await api.get(
            `/auth/user/check-mark-watched/${movieId}`,
          );
          console.log("Watched Data Movie", response.data);
          return response.data;
        },
        enabled: !!movieData?.id,
      },
      // ==================================================
      // ✅ USER MOVIE RATING
      // ==================================================
      {
        queryKey: ["user-movie-rating", movieData?.id],
        queryFn: async () => {
          const response = await api.get(
            `/auth/user/get-user-rating/${movieData.id}`,
          );
          return response.data;
        },
        enabled: !!movieData?.id,
      },
    ],
  });

  // ======================================================
  // ✅ WATCHED QUERY
  // ======================================================
  const watchedData = userActivityQueries[0]?.data;
  const watchedLoading = userActivityQueries[0]?.isLoading;
  const watchedError = userActivityQueries[0]?.isError;

  // ======================================================
  // ✅ USER RATING QUERY
  // ======================================================
  const userRatingData = userActivityQueries[1]?.data;
  const userRatingLoading = userActivityQueries[1]?.isLoading;
  const userRatingError = userActivityQueries[1]?.isError;

  const toggleMarkWatchedMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/auth/user/toggle-mark-watched", {
        movieId: movieData?.id,
      });

      return response.data;
    },

    // ======================================================
    // ✅ OPTIMISTIC UPDATE
    // ======================================================

    onMutate: async () => {
      // ============================================
      // ✅ STOP OLD REQUESTS
      // ============================================

      await queryClient.cancelQueries({
        queryKey: ["mark-watched", movieData?.id],
      });

      // ============================================
      // ✅ GET OLD DATA
      // ============================================

      const previousWatchedData = queryClient.getQueryData([
        "mark-watched",
        movieData?.id,
      ]);

      // ============================================
      // ✅ INSTANT UI UPDATE
      // ============================================

      queryClient.setQueryData(
        ["mark-watched", movieData?.id],

        (oldData) => ({
          ...oldData,

          watched: !oldData?.watched,
        }),
      );

      // ============================================
      // ✅ RETURN CONTEXT
      // ============================================

      return {
        previousWatchedData,
      };
    },

    // ======================================================
    // ✅ SUCCESS
    // ======================================================

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["mark-watched", movieData?.id],
      });
    },

    // ======================================================
    // ✅ ERROR ROLLBACK
    // ======================================================

    onError: (error, variables, context) => {
      console.log("TOGGLE MARK WATCHED ERROR", error);

      // ============================================
      // ✅ ROLLBACK
      // ============================================

      queryClient.setQueryData(
        ["mark-watched", movieData?.id],
        context.previousWatchedData,
      );
    },
  });

  // ======================================================
  // ✅ ADD MOVIE RATING
  // ======================================================
  const addMovieRatingMutation = useMutation({
    mutationFn: async (ratingData) => {
      const response = await api.post(
        "/auth/user/add-update-rating",
        ratingData,
      );
      return response.data;
    },
    // ======================================================
    // ✅ OPTIMISTIC UPDATE
    // ======================================================
    onMutate: async (ratingData) => {
      // ============================================
      // ✅ CANCEL OLD REQUEST
      // ============================================
      await queryClient.cancelQueries({
        queryKey: ["user-movie-rating", movieData?.id],
      });

      // ============================================
      // ✅ OLD DATA
      // ============================================
      const previousRatingData = queryClient.getQueryData([
        "user-movie-rating",
        movieData?.id,
      ]);
      // ============================================
      // ✅ INSTANT UI UPDATE
      // ============================================
      queryClient.setQueryData(
        ["user-movie-rating", movieData?.id],

        () => ({
          success: true,

          rated: true,

          data: {
            rating: ratingData.rating,
            review: ratingData.review,
          },
        }),
      );
      return {
        previousRatingData,
      };
    },
    // ======================================================
    // ✅ SUCCESS
    // ======================================================
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["user-movie-rating", movieData?.id],
      });
    },
    // ======================================================
    // ✅ ERROR ROLLBACK
    // ======================================================
    onError: (error, variables, context) => {
      console.log("ADD MOVIE RATING ERROR", error);

      // ============================================
      // ✅ ROLLBACK
      // ============================================

      queryClient.setQueryData(
        ["user-movie-rating", movieData?.id],
        context.previousRatingData,
      );
    },
  });

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
        // ============================================
        // ✅ MARK WATCHED
        // ============================================
        watchedData={watchedData}
        watchedLoading={watchedLoading}
        watchedError={watchedError}
        toggleMarkWatchedMutation={toggleMarkWatchedMutation}
        // ============================================
        // ✅ USER RATING
        // ============================================
        userRatingData={userRatingData}
        userRatingLoading={userRatingLoading}
        userRatingError={userRatingError}
        addMovieRatingMutation={addMovieRatingMutation}
        // ============================================
        // ✅ WATCHLIST
        // ============================================
        isInWatchlist={isInWatchlist}
        watchlistLoading={watchlistLoading}
        watchlistError={watchlistError}
        watchlistErrorMessage={watchlistErrorMessage}
        refetchWatchlist={refetchWatchlist}
        toggleWatchlistMutation={toggleWatchlistMutation}
      />

      {/* 2. Main Content Grid (Split into Left & Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-8 ">
        {/* LEFT SIDE (8 Columns): Gallery, Description, Cast */}
        <div className="lg:col-span-9 ">
          <MovieGallery movie={movieData} />

          <TopCast movie={movieData} />
        </div>

        {/* RIGHT SIDE (4 Columns): Movie Timeline (Sidebar) */}
        {/* <div className="lg:col-span-4">
          {!isRatingModalOpen && <MovieTimeline movie={movieData} />}
        </div> */}
      </div>
    </div>
  );
};

export default MovieDetailsPage;
