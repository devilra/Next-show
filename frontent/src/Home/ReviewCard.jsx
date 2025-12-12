// src/components/ReviewCard.js

import React from "react";
import { FaStar, FaUserCircle, FaPenFancy } from "react-icons/fa";

const ReviewCard = ({ review }) => {
  // ரிவியூ வகையைப் பொறுத்து ஐகான் மற்றும் நிறம்
  const isCritic = review.reviewType === "CRITIC";
  const Icon = isCritic ? FaPenFancy : FaUserCircle;
  const sourceColor = isCritic ? "text-red-500" : "text-blue-400";

  return (
    <div className="bg-[#1a1a1a] p-4 rounded-lg shadow-xl border border-gray-700 hover:border-red-500 transition duration-300">
      <div className="flex justify-between items-start mb-2">
        {/* Rating Stars */}
        <div className="flex items-center space-x-1 text-yellow-400 text-lg">
          <FaStar />
          <span className="text-xl font-bold">{review.rating}</span>
          <span className="text-gray-400">/ 5</span>
        </div>
        {/* Movie Title */}
        <h3 className="text-lg font-semibold text-white truncate max-w-[60%] text-right">
          {review.movie}
        </h3>
      </div>

      {/* Summary */}
      <p className="text-gray-300 text-sm mb-4 line-clamp-3">
        "{review.summary}"
      </p>

      {/* Reviewer Info */}
      <div className="flex items-center justify-between text-sm">
        <div className={`flex items-center font-medium ${sourceColor}`}>
          <Icon className="mr-2" />
          <span>{review.source}</span>
        </div>
        <span className="text-gray-500 text-xs">{review.date}</span>
      </div>
    </div>
  );
};

export default ReviewCard;
