import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Home/Home";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import NewMovies from "./NewMovies/NewMovies";
import StreamingNow from "./StreamingNow/StreamingNow";
import ScrollToTop from "./Components/ScrolltoTop";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<NewMovies />} />
        <Route path="/stream" element={<StreamingNow />} />
      </Routes>

      <Footer />
    </>
  );
};

export default App;
