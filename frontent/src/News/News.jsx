import React, { useEffect, useState } from "react";
import NewsHome from "./NewsHome";
import { useDispatch, useSelector } from "react-redux";
import { fetchActiveBlogs } from "../redux/HomeContentSlice/blogSlice";
import Nprogress from "nprogress";
import { FaSpinner } from "react-icons/fa";
import LoadingComponents from "../Components/LoadingComponents";

const News = () => {
  const dispatch = useDispatch();
  const [isPageLoading, setIsPageLoading] = useState(false);

  const { activeBlogs } = useSelector((state) => state.blogSection);

  console.log(activeBlogs);

  const hasData = activeBlogs.length > 0;

  useEffect(() => {
    const fetchAllHomeData = async () => {
      if (hasData) {
        setIsPageLoading(false);
        return;
      }

      try {
        setIsPageLoading(true);
        Nprogress.start();

        await dispatch(fetchActiveBlogs()).then(unwrapResult);
      } catch (error) {
        console.error("Home Page Parallel Fetch Error:", error);
      } finally {
        setIsPageLoading(false);
        Nprogress.done();
      }
    };

    fetchAllHomeData();
  }, [dispatch]);

  // Loading Screen
  if (isPageLoading) {
    return <LoadingComponents />;
  }
  return (
    <div>
      <NewsHome />
    </div>
  );
};

export default News;
