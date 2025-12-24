// src/sections/MovieReviewsSection.js
import React, { useState, useMemo } from "react";
import ReviewCard from "./StreamingReviewCard";

// Data
export const MOVIE_REVIEWS_DATA = [
  {
    id: 1,
    movie: "Jailer",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
    streamType: "NEW",
    source: "The Hindu",
    img: "https://content.tupaki.com/en/feeds/2023/08/10/142196-jail.jpg",
    rating: 4.0,
    summary:
      "A stylish comeback for Rajini! Nelson delivers a solid action comedy with great set pieces and mass moments.",
  },
  {
    id: 2,
    movie: "Vettaiyan",
    streamType: "TRENDING",
    source: "User_Aravind",
    img: "https://m.media-amazon.com/images/S/pv-target-images/d92ce2f6c69640edfde56eeba4bcb8868b7aabe5ba7313b721f8a5425c810716._SX1080_FMjpg_.jpg",
    rating: 4.5,
    summary:
      "Best performance from Rajini in years. A must-watch emotional action flick. Anirudh's BGM is superb!",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
  {
    id: 3,
    movie: "Jana Nayagan",
    streamType: "UPCOMMING",
    source: "DT Next",
    img: "https://i.pinimg.com/736x/1c/09/6c/1c096c1b143ae5f4499e90081b15cf51.jpg",
    rating: 3.5,
    summary:
      "Vijay shines in this political thriller, though the screenplay loses pace in the second half. Overall, a powerful message.",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
  {
    id: 4,
    movie: "Thangalaan",
    streamType: "TRENDING",
    source: "User_Priya",
    img: "https://images.hindustantimes.com/img/2024/08/15/1600x900/Thangalaan_1723709197073_1723709197226.jpg",
    rating: 5.0,
    summary:
      "Pure cinematic brilliance! Pa Ranjith's storytelling and Vikram's commitment are extraordinary. Highly recommended.",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
  // **மேலும் 11 டேட்டா சேர்க்கப்பட்டுள்ளது (மொத்தம் 15)**
  {
    id: 5,
    movie: "Leo",
    streamType: "TRENDING",
    source: "Times",
    img: "https://resizing.flixster.com/-BOvYVtW6LKWOdfbFz12hVdYzGk=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2RlNzVkZjM0LWRiZmEtNGE0YS1hYTUyLTU1YzlhYjQwMzViZi5qcGc=",
    rating: 3.0,
    summary:
      "Lokesh Cinematic Universe expands but lacks LCU intensity. Still a decent watch.",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
  {
    id: 6,
    movie: "Ayalaan",
    streamType: "TRENDING",
    img: "https://sund-images.sunnxt.com/183332/640x360_Ayalaan_183332_cb824cdc-d392-4342-9671-ed5993e24106.jpg",
    source: "User_Karthi",
    rating: 4.2,
    summary:
      "Great visual effects and fun family entertainer. Sci-fi works well for the kids.",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
  {
    id: 7,
    movie: "Indian",

    streamType: "TRENDING",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3NKYr7e-aJ4nWHWHIne16exZqYhy3vNFS8w&s",
    source: "Behindwoods",
    rating: 4.5,
    summary:
      "Shankar delivers a masterpiece. Kamal Haasan is flawless. The stunts are breathtaking.",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
  {
    id: 8,
    movie: "Captain Miller",
    streamType: "TRENDING",
    img: "https://m.media-amazon.com/images/M/MV5BNmMyNjlhY2UtN2QxNi00MWRiLWJjZDgtMzU1ZWM2NzZkNTQ1XkEyXkFqcGc@._V1_.jpg",
    source: "User_Deepa",
    rating: 4.0,
    summary:
      "Dhanush's best performance. Period war film feels raw and emotional.",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
  {
    id: 9,
    movie: "Viduthalai P1",
    streamType: "TRENDING",
    img: "https://img.airtel.tv/unsafe/fit-in/500x0/filters:format(webp)/https://xstreamcp-assets-msp.streamready.in/assets/ZEEFIVE/MOVIE/66ff656c56c0c1016282c99a/images/720x108079149533392f461ba75a664d5a95aa13.jpg?o=production",
    source: "India Today",
    rating: 4.0,
    summary:
      "Vetrimaaran's raw and gritty take on police brutality is gripping. Soori is a revelation.",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
  {
    id: 10,
    movie: "Thunivu",
    streamType: "NEW",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR09Ipl53al9eH4VyxgdeXFwmaZEElbJvopgA&s",
    source: "User_Manoj",
    rating: 3.8,
    summary:
      "Stylish heist film. Ajith carries the entire movie with ease and swag.",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
  {
    id: 11,
    movie: "Vaathi",
    streamType: "NEW",
    img: "https://m.media-amazon.com/images/M/MV5BODhmMTFmNjMtZjMwOS00MjNlLWJkNzQtYTI0MjhiZDMzNzZmXkEyXkFqcGc@._V1_.jpg",

    source: "Film Companion",
    rating: 3.0,
    summary:
      "An important social message packaged into an average entertainer. Still worth a watch.",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
  {
    id: 12,
    movie: "Sardar-2",
    streamType: "UPCOMMING",
    img: "https://m.media-amazon.com/images/M/MV5BMmYxMmJkMDAtNzc4NC00MzliLWJiNmItMWIyNGI5OWIyM2Q4XkEyXkFqcGc@._V1_.jpg",
    source: "User_Shalini",
    rating: 4.1,
    summary:
      "Karthi's double role worked wonders. A solid spy thriller with engaging twists.",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
  {
    id: 13,
    movie: "Pathu Thala",
    streamType: "UPCOMMING",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJDrSW9f_JTZ6CDpi4FPxA64l_NyEwTLpCWA&s",
    source: "Galatta",
    rating: 3.5,
    summary:
      "Simbu's screen presence elevates this action drama. Good mass appeal.",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
  {
    id: 14,
    movie: "Maamannan",
    streamType: "UPCOMMING",
    img: "https://m.media-amazon.com/images/M/MV5BNjdhOTg4NzMtMTY2MC00YmY0LWJiMWMtMTJkYzIzMWFmNTJmXkEyXkFqcGc@._V1_.jpg",
    source: "User_Sanjay",
    rating: 4.8,
    summary:
      "Fahadh Faasil steals the show. Powerful political drama from Mari Selvaraj.",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
  {
    id: 15,
    movie: "Ponniyin Selvan 2",
    streamType: "TRENDING",
    img: "https://resizing.flixster.com/bykwdBFKjGapfGZZ9cLdQjQsEoQ=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzLzFiYjc4OGQzLWM3NWMtNDY4ZS1iOTYxLWY3Y2RlMGFmNjM3OC5qcGc=",
    source: "Vikatan",
    rating: 4.0,
    summary:
      "Epic conclusion to a magnum opus. Grand visuals and solid performance from the cast.",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
];

// 1. Updated Tab Names
const REVIEW_TABS = [
  { id: "UPCOMMING", label: "Upcoming" },
  { id: "NEW", label: "New Releases" },
  { id: "TRENDING", label: "Trending Now" },
];

const INITIAL_REVIEWS_COUNT = 9;
const REVIEWS_PER_LOAD = 6;

const MovieStreamingSection = () => {
  const [activeTab, setActiveTab] = useState("UPCOMMING");
  const [reviewsToShow, setReviewsToShow] = useState(INITIAL_REVIEWS_COUNT);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setReviewsToShow(INITIAL_REVIEWS_COUNT);
  };

  // UPDATED: Simple and strict filtering based on streamType
  const filteredReviews = useMemo(() => {
    return MOVIE_REVIEWS_DATA.filter(
      (review) => review.streamType === activeTab
    );
  }, [activeTab]);

  const handleLoadMore = () => {
    setReviewsToShow((prevCount) => prevCount + REVIEWS_PER_LOAD);
  };

  const allReviewsLoaded = filteredReviews.length <= reviewsToShow;

  const getTabClasses = (tabId) =>
    `py-2 px-6 text-[13px] md:text-md lg:text-lg font-semibold transition-all duration-300 
     ${
       activeTab === tabId
         ? "bg-red-600 text-white rounded-t-lg shadow-lg"
         : "text-gray-400 hover:text-white hover:bg-[#252525]"
     }`;

  return (
    <div className="bg-[#0f0f0f] pt-10 px-8">
      <h2 className="text-white text-xl md:text-3xl font-bold mb-6">
        Streaming Now
      </h2>

      {/* TAB NAVIGATION */}
      <div className="flex border-b border-gray-700 mb-8">
        {REVIEW_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={getTabClasses(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* REVIEW GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-scroll pr-4 custom-scroll">
        {filteredReviews.length > 0 ? (
          filteredReviews
            .slice(0, reviewsToShow)
            .map((review) => <ReviewCard key={review.id} review={review} />)
        ) : (
          <p className="text-gray-500 col-span-2 py-10 text-center text-xl italic">
            No {activeTab.toLowerCase()} movies available right now.
          </p>
        )}
      </div>

      {/* VIEW MORE BUTTON */}
      {filteredReviews.length > INITIAL_REVIEWS_COUNT && !allReviewsLoaded && (
        <div className="flex justify-center mt-10">
          <button
            onClick={handleLoadMore}
            className="py-3 px-8 bg-gray-700 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300"
          >
            View More {activeTab} ({filteredReviews.length - reviewsToShow}{" "}
            remaining)
          </button>
        </div>
      )}

      {allReviewsLoaded && filteredReviews.length > INITIAL_REVIEWS_COUNT && (
        <p className="text-center text-green-400 mt-10 font-medium pb-10">
          You have viewed all {activeTab} content.
        </p>
      )}
    </div>
  );
};

export default MovieStreamingSection;
