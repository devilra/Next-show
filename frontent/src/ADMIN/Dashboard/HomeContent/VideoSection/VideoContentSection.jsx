import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus, FaSpinner, FaTrash, FaVideo, FaImage } from "react-icons/fa6";
import { Button, Snackbar, Alert, Tooltip } from "@mui/material";
import NProgress from "nprogress";
import { FaCheckCircle, FaEdit, FaTimesCircle } from "react-icons/fa";
import VideoSectionForm from "./VideoSectionForm";
import {
  deleteVideoSection,
  fetchAllVideos,
  resetVideoState,
} from "../../../../redux/HomeContentSlice/VideoSlice";

const VideoContentSection = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [snack, setSnack] = useState({ open: false, msg: "", type: "info" });

  const { videos, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.videoSection
  );

  useEffect(() => {
    dispatch(fetchAllVideos());
  }, [dispatch]);

  useEffect(() => {
    if (isLoading) {
      NProgress.start();
    } else {
      NProgress.done();
    }

    if (isError && message) setAlert("error", message);
    if (isSuccess && message) setAlert("success", message);
    if (isSuccess || isError) {
      dispatch(resetVideoState());
      NProgress.done();
    }
  }, [isError, isSuccess, message, dispatch]);

  const setAlert = (type, message) => {
    setSnack({ open: true, msg: message, type });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this video banner?")) {
      NProgress.start();
      dispatch(deleteVideoSection(id));
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 ">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-3">
            <span className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <FaVideo size={20} />
            </span>
            Video Banner Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Organize and manage your homepage hero banners and videos
          </p>
        </div>
        <Button
          variant="contained"
          onClick={() => {
            setCurrentVideo(null);
            setIsModalOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 normal-case px-6 py-2.5 rounded-xl font-bold shadow-indigo-200 shadow-lg"
          startIcon={<FaPlus />}
        >
          New Video Banner
        </Button>
      </header>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading && videos.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64">
            <FaSpinner className="animate-spin text-indigo-600 text-5xl mb-4" />
            <p className="text-gray-500 font-medium italic">
              Syncing with server...
            </p>
          </div>
        ) : (
          /* table-fixed பயன்படுத்துவதன் மூலம் வித் தாண்டி ஸ்க்ரோல் ஆகாது */
          <div className="w-full">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-4 py-4 text-xs uppercase font-bold text-gray-400 w-16">
                    order
                  </th>
                  <th className="px-4 py-4 text-xs uppercase font-bold text-gray-400 w-1/4">
                    Banner
                  </th>
                  <th className="px-4 py-4 text-xs uppercase font-bold text-gray-400 w-1/4">
                    Description
                  </th>
                  <th className="px-4 py-4 text-xs uppercase font-bold text-gray-400 text-center">
                    Video
                  </th>
                  <th className="px-4 py-4 text-xs uppercase font-bold text-gray-400 text-center">
                    Status
                  </th>
                  <th className="px-4 py-4 text-xs uppercase font-bold text-gray-400 text-right w-24">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {videos.length > 0 ? (
                  videos.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-indigo-50/30 transition-colors"
                    >
                      <td className="px-4 py-4 font-bold text-gray-400">
                        #{item.order}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-16 flex-shrink-0 rounded overflow-hidden border">
                            <img
                              src={item.bannerImage}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-gray-800 text-sm truncate">
                              {item.title}
                            </h4>
                            <p className="text-[9px] text-gray-400 truncate">
                              ID: {String(item?.id).slice(0, 5)}..
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-xs text-gray-500 line-clamp-2 break-words">
                          {item.shortDescription}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-block px-2 py-1 rounded text-[10px] font-bold ${
                            item.videoUrl
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-300"
                          }`}
                        >
                          {item.videoUrl ? "Attached" : "None"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase ${
                            item.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.isActive ? "Active" : "Off"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => {
                              setCurrentVideo(item);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-12 text-center text-gray-400 text-sm"
                    >
                      No banners found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <VideoSectionForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoData={currentVideo}
        setAlert={(type, message) => setAlert(type, message)}
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

export default VideoContentSection;
