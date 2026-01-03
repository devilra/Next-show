import React from "react";
import NewVideoSection from "./NewVideoSection";
import UpcomingMoviesCarousel from "./UpcomingMoviesCarousel";
import NewReleaseMoviesCarousel from "./NewReleaseMoviesCarousel";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { useEffect } from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import Nprogress from "nprogress";
import { fetchNewMoviesPage } from "../redux/CentralizedMovieSlice/CentralizedMovieSlice";
import LoadingComponents from "../Components/LoadingComponents";

const NewMovies = () => {
  const dispatch = useDispatch();
  const [isPageLoading, setIsPageLoading] = useState(false);

  // Redux state-la irunthu data-vai edukkirom
  const { newMoviesData, isPublicError } = useSelector(
    (state) => state.centralizedMovies
  );

  // console.log(newMoviesData);
  // Data irukkannu check pannikirom (to avoid re-fetching)
  const hasData =
    newMoviesData.upcoming?.length > 0 || newMoviesData.newReleases?.length > 0;

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
        await Promise.all([
          dispatch(fetchNewMoviesPage()).then(unwrapResult),
          // Inga vera ethavathu fetch thalaivara iruntha add pannikalam
        ]);
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
  if (isPageLoading) {
    return <LoadingComponents />;
  }

  // Error handle (Optional)
  if (isPublicError) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p className="text-red-500">
          Failed to load content. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div>
      <NewVideoSection />
      <UpcomingMoviesCarousel upcomingMovies={newMoviesData.upcoming} />
      <NewReleaseMoviesCarousel newReleases={newMoviesData.newReleases} />
    </div>
  );
};

export default NewMovies;
