import {
  Link,
  useLocation,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  HiChevronRight,
  HiMenu,
  HiOutlineTranslate,
  HiSearch,
  HiX,
} from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { FaBookmark, FaHeart, FaUser } from "react-icons/fa6";
import AuthComponent from "./LoginSignupComponent";
import { useDispatch, useSelector } from "react-redux";
import ProfileDropdown from "./ProfileDropdown";
import { FaCog, FaHistory, FaSignOutAlt } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import { logoutUser } from "../redux/userAuthSlice/UserAuthSlice";
import ReusableConfirmDialog from "./ReusableConfirmDialog";
import { useSnackbar } from "../../context/SnackbarContext";
import { useAuth } from "../../context/AuthContext";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/stream", label: "Streaming Now" },
  { to: "/new", label: "New Movies" },
  { to: "/videos", label: "Videos" },
  { to: "/news", label: "News" },
  // { to: "/about", label: "About Us" },
  { to: "/auth/login", label: "Login", isLogin: true },
];

const languages = ["Tamil", "English", "Hindi", "Telugu", "Malayalam"];

const menuVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.25 } },
};

const profileDropdownLinks = [
  {
    label: "My Profile",
    icon: FaUser,
    path: "/profile",
  },

  // {
  //   label: "Watchlist",
  //   icon: FaBookmark,
  //   path: "/watchlist",
  // },

  // {
  //   label: "Favorites",
  //   icon: FaHeart,
  //   path: "/favorites",
  // },

  // {
  //   label: "Watch History",
  //   icon: FaHistory,
  //   path: "/history",
  // },

  // {
  //   label: "Settings",
  //   icon: FaCog,
  //   path: "/settings",
  // },

  {
    label: "Logout",
    icon: FaSignOutAlt,
    action: "logout",
    danger: true,
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef(null);
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("Tamil");
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef(null); // Language outside click-kku
  // const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const dispatch = useDispatch();
  // ======================================================
  // ✅ STATES
  // ======================================================
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { showSnackbar } = useSnackbar();
  const { isAuthenticated, authLoading, currentUser, authChecked } =
    useSelector((state) => state.userAuth);
  const navbarRef = useRef(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { openAuth, closeAuth, isAuthOpen } = useAuth();
  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

  useEffect(() => {
    if (isOpen || isLangOpen || isAuthOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, isLangOpen, isAuthOpen]);

  // ======================================================
  // ✅ OUTSIDE CLICK
  // ======================================================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      // PROFILE AREA CLICK
      if (event.target.closest(".profile-dropdown")) {
        return;
      }

      // FULL NAVBAR OUTSIDE
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsOpen(false);

        setIsLangOpen(false);

        setIsProfileOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  // ======================================================
  // ✅ TOGGLES
  // ======================================================

  const handleMobileMenuToggle = () => {
    setIsOpen(!isOpen);

    setIsLangOpen(false);

    setIsProfileOpen(false);
  };

  const handleLanguageToggle = () => {
    setIsLangOpen(!isLangOpen);

    setIsProfileOpen(false);

    setIsOpen(false);
  };

  const handleProfileToggle = () => {
    setIsProfileOpen(!isProfileOpen);

    setIsLangOpen(false);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return null;
    }

    // ======================================================
    // ✅ FULL URL
    // ======================================================

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    // ======================================================
    // ✅ LOCAL IMAGE
    // ======================================================

    return `${IMAGE_BASE_URL}${imagePath}`;
  };

  // ─── HAMBURGER ANIMATION ───
  const topBar = {
    closed: { rotate: 0, translateY: 0 },
    opened: { rotate: 45, translateY: 8 }, // Center alignment fix
  };
  const midBar = {
    closed: { opacity: 1, x: 0 },
    opened: { opacity: 0, x: -20 },
  };
  const botBar = {
    closed: { rotate: 0, y: 0, width: "20px" }, // Initial small width
    opened: {
      rotate: -45,
      y: -10, // Adjusted from -12 for perfect center X
      width: "31px", // Full width when open to form the X
    },
  };

  const menuContainer = {
    hidden: { opacity: 0, scale: 0.95, y: -20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.3, staggerChildren: 0.1, delayChildren: 0.2 },
    },
    exit: { opacity: 0, scale: 0.95, y: -20, transition: { duration: 0.2 } },
  };

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/auth/user/user-logout");
      console.log("Logout Response", response.data);
      return response.data;
    },

    onSuccess: async (data) => {
      // ======================================================
      // ✅ CLEAR REDUX
      // ======================================================

      dispatch(logoutUser());

      // ======================================================
      // ✅ REFETCH CURRENT USER
      // ======================================================

      await queryClient.invalidateQueries({
        queryKey: ["current-user"],
      });

      // ======================================================
      // ✅ CLOSE DIALOG
      // ======================================================

      setLogoutDialogOpen(false);

      // ======================================================
      // ✅ CLOSE PROFILE
      // ======================================================

      setIsProfileOpen(false);

      // ======================================================
      // ✅ SNACKBAR
      // ======================================================

      showSnackbar(data?.message || "Logout successful", "success");
    },

    onError: (error) => {
      showSnackbar(error?.response?.data?.message || "Logout failed", "error");
    },
  });

  return (
    <>
      <header className="fixed top-0 left-0 w-full backdrop-blur-md bg-black/30 z-[9999]">
        <nav
          ref={navbarRef}
          className="flex justify-between items-center px-6 md:px-10 h-[80px]"
        >
          {/* LOGO */}
          <Link to="/" className="flex items-center shrink-0 gap-2">
            <img
              src="/logo3.png"
              alt="NextShow Logo"
              className="w-20 h-20 object-contain drop-shadow-lg"
            />
          </Link>

          {/* 2. CENTER SEARCH BAR */}
          {/* <div className="hidden md:flex flex-1 max-w-lg mx-5">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="relative w-full group flex items-center"
            >
              <div className="relative w-full flex items-center bg-white/5 border border-white/10 rounded-full p-1.5 transition-all duration-300 group-focus-within:bg-black/40 group-focus-within:border-orange-500/50 group-focus-within:ring-4 group-focus-within:ring-orange-500/10 shadow-2xl">
                <div className="pl-4 pr-2 text-white/40 group-focus-within:text-orange-500 transition-colors">
                  <HiSearch className="text-xl" />
                </div>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none text-white text-sm py-1 px-2 focus:outline-none placeholder:text-white/30"
                />
                <button
                  type="submit"
                  className="bg-orange-500 cursor-pointer hover:bg-orange-600 text-white px-4 py-[6px] rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-orange-500/20"
                >
                  <span>Search</span>
                </button>
              </div>
            </form>
          </div> */}

          <div className="flex items-center gap-6">
            {/* LANGUAGE ICON DROPDOWN */}
            <div className="relative hidden lg:block" ref={langRef}>
              <button
                disabled
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 text-white/70  transition-all text-sm cursor-not-allowed opacity-50 "
              >
                <HiOutlineTranslate className="text-xl" />
                <span>{selectedLang}</span>
                <motion.div
                  animate={{ rotate: isLangOpen ? 90 : 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <HiChevronRight className="text-white/40 text-xl" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 5 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="absolute top-[50px] right-4 w-[240px] bg-[#121212]/95 border border-white/10 backdrop-blur-2xl rounded-3xl p-2 shadow-2xl"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setSelectedLang(lang);
                          setIsLangOpen(false);
                        }}
                        className={`text-[13px] w-full text-start block my-1 py-3 px-4 rounded-xl transition-all ${selectedLang === lang ? "bg-orange-500 text-white" : "text-white/70 hover:text-white hover:bg-white/5"}`}
                      >
                        {lang}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. CUSTOM DESKTOP HAMBURGER */}
            <div className="hidden lg:flex items-center relative" ref={menuRef}>
              <button
                onClick={() => setNavMenuOpen(!navMenuOpen)}
                className="flex flex-col gap-[6px] p-3 cursor-pointer group"
              >
                <motion.div
                  variants={topBar}
                  animate={navMenuOpen ? "opened" : "closed"}
                  className="w-8 h-[3px] bg-white rounded-full group-hover:bg-orange-500 transition-colors"
                />
                <motion.div
                  variants={midBar}
                  animate={navMenuOpen ? "opened" : "closed"}
                  className="w-8 h-[2px] bg-white rounded-full group-hover:bg-orange-500 transition-colors"
                />
                <motion.div
                  variants={botBar}
                  animate={navMenuOpen ? "opened" : "closed"}
                  className="w-5 h-[3px] bg-white rounded-full group-hover:bg-orange-500 transition-colors self-end"
                />
              </button>

              {/* DESKTOP DROPDOWN MENU - Moved to Left via right-4 */}
              <AnimatePresence>
                {navMenuOpen && (
                  <motion.div
                    variants={menuContainer}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute top-[70px] right-4 w-[240px] bg-[#121212]/95 border border-white/10 backdrop-blur-2xl rounded-3xl p-2 shadow-2xl"
                  >
                    <ul className="flex flex-col gap-2">
                      {navLinks.map((link) => {
                        const isActiveLink = (path) => {
                          return location.pathname.startsWith(path);
                        };
                        return (
                          <motion.li
                            key={link.to}
                            initial={{ x: 10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                          >
                            <Link
                              to={link.to}
                              onClick={() => setNavMenuOpen(false)}
                              className={`text-[13px] block font-bold py-3 px-4 rounded-xl transition-all ${
                                location.pathname === link.to
                                  ? "bg-orange-500 text-white "
                                  : "text-white/70 hover:text-white hover:bg-white/5"
                              }`}
                            >
                              {link.label}
                            </Link>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {!authChecked ? (
              <div className="hidden md:hidden lg:block">
                <div
                  className="
      flex items-center gap-2

      px-3 sm:px-4

      h-[42px]

      rounded-2xl

      border border-white/5

      bg-white/[0.03]

      animate-pulse

      shrink-0
    "
                >
                  {/* ICON SKELETON */}
                  <div
                    className="
        w-7 h-7

        rounded-full

        bg-white/10

        relative overflow-hidden
      "
                  >
                    <div
                      className="
          absolute inset-0

          -translate-x-full

          animate-[shimmer_1.8s_infinite]

          bg-gradient-to-r
          from-transparent
          via-white/10
          to-transparent
        "
                    />
                  </div>
                  {/* TEXT SKELETON */}
                  <div
                    className="
        h-[12px]
        w-[52px]

        rounded-full

        bg-white/10

        relative overflow-hidden
      "
                  >
                    <div
                      className="
          absolute inset-0

          -translate-x-full

          animate-[shimmer_1.8s_infinite]

          bg-gradient-to-r
          from-transparent
          via-white/10
          to-transparent
        "
                    />
                  </div>
                </div>
              </div>
            ) : isAuthenticated && currentUser ? (
              <ProfileDropdown
                setLogoutDialogOpen={setLogoutDialogOpen}
                isProfileOpen={isProfileOpen}
                setIsProfileOpen={setIsProfileOpen}
              />
            ) : (
              <div className="hidden md:hidden lg:block profile-dropdown">
                <button
                  onClick={() => {
                    openAuth();
                    setNavMenuOpen(false);
                  }}
                  className="
              flex items-center gap-2
              px-3 sm:px-4
              h-[42px]
              rounded-2xl
              border border-orange-500/20
              bg-gradient-to-br from-orange-500/20 to-orange-600/5
              hover:from-orange-500/30 hover:to-orange-600/10
              transition-all duration-300
              group
              shrink-0
    "
                >
                  {/* ICON */}

                  <div
                    className="
        w-7 h-7
        rounded-full
        bg-orange-500
        flex items-center justify-center
        shadow-[0_0_18px_rgba(249,115,22,0.45)]
      "
                  >
                    <FaUser size={15} className="text-white" />
                  </div>

                  {/* TEXT */}

                  <div className="hidden sm:flex flex-col items-start leading-none">
                    <span className="text-[14px]  text-white group-hover:text-orange-300 transition-all">
                      Login
                    </span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* MOBILE RIGHT SECTION */}
          <div className="flex items-center gap-5 lg:hidden">
            {/* MOBILE LANGUAGE */}
            <div className="relative" ref={langRef}>
              <button
                disabled
                onClick={() => {
                  setIsLangOpen(!isLangOpen);
                  if (isOpen) {
                    setIsOpen(false);
                  }
                }}
                className="
        flex items-center gap-1

        text-zinc-300
        hover:text-white

        transition-all duration-300
              cursor-not-allowed
              opacity-50
        text-[15px]
        font-medium
      "
              >
                <HiOutlineTranslate className="text-[22px]" />

                <span>{selectedLang}</span>

                <motion.div
                  animate={{ rotate: isLangOpen ? 90 : 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <HiChevronRight className="text-zinc-500 text-[20px]" />
                </motion.div>
              </button>

              {/* MOBILE LANGUAGE DROPDOWN */}
              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.25 }}
                    className="
            absolute top-[45px] right-0

            w-[180px]

            overflow-hidden

            rounded-2xl

            border border-white/[0.08]

            bg-gradient-to-br
            from-zinc-900/95
            via-neutral-900/92
            to-slate-950/95

            backdrop-blur-3xl

            shadow-[0_10px_45px_rgba(0,0,0,0.45)]

            z-[9999]
          "
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setSelectedLang(lang);
                          setIsLangOpen(false);
                        }}
                        className={`
                w-full
                text-left

                px-4 py-3

                text-[14px]

                transition-all duration-300

                ${
                  selectedLang === lang
                    ? `
                      bg-orange-500
                      text-white
                    `
                    : `
                      text-zinc-300
                      hover:bg-white/[0.04]
                      hover:text-white
                    `
                }
              `}
                      >
                        {lang}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* MOBILE MENU ICON */}
            <button
              className=" hidden
       flex-col gap-[6px]
      p-2
      cursor-pointer
      group
    "
              onClick={() => {
                setIsOpen(!isOpen);
                if (isLangOpen) {
                  setIsLangOpen(false);
                }
              }}
            >
              <motion.div
                variants={topBar}
                animate={isOpen ? "opened" : "closed"}
                className="w-8 h-[3px] bg-white rounded-full group-hover:bg-orange-500 transition-colors"
              />
              <motion.div
                variants={midBar}
                animate={isOpen ? "opened" : "closed"}
                className="w-8 h-[2px] bg-white rounded-full group-hover:bg-orange-500 transition-colors"
              />
              <motion.div
                variants={botBar}
                animate={isOpen ? "opened" : "closed"}
                className="w-5 h-[3px] bg-white rounded-full group-hover:bg-orange-500 transition-colors self-end"
              />
            </button>
          </div>
        </nav>

        {/* MOBILE DROPDOWN */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="
          md:block lg:hidden

          relative overflow-hidden

          border-b border-white/[0.08]
          rounded-bl-3xl rounded-br-3xl

          bg-gradient-to-br
          from-zinc-900/95
          via-neutral-900/92
          to-slate-950/95

          backdrop-blur-3xl

          px-3 py-6

          shadow-[0_10px_45px_rgba(0,0,0,0.45)]

          before:absolute
          before:inset-0
          before:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_38%)]

          after:absolute
          after:inset-0
          after:bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.015),transparent)]

          before:pointer-events-none
          after:pointer-events-none

          max-h-[78vh]
          overflow-y-auto
        "
              >
                {/* ================================================= */}
                {/* ✅ CUSTOM SCROLLBAR */}
                {/* ================================================= */}

                <style>
                  {`
            .mobile-menu-scroll::-webkit-scrollbar {
              width: 4px;
            }

            .mobile-menu-scroll::-webkit-scrollbar-thumb {
              background: rgba(255,255,255,0.15);
              border-radius: 999px;
            }
          `}
                </style>

                <ul className="flex flex-col gap-2 mobile-menu-scroll">
                  {navLinks.map((link) => (
                    <li key={link.to} className="profile-dropdown">
                      {/* ================================================= */}
                      {/* ✅ LOGIN / PROFILE */}
                      {/* ================================================= */}

                      {link.isLogin ? (
                        isAuthenticated ? (
                          <>
                            {/* PROFILE BUTTON */}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();

                                setIsProfileOpen((prev) => !prev);
                              }}
                              className="
                        w-full

                        flex items-center
                        justify-between

                        px-4 py-3

                        rounded-2xl

                        border border-white/10

                        bg-white/[0.03]

                        transition-all duration-300
                      "
                            >
                              {/* LEFT */}

                              <div className="flex items-center gap-3">
                                {/* PROFILE */}

                                <div
                                  className="
                            w-10 h-10

                            rounded-full

                            overflow-hidden

                            bg-gradient-to-br
                            from-orange-500
                            to-orange-600

                            flex items-center justify-center

                            text-white
                            font-semibold
                            text-sm

                            shrink-0

                            shadow-[0_0_18px_rgba(249,115,22,0.45)]
                          "
                                >
                                  {currentUser?.profileImage ? (
                                    <img
                                      src={getImageUrl(
                                        currentUser?.profileImage,
                                      )}
                                      alt="profile"
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    currentUser?.fullName
                                      ?.charAt(0)
                                      ?.toUpperCase()
                                  )}
                                </div>

                                {/* USER DETAILS */}

                                <div className="flex flex-col items-start overflow-hidden">
                                  <span className="text-[14px] font-semibold text-white truncate max-w-[170px]">
                                    {currentUser?.fullName}
                                  </span>

                                  <span className="text-[11px] text-white/40">
                                    Manage Account
                                  </span>
                                </div>
                              </div>

                              {/* ARROW */}

                              <motion.div
                                animate={{
                                  rotate: isProfileOpen ? 90 : 0,
                                }}
                                transition={{
                                  type: "spring",
                                  stiffness: 300,
                                }}
                                className="shrink-0"
                              >
                                <HiChevronRight className="text-white/40 text-[22px]" />
                              </motion.div>
                            </button>

                            {/* ================================================= */}
                            {/* ✅ PROFILE DROPDOWN */}
                            {/* ================================================= */}

                            <AnimatePresence>
                              {isProfileOpen && (
                                <motion.div
                                  onClick={(e) => e.stopPropagation()}
                                  initial={{
                                    opacity: 0,
                                    height: 0,
                                  }}
                                  animate={{
                                    opacity: 1,
                                    height: "auto",
                                  }}
                                  exit={{
                                    opacity: 0,
                                    height: 0,
                                  }}
                                  transition={{
                                    duration: 0.25,
                                  }}
                                  className="
                            overflow-hidden

                            mt-2

                            rounded-2xl

                            border border-white/5

                            bg-white/[0.025]

                            p-2

                            flex flex-col gap-1
                          "
                                >
                                  {profileDropdownLinks.map((item) => {
                                    const Icon = item.icon;

                                    // ======================================================
                                    // ✅ LOGOUT BUTTON
                                    // ======================================================

                                    if (item.action === "logout") {
                                      return (
                                        <button
                                          key={item.label}
                                          onClick={() => {
                                            setLogoutDialogOpen(true);
                                            setIsProfileOpen(false);
                                          }}
                                          className="
                                              w-full
                                              flex items-center gap-3
                                              px-4 py-3
                                              rounded-xl
                                              text-red-400
                                              hover:bg-red-500/10
                                              transition-all duration-300
                                            "
                                        >
                                          <Icon className="text-[15px] shrink-0" />

                                          <span className="text-[14px]">
                                            {item.label}
                                          </span>
                                        </button>
                                      );
                                    }

                                    // ======================================================
                                    // ✅ NORMAL LINKS
                                    // ======================================================

                                    return (
                                      <button
                                        key={item.label}
                                        // to={item.path}
                                        onClick={() => {
                                          // ============================================
                                          // ✅ PROFILE PAGE
                                          // ============================================

                                          if (item.path === "/profile") {
                                            navigate("/profile", {
                                              state: {
                                                from: location.pathname,
                                              },
                                            });

                                            // ==========================================
                                            // ✅ CLOSE MOBILE MENU
                                            // ==========================================

                                            setNavMenuOpen(false);

                                            return;
                                          }

                                          // ============================================
                                          // ✅ OTHER ROUTES
                                          // ============================================

                                          navigate(item.path);

                                          setNavMenuOpen(false);
                                        }}
                                        className={`
                                            flex items-center gap-3
                                            px-4 py-3 
                                           rounded-xl
                                            transition-all duration-300
                                            ${
                                              item.danger
                                                ? `
                                                  text-red-400
                                                  hover:bg-red-500/10
                                                `
                                                : `
                                                  text-white/70
                                                  hover:text-white
                                                  hover:bg-white/5
                                                `
                                            }
                                          `}
                                      >
                                        <Icon className="text-[15px] shrink-0" />

                                        <span className="text-[14px]">
                                          {item.label}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        ) : (
                          /* ================================================= */
                          /* ✅ LOGIN BUTTON */
                          /* ================================================= */

                          <button
                            onClick={() => {
                              // setIsAuthOpen(true);
                              openAuth();
                              setIsOpen(false);
                            }}
                            className="
                      w-full

                      flex items-center gap-3

                      px-4 py-3

                      rounded-2xl

                      border border-orange-500/20

                      bg-gradient-to-br
                      from-orange-500/20
                      to-orange-600/5

                      hover:from-orange-500/30
                      hover:to-orange-600/10

                      transition-all duration-300

                      group
                    "
                          >
                            {/* ICON */}

                            <div
                              className="
                        w-9 h-9

                        rounded-full

                        bg-orange-500

                        flex items-center justify-center

                        shrink-0

                        shadow-[0_0_18px_rgba(249,115,22,0.45)]
                      "
                            >
                              <FaUser size={16} className="text-white" />
                            </div>

                            {/* TEXT */}

                            <div className="flex flex-col leading-none">
                              <span className="text-[15px] font-semibold text-white group-hover:text-orange-300 transition-all">
                                Login
                              </span>
                            </div>
                          </button>
                        )
                      ) : (
                        /* ================================================= */
                        /* ✅ NORMAL LINKS */
                        /* ================================================= */

                        <Link
                          to={link.to}
                          onClick={() => setIsOpen(false)}
                          className={`
                    relative z-10

                    flex items-center

                    rounded-xl

                    px-4 py-3

                    text-[15px]
                    font-medium

                    transition-all duration-300

                    ${
                      location.pathname === link.to
                        ? `
                          bg-orange-500
                          text-white
                          shadow-lg
                          shadow-orange-500/20
                        `
                        : `
                          text-zinc-200
                          hover:bg-white/[0.04]
                          hover:text-white
                        `
                    }
                  `}
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
      {/* ===================================================== */}
      {/* ✅ AUTH MODAL */}
      {/* ===================================================== */}

      <AnimatePresence>
        {isAuthOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
fixed inset-0

z-[99999]

bg-black/70
backdrop-blur-md

flex items-center justify-center

p-4
"
          >
            {/* CLICK OUTSIDE */}

            <div className="absolute inset-0" onClick={() => closeAuth()} />

            {/* MODAL CONTENT */}

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 24,
              }}
              className="relative "
            >
              <AuthComponent />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ReusableConfirmDialog
        open={logoutDialogOpen}
        title="Logout Account"
        description="Are you sure you want to logout from your account?"
        confirmText="Logout"
        cancelText="Stay Logged In"
        confirmColor="red"
        loading={logoutMutation.isPending}
        disableOutsideClose={true}
        onClose={() => {
          // ======================================================
          // ✅ PREVENT CLOSE DURING LOGOUT
          // ======================================================

          if (logoutMutation.isPending) return;

          setLogoutDialogOpen(false);
        }}
        onConfirm={() => {
          // ======================================================
          // ✅ LOGOUT API CALL
          // ======================================================

          logoutMutation.mutate();
        }}
      />
    </>
  );
};

export default Navbar;
