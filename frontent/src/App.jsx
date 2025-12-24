import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./Home/Home";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import NewMovies from "./NewMovies/NewMovies";
import StreamingNow from "./StreamingNow/StreamingNow";
import ScrollToTop from "./Components/ScrollToTop";
import Dashboard from "./ADMIN/Dashboard/Dashboard";
import DashboardHome from "./ADMIN/Dashboard/DashboardHome";
import Trailer from "./Trailer/TrailerPage";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

const App = () => {
  const location = useLocation();

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

        {/* Admin Dashboard */}
        <Route path="admin" element={<Dashboard />}>
          <Route path="dashboard" element={<DashboardHome />} />
        </Route>
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
};

export default App;
