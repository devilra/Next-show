import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GoogleLogin } from "@react-oauth/google";
import { useSnackbar } from "../../context/SnackbarContext";
import { useAuth } from "../../context/AuthContext";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const EyeIcon = ({ open }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const containerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.065, delayChildren: 0.05 },
  },
  exit: { opacity: 0, y: -16, transition: { duration: 0.18 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 26 },
  },
};

function FloatingInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  success,
  rightSlot,
  placeholder,
}) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  const borderColor = error
    ? "#ff5b5b"
    : success
      ? "#4ade80"
      : focused
        ? "rgba(255,255,255,0.45)"
        : "rgba(255,255,255,0.15)";

  const boxShadow = focused
    ? error
      ? "0 0 0 3px rgba(255,91,91,0.15)"
      : "0 0 0 3px rgba(255,255,255,0.07)"
    : "none";

  return (
    <div className="w-full">
      <div
        className="relative overflow-hidden rounded-[14px] backdrop-blur-sm transition-shadow duration-200"
        style={{
          border: `1.5px solid ${borderColor}`,
          background: "rgba(255,255,255,0.04)",
          boxShadow,
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      >
        <motion.label
          htmlFor={id}
          animate={{
            top: lifted ? 8 : "50%",
            y: lifted ? 0 : "-50%",
            fontSize: lifted ? 10 : 13,
            color: error
              ? "#ff5b5b"
              : focused
                ? "rgba(255,255,255,0.75)"
                : "rgba(255,255,255,0.38)",
          }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="absolute left-4 pointer-events-none font-medium z-10 leading-none whitespace-nowrap"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {label}
        </motion.label>

        <div className="flex items-end" style={{ height: 54 }}>
          <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            // onFocus={() => setFocused(true)}
            // onBlur={() => setFocused(false)}
            placeholder={lifted ? placeholder : ""}
            // autoComplete={
            //   type === "password"
            //     ? "current-password"
            //     : type === "email"
            //       ? "email"
            //       : "name"
            // }
            autoCorrect="off"
            className="w-full bg-transparent border-none outline-none text-white placeholder:text-white/20"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(13px, 2.5vw, 14px)",
              padding: "0 44px 4px 16px",
            }}
          />
        </div>

        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center z-10">
          {rightSlot ??
            (value.length > 0 && (error || success) ? (
              <span
                className="text-[12px] font-semibold leading-none select-none"
                style={{ color: error ? "#ff5b5b" : "#4ade80" }}
              >
                {/* {error ? "✕" : "✓"} */}
              </span>
            ) : null)}
        </div>
      </div>

      <AnimatePresence>
        {error && value.length > 0 && (
          <motion.p
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 4 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="text-[11px] ml-1 m-0"
            style={{ color: "#ff5b5b", fontFamily: "'DM Sans', sans-serif" }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function PasswordStrength({ password }) {
  if (!password) return null;
  const checks = [
    { label: "6+ chars", valid: password.length >= 6 },
    { label: "Uppercase", valid: /[A-Z]/.test(password) },
    { label: "Number", valid: /\d/.test(password) },
  ];
  const score = checks.filter((c) => c.valid).length;
  const colors = ["#ff5b5b", "#f59e0b", "#4ade80"];
  const labels = ["Weak", "Fair", "Strong"];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-1.5"
    >
      <div className="flex gap-1 mb-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              backgroundColor:
                i < score ? colors[score - 1] : "rgba(255,255,255,0.1)",
            }}
            transition={{ duration: 0.28 }}
            className="flex-1 rounded-full"
            style={{ height: 3 }}
          />
        ))}
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-2 flex-wrap">
          {checks.map((c, i) => (
            <motion.span
              key={i}
              animate={{ color: c.valid ? "#4ade80" : "rgba(255,255,255,0.3)" }}
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px" }}
            >
              {c.valid ? "✓" : "·"} {c.label}
            </motion.span>
          ))}
        </div>
        {score > 0 && (
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              color: colors[score - 1],
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {labels[score - 1]}
          </span>
        )}
      </div>
    </motion.div>
  );
}

function EyeBtn({ show, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="text-white/40 hover:text-white/70 transition-colors p-0.5 flex items-center bg-transparent border-none cursor-pointer"
    >
      <EyeIcon open={show} />
    </button>
  );
}

