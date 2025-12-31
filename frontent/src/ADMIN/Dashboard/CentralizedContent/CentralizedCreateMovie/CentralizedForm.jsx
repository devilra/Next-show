import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCloudUploadAlt, FaTimes, FaSpinner, FaImage } from "react-icons/fa";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import {
  createMovie,
  fetchAllMoviesAdmin,
  updateMovie,
} from "../../../../redux/CentralizedMovieSlice/CentralizedMovieSlice";

const CentralizedForm = ({ isOpen, onClose, contentData, setAlert }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.centralizedMovies);

  const initialFormState = {
    title: "",
    showInNewMovies: false,
    showInStreamingNow: false,
    status: "RELEASED", // Upcoming, Released, Postponed
    streamType: "NEW_RELEASE", // NEW_RELEASE, TRENDING, UPCOMING
    director: "TBA",
    cast: "",
    releaseDate: dayjs().format("DD-MM-YYYY"),
    certification: "U/A 18+",
    durationOrSeason: "", // Added
    language: "Tamil", // Added
    imdbRating: 0,
    userRating: 0, // Added
    ratingCount: 0, // Added
    viewCount: 0,
    isTrending: false,
    trailerUrl: "",
    availableOn: "Theatres",
    watchUrl: "", // Added
    musicDirector: "N/A",
    cinematography: "N/A", // Added
    productionHouse: "N/A", // Added
    slug: "",
    metaTitle: "",
    metaDescription: "",
    genres: "Drama", // Added
    longDescription: "", // Added
    order: 1, // Added
    isActive: true, // Added
  };

  const [formData, setFormData] = useState(initialFormState);
  const [bannerFile, setBannerFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const isEdit = !!contentData;

  useEffect(() => {
    if (contentData && isOpen) {
      setFormData({ ...initialFormState, ...contentData });
      setPreview(contentData.bannerImage);
    } else {
      setFormData(initialFormState);
      setPreview(null);
    }
  }, [contentData, isOpen]);

  const handleDateChange = (newValue) => {
    if (newValue)
      setFormData({ ...formData, releaseDate: newValue.format("DD-MM-YYYY") });
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
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (bannerFile) data.append("bannerImage", bannerFile);

    if (!isEdit && !bannerFile) return alert("Banner image is required!");

    const action = isEdit
      ? updateMovie({ id: contentData.id, formData: data })
      : createMovie(data);

    dispatch(action)
      .unwrap()
      .then(() => {
        dispatch(fetchAllMoviesAdmin());
        onClose();
        setAlert(
          "success",
          `Movie ${isEdit ? "updated" : "published"} successfully!`
        );
      })
      .catch((err) => setAlert("error", err));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-3xl w-full max-w-5xl p-6 relative shadow-2xl max-h-[95vh] overflow-y-auto scrollbar-hide">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-black transition-transform hover:rotate-90"
        >
          <FaTimes size={24} />
        </button>

        <h3 className="text-xl font-bold mb-6 text-indigo-800 border-b pb-4">
          {isEdit ? "🛠️ Edit Movie Master Data" : "🚀 Add New Movie"}
        </h3>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 text-[13px] text-black"
        >
          {/* Section 1: Visibility & Status */}
          <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
              />
              <label className="font-bold text-gray-700">Active Status</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.showInNewMovies}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    showInNewMovies: e.target.checked,
                  })
                }
              />
              <label className="font-bold text-gray-700">
                New Movie Section
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.showInStreamingNow}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    showInStreamingNow: e.target.checked,
                  })
                }
              />
              <label className="font-bold text-gray-700">
                Streaming Section
              </label>
            </div>
            {/* <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isTrending}
                onChange={(e) =>
                  setFormData({ ...formData, isTrending: e.target.checked })
                }
              />
              <label className="font-bold text-gray-700">Trending</label>
            </div> */}
          </div>

          {/* Section 2: Core Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase">
                  Movie Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full border-b p-2 outline-none focus:border-indigo-500 bg-transparent"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase">
                  Stream Type
                </label>
                <select
                  value={formData.streamType}
                  onChange={(e) =>
                    setFormData({ ...formData, streamType: e.target.value })
                  }
                  className="w-full border-b p-2 bg-transparent outline-none"
                >
                  <option value="NEW_RELEASE">New Release</option>
                  <option value="TRENDING">Trending</option>
                  <option value="UPCOMING">Upcoming</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full border-b p-2 bg-transparent outline-none"
                >
                  <option value="UPCOMING">Upcoming</option>
                  <option value="RELEASED">Released</option>
                  <option value="POSTPONED">Postponed</option>
                </select>
              </div>
            </div>

            {/* Banner Upload */}
            <div
              className={`relative border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center ${
                preview ? "border-indigo-400 bg-indigo-50" : "border-gray-200"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {preview ? (
                <img src={preview} className="h-24 rounded-lg object-cover" />
              ) : (
                <div className="text-center text-gray-400">
                  <FaImage size={30} className="mx-auto" />
                  <p className="text-[9px] font-bold mt-1 uppercase">
                    Banner Image
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Technical Details */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase">
                Language
              </label>
              <input
                type="text"
                value={formData.language}
                onChange={(e) =>
                  setFormData({ ...formData, language: e.target.value })
                }
                className="w-full border-b p-2"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase">
                Duration / Season
              </label>
              <input
                type="text"
                placeholder="2h 30m / Season 1"
                value={formData.durationOrSeason}
                onChange={(e) =>
                  setFormData({ ...formData, durationOrSeason: e.target.value })
                }
                className="w-full border-b p-2"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase">
                Genres
              </label>
              <input
                type="text"
                value={formData.genres}
                onChange={(e) =>
                  setFormData({ ...formData, genres: e.target.value })
                }
                className="w-full border-b p-2"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
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
                    textField: { variant: "standard", fullWidth: true },
                  }}
                />
              </LocalizationProvider>
            </div>
          </div>

          {/* Section 4: Cast & Crew */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase">
                Director
              </label>
              <input
                type="text"
                value={formData.director}
                onChange={(e) =>
                  setFormData({ ...formData, director: e.target.value })
                }
                className="w-full border-b p-2"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase">
                Music Director
              </label>
              <input
                type="text"
                value={formData.musicDirector}
                onChange={(e) =>
                  setFormData({ ...formData, musicDirector: e.target.value })
                }
                className="w-full border-b p-2"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase">
                Cinematography
              </label>
              <input
                type="text"
                value={formData.cinematography}
                onChange={(e) =>
                  setFormData({ ...formData, cinematography: e.target.value })
                }
                className="w-full border-b p-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-gray-400 uppercase">
                Cast (Names)
              </label>
              <input
                type="text"
                value={formData.cast}
                onChange={(e) =>
                  setFormData({ ...formData, cast: e.target.value })
                }
                className="w-full border-b p-2"
                placeholder="Vijay, Trisha..."
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase">
                Production House
              </label>
              <input
                type="text"
                value={formData.productionHouse}
                onChange={(e) =>
                  setFormData({ ...formData, productionHouse: e.target.value })
                }
                className="w-full border-b p-2"
              />
            </div>
          </div>

          {/* Section 5: Ratings & Links */}
          <div className="bg-gray-50 p-5 rounded-2xl grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase">
                IMDb Rating
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.imdbRating}
                onChange={(e) =>
                  setFormData({ ...formData, imdbRating: e.target.value })
                }
                className="w-full border-b p-2 bg-transparent"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase">
                User Rating
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.userRating}
                onChange={(e) =>
                  setFormData({ ...formData, userRating: e.target.value })
                }
                className="w-full border-b p-2 bg-transparent"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase">
                Rating Count
              </label>
              <input
                type="number"
                value={formData.ratingCount}
                onChange={(e) =>
                  setFormData({ ...formData, ratingCount: e.target.value })
                }
                className="w-full border-b p-2 bg-transparent"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase">
                Display Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: e.target.value })
                }
                className="w-full border-b p-2 bg-transparent"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase">
                Available On
              </label>
              <select
                value={formData.availableOn}
                onChange={(e) =>
                  setFormData({ ...formData, availableOn: e.target.value })
                }
                className="w-full border-b p-2 bg-transparent"
              >
                <option value="Theatres">Theatres</option>
                <option value="Netflix">Netflix</option>
                <option value="Prime Video">Prime Video</option>
                <option value="Disney+ Hotstar">Hotstar</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-gray-400 uppercase">
                Trailer URL
              </label>
              <input
                type="text"
                value={formData.trailerUrl}
                onChange={(e) =>
                  setFormData({ ...formData, trailerUrl: e.target.value })
                }
                className="w-full border-b p-2 bg-transparent"
                placeholder="YouTube Link"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-[10px] font-bold text-gray-400 uppercase">
                Watch URL (Streaming Link)
              </label>
              <input
                type="text"
                value={formData.watchUrl}
                onChange={(e) =>
                  setFormData({ ...formData, watchUrl: e.target.value })
                }
                className="w-full border-b p-2 bg-transparent"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Section 6: Description */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase">
              Long Description / Synopsis
            </label>
            <textarea
              rows="3"
              value={formData.longDescription}
              onChange={(e) =>
                setFormData({ ...formData, longDescription: e.target.value })
              }
              className="w-full border rounded-xl p-3 outline-none focus:border-indigo-500 mt-1"
            />
          </div>

          {/* Section 7: SEO */}
          <div className="p-5 border-2 border-indigo-50 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-indigo-600 uppercase">
                SEO & Meta Data
              </span>
            </div>
            <input
              type="text"
              placeholder="Slug (URL Friendly)"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              className="w-full border rounded-lg p-2"
            />
            <input
              type="text"
              placeholder="Meta Title"
              value={formData.metaTitle}
              onChange={(e) =>
                setFormData({ ...formData, metaTitle: e.target.value })
              }
              className="w-full border rounded-lg p-2"
            />
            <textarea
              placeholder="Meta Description"
              value={formData.metaDescription}
              onChange={(e) =>
                setFormData({ ...formData, metaDescription: e.target.value })
              }
              className="w-full border rounded-lg p-2 md:col-span-2"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-indigo-600 text-white px-8 py-2 rounded-xl font-bold hover:bg-indigo-700 flex items-center shadow-lg disabled:bg-gray-400"
            >
              {isLoading ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <FaCloudUploadAlt className="mr-2" />
              )}
              {isEdit ? "Update Master Record" : "Publish Movie"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CentralizedForm;
