import React from "react";

const OTTBadge = ({ platformName, defaultName }) => {
  // 1. Array handle panna oru helper function
  const renderSingleBadge = (name) => {
    if (!name || name === "N/A") return null;

    // String format (Example: "Jio Hotstar" -> "jiohotstar")
    const normalizedName = name
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "")
      .trim();

    const platformStyles = {
      netflix: "bg-[#E50914] text-white",
      amazonprime: "bg-[#00A8E1] text-white",
      prime: "bg-[#00A8E1] text-white",
      jiohotstar: "bg-gradient-to-r from-[#01147C] to-[#00ED82] text-white",
      hotstar: "bg-[#01147C] text-white",
      zee5: "bg-[#8230C6] text-white",
      aha: "bg-[#FF6D00] text-white",
    };

    const defaultStyle = "bg-gray-700 text-gray-200 border border-gray-600";
    const selectedStyle = platformStyles[normalizedName] || defaultStyle;

    return (
      <span
        key={name}
        className={`px-3 py-1 rounded-md text-[10px] md:text-xs   tracking-[1px] shadow-sm ${selectedStyle}`}
      >
        {name}
      </span>
    );
  };

  // 2. Main Logic: Platform name illati Default names (Array or String)
  const dataToRender = platformName || defaultName;

  if (!dataToRender || dataToRender === "N/A") return null;

  return (
    <div className="flex flex-wrap gap-2">
      {Array.isArray(dataToRender)
        ? dataToRender.flat().map((name) => renderSingleBadge(name))
        : renderSingleBadge(dataToRender)}
    </div>
  );
};

export default OTTBadge;
