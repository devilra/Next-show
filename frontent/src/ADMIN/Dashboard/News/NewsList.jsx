import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBlogs, deleteBlog } from "../../../redux/HomeContentSlice/blogSlice";
import { FaTrash, FaEdit, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NewsList = () => {
  const dispatch = useDispatch();
  const { blogs, isLoading } = useSelector((state) => state.blogSection);

  useEffect(() => {
    dispatch(fetchAllBlogs());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this news? This will also remove the image from Cloudinary.")) {
      dispatch(deleteBlog(id));
    }
  };
  const navigate = useNavigate();

  if (isLoading) return <div className="p-10 text-center text-gray-400">Loading News List...</div>;

  return (
    <div className="p-6 bg-[#121212] rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Manage Movie News</h2>
        <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold">
          {blogs.length} Total Posts
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-800 text-gray-400 text-sm uppercase tracking-wider">
              <th className="p-4">Banner</th>
              <th className="p-4">Title</th>
              <th className="p-4">Director</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {blogs.map((item) => (
              <tr key={item.id} className="border-b border-neutral-800 hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <img src={item.bannerImage} alt="" className="w-20 h-12 object-cover rounded-md shadow-md" />
                </td>
                <td className="p-4 font-medium max-w-xs truncate">{item.title}</td>
                <td className="p-4 text-sm text-gray-500">{item.directedBy}</td>
                <td className="p-4">
                  {item.isActive ? (
                    <span className="flex items-center gap-1 text-green-500 text-xs font-bold uppercase">
                      <FaEye /> Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-500 text-xs font-bold uppercase">
                      <FaEyeSlash /> Inactive
                    </span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-3">
                   <button 
  onClick={() => navigate(`/admin/edit-news/${item.id}`)}
  className="p-2 hover:bg-blue-600/20 text-blue-500 rounded-lg transition-all"
>
  <FaEdit />
</button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2 hover:bg-red-600/20 text-red-500 rounded-lg transition-all" 
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {blogs.length === 0 && (
          <div className="p-20 text-center text-gray-600">No news posts found in database.</div>
        )}
      </div>
    </div>
  );
};

export default NewsList;