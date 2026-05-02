import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus, FaSpinner, FaTrash, FaNewspaper } from "react-icons/fa6";
import { Button, Snackbar, Alert } from "@mui/material";
import NProgress from "nprogress";
import {
  deleteBlog,
  fetchAllBlogs,
  resetBlogState,
} from "../../../../redux/HomeContentSlice/blogSlice";
import { FaEdit } from "react-icons/fa";
import BlogSectionForm from "./BlogSectionForm";

const BlogContentSection = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [snack, setSnack] = useState({ open: false, msg: "", type: "info" });

  const { blogs, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.blogSection
  );

  useEffect(() => {
    dispatch(fetchAllBlogs());
  }, [dispatch]);

  useEffect(() => {
    if (isLoading) NProgress.start();
    else NProgress.done();

    if (isError && message) setAlert("error", message);
    if (isSuccess && message) setAlert("success", message);

    if (isSuccess || isError) {
      dispatch(resetBlogState());
      NProgress.done();
    }
  }, [isError, isSuccess, message, dispatch]);

  const setAlert = (type, message) => {
    setSnack({ open: true, msg: message, type });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this blog news?")) {
      NProgress.start();
      dispatch(deleteBlog(id));
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 ">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-3">
            <span className="p-2 bg-orange-100 text-orange-600 rounded-lg">
              <FaNewspaper size={20} />
            </span>
            Movie Blog Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage latest movie news, cast details, and updates
          </p>
        </div>
        <Button
          variant="contained"
          onClick={() => {
            setCurrentBlog(null);
            setIsModalOpen(true);
          }}
          className="bg-orange-600 hover:bg-orange-700 normal-case px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-100"
          startIcon={<FaPlus />}
        >
          New Movie Blog
        </Button>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading && blogs.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64">
            <FaSpinner className="animate-spin text-orange-600 text-5xl mb-4" />
            <p className="text-gray-500 font-medium italic">Syncing blogs...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-4 py-4 text-xs uppercase font-bold text-gray-400 w-16">
                    order
                  </th>
                  <th className="px-6 py-4 text-xs uppercase font-bold text-gray-400">
                    Blog Info
                  </th>
                  <th className="px-6 py-4 text-xs uppercase font-bold text-gray-400">
                    Director
                  </th>
                  <th className="px-6 py-4 text-xs uppercase font-bold text-gray-400 text-center">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs uppercase font-bold text-gray-400 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {blogs.map((blog) => (
                  <tr
                    key={blog.id}
                    className="hover:bg-orange-50/30 transition-colors"
                  >
                    <td className="px-4 py-4 font-bold text-gray-400">
                      #{blog.order}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={blog.bannerImage}
                          className="h-12 w-20 object-cover rounded shadow-sm border"
                          alt=""
                        />
                        <div className="max-w-[200px]">
                          <h4 className="font-bold text-gray-800 text-sm truncate">
                            {blog.title}
                          </h4>
                          <p className="text-xs text-gray-400 truncate">
                            {blog.shortDescription}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600">
                      {blog.directedBy}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                          blog.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {blog.isActive ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setCurrentBlog(blog);
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <BlogSectionForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        blogData={currentBlog}
        setAlert={setAlert}
      />

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snack.type} variant="filled">
          {snack.msg}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default BlogContentSection;
