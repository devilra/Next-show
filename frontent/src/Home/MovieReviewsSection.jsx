// src/sections/MovieReviewsSection.js

import React, { useState, useMemo } from "react";
import ReviewCard from "./ReviewCard";

// src/data/ReviewData.js - இங்கே அதிக டேட்டா சேர்க்கப்பட்டுள்ளது (உங்கள் தேவைக்காக)
// இந்த டேட்டாவை நீங்கள் தனி ஃபைலில் இருந்து இறக்குமதி (import) செய்ய வேண்டும்
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

// ரிவியூ வகைகளுக்கான டேப் லிஸ்ட்
const REVIEW_TABS = [
  { id: "LATEST", label: "Latest Reviews" },
  { id: "CRITIC", label: "Top Critic Reviews" },
  { id: "AUDIENCE", label: "Audience Reviews" },
];

// ஆரம்பத்தில் காட்ட வேண்டிய ரிவியூக்களின் எண்ணிக்கை
const INITIAL_REVIEWS_COUNT = 9;
// ஒவ்வொரு முறையும் "Load More" கொடுக்கும்போது சேர்க்க வேண்டிய ரிவியூக்களின் எண்ணிக்கை
const REVIEWS_PER_LOAD = 6;

const MovieReviewsSection = () => {
  // 1. ஆரம்ப ஸ்டேட்டை செட் செய்யவும்
  const [activeTab, setActiveTab] = useState("LATEST");
  // 2. காட்ட வேண்டிய ரிவியூக்களின் எண்ணிக்கையைக் கட்டுப்படுத்த
  const [reviewsToShow, setReviewsToShow] = useState(INITIAL_REVIEWS_COUNT);

  // 3. activeTab மாறும் போது reviewsToShow-ஐ மீண்டும் ஆரம்ப நிலைக்கு மாற்றவும் (Reset)
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setReviewsToShow(INITIAL_REVIEWS_COUNT); // புதிய டேப்-க்கு மாறும்போது, ஆரம்ப 9-ஐ மட்டும் காட்டவும்
  };

  // டேட்டா வடிகட்டல் (Data Filtering Logic)
  const filteredReviews = useMemo(() => {
    let reviews = [...MOVIE_REVIEWS_DATA];

    if (activeTab === "LATEST") {
      return reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
      return reviews.filter((review) => review.reviewType === activeTab);
    }
  }, [activeTab]);

  // "Load More" பட்டனைக் கிளிக் செய்தால்
  const handleLoadMore = () => {
    // தற்போதுள்ள எண்ணிக்கையுடன் REVIEWS_PER_LOAD ஐ கூட்டவும்
    setReviewsToShow((prevCount) => prevCount + REVIEWS_PER_LOAD);
  };

  // அனைத்து ரிவியூக்களும் காட்டப்பட்டுவிட்டதா என்று சரிபார்க்க
  const allReviewsLoaded = filteredReviews.length <= reviewsToShow;

  // டேப் UI ஸ்டைலிங்
  const getTabClasses = (tabId) =>
    `py-2 px-6 text-[13px] md:text-md lg:text-lg font-semibold transition-all duration-300 
     ${
       activeTab === tabId
         ? "bg-red-600 text-white rounded-t-lg shadow-lg"
         : "text-gray-400 hover:text-white hover:bg-[#252525]"
     }`;

  return (
    <div className="bg-[#0f0f0f] pt-10 px-8">
      {/* SECTION HEADER */}
      <h2 className="text-white text-xl md:text-3xl font-bold mb-6">
        Movie Reviews
      </h2>

      {/* TAB NAVIGATION */}
      <div className="flex border-b border-gray-700 mb-8">
        {REVIEW_TABS.map((tab) => (
          <button
            key={tab.id}
            // onClick-ஐ handleTabChange மூலம் மாற்றவும்
            onClick={() => handleTabChange(tab.id)}
            className={getTabClasses(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* REVIEW GRID */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[500px] overflow-y-scroll pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {filteredReviews.length > 0 ? (
          // reviewsToShow எண்ணிக்கையைப் பயன்படுத்தி ரிவியூக்களைக் காட்டவும்
          filteredReviews
            .slice(0, reviewsToShow)
            .map((review) => <ReviewCard key={review.id} review={review} />)
        ) : (
          <p className="text-gray-500 col-span-3">
            No reviews found for this selection.
          </p>
        )}
      </div> */}

      {/* VIEW MORE BUTTON (அனைத்தும் காட்டப்பட்டால் பட்டன் மறையும்) */}
      {/* {filteredReviews.length > INITIAL_REVIEWS_COUNT && !allReviewsLoaded && (
        <div className="flex justify-center mt-10">
          <button
            onClick={handleLoadMore}
            className="py-3 px-8 bg-gray-700 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300"
          >
            Load More Reviews ({filteredReviews.length - reviewsToShow}{" "}
            remaining)
          </button>
        </div>
      )} */}

      {/* அனைத்து ரிவியூக்களும் காட்டப்பட்டுவிட்டால் ஒரு மெசேஜ் */}
      {/* {allReviewsLoaded && filteredReviews.length > INITIAL_REVIEWS_COUNT && (
        <p className="text-center text-green-400 mt-10 font-medium">
          You have viewed all {filteredReviews.length} reviews.
        </p>
      )} */}
    </div>
  );
};

export default MovieReviewsSection;
