import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaCloudUploadAlt,
  FaTimes,
  FaSpinner,
  FaImage,
  FaVideo,
  FaCheckCircle,
} from "react-icons/fa";
import {
  createStreamingContent,
  fetchAllStreaming,
  updateStreamingContent,
} from "../../../../redux/StreamingNowSlice/StreamVideo";

const StreamingVideoForm = ({ isOpen, onClose, contentData, setAlert }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.streamingNow);

  const [formData, setFormData] = useState({
    title: "",
    releaseYear: "",
    certification: "",
    durationOrSeason: "",
    language: "",
    genres: "",
    longDescription: "",
    order: 1,
    isActive: true,
  });

  const [files, setFiles] = useState({ bannerImage: null, videoUrl: null });
  const [previews, setPreviews] = useState({ image: null, videoName: "" });

  const isEdit = !!contentData;

  useEffect(() => {
    if (contentData && isOpen) {
      setFormData({
        title: contentData.title,
        releaseYear: contentData.releaseYear,
        certification: contentData.certification,
        durationOrSeason: contentData.durationOrSeason,
        language: contentData.language,
        genres: contentData.genres,
        longDescription: contentData.longDescription,
        order: contentData.order,
        isActive: contentData.isActive,
      });
      setPreviews({
        image: contentData.bannerImage,
        videoName: contentData.videoUrl ? "Existing video attached" : "",
      });
    } else {
      resetForm();
    }
  }, [contentData, isOpen]);

  const resetForm = () => {
    setFormData({
      title: "",
      releaseYear: "",
      certification: "",
      durationOrSeason: "",
      language: "",
      genres: "",
      longDescription: "",
      order: 1,
      isActive: true,
    });
    setFiles({ bannerImage: null, videoUrl: null });
    setPreviews({ image: null, videoName: "" });
  };

  const handleFile = (e) => {
    const { name, files: selectedFiles } = e.target;
    const file = selectedFiles[0];
    if (!file) return;

    setFiles((prev) => ({ ...prev, [name]: file }));
    if (name === "bannerImage")
      setPreviews((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
    if (name === "videoUrl")
      setPreviews((prev) => ({ ...prev, videoName: file.name }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (files.bannerImage) data.append("bannerImage", files.bannerImage);
    if (files.videoUrl) data.append("videoUrl", files.videoUrl);

    if (!isEdit && !files.bannerImage)
      return alert("Banner image is required!");

    const action = isEdit
      ? updateStreamingContent({ id: contentData.id, formData: data })
      : createStreamingContent(data);

    dispatch(action)
      .unwrap()
      .then(() => {
        dispatch(fetchAllStreaming());
        onClose();
        setAlert(
          "success",
          `Content ${isEdit ? "updated" : "published"} successfully!`
        );
      })
      .catch((err) => setAlert("error", err));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-black"
        >
          <FaTimes size={24} />
        </button>
        <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
          {isEdit ? "Update Content" : "Publish New Content"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6 text-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs font-bold uppercase text-gray-400">
                Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full border-b-2 border-gray-100 p-2 focus:border-orange-500 outline-none transition-colors"
                placeholder="e.g. Stranger Things"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-gray-400">
                Release Year
              </label>
              <input
                type="text"
                value={formData.releaseYear}
                onChange={(e) =>
                  setFormData({ ...formData, releaseYear: e.target.value })
                }
                className="w-full border-b-2 border-gray-100 p-2 focus:border-orange-500 outline-none"
                placeholder="2024"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-gray-400">
                Certification
              </label>
              <input
                type="text"
                value={formData.certification}
                onChange={(e) =>
                  setFormData({ ...formData, certification: e.target.value })
                }
                className="w-full border-b-2 border-gray-100 p-2 focus:border-orange-500 outline-none"
                placeholder="U/A, 18+, etc."
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-gray-400">
                Duration / Season
              </label>
              <input
                type="text"
                value={formData.durationOrSeason}
                onChange={(e) =>
                  setFormData({ ...formData, durationOrSeason: e.target.value })
                }
                className="w-full border-b-2 border-gray-100 p-2 focus:border-orange-500 outline-none"
                placeholder="2h 30m or 4 Seasons"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-gray-400">
                Language
              </label>
              <input
                type="text"
                value={formData.language}
                onChange={(e) =>
                  setFormData({ ...formData, language: e.target.value })
                }
                className="w-full border-b-2 border-gray-100 p-2 focus:border-orange-500 outline-none"
                placeholder="Tamil, English, etc."
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold uppercase text-gray-400">
                Genres
              </label>
              <input
                type="text"
                value={formData.genres}
                onChange={(e) =>
                  setFormData({ ...formData, genres: e.target.value })
                }
                className="w-full border-b-2 border-gray-100 p-2 focus:border-orange-500 outline-none"
                placeholder="Action | Thriller | Drama"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold uppercase text-gray-400">
                Description
              </label>
              <textarea
                rows="3"
                value={formData.longDescription}
                onChange={(e) =>
                  setFormData({ ...formData, longDescription: e.target.value })
                }
                className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-orange-500 outline-none"
                placeholder="Write full plot summary..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Upload */}
            <div
              className={`relative border-2 border-dashed rounded-2xl p-4 transition-all ${
                previews.image
                  ? "border-green-400 bg-green-50"
                  : "border-gray-200"
              }`}
            >
              <input
                type="file"
                name="bannerImage"
                onChange={handleFile}
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-center">
                {previews.image ? (
                  <img
                    src={previews.image}
                    className="h-24 mx-auto rounded shadow-sm"
                    alt="preview"
                  />
                ) : (
                  <div className="py-4">
                    <FaImage className="mx-auto text-gray-300 text-3xl mb-1" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                      Banner Image
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Video Upload */}
            <div
              className={`relative border-2 border-dashed rounded-2xl p-4 transition-all ${
                previews.videoName
                  ? "border-orange-400 bg-red-50"
                  : "border-gray-200"
              }`}
            >
              <input
                type="file"
                name="videoUrl"
                onChange={handleFile}
                accept="video/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-center">
                {previews.videoName ? (
                  <div className="py-4">
                    <FaCheckCircle className="mx-auto text-red-500 text-3xl mb-1" />
                    <p className="text-[10px] font-bold text-red-700 truncate px-2">
                      {previews.videoName}
                    </p>
                  </div>
                ) : (
                  <div className="py-4">
                    <FaVideo className="mx-auto text-gray-300 text-3xl mb-1" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                      Upload Video
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl">
            <div className="flex gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400 block">
                  Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({ ...formData, order: e.target.value })
                  }
                  className="w-16 bg-transparent border-b border-gray-300 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400 block">
                  Status
                </label>
                <select
                  value={formData.isActive}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isActive: e.target.value === "true",
                    })
                  }
                  className="bg-transparent outline-none font-bold text-sm"
                >
                  <option value="true">Active</option>
                  <option value="false">Hidden</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-10 py-3 bg-orange-500 text-white rounded-xl font-bold shadow-lg shadow-red-100 hover:bg-orange-700 disabled:bg-gray-400 transition-all flex items-center"
            >
              {isLoading ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <FaCloudUploadAlt className="mr-2" />
              )}{" "}
              {isEdit ? "Update" : "Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StreamingVideoForm;
