import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "../redux/AdminAuthSlice/AdminAuthSlice";
import VideoSection from "../redux/HomeContentSlice/VideoSlice";
import BlogSection from "../redux/HomeContentSlice/blogSlice";
import StreaminVideoSection from "../redux/StreamingNowSlice/StreamVideo";
import HomeStreamSection from "../redux/HomeContentSlice/HomeStreamSlice";
import HomeMovieSection from "../redux/HomeContentSlice/HomeMovieSlice";
import HomeTrailerSection from "../redux/HomeContentSlice/HomeTrailerSlice";
import CentralizedMovieCreate from "../redux/CentralizedMovieSlice/CentralizedMovieSlice";

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    videoSection: VideoSection,
    blogSection: BlogSection,
    streamingNow: StreaminVideoSection,
    homeStreaming: HomeStreamSection,
    homeMovies: HomeMovieSection,
    homeTrailers: HomeTrailerSection,
    centralizedMovies: CentralizedMovieCreate,
  },
});
