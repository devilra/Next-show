import React, { useEffect } from "react";
import NewsHome from "./NewsHome";
import LatestNewsList from "./LatestNewsList";
import { useDispatch, useSelector } from "react-redux";
import { fetchActiveBlogs } from "../redux/HomeContentSlice/blogSlice";
import LoadingComponents from "../Components/LoadingComponents";

const News = () => {
  const dispatch = useDispatch();
  const { activeBlogs, isActiveLoading } = useSelector((state) => state.blogSection);

  useEffect(() => {
    // Only fetch if we don't have data already to save performance
    if (activeBlogs.length === 0) {
      dispatch(fetchActiveBlogs());
    }
  }, [dispatch, activeBlogs.length]);

  if (isActiveLoading) return <LoadingComponents />;

  return (
    <div className="mt-16 bg-black min-h-screen">
      {/* Pass the dynamic data to the visual sections */}
      <NewsHome blogs={activeBlogs} />
      
      <div className="max-w-7xl mx-auto px-4 mt-10">
        <h2 className="text-2xl font-bold text-white border-l-4 border-blue-600 pl-4 mb-8">
          MORE NEWS <span className="text-gray-500 font-light">& UPDATES</span>
        </h2>
        <LatestNewsList blogs={activeBlogs} />
      </div>
    </div>
  );
};

export default News;