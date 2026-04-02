// src/sections/MovieReviewsSection.js
import React, { useState, useMemo } from "react";
import ReviewCard from "./StreamingReviewCard";

// Data
export const MOVIE_REVIEWS_DATA = [
  {
    id: 1,
    movie: "Jailer (2023)",
    reviewType: "CRITIC",
    source: "The Hindu",
    rating: 4.0,
    summary:
      "A stylish comeback for Rajini! Nelson delivers a solid action comedy with great set pieces and mass moments.",
    date: "2023-08-10",
  },
  {
    id: 2,
    movie: "Vettaiyan (2025)",
    reviewType: "AUDIENCE",
    source: "User_Aravind",
    rating: 4.5,
    summary:
      "Best performance from Rajini in years. A must-watch emotional action flick. Anirudh's BGM is superb!",
    date: "2025-11-20",
  },
  {
    id: 3,
    movie: "Thalapathy 69 (2025)",
    reviewType: "CRITIC",
    source: "DT Next",
    rating: 3.5,
    summary:
      "Vijay shines in this political thriller, though the screenplay loses pace in the second half. Overall, a powerful message.",
    date: "2025-12-05",
  },
  {
    id: 4,
    movie: "Thangalaan (2024)",
    reviewType: "AUDIENCE",
    source: "User_Priya",
    rating: 5.0,
    summary:
      "Pure cinematic brilliance! Pa Ranjith's storytelling and Vikram's commitment are extraordinary. Highly recommended.",
    date: "2024-04-14",
  },
  // **மேலும் 11 டேட்டா சேர்க்கப்பட்டுள்ளது (மொத்தம் 15)**
  {
    id: 5,
    movie: "Leo (2023)",
    reviewType: "CRITIC",
    source: "Times",
    rating: 3.0,
    summary:
      "Lokesh Cinematic Universe expands but lacks LCU intensity. Still a decent watch.",
    date: "2023-10-19",
  },
  {
    id: 6,
    movie: "Ayalaan (2024)",
    reviewType: "AUDIENCE",
    source: "User_Karthi",
    rating: 4.2,
    summary:
      "Great visual effects and fun family entertainer. Sci-fi works well for the kids.",
    date: "2024-01-14",
  },
  {
    id: 7,
    movie: "Indian 2 (2025)",
    reviewType: "CRITIC",
    source: "Behindwoods",
    rating: 4.5,
    summary:
      "Shankar delivers a masterpiece. Kamal Haasan is flawless. The stunts are breathtaking.",
    date: "2025-09-01",
  },
  {
    id: 8,
    movie: "Captain Miller (2024)",
    reviewType: "AUDIENCE",
    source: "User_Deepa",
    rating: 4.0,
    summary:
      "Dhanush's best performance. Period war film feels raw and emotional.",
    date: "2024-01-12",
  },
  {
    id: 9,
    movie: "Viduthalai P1 (2023)",
    reviewType: "CRITIC",
    source: "India Today",
    rating: 4.0,
    summary:
      "Vetrimaaran's raw and gritty take on police brutality is gripping. Soori is a revelation.",
    date: "2023-03-31",
  },
  {
    id: 10,
    movie: "Thunivu (2023)",
    reviewType: "AUDIENCE",
    source: "User_Manoj",
    rating: 3.8,
    summary:
      "Stylish heist film. Ajith carries the entire movie with ease and swag.",
    date: "2023-01-11",
  },
  {
    id: 11,
    movie: "Vaathi (2023)",
    reviewType: "CRITIC",
    source: "Film Companion",
    rating: 3.0,
    summary:
      "An important social message packaged into an average entertainer. Still worth a watch.",
    date: "2023-02-17",
  },
  {
    id: 12,
    movie: "Sardar (2022)",
    reviewType: "AUDIENCE",
    source: "User_Shalini",
    rating: 4.1,
    summary:
      "Karthi's double role worked wonders. A solid spy thriller with engaging twists.",
    date: "2022-10-21",
  },
  {
    id: 13,
    movie: "Pathu Thala (2023)",
    reviewType: "CRITIC",
    source: "Galatta",
    rating: 3.5,
    summary:
      "Simbu's screen presence elevates this action drama. Good mass appeal.",
    date: "2023-03-30",
  },
  {
    id: 14,
    movie: "Maamannan (2023)",
    reviewType: "AUDIENCE",
    source: "User_Sanjay",
    rating: 4.8,
    summary:
      "Fahadh Faasil steals the show. Powerful political drama from Mari Selvaraj.",
    date: "2023-06-29",
  },
  {
    id: 15,
    movie: "Ponniyin Selvan 2 (2023)",
    reviewType: "CRITIC",
    source: "Vikatan",
    rating: 4.0,
    summary:
      "Epic conclusion to a magnum opus. Grand visuals and solid performance from the cast.",
    date: "2023-04-28",
  },
];

// 1. Updated Tab Names
const REVIEW_TABS = [
  { id: "Upcoming", label: "Upcoming" },
  { id: "New", label: "New Releases" },
  { id: "Trending Now", label: "Trending Now" },
];

const INITIAL_REVIEWS_COUNT = 9;
const REVIEWS_PER_LOAD = 6;

const MovieReviewsSection = () => {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [reviewsToShow, setReviewsToShow] = useState(INITIAL_REVIEWS_COUNT);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setReviewsToShow(INITIAL_REVIEWS_COUNT);
  };

  // 2. Updated Filtering Logic based on New Tabs
  const filteredReviews = useMemo(() => {
    let reviews = [...MOVIE_REVIEWS_DATA];
    const today = new Date();
    const currentYear = today.getFullYear();

    if (activeTab === "Upcoming") {
      // Future dates ulla movies-a filter pannuvom (Example logic)
      return reviews.filter(
        (review) =>
          new Date(review.date) > today || review.movie.includes("2025")
      );
    }

    if (activeTab === "New") {
      // Recent releases (Current year)
      return reviews.filter((review) =>
        review.movie.includes(currentYear.toString())
      );
    }

    if (activeTab === "Trending Now") {
      // High rating ulla movies-a trending-ah kaamikkalam
      return reviews
        .filter((review) => review.rating >= 4.0)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return reviews;
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
          <p className="text-gray-500 col-span-3 py-10 text-center">
            No items found for {activeTab}.
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

export default MovieReviewsSection;
