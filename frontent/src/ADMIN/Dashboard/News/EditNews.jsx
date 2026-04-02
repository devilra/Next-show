import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogDetail, updateBlog, resetBlogState } from "../../../redux/HomeContentSlice/blogSlice";
import LoadingComponents from "../../../Components/LoadingComponents";

const EditNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedBlog, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.blogSection
  );

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
    isActive: true,
    bannerImage: null,
  });

  const [preview, setPreview] = useState("");

  // 1. Fetch the existing data when page loads
  useEffect(() => {
    dispatch(fetchBlogDetail(id));
  }, [dispatch, id]);

  // 2. Pre-fill the form once data is received
  useEffect(() => {
    if (selectedBlog) {
      setFormData({
        title: selectedBlog.title || "",
        shortDescription: selectedBlog.shortDescription || "",
        longDescription: selectedBlog.longDescription || "",
        directedBy: selectedBlog.directedBy || "",
        starCast: selectedBlog.starCast || "",
        producedBy: selectedBlog.producedBy || "",
        cinematography: selectedBlog.cinematography || "",
        newsDate: selectedBlog.newsDate || "",
        order: selectedBlog.order || 1,
        isActive: selectedBlog.isActive,
        bannerImage: null,
      });
      setPreview(selectedBlog.bannerImage);
    }
  }, [selectedBlog]);

  // 3. Handle Success/Error
  useEffect(() => {
    if (isSuccess) {
      alert("✅ News Updated Successfully!");
      dispatch(resetBlogState());
      navigate("/admin/news-list");
    }
    if (isError) {
      alert("❌ Update Failed: " + message);
      dispatch(resetBlogState());
    }
  }, [isSuccess, isError, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "bannerImage") {
      setFormData({ ...formData, bannerImage: files[0] });
      setPreview(URL.createObjectURL(files[0])); // Show new image preview
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();

    // Append all text fields
    Object.keys(formData).forEach((key) => {
      if (key === "bannerImage") {
        if (formData.bannerImage) data.append("bannerImage", formData.bannerImage);
      } else {
        data.append(key, formData[key]);
      }
    });

    dispatch(updateBlog({ id, formData: data }));
  };

  if (isLoading && !selectedBlog) return <LoadingComponents />;

  return (
    <div className="p-6 bg-[#121212] min-h-screen text-white rounded-xl">
      <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <h2 className="text-2xl font-bold">Edit Movie News</h2>
        <button 
          onClick={() => navigate("/admin/news-list")}
          className="text-sm bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          Back to List
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-[#1e1e1e] p-8 rounded-2xl shadow-2xl">
        {/* Left Section */}
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm block mb-1">News Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full p-3 bg-[#2a2a2a] border border-neutral-700 rounded-lg outline-none" />
          </div>

          <div>
            <label className="text-gray-400 text-sm block mb-1">Short Description</label>
            <input type="text" name="shortDescription" value={formData.shortDescription} onChange={handleChange} required className="w-full p-3 bg-[#2a2a2a] border border-neutral-700 rounded-lg outline-none" />
          </div>

          <div>
            <label className="text-gray-400 text-sm block mb-1">Full Article Content</label>
            <textarea name="longDescription" value={formData.longDescription} onChange={handleChange} className="w-full p-3 bg-[#2a2a2a] border border-neutral-700 rounded-lg h-40 outline-none" />
          </div>

          <div className="flex items-center gap-2 p-3 bg-blue-600/10 rounded-lg border border-blue-600/20">
            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-5 h-5 accent-blue-600" />
            <label className="text-sm font-bold text-blue-400">Make this news Active on Website</label>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="text-gray-400 text-sm block mb-1">Director</label>
                <input type="text" name="directedBy" value={formData.directedBy} onChange={handleChange} className="w-full p-3 bg-[#2a2a2a] border border-neutral-700 rounded-lg outline-none" />
             </div>
             <div>
                <label className="text-gray-400 text-sm block mb-1">News Date</label>
                <input type="text" name="newsDate" value={formData.newsDate} onChange={handleChange} className="w-full p-3 bg-[#2a2a2a] border border-neutral-700 rounded-lg outline-none" />
             </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm block mb-1">Star Cast</label>
            <input type="text" name="starCast" value={formData.starCast} onChange={handleChange} className="w-full p-3 bg-[#2a2a2a] border border-neutral-700 rounded-lg outline-none" />
          </div>

          <div className="p-4 bg-black/40 rounded-xl border border-neutral-800">
            <label className="text-gray-400 text-xs block mb-3 uppercase tracking-widest">Banner Image</label>
            {preview && (
              <img src={preview} alt="Preview" className="w-full h-40 object-cover rounded-lg mb-4 border border-neutral-700" />
            )}
            <input type="file" name="bannerImage" onChange={handleChange} accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white" />
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-orange-500 hover:bg-orange-600 py-4 rounded-xl font-bold shadow-lg transition-all transform active:scale-95">
            {isLoading ? "Saving Changes..." : "Update News Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditNews;