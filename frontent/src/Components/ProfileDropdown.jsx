import { useRef, useState } from "react";
import {
  FaHeart,
  FaBookmark,
  FaHistory,
  FaCog,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronRight } from "react-icons/hi";
import { Link } from "react-router-dom";

const profileDropdownLinks = [
  {
    label: "My Profile",
    icon: FaUser,
    path: "/profile",
  },

  {
    label: "Watchlist",
    icon: FaBookmark,
    path: "/watchlist",
  },

  {
    label: "Favorites",
    icon: FaHeart,
    path: "/favorites",
  },

  {
    label: "Watch History",
    icon: FaHistory,
    path: "/history",
  },

  {
    label: "Settings",
    icon: FaCog,
    path: "/settings",
  },
  {
    label: "Logout",
    icon: FaSignOutAlt,
    action: "logout",
    danger: true,
  },
];

export default function ProfileDropdown({
  setLogoutDialogOpen,
  setIsProfileOpen,
  isProfileOpen,
}) {
  const profileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.userAuth);

  // ======================================================
  // ✅ PROFILE IMAGE
  // ======================================================
  const profileImage = currentUser?.profileImage;
  // ======================================================
  // ✅ FIRST LETTER
  // ======================================================
  const firstLetter = currentUser?.fullName?.[0]?.toUpperCase();
  return (
    <div className="relative hidden lg:block" ref={profileRef}>
      {/* ====================================================== */}
      {/* ✅ PROFILE BUTTON */}
      {/* ====================================================== */}

      <button
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className="
          flex items-center gap-2
          transition-all
        "
      >
        {/* PROFILE IMAGE */}

        <div
          className="
            w-10 h-10
            rounded-full
            overflow-hidden

            border border-orange-500/30

            bg-gradient-to-br
            from-orange-500
            to-orange-600

            flex items-center justify-center

            text-white
            font-semibold
            text-sm

            shadow-[0_0_25px_rgba(249,115,22,0.25)]
          "
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt="profile"
              className="w-full h-full object-cover"
            />
          ) : (
            firstLetter
          )}
        </div>

        {/* CHEVRON */}

        {/* <motion.div
          animate={{
            rotate: isOpen ? 90 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
          }}
        >
          <HiChevronRight className="text-white/40 text-xl" />
        </motion.div> */}
      </button>

      {/* ====================================================== */}
      {/* ✅ DROPDOWN */}
      {/* ====================================================== */}

      <AnimatePresence>
        {isProfileOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 5,
            }}
            exit={{
              opacity: 0,
              y: 15,
            }}
            className="
              absolute
              top-[55px]
              right-0

              w-[270px]

              bg-[#121212]/95

              border border-white/10

              backdrop-blur-2xl

              rounded-3xl

              p-2

              shadow-2xl

              overflow-hidden

              z-[99999]
            "
          >
            {/* USER INFO */}

            <div
              className="
                px-4 py-4
                border-b border-white/5
                mb-2
              "
            >
              <h3 className="text-white  text-[15px]">
                {currentUser?.fullName}
              </h3>

              <p className="text-white/40 text-[12px] mt-1 truncate">
                {currentUser?.email}
              </p>
            </div>

            {/* LINKS */}

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

                    <span className="text-[14px] font-medium">
                      {item.label}
                    </span>
                  </button>
                );
              }

              // ======================================================
              // ✅ NORMAL LINKS
              // ======================================================

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => {
                    setIsProfileOpen(false);
                  }}
                  className="
        flex items-center gap-3

        px-4 py-3

        rounded-xl

        text-white/70

        hover:text-white
        hover:bg-white/5

        transition-all duration-300
      "
                >
                  <Icon className="text-[15px] shrink-0" />

                  <span className="text-[14px] font-medium">{item.label}</span>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
