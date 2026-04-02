import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTimes, FaSpinner, FaYoutube } from "react-icons/fa";
import {
  createNewTrailer,
  fetchAllTrailersAdmin,
  updateTrailerContent,
} from "../../../redux/HomeContentSlice/NewTrailerSlice";

const NewTrailerForm = ({ isOpen, onClose, contentData, setAlert }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.newTrailers);

  const [formData, setFormData] = useState({
    movieName: "",
    videoTitle: "",
    trailerUrl: "",
    postedTimeDisplay: "Just now",
    order: 1,
    isActive: true, // Boolean value for backend
  });

  const [ytPreview, setYtPreview] = useState(null);

  const isEdit = !!contentData;

  const getYTThumbnail = (url) => {
    const regExp =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url?.match(regExp);
    if (match && match[2].length === 11) {
      return `https://img.youtube.com/vi/${match[2]}/mqdefault.jpg`;
    }
    return null;
  };

  const resetForm = () => {
    setFormData({
      movieName: "",
      videoTitle: "",
      trailerUrl: "",
      postedTimeDisplay: "Just now",
      order: 1,
      isActive: true,
    });
    setYtPreview(null);
  };

  useEffect(() => {
    if (contentData && isOpen) {
      setFormData({
        movieName: contentData.movieName || "",
        videoTitle: contentData.videoTitle || "",
        trailerUrl: contentData.trailerUrl || "",
        postedTimeDisplay: contentData.postedTimeDisplay || "Just now",
        order: contentData.order || 1,
        isActive: contentData.isActive ?? true,
      });
      setYtPreview(getYTThumbnail(contentData.trailerUrl));
    } else {
      resetForm();
    }
  }, [contentData, isOpen]);

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setFormData({ ...formData, trailerUrl: url });
    setYtPreview(getYTThumbnail(url));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = isEdit
      ? updateTrailerContent({ id: contentData.id, updateData: formData })
      : createNewTrailer(formData);

    dispatch(action)
      .unwrap()
      .then(() => {
        dispatch(fetchAllTrailersAdmin());
        onClose();
        setAlert("success", isEdit ? "Trailer updated!" : "Trailer published!");
      })
      .catch((err) => setAlert("error", err));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-black"
        >
          <FaTimes size={24} />
        </button>

        <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4 flex items-center gap-2">
          <FaYoutube className="text-red-600" />
          {isEdit ? "Edit Trailer" : "Add New Trailer"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5 text-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-400 uppercase">
                Movie Name *
              </label>
              <input
                type="text"
                required
                value={formData.movieName}
                onChange={(e) =>
                  setFormData({ ...formData, movieName: e.target.value })
                }
                className="w-full border-b-2 p-2 outline-none focus:border-red-500 transition-colors bg-transparent"
                placeholder="e.g. Leo"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-400 uppercase">
                Video Title (Optional)
              </label>
              <input
                type="text"
                value={formData.videoTitle}
                onChange={(e) =>
                  setFormData({ ...formData, videoTitle: e.target.value })
                }
                className="w-full border-b-2 p-2 outline-none focus:border-red-500 transition-colors bg-transparent"
                placeholder="e.g. Official Trailer 1"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-400 uppercase">
                YouTube Trailer URL *
              </label>
              <input
                type="url"
                required
                value={formData.trailerUrl}
                onChange={handleUrlChange}
                className="w-full border-b-2 p-2 outline-none focus:border-red-500 transition-colors bg-transparent"
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">
                Posted Time Display
              </label>
              <input
                type="text"
                value={formData.postedTimeDisplay}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    postedTimeDisplay: e.target.value,
                  })
                }
                className="w-full border-b-2 p-2 outline-none focus:border-red-500 transition-colors bg-transparent"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">
                Display Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: e.target.value })
                }
                className="w-full border-b-2 p-2 outline-none focus:border-red-500 transition-colors bg-transparent"
              />
            </div>

            {/* 🔥 Status Select Field 🔥 */}
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-400 uppercase">
                Visibility Status
              </label>
              <select
                value={formData.isActive}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isActive: e.target.value === "true",
                  })
                }
                className="w-full border-b-2 p-2 outline-none focus:border-red-500 transition-colors bg-transparent cursor-pointer"
              >
                <option value="true">Visible</option>
                <option value="false">Hidden</option>
              </select>
            </div>
          </div>

          {ytPreview && (
            <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex gap-4 items-center">
              <img
                src={ytPreview}
                alt="YT Preview"
                className="w-32 h-20 object-cover rounded-lg shadow-md"
              />
              <div>
                <p className="text-xs font-bold text-red-600 uppercase">
                  Trailer Preview Detected
                </p>
                <p className="text-sm text-gray-500">
                  Thumbnail confirmed from YouTube.
                </p>
              </div>
            </div>
          )}

          <div className="pt-6 border-t flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-all flex justify-center items-center gap-2 shadow-lg shadow-red-200 disabled:bg-gray-400"
            >
              {isLoading ? (
                <FaSpinner className="animate-spin" />
              ) : isEdit ? (
                "Update Trailer"
              ) : (
                "Publish Trailer"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-100 rounded-xl font-bold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTrailerForm;
