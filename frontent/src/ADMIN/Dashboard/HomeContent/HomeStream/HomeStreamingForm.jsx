import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaCloudUploadAlt,
  FaTimes,
  FaSpinner,
  FaImage,
  FaCheckCircle,
} from "react-icons/fa";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import {
  createHomeStreamContent,
  fetchAllHomeStream,
  updateHomeStreamContent,
} from "../../../../redux/HomeContentSlice/HomeStreamSlice";

const HomeStreamingForm = ({ isOpen, onClose, contentData, setAlert }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.homeStreaming);

  const [formData, setFormData] = useState({
    title: "",
    streamType: "NEW", // Default value
    director: "",
    cast: "",
    releaseDate: "",
    certification: "",
    durationOrSeason: "",
    language: "",
    genres: "",
    longDescription: "",
    order: 1,
    isActive: true,
  });

  const [bannerFile, setBannerFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const isEdit = !!contentData;

  useEffect(() => {
    if (contentData && isOpen) {
      const formattedDateForPicker = contentData.releaseDate
        ? dayjs(contentData.releaseDate, "DD MMM YYYY").format("DD-MM-YYYY")
        : "";

      setFormData({
        title: contentData.title || "",
        streamType: contentData.streamType || "NEW", // Edit mode-ல் streamType செட் செய்தல்
        director: contentData.director || "",
        cast: contentData.cast || "",
        releaseDate: formattedDateForPicker,
        certification: contentData.certification || "",
        durationOrSeason: contentData.durationOrSeason || "",
        language: contentData.language || "",
        genres: contentData.genres || "",
        longDescription: contentData.longDescription || "",
        order: contentData.order || 1,
        isActive: contentData.isActive,
      });
      setPreview(contentData.bannerImage);
    } else {
      resetForm();
    }
  }, [contentData, isOpen]);

  const resetForm = () => {
    setFormData({
      title: "",
      streamType: "NEW",
      director: "",
      cast: "",
      releaseDate: dayjs().format("DD-MM-YYYY"), // Default இன்றைய தேதி format-உடன்
      certification: "",
      durationOrSeason: "",
      language: "",
      genres: "",
      longDescription: "",
      order: 1,
      isActive: true,
    });
    setBannerFile(null);
    setPreview(null);
  };

  const handleDateChange = (newValue) => {
    if (newValue) {
      const formattedDate = newValue.format("DD-MM-YYYY");
      setFormData({ ...formData, releaseDate: formattedDate });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // DB-la store aaga vendiya format (10 JAN 2026)
    // Dayjs use panni MMM uppercase-la vara .toUpperCase() use panrom
    const dbDateFormat = dayjs(formData.releaseDate, "DD-MM-YYYY")
      .format("DD MMM YYYY")
      .toUpperCase();

    Object.keys(formData).forEach((key) => {
      if (key === "releaseDate") {
        data.append(key, dbDateFormat); // Updated format here
      } else {
        data.append(key, formData[key]);
      }
    });
    if (bannerFile) data.append("bannerImage", bannerFile);

    if (!isEdit && !bannerFile) return alert("Banner image is required!");

    const action = isEdit
      ? updateHomeStreamContent({ id: contentData.id, formData: data })
      : createHomeStreamContent(data);

    dispatch(action)
      .unwrap()
      .then(() => {
        dispatch(fetchAllHomeStream());
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
          {isEdit ? "Update Home Content" : "Add New Home Content"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6 text-black">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-400 uppercase">
                Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full border-b-2 p-2 outline-none focus:border-orange-500 transition-colors"
                placeholder="e.g. Jailer"
              />
            </div>

            {/* 🔥 Stream Type Select Field 🔥 */}
            <div className="md:col-span-1">
              <label className="text-xs font-bold text-gray-400 uppercase">
                Stream Type
              </label>
              <select
                required
                value={formData.streamType}
                onChange={(e) =>
                  setFormData({ ...formData, streamType: e.target.value })
                }
                className="w-full border-b-2 p-2 outline-none focus:border-orange-500  "
              >
                <option value="UPCOMING">UPCOMING</option>
                <option value="NEW">NEW RELEASES</option>
                <option value="TRENDING">TRENDING NOW</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-400">
                Duration
              </label>
              <input
                type="text"
                value={formData.durationOrSeason}
                onChange={(e) =>
                  setFormData({ ...formData, durationOrSeason: e.target.value })
                }
                className="w-full border-b-2 border-gray-100 p-2 focus:border-orange-500 outline-none"
                placeholder="2h 30m "
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">
                Director
              </label>
              <input
                type="text"
                value={formData.director}
                onChange={(e) =>
                  setFormData({ ...formData, director: e.target.value })
                }
                className="w-full border-b-2 p-2 outline-none focus:border-orange-500"
                placeholder="Nelson"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">
                Release Date
              </label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={
                    formData.releaseDate
                      ? dayjs(formData.releaseDate, "DD-MM-YYYY")
                      : null
                  }
                  onChange={handleDateChange}
                  format="DD-MM-YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: "standard", // உங்கள் UI-க்கு ஏற்ப standard variant
                      sx: {
                        "& .MuiInput-underline:before": {
                          borderBottomColor: "#e5e7eb",
                        },
                        "& .MuiInput-underline:after": {
                          borderBottomColor: "#f97316",
                        }, // orange-500
                        "& input": { padding: "8px 0" },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-400 uppercase">
                Cast
              </label>
              <input
                type="text"
                value={formData.cast}
                onChange={(e) =>
                  setFormData({ ...formData, cast: e.target.value })
                }
                className="w-full border-b-2 p-2 outline-none focus:border-orange-500"
                placeholder="Rajinikanth, Mohanlal..."
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">
                Language
              </label>
              <input
                type="text"
                value={formData.language}
                onChange={(e) =>
                  setFormData({ ...formData, language: e.target.value })
                }
                className="w-full border-b-2 p-2 outline-none focus:border-orange-500"
                placeholder="Tamil"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">
                Genres
              </label>
              <input
                type="text"
                value={formData.genres}
                onChange={(e) =>
                  setFormData({ ...formData, genres: e.target.value })
                }
                className="w-full border-b-2 p-2 outline-none focus:border-orange-500"
                placeholder="Action | Drama"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-400 uppercase">
                Long Description
              </label>
              <textarea
                rows="3"
                value={formData.longDescription}
                onChange={(e) =>
                  setFormData({ ...formData, longDescription: e.target.value })
                }
                className="w-full border-2 rounded-xl p-3 outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div
              className={`relative border-2 border-dashed rounded-2xl p-6 w-full md:w-1/2 transition-all ${
                preview ? "border-orange-400 bg-orange-50" : "border-gray-200"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-center">
                {preview ? (
                  <img
                    src={preview}
                    className="h-28 mx-auto rounded shadow-md"
                    alt="Preview"
                  />
                ) : (
                  <div className="py-2">
                    <FaImage className="mx-auto text-gray-300 text-3xl mb-1" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                      Upload Banner
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full md:w-1/2 space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block">
                    Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: e.target.value })
                    }
                    className="w-full border-b p-1 outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block">
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
                    className="w-full border-b p-1 outline-none font-bold"
                  >
                    <option value="true">Active</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 flex items-center justify-center disabled:bg-gray-400"
              >
                {isLoading ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  <FaCloudUploadAlt className="mr-2" />
                )}
                {isEdit ? "Update Content" : "Publish Content"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HomeStreamingForm;
