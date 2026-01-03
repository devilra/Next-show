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
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  NProgress.configure({
    showSpinner: false,
  });

  useEffect(() => {
    const localAdmin = localStorage.getItem("nextShow_admin");
    // Path "/auth/login" aaga illai endral mattum session check seiyavum
    if (localAdmin && !location.pathname.startsWith("/auth/login")) {
      dispatch(getMeAdmin());
    }
  }, [dispatch]); // location.pathname dependency-il irukkum pothu careful-aga handle seiyavum

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

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminProtect />}>
          <Route path="" element={<Dashboard />}>
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<DashboardHome />} />
            <Route path="stream" element={<StreamingContent />} />
            <Route path="centralized" element={<CentralizedContent />} />
          </Route>
        </Route>
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
};

export default App;
