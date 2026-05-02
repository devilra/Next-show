import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaPlus,
  FaSpinner,
  FaTrash,
  FaFilm,
  FaCloudArrowUp,
} from "react-icons/fa6";
import { Button, Snackbar, Alert } from "@mui/material";
import NProgress from "nprogress";
import CentralizedForm from "./CentralizedForm";
import { AnimatePresence, motion } from "framer-motion";
import {
  deleteMovie,
  fetchAllMoviesAdmin,
  resetMovieState,
} from "../../../../redux/CentralizedMovieSlice/CentralizedMovieSlice";
import {
  FaEdit,
  FaFire,
  FaRocket,
  FaPlayCircle,
  FaArrowLeft,
  FaFileUpload,
  FaDatabase,
} from "react-icons/fa";
import AdminMovieEditor from "./AdminMovieEditor";
import UploadMovies from "./UploadMovies";
import CentralizedJsonMovie from "./CentralizedJsonMovie";
import CentralizedJsonMovieDetails from "./CentralizedJsonMovieDetails";

const CentralizedSection = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContent, setCurrentContent] = useState(null);
  const [snack, setSnack] = useState({ open: false, msg: "", type: "info" });
  const [bulkData, setBulkData] = useState([]);
  const [activeTab, setActiveTab] = useState("json"); // "json" or "centralized"
  const [selectedJsonMovie, setSelectedJsonMovie] = useState(null);

  // console.log("IS Model Open", isModalOpen);

  // 🔄 UI Switching State
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [isEditorActive, setIsEditorActive] = useState(false); // New state to switch between Upload UI and Editor UI

  const { movies, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.centralizedMovies,
  );

  // console.log(movies);

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

  const validateMovie = (movie) => {
    let errors = [];

    // ENUM VALIDATION
    const validStatus = ["UPCOMING", "RELEASED", "TRENDING"];
    if (!validStatus.includes(movie.status)) {
      errors.push("Invalid status");
    }

    const validStream = ["TRENDING", "UPCOMING", "NEW_RELEASE"];
    if (!validStream.includes(movie.streamType)) {
      errors.push("Invalid streamType");
    }

    // ⭐ RATING VALIDATION (NEW)
    if (movie.imdbRating !== undefined) {
      if (movie.imdbRating > 10 || movie.imdbRating < 0) {
        errors.push("IMDB rating must be between 0 and 10");
      }
    }

    if (movie.userRating !== undefined) {
      if (movie.userRating > 10 || movie.userRating < 0) {
        errors.push("User rating must be between 0 and 10");
      }
    }

    // BOX OFFICE VALIDATION
    if (movie.boxOffice?.budget) {
      const val = movie.boxOffice.budget;

      if (!val.startsWith("₹")) {
        errors.push("Missing ₹ in budget");
      }

      if (!val.includes("Crore")) {
        errors.push("Missing Crore in budget");
      }
    }

    return errors;
  };

  const handleFileProcessing = (file) => {
    NProgress.start();

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);

        if (Array.isArray(jsonData)) {
          // 🔥 VALIDATE EACH MOVIE
          const validatedData = jsonData.map((movie) => {
            const errors = validateMovie(movie);

            return {
              ...movie,
              __errors: errors, // 🔥 attach errors
            };
          });

          setBulkData(validatedData);
          setIsEditorActive(true);

          setAlert(
            "success",
            `${validatedData.length} movies loaded (with validation)`,
          );
        } else {
          setAlert("error", "Invalid JSON! Must be array");
        }
      } catch {
        setAlert("error", "Invalid JSON format");
      } finally {
        NProgress.done();
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="p-2 md:p-2 bg-gray-50 min-h-screen overflow-hidden relative">
      <AnimatePresence>
        {!showBulkUpload ? (
          <motion.div
            key="table-ui"
            initial={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }} // Slide left when exiting
            transition={{ duration: 0.3 }}
          >
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
              <div className="flex gap-3">
                {/* 🆕 UPLOAD MOVIE BUTTON */}
                <Button
                  variant="outlined"
                  onClick={() => setShowBulkUpload(true)}
                  className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 normal-case px-5 py-2 rounded-xl font-bold"
                  startIcon={<FaCloudArrowUp />}
                >
                  Upload Movies
                </Button>
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
              </div>
            </header>

            {/* 🛠 TABS NAVIGATION */}
            <div className="flex gap-2 mb-6 bg-gray-200/50 rounded-2xl p-1 w-fit">
              <button
                onClick={() => setActiveTab("json")}
                className={`flex items-center gap-2 px-6 py-2.5 cursor-pointer rounded-xl text-sm  transition-all ${activeTab === "json" ? "bg-white text-orange-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                <FaFileUpload size={14} />
                JSON Upload Movies
              </button>
              <button
                onClick={() => setActiveTab("centralized")}
                className={`flex items-center gap-2 px-6 py-2.5 cursor-pointer rounded-xl text-sm font-bold transition-all ${
                  activeTab === "centralized"
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <FaDatabase size={14} />
                Old Centralized Movie
              </button>
            </div>

            {/* 🔄 CONDITIONAL CONTENT RENDERING */}

            {activeTab === "json" ? (
              // Logic: Details state irundha Details Component, illana List Component
              selectedJsonMovie ? (
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  <CentralizedJsonMovieDetails
                    movie={selectedJsonMovie}
                    onClose={() => setSelectedJsonMovie(null)}
                  />
                </motion.div>
              ) : (
                <CentralizedJsonMovie
                  setAlert={setAlert}
                  onMovieSelect={(movie) => setSelectedJsonMovie(movie)}
                />
              )
            ) : (
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
            )}
          </motion.div>
        ) : (
          <motion.div
            key="editor-ui"
            initial={{ x: "100%", opacity: 0 }} // Start from right
            animate={{ x: 0, opacity: 1 }} // Slide to center
            exit={{ x: "100%", opacity: 0 }} // Slide back to right
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 min-h-[85vh] flex flex-col">
              <header className="p-5 border-b border-gray-100 flex justify-between items-center bg-indigo-50/50 rounded-t-2xl">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowBulkUpload(false)}
                    className="p-2 hover:bg-white rounded-full text-indigo-600 transition-all shadow-sm"
                  >
                    <FaArrowLeft size={18} />
                  </button>
                  <div>
                    <h2 className="text-lg  text-gray-800">Bulk JSON Upload</h2>
                    {/* <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                      Editor Mode
                    </p> */}
                  </div>
                </div>
              </header>
              <div className="flex-grow  flex items-center justify-center ">
                {/* CONDITIONAL SWITCH: Upload UI or Editor UI */}
                {!isEditorActive ? (
                  <UploadMovies
                    onBack={() => setShowBulkUpload(false)}
                    onFileSelect={handleFileProcessing}
                    setAlert={setAlert}
                  />
                ) : (
                  <AdminMovieEditor
                    initialData={bulkData} // 🆕 Parsed data-va anuprom
                    onBack={() => setIsEditorActive(false)}
                    validateMovie={validateMovie}
                    setBulkData={setBulkData}
                    setAlert={setAlert}
                    modalOpen={setIsModalOpen}
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          severity={snack.type}
          variant="filled"
          sx={{
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: "500",
            minWidth: "400px",
            maxWidth: "600px",
            alignItems: "center",
            boxShadow: "0px 10px 20px rgba(0,0,0,0.15)",
          }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CentralizedSection;