export default function AuthComponent({ setIsAuthOpen }) {
  const [tab, setTab] = useState("login");
  const [success, setSuccess] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPwd, setLoginPwd] = useState("");
  const [showLPwd, setShowLPwd] = useState(false);

  const [signName, setSignName] = useState("");
  const [signEmail, setSignEmail] = useState("");
  const [signPwd, setSignPwd] = useState("");
  const [signConfirm, setSignConfirm] = useState("");
  const [showSPwd, setShowSPwd] = useState(false);
  const [showSCPwd, setShowSCPwd] = useState(false);
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { closeAuth, isAuthOpen } = useAuth();

  console.log("LOGINSIGNUP", isAuthOpen);

  const signupMutation = useMutation({
    mutationFn: async (userdata) => {
      const response = await api.post(
        "/auth/user/auth-manual-signup",
        userdata,
      );
      console.log(response.data);
      return response.data;
    },
    onSuccess: async (data) => {
      try {
        // ======================================================
        // ✅ SUCCESS SNACKBAR
        // ======================================================

        showSnackbar(
          data?.message || "Account created successfully",
          "success",
        );
        // ======================================================
        // ✅ WAIT FOR COOKIE SET
        // ======================================================
        await new Promise((resolve) => setTimeout(resolve, 300));
        // ============================================
        // ✅ GET CURRENT USER
        // ============================================
        const currentUserResponse = await api.get("/auth/user/current-user");
        console.log("Current Resposne", currentUserResponse);
        if (currentUserResponse.data.success) {
          // ======================================================
          // ✅ RESET FORM
          // ======================================================

          setSignName("");
          setSignEmail("");
          setSignPwd("");
          setSignConfirm("");

          // ======================================================
          // ✅ CLOSE MODAL
          // ======================================================

          closeAuth();

          // ======================================================
          // ✅ NAVIGATE
          // ======================================================

          navigate("/");
        }
        console.log("CURRENT USER", currentUserResponse);
      } catch (error) {
        showSnackbar(error?.response?.data?.message, "error");
      }
    },
    onError: (error) => {
      console.log("SIGNUP ERROR", error);

      showSnackbar(error?.response?.data?.message || "Signup failed", "error");
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (userData) => {
      const response = await api.post("/auth/user/manual-login", userData);
      console.log("Login Response", response.data);
      return response.data;
    },
    onSuccess: async (data) => {
      showSnackbar(data.message, "success");

      // ============================================
      // ✅ RESET FORM
      // ============================================

      setLoginEmail("");
      setLoginPwd("");

      await queryClient.invalidateQueries({
        queryKey: ["current-user"],
      });

      closeAuth();
      navigate("/");
    },
    onError: (error) => {
      console.log("LOGIN ERROR", error);

      showSnackbar(error?.response?.data?.message || "Login failed", "error");
    },
  });

  const googleLoginApi = async (googleToken) => {
    const response = await api.post("/auth/user/google-login", {
      credential: googleToken,
    });
    console.log(response);
    return response.data;
  };

  const googleLoginMutation = useMutation({
    mutationFn: googleLoginApi,
    onSuccess: async (data) => {
      console.log("GOOGLE LOGIN SUCCESS", data);
      // ============================================
      // ✅ CLOSE MODAL IF YOU HAVE STATE
      // ============================================
      showSnackbar(data?.message || "Google login successful", "success");
      await queryClient.invalidateQueries({
        queryKey: ["current-user"],
      });

      closeAuth();
      navigate("/");
    },
    onError: (error) => {
      console.log("GOOGLE LOGIN ERROR", error);

      showSnackbar(
        error?.response?.data?.message || "Google login failed",
        "error",
      );
    },
  });

  const loginEmailErr =
    loginEmail && !emailRegex.test(loginEmail)
      ? "Enter a valid email address"
      : null;
  const loginPwdErr =
    loginPwd && loginPwd.length < 6 ? "Minimum 6 characters required" : null;
  const loginValid = emailRegex.test(loginEmail) && loginPwd.length >= 6;

  const signNameErr =
    signName && signName.trim().length < 2 ? "Enter your full name" : null;
  const signEmailErr =
    signEmail && !emailRegex.test(signEmail)
      ? "Enter a valid email address"
      : null;
  const signPwdErr =
    signPwd && signPwd.length < 6 ? "Minimum 6 characters required" : null;
  const signConfirmErr =
    signConfirm && signPwd !== signConfirm ? "Passwords don't match" : null;
  const signupValid =
    signName.trim().length >= 2 &&
    emailRegex.test(signEmail) &&
    signPwd.length >= 6 &&
    signPwd === signConfirm;

  const switchTab = (t) => {
    setTab(t);
    setSuccess(false);
  };

  // ======================================================
  // ✅ LOGIN SUBMIT
  // ======================================================
  const handleLoginSubmit = () => {
    if (!loginValid) {
      showSnackbar("Please enter valid credentials", "warning");
      return;
    }

    loginMutation.mutate({
      email: loginEmail,
      password: loginPwd,
    });
  };

  // ======================================================
  // ✅ SIGNUP SUBMIT
  // ======================================================

  const handleSignupSubmit = () => {
    if (!signupValid) {
      showSnackbar("Please fill all fields correctly", "warning");

      return;
    }

    signupMutation.mutate({
      fullName: signName,
      email: signEmail,
      password: signPwd,
    });
  };

  // Fixed card height — form scrolls inside
  const CARD_HEIGHT = 580;

  return (
    <div
      className="w-full flex items-center justify-center p-2 relative overflow-hidden"
      style={{ fontFamily: "'DM Sans',sans-serif" }}
    >
      {/* bg blobs */}
      <div
        className="absolute w-[420px] h-[420px] rounded-full -top-[10%] -left-[8%] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 70%)",
        }}
      />
      <div
        className="absolute w-[300px] h-[300px] rounded-full bottom-[5%] right-[4%] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle,rgba(168,85,247,0.06) 0%,transparent 70%)",
        }}
      />

      {/* Card — fixed height */}
      <motion.div
        initial={{ opacity: 0, y: 36, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
        className="relative w-full md:w-[400px] lg:w-[420px] rounded-[28px] overflow-hidden flex flex-col"
        style={{
          height:
            tab === "signup"
              ? "clamp(500px, 88vh, 620px)"
              : "clamp(440px, 72vh, 560px)",
          background: "rgba(18,18,26,0.93)",
          backdropFilter: "blur(32px)",
          border: "1px solid rgba(255,255,255,0.09)",
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset",
        }}
      >
        {/* top shimmer */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)",
          }}
        />

        {/* Static header — title + tabs + google + divider — never scrolls */}
        <div style={{ padding: "28px 28px 0", flexShrink: 0 }}>
          {/* Title */}
          <div className="text-center mb-5">
            <h1
              style={{
                fontSize: "clamp(18px, 4vw, 22px)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                margin: 0,
                marginBottom: 6,
                background:
                  "linear-gradient(135deg,#fff 60%,rgba(255,255,255,0.5))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {tab === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p
              style={{
                fontSize: "clamp(11px, 2vw, 13px)",
                color: "rgba(255,255,255,0.4)",
                margin: 0,
                lineHeight: 1.5,
                fontWeight: 400,
              }}
            >
              {tab === "login"
                ? "Log in to get smarter responses and more."
                : "Sign up to upload files, images, and more."}
            </p>
          </div>

          {/* Tabs */}
          <div className="relative flex bg-white/[0.05] rounded-[13px] p-[3px] mb-5">
            <motion.div
              className="absolute top-[3px] bottom-[3px] rounded-[10px]"
              style={{
                width: "calc(50% - 3px)",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              }}
              animate={{ left: tab === "login" ? 3 : "50%" }}
              transition={{ type: "spring", stiffness: 360, damping: 34 }}
            />
            {[
              { id: "login", label: "Log in" },
              { id: "signup", label: "Sign up" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => switchTab(t.id)}
                className={`relative z-10 flex-1 py-2 rounded-[10px] border-none bg-transparent cursor-pointer font-semibold tracking-[0.01em] transition-colors duration-200 ${tab === t.id ? "text-white" : "text-white/40"}`}
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: "clamp(12px, 2.5vw, 13px)",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Google */}
          {/* <motion.button
            whileHover={{
              scale: 1.018,
              backgroundColor: "rgba(255,255,255,0.11)",
            }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2 mb-4 px-4 rounded-[14px] cursor-pointer text-white font-semibold tracking-[0.01em] transition-colors duration-200"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              fontFamily: "'DM Sans',sans-serif",
              fontSize: "clamp(12px, 2.5vw, 13px)",
              paddingTop: 11,
              paddingBottom: 11,
            }}
          >
            <GoogleIcon />
            Continue with Google
          </motion.button> */}
          <motion.button
            whileHover={{
              scale: 1.018,
              backgroundColor: "rgba(255,255,255,0.11)",
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              document.querySelector('[role="button"]')?.click();
            }}
            className="
    w-full

    flex items-center justify-center gap-3

    mb-4

    px-4 py-[11px]

    rounded-[14px]

    cursor-pointer

    text-white
    font-semibold
    tracking-[0.01em]

    transition-colors duration-200
  "
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              fontFamily: "'DM Sans',sans-serif",
              fontSize: "clamp(12px, 2.5vw, 13px)",
            }}
          >
            <GoogleIcon />

            <span>Continue with Google</span>
          </motion.button>

          {/* ============================================ */}
          {/* ✅ HIDDEN GOOGLE BUTTON */}
          {/* ============================================ */}

          <div className="hidden">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                console.log("GOOGLE TOKEN", credentialResponse);

                googleLoginMutation.mutate(credentialResponse.credential);
              }}
              onError={() => {
                console.log("Google Login Failed");
              }}
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/10" />
            <span
              style={{
                fontSize: "11px",
                color: "rgba(255,255,255,0.3)",
                fontWeight: 600,
                letterSpacing: "0.08em",
              }}
            >
              OR
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
        </div>

        {/* Scrollable form area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            padding: "0 28px 28px",
            /* thin custom scrollbar */
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.18) transparent",
          }}
          className="scrollable-form"
        >
          <AnimatePresence mode="wait">
            {tab === "login" ? (
              <motion.div
                key="login"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col gap-3"
              >
                <motion.div variants={itemVariants}>
                  <FloatingInput
                    id="l-email"
                    label="Email address"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    error={loginEmailErr}
                    success={!loginEmailErr && loginEmail.length > 0}
                    placeholder="you@example.com"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FloatingInput
                    id="l-pwd"
                    label="Password"
                    type={showLPwd ? "text" : "password"}
                    value={loginPwd}
                    onChange={(e) => setLoginPwd(e.target.value)}
                    error={loginPwdErr}
                    success={!loginPwdErr && loginPwd.length > 0}
                    placeholder="••••••••"
                    rightSlot={
                      <EyeBtn
                        show={showLPwd}
                        onToggle={() => setShowLPwd((v) => !v)}
                      />
                    }
                  />
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex justify-end -mt-1"
                >
                  <button
                    className="bg-transparent border-none cursor-pointer text-white/45 font-medium hover:text-white/70 transition-colors"
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: "clamp(11px, 2vw, 12px)",
                    }}
                  >
                    Forgot password?
                  </button>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <AnimatePresence mode="wait">
                    {success ? (
                      <motion.div
                        key="ok"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="rounded-[14px] p-3 text-center font-semibold"
                        style={{
                          fontSize: "clamp(12px, 2.5vw, 13px)",
                          color: "#4ade80",
                          background: "rgba(74,222,128,0.12)",
                          border: "1px solid rgba(74,222,128,0.3)",
                        }}
                      >
                        ✓ Logged in successfully!
                      </motion.div>
                    ) : (
                      <motion.button
                        key="btn"
                        whileHover={loginValid ? { scale: 1.02 } : {}}
                        whileTap={loginValid ? { scale: 0.97 } : {}}
                        onClick={handleLoginSubmit}
                        disabled={loginMutation.isPending}
                        className="w-full rounded-[14px] border-none font-bold tracking-[0.01em] transition-all duration-300"
                        style={{
                          fontFamily: "'DM Sans',sans-serif",
                          fontSize: "clamp(13px, 2.5vw, 14px)",
                          paddingTop: 14,
                          paddingBottom: 14,
                          background: loginValid
                            ? "linear-gradient(135deg,#fff 0%,#e8e8f0 100%)"
                            : "rgba(255,255,255,0.1)",
                          color: loginValid
                            ? "#0d0d16"
                            : "rgba(255,255,255,0.3)",
                          cursor: loginMutation.isPending
                            ? "not-allowed"
                            : loginValid
                              ? "pointer"
                              : "not-allowed",
                          boxShadow: loginValid
                            ? "0 4px 20px rgba(255,255,255,0.15)"
                            : "none",
                          opacity: loginMutation.isPending
                            ? 0.7
                            : loginValid
                              ? 1
                              : 0.6,
                        }}
                      >
                        {loginMutation.isPending
                          ? "Please wait..."
                          : "Continue"}
                      </motion.button>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col gap-3"
              >
                <motion.div variants={itemVariants}>
                  <FloatingInput
                    id="s-name"
                    label="Full name"
                    value={signName}
                    onChange={(e) => setSignName(e.target.value)}
                    error={signNameErr}
                    success={!signNameErr && signName.length >= 2}
                    placeholder="John Doe"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FloatingInput
                    id="s-email"
                    label="Email address"
                    type="email"
                    value={signEmail}
                    onChange={(e) => setSignEmail(e.target.value)}
                    error={signEmailErr}
                    success={!signEmailErr && signEmail.length > 0}
                    placeholder="you@example.com"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FloatingInput
                    id="s-pwd"
                    label="Password"
                    type={showSPwd ? "text" : "password"}
                    value={signPwd}
                    onChange={(e) => setSignPwd(e.target.value)}
                    error={signPwdErr}
                    success={!signPwdErr && signPwd.length >= 6}
                    placeholder="Min. 6 characters"
                    rightSlot={
                      <EyeBtn
                        show={showSPwd}
                        onToggle={() => setShowSPwd((v) => !v)}
                      />
                    }
                  />
                  <AnimatePresence>
                    {signPwd && <PasswordStrength password={signPwd} />}
                  </AnimatePresence>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FloatingInput
                    id="s-confirm"
                    label="Confirm password"
                    type={showSCPwd ? "text" : "password"}
                    value={signConfirm}
                    onChange={(e) => setSignConfirm(e.target.value)}
                    error={signConfirmErr}
                    success={
                      !signConfirmErr &&
                      signConfirm.length > 0 &&
                      signPwd === signConfirm
                    }
                    placeholder="Repeat password"
                    rightSlot={
                      <EyeBtn
                        show={showSCPwd}
                        onToggle={() => setShowSCPwd((v) => !v)}
                      />
                    }
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <AnimatePresence mode="wait">
                    {success ? (
                      <motion.div
                        key="ok"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="rounded-[14px] p-3 text-center font-semibold"
                        style={{
                          fontSize: "clamp(12px, 2.5vw, 13px)",
                          color: "#4ade80",
                          background: "rgba(74,222,128,0.12)",
                          border: "1px solid rgba(74,222,128,0.3)",
                        }}
                      >
                        ✓ Account created! Welcome aboard 🎉
                      </motion.div>
                    ) : (
                      <motion.button
                        key="btn"
                        whileHover={signupValid ? { scale: 1.02 } : {}}
                        whileTap={signupValid ? { scale: 0.97 } : {}}
                        onClick={handleSignupSubmit}
                        disabled={signupMutation.isPending}
                        className="w-full rounded-[14px] border-none font-bold tracking-[0.01em] transition-all duration-300"
                        style={{
                          fontFamily: "'DM Sans',sans-serif",
                          fontSize: "clamp(13px, 2.5vw, 14px)",
                          paddingTop: 14,
                          paddingBottom: 14,
                          background: signupValid
                            ? "linear-gradient(135deg,#fff 0%,#e8e8f0 100%)"
                            : "rgba(255,255,255,0.1)",
                          color: signupValid
                            ? "#0d0d16"
                            : "rgba(255,255,255,0.3)",
                          cursor: signupMutation.isPending
                            ? "not-allowed"
                            : signupValid
                              ? "pointer"
                              : "not-allowed",
                          boxShadow: signupValid
                            ? "0 4px 20px rgba(255,255,255,0.15)"
                            : "none",
                          opacity: signupMutation.isPending
                            ? 0.7
                            : signupValid
                              ? 1
                              : 0.6,
                        }}
                      >
                        {signupMutation.isPending
                          ? "Creating Account..."
                          : "Create Account"}
                      </motion.button>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.p
                  variants={itemVariants}
                  className="text-white/25 text-center m-0 leading-relaxed"
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "clamp(10px, 1.8vw, 11px)",
                  }}
                >
                  By signing up, you agree to our{" "}
                  <span className="text-white/50 cursor-pointer underline">
                    Terms
                  </span>{" "}
                  and{" "}
                  <span className="text-white/50 cursor-pointer underline">
                    Privacy Policy
                  </span>
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px rgba(18,18,26,0.95) inset !important;
          -webkit-text-fill-color: #fff !important;
        }
        .scrollable-form::-webkit-scrollbar {
          width: 3px;
        }
        .scrollable-form::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollable-form::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.18);
          border-radius: 99px;
        }
        .scrollable-form::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.3);
        }
      `}</style>
    </div>
  );
}
