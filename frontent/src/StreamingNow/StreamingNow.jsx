import React, { useEffect, useState } from "react";
import StreamVideoSection from "./StreamVideoSection";
import StreamingUpcommingMovies from "./StreamingUpcommingMovies";
import StreamingNewRelease from "./StreamingNewRelease";
import { useDispatch, useSelector } from "react-redux";
import { FaSpinner } from "react-icons/fa";
import Nprogress from "nprogress";
import { fetchActiveStreaming } from "../redux/StreamingNowSlice/StreamVideo";
import { unwrapResult } from "@reduxjs/toolkit";
import { fetchStreamingNowPage } from "../redux/CentralizedMovieSlice/CentralizedMovieSlice";
import LoadingComponents from "../Components/LoadingComponents";

const StreamingNow = () => {
  const dispatch = useDispatch();
  const [isPageLoading, setIsPageLoading] = useState(false);

  const { activeItems } = useSelector((state) => state.streamingNow);
  const { streamingData } = useSelector((state) => state.centralizedMovies);

  //console.log(streamingData);

  const hasData =
    activeItems.length > 0 ||
    streamingData.upcoming.length > 0 ||
    streamingData.newReleases > 0;

  useEffect(() => {
    const fetchAllHomeData = async () => {
      if (hasData) {
        setIsPageLoading(false);
        return;
      }

      try {
        setIsPageLoading(true);
        Nprogress.start();
        await Promise.all([
          dispatch(fetchActiveStreaming()).then(unwrapResult),
          dispatch(fetchStreamingNowPage()).then(unwrapResult),
        ]);
      } catch (error) {
        console.error("Home Page Parallel Fetch Error:", error);
      } finally {
        setIsPageLoading(false);
        Nprogress.done();
      }
    };
    fetchAllHomeData();
  }, [dispatch]);

  // Loading Screen
  if (isPageLoading) {
    return <LoadingComponents />;
  }

  return (
    <div>
      <StreamVideoSection activeItems={activeItems} />
      <StreamingUpcommingMovies upcoming={streamingData.upcoming} />
      <StreamingNewRelease newReleases={streamingData.newReleases} />
    </div>
  );
};

export default StreamingNow;
