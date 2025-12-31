import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus, FaSpinner, FaTrash, FaFilm } from "react-icons/fa6";
import { Button, Snackbar, Alert } from "@mui/material";
import NProgress from "nprogress";
import CentralizedForm from "./CentralizedForm";
import {
  deleteMovie,
  fetchAllMoviesAdmin,
  resetMovieState,
} from "../../../../redux/CentralizedMovieSlice/CentralizedMovieSlice";
import { FaEdit, FaFire, FaRocket, FaPlayCircle } from "react-icons/fa";

const CentralizedSection = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContent, setCurrentContent] = useState(null);
  const [snack, setSnack] = useState({ open: false, msg: "", type: "info" });

  const { movies, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.centralizedMovies
  );

  useEffect(() => {
    dispatch(fetchAllMoviesAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (isLoading) NProgress.start();
    else NProgress.done();

    if (isError && message) setAlert("error", message);
    if (isSuccess && message) setAlert("success", message);

    if (isSuccess || isError) {
      dispatch(resetMovieState());
      NProgress.done();
    }
  }, [isError, isSuccess, message, dispatch]);

  const setAlert = (type, message) => {
    setSnack({ open: true, msg: message, type });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      NProgress.start();
      dispatch(deleteMovie(id));
    }
  };

  return (
    <div className="p-2 md:p-6 bg-gray-50 min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
            <span className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <FaFilm size={18} />
            </span>
            Centralized Movies
          </h2>
          <p className="text-[11px] text-gray-500 mt-0.5 uppercase tracking-wider font-semibold">
            Database Management
          </p>
        </div>
        <Button
          variant="contained"
          onClick={() => {
            setCurrentContent(null);
            setIsModalOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 normal-case px-5 py-2 rounded-xl font-bold shadow-md shadow-indigo-100"
          startIcon={<FaPlus />}
        >
          Add Movie
        </Button>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading && movies.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64">
            <FaSpinner className="animate-spin text-indigo-600 text-4xl mb-4" />
            <p className="text-gray-500 text-sm italic">Loading...</p>
          </div>
        ) : (
          /* table-fixed and w-full makes it adapt to screen width */
          <div className="w-full">
            <table className="w-full text-left border-collapse table-auto">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-4 text-[10px] uppercase font-bold text-gray-400">
                    Movie Info
                  </th>
                  <th className="px-3 py-4 text-[10px] uppercase font-bold text-gray-400">
                    Streaming
                  </th>
                  <th className="px-3 py-4 text-[10px] uppercase font-bold text-gray-400">
                    Sections
                  </th>
                  <th className="px-3 py-4 text-[10px] uppercase font-bold text-gray-400">
                    Rating
                  </th>
                  <th className="px-3 py-4 text-[10px] uppercase font-bold text-gray-400 text-center">
                    Status
                  </th>
                  <th className="px-4 py-4 text-[10px] uppercase font-bold text-gray-400 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {movies.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Movie Info */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.bannerImage}
                          className="h-10 w-14 object-cover rounded shadow-sm flex-shrink-0"
                          alt=""
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-gray-800 text-[12px] truncate uppercase leading-tight">
                            {item.title}
                          </h4>
                          <p className="text-[9px] text-gray-500 truncate mt-0.5">
                            {item.availableOn}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Streaming Type */}
                    <td className="px-3 py-3">
                      {item.streamType === "UPCOMING" ? (
                        <span className="inline-flex items-center gap-1 text-purple-600 font-bold text-[9px] bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                          <FaRocket size={8} /> UPCOMING
                        </span>
                      ) : item.streamType === "NEW_RELEASE" ? (
                        <span className="inline-flex items-center gap-1 text-green-600 font-bold text-[9px] bg-green-50 px-2 py-0.5 rounded border border-green-100">
                          <FaPlayCircle size={8} /> NEW
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-orange-600 font-bold text-[9px] bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
                          <FaFire size={8} /> TRENDING
                        </span>
                      )}
                    </td>

                    {/* Sections */}
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1 max-w-[120px]">
                        {item.showInNewMovies && (
                          <span className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded text-[8px] font-bold border border-emerald-100">
                            NEW-MOVIES
                          </span>
                        )}
                        {item.showInStreamingNow && (
                          <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-[8px] font-bold border border-blue-100">
                            STREAMING-NOW
                          </span>
                        )}
                        {/* {item.isTrending && (
                          <span className="bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded text-[8px] font-bold border border-amber-100">
                            TREND
                          </span>
                        )} */}
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="px-3 py-3 font-bold text-[12px] text-gray-700 whitespace-nowrap">
                      ⭐ {item.imdbRating}
                    </td>

                    {/* Active Status */}
                    <td className="px-3 py-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                          item.isActive
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {item.isActive ? "Active" : "Hide"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => {
                            setCurrentContent(item);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CentralizedForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contentData={currentContent}
        setAlert={setAlert}
      />
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snack.type}
          variant="filled"
          sx={{ borderRadius: "8px", fontSize: "12px" }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CentralizedSection;
