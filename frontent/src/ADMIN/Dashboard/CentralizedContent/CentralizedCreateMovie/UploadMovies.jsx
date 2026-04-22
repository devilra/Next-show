import React, { useState } from "react";
import { FaCloudArrowUp, FaRegFileCode, FaXmark } from "react-icons/fa6";
import { HiOutlineClock } from "react-icons/hi";

import { Button } from "@mui/material";

const UploadMovies = ({ onBack, onFileSelect, setAlert }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 1) {
      setAlert("error", "Select only one file to upload!");
      return;
    }

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    if (file.type === "application/json" || file.name.endsWith(".json")) {
      setSelectedFile(file);
    } else {
      setAlert("error", "Invalid file format! Only .json files are allowed.");
      setSelectedFile(null);
    }
  };

  return (
    <div className="bg-[#1e1e1e] text-gray-300 p-6 rounded-xl border border-gray-800 w-full max-w-4xl mx-auto shadow-2xl">
      {/* Header Info */}
      {/* <div className="flex justify-between items-center mb-8">
        <button className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm">
          <FaCloudArrowUp /> Upload JSON
        </button>
        <p className="text-gray-500 text-xs flex items-center gap-1">
          <HiOutlineClock /> Only .json format allowed
        </p>
      </div> */}

      {/* Drag & Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center transition-all ${
          dragActive
            ? "border-indigo-500 bg-indigo-500/5"
            : "border-gray-700 bg-[#252525]"
        }`}
      >
        <div className="bg-white p-4 rounded-full text-indigo-600 shadow-lg mb-4">
          <FaCloudArrowUp size={32} />
        </div>

        {selectedFile ? (
          <div className="text-center z-50 relative">
            <p className="text-indigo-400 font-bold flex items-center gap-2">
              <FaRegFileCode /> {selectedFile.name}
              <FaXmark
                className="cursor-pointer text-red-400"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedFile(null);
                }}
              />
            </p>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold text-gray-100 mb-1">
              Drop your JSON file here
            </h3>
            <p className="text-sm text-gray-500 mb-6">or click to browse</p>
          </>
        )}

        <div className="bg-black/30 px-6 py-2 rounded-full border border-white/5 text-xs text-gray-400 font-medium">
          Array of movie objects → auto-loads into editor
        </div>

        {/* Hidden Input for Click to Browse */}
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept=".json"
          multiple={false}
          onChange={(e) => validateAndSetFile(e.target.files[0])}
        />
      </div>

      {/* Footer Actions */}
      <div className="mt-10 flex justify-end items-center gap-4 border-t border-gray-800 pt-6">
        {/* <button className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
          <LuArrowDownCircle className="text-gray-400" size={20} />
        </button> */}

        <button
          onClick={onBack}
          className="px-8 py-2.5 rounded-xl border border-gray-700 font-bold text-gray-300 hover:bg-gray-400/5 transition-all"
        >
          Cancel
        </button>

        <button
          disabled={!selectedFile}
          onClick={() => onFileSelect(selectedFile)}
          className={`px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
            selectedFile
              ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-indigo-500/20"
              : "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
          }`}
        >
          Load into Editor →
        </button>
      </div>
    </div>
  );
};

export default UploadMovies;
