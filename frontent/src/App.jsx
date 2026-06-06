import React, { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Home from "./Home/Home";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import NewMovies from "./NewMovies/NewMovies";
import StreamingNow from "./StreamingNow/StreamingNow";
import Dashboard from "./ADMIN/Dashboard/Dashboard";
import DashboardHome from "./ADMIN/Dashboard/DashboardHome";
import Trailer from "./Trailer/TrailerPage";
import NProgress from "nprogress"; // Import NProgress
import "nprogress/nprogress.css"; // Import CSS
import Login from "./ADMIN/Login";
import AdminProtect from "./ADMIN/AdminComponents/AdminProtect";
import StreamingContent from "./ADMIN/Dashboard/StreamingNow/StreamingContent";
import CentralizedContent from "./ADMIN/Dashboard/CentralizedContent/CentralizedContent";
import About from "./About/About";
import News from "./News/News";
import ScrollToTop from "./Components/ScrollTop";
import { useDispatch } from "react-redux";
import { getMeAdmin } from "./redux/AdminAuthSlice/AdminAuthSlice";
import MovieDetailsPage from "./MovieDetails/MovieDetailsPage";
import NewTrailerSection from "./ADMIN/Dashboard/NewTrailers/NewTrailerSection";
import NewsList from "./ADMIN/Dashboard/News/NewsList";
import AddNews from "./ADMIN/Dashboard/News/AddNews";
import EditNews from "./ADMIN/Dashboard/News/EditNews";
import TrashMovie from "./ADMIN/Dashboard/TrashMovie/TrashMovie";
import { useWebsiteTracking } from "./hooks/useWebsiteTracking";
import NewsPage from "./NewsSection/NewsPage";
import NewsDetails from "./NewsSection/NewsDetailsSection/NewsDetails";
import { useQuery } from "@tanstack/react-query";
import {
  authFail,
  authStart,
  authSuccess,
} from "./redux/userAuthSlice/UserAuthSlice";
import api from "./api";
import ProfileLayout from "./ProfileLayout/ProfileLayout";
import MyProfilePage from "./ProfileLayout/Myprofile";
import WatchlistPage from "./ProfileLayout/WatchList";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import AuthComponent from "./Components/LoginSignupComponent";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthOpen, closeAuth } = useAuth();

  NProgress.configure({
    showSpinner: false,
  });

  const {
    data: currentUserData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      try {
        // ======================================================
        // ✅ AUTH START
        // ======================================================
        dispatch(authStart());
        // ======================================================
        // ✅ API CALL
        // ======================================================

        const response = await api.get("/auth/user/current-user");
        // ======================================================
        // ✅ STORE USER
        // ======================================================
        dispatch(authSuccess(response.data.user));
        return response.data.user;
      } catch (error) {
        // ======================================================
        // ✅ AUTH FAIL
        // ======================================================
        dispatch(
          authFail(error?.response?.data?.message || "Authentication failed"),
        );
        throw error;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Intha oru line unga moththa tracking-aiyum paathukkum
  useWebsiteTracking(location.pathname);

  // console.log("API URL:", import.meta.env.VITE_API_TRACK_EXIT_URL);

  useEffect(() => {
    const handleTabClose = () => {
      const sessionId = sessionStorage.getItem("session_id");
      if (sessionId) {
        const baseUrl = import.meta.env.VITE_API_TRACK_EXIT_URL;
        const url = `${baseUrl}/admin/track-exit`;

        // 2. Beacon API-ku Blob data anuppuvom (Header issue varaama irukka)
        const blob = new Blob([JSON.stringify({ sessionId })], {
          type: "application/json",
        });

        if (navigator.sendBeacon) {
          navigator.sendBeacon(url, blob);
        } else {
          fetch(url, {
            method: "POST",
            body: JSON.stringify({ sessionId }),
            headers: { "Content-Type": "application/json" },
            keepalive: true,
          });
        }
      }
    };
    window.addEventListener("beforeunload", handleTabClose);
    return () => window.removeEventListener("beforeunload", handleTabClose);
  }, []);

  useEffect(() => {
    const localAdmin = localStorage.getItem("nextShow_admin");
    // Path "/auth/login" aaga illai endral mattum session check seiyavum
    if (localAdmin && !location.pathname.startsWith("/auth/login")) {
      dispatch(getMeAdmin());
    }
  }, [dispatch, location.pathname]); // location.pathname dependency-il irukkum pothu careful-aga handle seiyavum

  useEffect(() => {
    NProgress.start();
    // small delay for smooth UX
    const timer = setTimeout(() => {
      NProgress.done();
    }, 1400);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const hideLayout =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/auth") ||
    location.pathname.startsWith("/profile");

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      {!hideLayout && <Navbar />}
      {/* ✅ குளோபல் Auth மாடல் - UI ரெண்டரிங் */}
      <AnimatePresence>
        {isAuthOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          >
            {/* CLICK OUTSIDE */}
            <div className="absolute inset-0" onClick={closeAuth} />

            {/* MODAL CONTENT */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 24,
              }}
              className="relative z-10"
            >
              <AuthComponent />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<NewMovies />} />
        <Route path="/stream" element={<StreamingNow />} />

        <Route path="/trailer" element={<Trailer />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:slug" element={<NewsDetails />} />
        {/* <Route path="/about" element={<About />} /> */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/movie/:slug" element={<MovieDetailsPage />} />

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminProtect />}>
          <Route path="" element={<Dashboard />}>
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<DashboardHome />} />
            <Route path="stream" element={<StreamingContent />} />
            <Route path="centralized" element={<CentralizedContent />} />
            <Route path="trash" element={<TrashMovie />} />
            <Route path="new-trailers" element={<NewTrailerSection />} />
            <Route path="news-list" element={<NewsList />} />{" "}
            {/* New Route for News List */}
            <Route path="news-add" element={<AddNews />} />{" "}
            {/* New Route for Adding News */}
            <Route path="edit-news/:id" element={<EditNews />} />
          </Route>
        </Route>
        <Route path="/profile" element={<ProfileLayout />}>
          <Route index element={<MyProfilePage />} />
          <Route path="watchlist" element={<WatchlistPage />} />
        </Route>
        {/* Optional: 404 */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
              Page Not Found
            </div>
          }
        />
      </Routes>

      {!hideLayout && <Footer />}
      {/* 
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
      * { font-family: 'Sora', sans-serif; box-sizing: border-box; margin: 0; padding: 0; }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in { animation: fadeIn 0.35s ease both; }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 4px; }
    `}</style> */}
    </div>
  );
};

export default App;
