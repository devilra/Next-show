// src/components/Sidebar.js (அல்லது உங்கள் பாதைக்கு ஏற்ப)

import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaSignOutAlt } from "react-icons/fa"; // Icons-க்காக react-icons பயன்படுத்துகிறேன்
import { IoHomeSharp } from "react-icons/io5";
import { MdOutlineMiscellaneousServices } from "react-icons/md";
import { AiOutlineSolution } from "react-icons/ai";
import { useDispatch } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { HiNewspaper } from "react-icons/hi";
import { logoutAdmin } from "../../redux/AdminAuthSlice/AdminAuthSlice";

// MuiAlert-ஐ helper function ஆக மாற்றவும்
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 💡 Snackbar State Management
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackType, setSnackType] = useState("success"); // default success

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackOpen(false);
  };

  // ----------------------------------------------------
  // 🚪 Logout Logic
  // ----------------------------------------------------

  const handleLogout = () => {
    // 1. Alert Box-ஐக் காட்டவும்
    const confirmLogout = window.confirm("Are you sure you want to log out?");

    if (confirmLogout) {
      // 2. ஆம் என்றால், logoutAdmin Thunk-ஐ அழைக்கவும்
      dispatch(logoutAdmin())
        .then(() => {
          // 3. Logout முடிந்தவுடன் Login Page-க்கு Redirect செய்யவும்
          // Success (Logout முடிந்தவுடன்)
          setSnackMsg("Logged out successfully.");
          setSnackType("success");
          setSnackOpen(true);
          // 100ms தாமதத்துக்குப் பிறகு Login Page-க்கு Redirect செய்யவும்
          setTimeout(() => {
            navigate("/auth/login", { replace: true });
          }, 100);
        })
        .catch((error) => {
          // 🚨 ERROR (Logout-இல் பிழை ஏற்பட்டால்)
          let errorMessage = "Logout Failed. Server error or network issue.";

          // Thunk-இல் இருந்து rejectWithValue மூலம் அனுப்பப்பட்ட message-ஐப் பயன்படுத்த
          if (error.payload) {
            errorMessage = error.payload;
          }
          setSnackMsg(errorMessage);
          setSnackType("error");
          setSnackOpen(true);
        });
    }
  };

  return (
    // Tailwind CSS-ல் 'fixed' பயன்படுத்தி இடது பக்கத்தில் நிலையாக வைக்கப்பட்டுள்ளது
    <div className="fixed top-0 left-0 h-screen w-64 bg-[#0a0a0a] text-white p-4 z-20 shadow-2xl flex flex-col justify-between">
      <div>
        <h2
          style={{ fontFamily: '"Nosifer", cursive' }}
          className="text-2xl font-extrabold mb-8 text-white border-b border-gray-700 pb-3"
        >
          NEXT SHOW
        </h2>

        <ul className="space-y-3">
          {/* <li>
            <NavLink
              to="dashboard"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg transition duration-200 
               ${
                 isActive
                   ? "bg-blue-600 text-white shadow-lg"
                   : "text-gray-300 hover:bg-gray-700 hover:text-white"
               }`
              }
            >
              <FaTachometerAlt className="mr-3" />
              Dashboard
            </NavLink>
          </li> */}
          <li>
            <NavLink
              to="home"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg transition duration-200 
               ${
                 isActive
                   ? "bg-orange-400 text-white shadow-lg"
                   : "text-gray-300 hover:bg-gray-700 hover:text-white"
               }`
              }
            >
              <IoHomeSharp className="mr-3" />
              Home Contents
            </NavLink>
          </li>
          <li>
            <NavLink
              to="stream"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg transition duration-200 
               ${
                 isActive
                   ? "bg-orange-400 text-white shadow-lg"
                   : "text-gray-300 hover:bg-gray-700 hover:text-white"
               }`
              }
            >
              <HiNewspaper className="mr-3" />
              StreamingNow
            </NavLink>
          </li>
          <li>
            <NavLink
              to="centralized"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg transition truncate duration-200 
               ${
                 isActive
                   ? "bg-orange-400 text-white shadow-lg"
                   : "text-gray-300 hover:bg-gray-700 hover:text-white"
               }`
              }
            >
              <HiNewspaper className="mr-3" />
              Centralized Create Movie
            </NavLink>
          </li>
          {/* <li>
            <NavLink
              to="serviceContent"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg transition duration-200 
               ${
                 isActive
                   ? "bg-orange-400 text-white shadow-lg"
                   : "text-gray-300 hover:bg-gray-700 hover:text-white"
               }`
              }
            >
              <MdOutlineMiscellaneousServices className="mr-3" />
              Service Contents
            </NavLink>
          </li> */}
          {/* <li>
            <NavLink
              to="solutionContent"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg transition duration-200 
               ${
                 isActive
                   ? "bg-orange-400 text-white shadow-lg"
                   : "text-gray-300 hover:bg-gray-700 hover:text-white"
               }`
              }
            >
              <AiOutlineSolution className="mr-3" />
              Solution Contents
            </NavLink>
          </li> */}
        </ul>
      </div>
      {/* -------------------- Bottom Section: Logout Button -------------------- */}
      <div className="mt-auto border-t border-gray-700 pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center p-3 w-full rounded-lg transition duration-200 bg-red-600 text-white hover:bg-red-700 shadow-lg font-semibold"
        >
          <FaSignOutAlt className="mr-3" />
          Logout
        </button>
      </div>
      {/* -------------------- Snackbar -------------------- */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={4000}
        onClose={handleSnackClose}
      >
        <Alert
          onClose={handleSnackClose}
          severity={snackType}
          sx={{ width: "100%" }}
        >
          {snackMsg}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Sidebar;
