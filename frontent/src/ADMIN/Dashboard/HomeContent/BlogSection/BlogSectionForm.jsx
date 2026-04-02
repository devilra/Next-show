import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import {
  FaCloudUploadAlt,
  FaTimes,
  FaSpinner,
  FaImage,
  FaCheckCircle,
} from "react-icons/fa";
import { TextField } from "@mui/material";
import {
  createBlog,
  fetchAllBlogs,
  updateBlog,
} from "../../../../redux/HomeContentSlice/blogSlice";

const BlogSectionForm = ({ isOpen, onClose, blogData, setAlert }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.blogSection);

  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    longDescription: "",
    directedBy: "",
    starCast: "",
    producedBy: "",
    newsDate: "",
    order: 1,
    cinematography: "",
    isActive: true,
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const isEdit = !!blogData;

  useEffect(() => {
    if (blogData && isOpen) {
      setFormData({ ...blogData });
      setPreview(blogData.bannerImage);
    } else {
      setFormData({
        title: "",
        shortDescription: "",
        longDescription: "",
        directedBy: "",
        starCast: "",
        producedBy: "",
        cinematography: "",
        newsDate: dayjs().format("MMM DD, YYYY"), // Default இன்றைய தேதி
        order: 1,
        isActive: true,
      });
      setPreview(null);
      setFile(null);
    }
  }, [blogData, isOpen]);

  // Date Change Handler
  const handleDateChange = (newValue) => {
    if (newValue) {
      // இங்கேதான் "Dec 30, 2025" என்ற Format-க்கு மாற்றுகிறோம்
      const formattedDate = newValue.format("MMM DD, YYYY");
      setFormData({ ...formData, newsDate: formattedDate });
    }
  };

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (file) data.append("bannerImage", file);

    const action = isEdit
      ? updateBlog({ id: blogData.id, formData: data })
      : createBlog(data);

    dispatch(action)
      .unwrap()
      .then(() => {
        dispatch(fetchAllBlogs());
        onClose();
        setAlert(
          "success",
          `Blog ${isEdit ? "updated" : "published"} successfully!`
        );
      })
      .catch((err) => setAlert("error", err));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-800"
        >
          <FaTimes size={24} />
        </button>
        <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
          {isEdit ? "Edit Movie Blog" : "Create Movie Blog"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5 text-black">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">
                Movie Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g. Jana Nayagan"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">
                Director Name *
              </label>
              <input
                type="text"
                required
                value={formData.directedBy}
                onChange={(e) =>
                  setFormData({ ...formData, directedBy: e.target.value })
                }
                className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Director Name"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700">
              Short Description *
            </label>
            <input
              type="text"
              required
              value={formData.shortDescription}
              onChange={(e) =>
                setFormData({ ...formData, shortDescription: e.target.value })
              }
              className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Brief catchphrase..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700">
              Long Description / Content
            </label>
            <textarea
              rows="4"
              value={formData.longDescription}
              onChange={(e) =>
                setFormData({ ...formData, longDescription: e.target.value })
              }
              className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Full article content..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">
                Display Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: e.target.value })
                }
                className="w-full border p-3 rounded-xl text-sm"
              />
            </div>
            {/* <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">
                Directed By
              </label>
              <input
                type="text"
                value={formData.directedBy}
                onChange={(e) =>
                  setFormData({ ...formData, directedBy: e.target.value })
                }
                className="w-full border p-3 rounded-xl text-sm"
                placeholder="Lokesh, Nelson..."
              />
            </div> */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">
                Produced By
              </label>
              <input
                type="text"
                value={formData.producedBy}
                onChange={(e) =>
                  setFormData({ ...formData, producedBy: e.target.value })
                }
                className="w-full border p-3 rounded-xl text-sm"
                placeholder="AGS"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">
                Cinematography
              </label>
              <input
                type="text"
                value={formData.cinematography}
                onChange={(e) =>
                  setFormData({ ...formData, cinematography: e.target.value })
                }
                className="w-full border p-3 rounded-xl text-sm"
                placeholder="type cinematography..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">
                Star Cast
              </label>
              <input
                type="text"
                value={formData.starCast}
                onChange={(e) =>
                  setFormData({ ...formData, starCast: e.target.value })
                }
                className="w-full border p-3 rounded-xl text-sm"
                placeholder="Vijay, Trisha..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">
                News Date
              </label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={dayjs(formData.newsDate)}
                  onChange={handleDateChange}
                  format="MMM DD, YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      sx: {
                        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">
                Visibility
              </label>
              <select
                value={formData.isActive}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isActive: e.target.value === "true",
                  })
                }
                className="w-full border p-3 rounded-xl text-sm"
              >
                <option value="true">Active</option>
                <option value="false">Hidden</option>
              </select>
            </div>
          </div>

          {/* Image Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
              preview
                ? "border-green-400 bg-green-50"
                : "border-gray-300 hover:border-orange-400"
            }`}
          >
            <input
              type="file"
              onChange={handleFile}
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {preview ? (
              <div className="flex flex-col items-center">
                <img
                  src={preview}
                  className="h-32 w-56 object-cover rounded-lg shadow-md mb-2"
                />
                <p className="text-xs text-green-600 font-bold flex items-center gap-1">
                  <FaCheckCircle /> Image Selected
                </p>
              </div>
            ) : (
              <div>
                <FaImage className="mx-auto text-gray-400 text-4xl mb-2" />
                <p className="text-sm font-bold text-gray-500">
                  Upload Banner Image (Required)
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold text-lg hover:bg-orange-700 transition-all flex items-center justify-center disabled:bg-gray-400"
          >
            {isLoading ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              <FaCloudUploadAlt className="mr-2" />
            )}
            {isEdit ? "Update Blog News" : "Publish Blog News"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BlogSectionForm;
