import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiHome } from "react-icons/fi";
import { HiEye, HiEyeOff } from "react-icons/hi";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginAdmin, reset } from "../redux/AdminAuthSlice/AdminAuthSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [snackOpen, setSnackOpen] = useState(false); // snackbar
  const [snackMsg, setSnackMsg] = useState("");
  const [snackType, setSnackType] = useState("success");
  const { admin, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.admin
  );

  const togglePassword = () => setShowPass(!showPass);

  // Email regex
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Prevent space in password
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    if (value.includes(" ")) return; // block space
    setPassword(value);
  }; // 🏠 Home Navigation Handler // ----------------------------------------------------

  // ----------------------------------------------------
  const handleGoHome = () => {
    navigate("/"); // Homepage-க்குச் செல்லவும்
  };

  useEffect(() => {
    // 1. Success (Login வெற்றிகரமாக நடந்தால்)
    if (isSuccess && admin) {
      setSnackMsg("Login Successful! Redirecting...");
      setSnackType("success");
      setSnackOpen(true);

      // 200ms கழித்து Dashboard-க்குச் செல்லவும்
      setTimeout(() => {
        navigate("/admin", {
          replace: true,
        });
        dispatch(reset());
      }, 200);
    }

    // 2. Error (Login தோல்வியடைந்தால்)
    if (isError) {
      setSnackMsg(message || "Login failed. Please check your credentials.");
      setSnackType("error");
      setSnackOpen(true);
      dispatch(reset());
    }

    // Cleanup - Component Unmount ஆகும் போது state-ஐ reset செய்ய
    return () => {
      dispatch(reset());
    };
  }, [admin, isError, isSuccess, message, navigate, dispatch]);

  // Button enabled logic
  const isFormValid = validEmail && password.length > 0;

  // ----------------------------------------------------
  // 🔑 Submit Handler - API Call
  // ----------------------------------------------------

  const handleLogin = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const adminData = {
      email,
      password,
    };

    dispatch(loginAdmin(adminData));
  };

  return (
    <>
      <div className="min-h-screen w-full bg-linear-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex items-center justify-center px-4 relative">
        {/* Card */}

        <motion.button
          onClick={handleGoHome}
          className="absolute top-6 left-6 flex items-center px-4 py-2 bg-white/10 text-white rounded-xl text-sm font-semibold hover:bg-white/20 transition duration-300"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <FiHome className="mr-2 text-lg" />
          Back to Home
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 p-10 rounded-2xl shadow-2xl"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-white text-4xl font-bold tracking-wide">
              Admin Login
            </h1>
            <p className="text-gray-300 mt-2">
              Secure access to your dashboard
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Email Input */}
            <div>
              <label className="text-gray-300 mb-2 block">Email</label>
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-blue-400">
                <FiMail className="text-gray-300 text-xl" />
                <input
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent w-full ml-3 text-white outline-none placeholder-gray-400"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="text-gray-300 mb-2 block">Password</label>
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 relative focus-within:border-blue-400">
                <FiLock className="text-gray-300 text-xl" />

                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={handlePasswordChange}
                  className="bg-transparent w-full ml-3 text-white outline-none placeholder-gray-400"
                />

                {/* Eye Icon — hide if no password typed */}
                {password.length > 0 && (
                  <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute right-4 text-gray-300 text-xl"
                  >
                    {showPass ? <HiEyeOff /> : <HiEye />}
                  </button>
                )}
              </div>
            </div>

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: isFormValid ? 1.02 : 1 }}
              whileTap={{ scale: isFormValid ? 0.98 : 1 }}
              disabled={!isFormValid || isLoading}
              className={`w-full bg-blue-600 text-white py-3 rounded-xl font-semibold shadow-lg mt-4 transition flex justify-center items-center
                ${
                  !isFormValid || isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-700"
                }
              `}
            >
              {isLoading ? (
                <CircularProgress size={24} style={{ color: "white" }} />
              ) : (
                "Login"
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Snackbar */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={2000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <MuiAlert
          onClose={() => setSnackOpen(false)}
          severity={snackType}
          elevation={6}
          variant="filled"
        >
          {snackMsg}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default Login;
