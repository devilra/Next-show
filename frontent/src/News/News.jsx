import React from "react";
import { motion } from "framer-motion";

const newsData = [
  {
    id: 1,
    title: "Viduthalai Part 2: Vetrimaaran's Masterclass Continues",
    category: "Review",
    date: "Dec 30, 2024",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=500",
    desc: "An intense emotional journey that explores the depths of the characters...",
  },
  {
    id: 2,
    title: "Thalapathy 69: Final Schedule Starts in Chennai",
    category: "Latest News",
    date: "Dec 31, 2024",
    image:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=500",
    desc: "The highly anticipated final film of Thalapathy Vijay enters its crucial stage...",
  },
];

const News = () => {
  return (
    <div className="pt-28 pb-20 px-6 md:px-10 bg-black min-h-screen text-white">
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-4xl font-bold border-l-4 border-orange-500 pl-4 mb-10"
      >
        Cinema <span className="text-orange-500">News & Reviews</span>
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {newsData.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-orange-500/50 transition-all group"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <span className="absolute top-4 left-4 bg-orange-500 text-xs font-bold px-3 py-1 rounded-full uppercase">
                {item.category}
              </span>
            </div>
            <div className="p-6">
              <p className="text-gray-400 text-sm mb-2">{item.date}</p>
              <h3 className="text-xl font-bold mb-3 group-hover:text-orange-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                {item.desc}
              </p>
              <button className="text-orange-500 font-bold hover:underline">
                Read More →
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default News;
