import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBlog, resetBlogState } from "../../../redux/HomeContentSlice/blogSlice";

const AddNews = () => {
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    longDescription: "",
    directedBy: "",
    starCast: "",
    producedBy: "",
    cinematography: "",
    newsDate: "",
    order: 1,
    bannerImage: null,
  });

  const dispatch = useDispatch();
  const { isLoading, isSuccess, isError, message } = useSelector((state) => state.blogSection);

  useEffect(() => {
    if (isSuccess) {
      alert("News Published Successfully!");
      setFormData({ title: "", shortDescription: "", longDescription: "", directedBy: "", starCast: "", producedBy: "", cinematography: "", newsDate: "", order: 1, bannerImage: null });
      dispatch(resetBlogState());
    }
    if (isError) {
      alert("Error: " + message);
      dispatch(resetBlogState());
    }
  }, [isSuccess, isError, dispatch]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "bannerImage") {
      setFormData({ ...formData, bannerImage: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    // Append all fields to FormData
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    dispatch(createBlog(data));
  };

  return (
    <div className="p-6 bg-[#1a1a1a] min-h-screen text-white rounded-xl">
      <h2 className="text-3xl font-bold mb-8 border-b border-gray-700 pb-4">Create Movie News</h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#262626] p-8 rounded-2xl shadow-2xl">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">News Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full p-3 bg-[#333] border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Thalapathy 69 Update" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Short Description (for list view)</label>
            <input type="text" name="shortDescription" value={formData.shortDescription} onChange={handleChange} required className="w-full p-3 bg-[#333] border border-gray-600 rounded-lg outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Long Description / Article Content</label>
            <textarea name="longDescription" value={formData.longDescription} onChange={handleChange} className="w-full p-3 bg-[#333] border border-gray-600 rounded-lg h-32 outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Directed By</label>
              <input type="text" name="directedBy" value={formData.directedBy} onChange={handleChange} required className="w-full p-3 bg-[#333] border border-gray-600 rounded-lg outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Produced By</label>
              <input type="text" name="producedBy" value={formData.producedBy} onChange={handleChange} className="w-full p-3 bg-[#333] border border-gray-600 rounded-lg outline-none" />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Star Cast</label>
            <input type="text" name="starCast" value={formData.starCast} onChange={handleChange} className="w-full p-3 bg-[#333] border border-gray-600 rounded-lg outline-none" placeholder="Vijay, Bobby Deol..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Cinematography</label>
            <input type="text" name="cinematography" value={formData.cinematography} onChange={handleChange} className="w-full p-3 bg-[#333] border border-gray-600 rounded-lg outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">News Date</label>
              <input type="text" name="newsDate" value={formData.newsDate} onChange={handleChange} className="w-full p-3 bg-[#333] border border-gray-600 rounded-lg outline-none" placeholder="Jan 2026" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Display Order</label>
              <input type="number" name="order" value={formData.order} onChange={handleChange} className="w-full p-3 bg-[#333] border border-gray-600 rounded-lg outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Banner Image (Cloudinary)</label>
            <input type="file" name="bannerImage" onChange={handleChange} accept="image/*" required className="w-full p-2 bg-[#333] border border-dashed border-gray-500 rounded-lg cursor-pointer file:bg-blue-600 file:text-white file:border-none file:px-4 file:py-1 file:rounded file:mr-4" />
          </div>

          <div className="pt-4">
            <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform active:scale-95 disabled:bg-gray-600">
              {isLoading ? "🚀 Uploading to Cloudinary..." : "✅ Publish News Update"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddNews;