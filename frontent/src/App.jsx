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
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  NProgress.configure({
    showSpinner: false,
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
    location.pathname.startsWith("/auth");

  return (
    <>
      <ScrollToTop />
      {!hideLayout && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<NewMovies />} />
        <Route path="/stream" element={<StreamingNow />} />

        <Route path="/trailer" element={<Trailer />} />
        <Route path="/news" element={<News />} />
        <Route path="/about" element={<About />} />
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
    </>
  );
};

export default App;
