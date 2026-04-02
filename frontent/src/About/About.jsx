import React from "react";
import { motion } from "framer-motion";
import { FaBullseye, FaUsers, FaStar } from "react-icons/fa";

const About = () => {
  return (
    <div className="pt-28 pb-20 px-6 md:px-10 bg-black min-h-screen text-white">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-black mb-6"
        >
          Everything About <span className="text-orange-500">Cinema.</span>
        </motion.h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          Welcome to NextShow, your ultimate destination for everything
          entertainment. We provide accurate movie updates, authentic reviews,
          and the latest news straight from the heart of the industry.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 bg-white/5 rounded-3xl border border-white/10 text-center">
          <FaBullseye className="text-4xl text-orange-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Our Mission</h3>
          <p className="text-gray-400 text-sm">
            To be the most trusted source for movie buffs across the globe.
          </p>
        </div>
        <div className="p-8 bg-white/5 rounded-3xl border border-white/10 text-center">
          <FaUsers className="text-4xl text-orange-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Community First</h3>
          <p className="text-gray-400 text-sm">
            We value our users' ratings and opinions above all else.
          </p>
        </div>
        <div className="p-8 bg-white/5 rounded-3xl border border-white/10 text-center">
          <FaStar className="text-4xl text-orange-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Authentic Reviews</h3>
          <p className="text-gray-400 text-sm">
            Honest reviews from critics and audiences alike.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-20 p-10 bg-orange-500 rounded-3xl flex flex-wrap justify-around gap-10 text-black">
        <div className="text-center">
          <h4 className="text-4xl font-black">500+</h4>
          <p className="font-bold opacity-80 uppercase text-xs">
            Movies Listed
          </p>
        </div>
        <div className="text-center">
          <h4 className="text-4xl font-black">10K+</h4>
          <p className="font-bold opacity-80 uppercase text-xs">Active Users</p>
        </div>
        <div className="text-center">
          <h4 className="text-4xl font-black">1M+</h4>
          <p className="font-bold opacity-80 uppercase text-xs">Total Views</p>
        </div>
      </div>
    </div>
  );
};

export default About;
