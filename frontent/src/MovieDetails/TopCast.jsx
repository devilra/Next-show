import React from "react";
import { ChevronRight, Heart, Edit2 } from "lucide-react";

const TopCast = () => {
  const castList = [
    { name: "Dhanush", role: "Murugan", img: "/cast/dhanush.jpg" },
    { name: "Arun Vijay", role: "Ashwin", img: "/cast/arun.jpg" },
    { name: "Sathyaraj", role: "Vishnu Vardhan", img: "/cast/sathyaraj.jpg" },
    { name: "Raj Kiran", role: "Sivanesan", img: "/cast/rajkiran.jpg" },
    { name: "Nithya Menen", role: "Kayal", img: "/cast/nithya.jpg" },
    { name: "Shalini Pandey", role: "Meera", img: "/cast/shalini.jpg" },
    { name: "Ilavarasu", role: "Ramarajan", img: "/cast/ilavarasu.jpg" },
    { name: "Geetha Kailasam", role: "Kasthuri", img: "/cast/geetha.jpg" },
  ];

  return (
    <div className="py-8 bg-[#121212] text-white max-w-4xl">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-1 h-8 bg-yellow-500 rounded-full"></div>
          <h2 className="text-2xl md:text-3xl font-bold flex items-center">
            Top Cast{" "}
            <span className="text-gray-500 ml-3 font-normal text-xl">17</span>
            <ChevronRight
              className="ml-2 group-hover:text-yellow-500 transition-colors"
              size={28}
            />
          </h2>
        </div>
        <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <Edit2 size={18} />
          <span className="text-sm font-semibold">Edit</span>
        </button>
      </div>

      {/* Cast Grid - Responsive 1 column on mobile, 2 on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
        {castList.map((person, index) => (
          <div
            key={index}
            className="flex items-center gap-4 group cursor-pointer"
          >
            {/* Circular Image with Heart Icon */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-gray-600 transition-all">
                <img
                  src={person.img}
                  alt={person.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 left-0 bg-zinc-900/80 p-1.5 rounded-full border border-gray-700 hover:bg-zinc-800">
                <Heart size={16} className="text-white hover:fill-white" />
              </button>
            </div>

            {/* Name and Character Role */}
            <div className="flex flex-col justify-center">
              <span className="font-bold text-lg hover:underline decoration-1 underline-offset-4">
                {person.name}
              </span>
              <span className="text-gray-400 text-sm">{person.role}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCast;
