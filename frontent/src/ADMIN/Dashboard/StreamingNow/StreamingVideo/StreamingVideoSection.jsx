import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus, FaSpinner, FaTrash, FaVideo } from "react-icons/fa6";
import { Button, Snackbar, Alert } from "@mui/material";
import NProgress from "nprogress";
import StreamingVideoForm from "./StreamingVideoForm";
import {
  deleteStreamingContent,
  fetchAllStreaming,
  resetStreamingState,
} from "../../../../redux/StreamingNowSlice/StreamVideo";
import { FaEdit } from "react-icons/fa";

const StreamingVideoSection = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContent, setCurrentContent] = useState(null);
  const [snack, setSnack] = useState({ open: false, msg: "", type: "info" });

  const { items, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.streamingNow
  );

  useEffect(() => {
    dispatch(fetchAllStreaming());
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
      dispatch(resetStreamingState());
      NProgress.done();
    }
  }, [isError, isSuccess, message, dispatch]);

  const setAlert = (type, message) => {
    setSnack({ open: true, msg: message, type });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      NProgress.start();
      dispatch(deleteStreamingContent(id));
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 ">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-3">
            <span className="p-2 bg-red-100 text-red-600 rounded-lg">
              <FaVideo size={20} />
            </span>
            Streaming Now Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage movies, series, and live content for your platform
          </p>
        </div>
        <Button
          variant="contained"
          onClick={() => {
            setCurrentContent(null);
            setIsModalOpen(true);
          }}
          className="bg-red-600 hover:bg-red-700 normal-case px-6 py-2.5 rounded-xl font-bold"
          startIcon={<FaPlus />}
        >
          New Content
        </Button>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading && items.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64">
            <FaSpinner className="animate-spin text-red-600 text-5xl mb-4" />
            <p className="text-gray-500 italic">Fetching content...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs uppercase font-bold text-gray-400 w-16">
                    Order
                  </th>
                  <th className="px-6 py-4 text-xs uppercase font-bold text-gray-400">
                    Content Info
                  </th>
                  <th className="px-6 py-4 text-xs uppercase font-bold text-gray-400">
                    Details
                  </th>
                  <th className="px-6 py-4 text-xs uppercase font-bold text-gray-400 text-center">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs uppercase font-bold text-gray-400 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.length > 0 ? (
                  items.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-gray-400">
                        #{item.order}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={item.bannerImage}
                            alt=""
                            className="h-12 w-20 object-cover rounded shadow-sm"
                          />
                          <div>
                            <h4 className="font-bold text-gray-800 text-sm">
                              {item.title}
                            </h4>
                            <p className="text-[11px] text-gray-500 uppercase">
                              {item.language} • {item.certification}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-gray-600 line-clamp-1">
                          {item.genres}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {item.releaseYear} • {item.durationOrSeason}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                            item.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.isActive ? "Active" : "Hidden"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setCurrentContent(item);
                              setIsModalOpen(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-12 text-center text-gray-400 text-sm"
                    >
                      No streaming content found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <StreamingVideoForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contentData={currentContent}
        setAlert={setAlert}
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

export default StreamingVideoSection;
