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
  createVideoSection,
  fetchAllVideos,
  updateVideoSection,
} from "../../../../redux/HomeContentSlice/VideoSlice";

const VideoSectionForm = ({ isOpen, onClose, videoData, setAlert }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.videoSection);

  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    order: 1,
    isActive: true,
  });
  const [files, setFiles] = useState({ bannerImage: null, videoUrl: null });
  const [previews, setPreviews] = useState({ image: null, videoName: "" });

  const isEdit = !!videoData;

  useEffect(() => {
    if (videoData && isOpen) {
      setFormData({
        title: videoData.title,
        shortDescription: videoData.shortDescription,
        order: videoData.order,
        isActive: videoData.isActive,
      });
      setPreviews({
        image: videoData.bannerImage,
        videoName: videoData.videoUrl ? "Existing Video Attached" : "",
      });
    } else {
      setFormData({
        title: "",
        shortDescription: "",
        order: 1,
        isActive: true,
      });
      setPreviews({ image: null, videoName: "" });
      setFiles({ bannerImage: null, videoUrl: null });
    }
  }, [videoData, isOpen]);

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
      ? updateVideoSection({ id: videoData.id, formData: data })
      : createVideoSection(data);

    dispatch(action)
      .unwrap()
      .then(() => {
        dispatch(fetchAllVideos());
        onClose();
        setAlert(
          "success",
          `Banner ${isEdit ? "updated" : "created"} successfully!`
        );
      })
      .catch((err) => setAlert("error", err));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl p-8 relative shadow-2xl max-h-[95vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 transition-colors"
        >
          <FaTimes size={24} />
        </button>
        <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
          {isEdit ? "Update Banner" : "New Video Banner"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6 text-black">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Banner Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full border-gray-200 border rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Enter title"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Display Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: e.target.value })
                }
                className="w-full border-gray-200 border rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              rows="2"
              value={formData.shortDescription}
              onChange={(e) =>
                setFormData({ ...formData, shortDescription: e.target.value })
              }
              className="w-full border-gray-200 border rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Brief description..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Banner Image Upload */}
            <div
              className={`relative border-2 border-dashed rounded-2xl p-4 transition-all ${
                previews.image
                  ? "border-green-400 bg-green-50"
                  : "border-gray-300 hover:border-indigo-400"
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
                  <div className="relative inline-block">
                    <img
                      src={previews.image}
                      className="h-24 w-40 object-cover rounded-lg shadow-md"
                    />
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                      <FaCheckCircle size={12} />
                    </div>
                  </div>
                ) : (
                  <div className="py-4">
                    <FaImage className="mx-auto text-gray-400 text-3xl mb-2" />
                    <p className="text-xs font-medium text-gray-500">
                      Upload Banner Image
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Video Upload */}
            <div
              className={`relative border-2 border-dashed rounded-2xl p-4 transition-all ${
                previews.videoName
                  ? "border-indigo-400 bg-indigo-50"
                  : "border-gray-300 hover:border-indigo-400"
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
                    <FaCheckCircle className="mx-auto text-indigo-500 text-3xl mb-2" />
                    <p className="text-xs font-bold text-indigo-700 truncate px-2">
                      {previews.videoName}
                    </p>
                  </div>
                ) : (
                  <div className="py-4">
                    <FaVideo className="mx-auto text-gray-400 text-3xl mb-2" />
                    <p className="text-xs font-medium text-gray-500">
                      Upload Video (Optional)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl">
            <span className="text-sm font-semibold text-gray-700">
              Visibility Status
            </span>
            <select
              value={formData.isActive}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isActive: e.target.value === "true",
                })
              }
              className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="true">Visible</option>
              <option value="false">Hidden</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center disabled:bg-gray-400"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-3" /> Processing...
              </>
            ) : (
              <>
                <FaCloudUploadAlt className="mr-3 text-2xl" />{" "}
                {isEdit ? "Update Banner" : "Publish Banner"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VideoSectionForm;
