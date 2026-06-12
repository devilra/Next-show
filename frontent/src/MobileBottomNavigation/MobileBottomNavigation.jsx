import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import { HiPlay, HiUser } from "react-icons/hi";
import MobileNavItem from "./MobileNavItem";
import { SiHomeadvisor } from "react-icons/si";
import { CiStreamOn } from "react-icons/ci";
import { BiSolidCameraMovie } from "react-icons/bi";
import { PiNewspaperClipping } from "react-icons/pi";
import { useSelector } from "react-redux";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useRef, useState } from "react";

const navItems = [
  {
    label: "Home",
    path: "/",
    icon: SiHomeadvisor,
  },
  {
    label: "Streaming",
    path: "/stream",
    icon: CiStreamOn,
  },
  {
    label: "New Movies",
    path: "/new",
    icon: BiSolidCameraMovie,
  },
  //   {
  //     label: "Videos",
  //     path: "/videos",
  //     icon: HiPlay,
  //   },
  {
    label: "News",
    path: "/news",
    icon: PiNewspaperClipping,
  },
  {
    label: "Profile",
    path: "/profile",
    icon: HiUser,
    type: "profile",
  },
];

const MobileBottomNavigation = () => {
  const location = useLocation();
  const [showNav, setShowNav] = useState(true);
  const { isAuthenticated, authChecked, currentUser } = useSelector(
    (state) => state.userAuth,
  );
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Top area la always show
      if (currentScrollY < 80) {
        setShowNav(true);
        lastScrollY.current = currentScrollY;
      }
      // Down Scroll
      if (currentScrollY > lastScrollY.current) {
        setShowNav(false);
      }
      // Up Scroll
      else {
        setShowNav(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    return `${IMAGE_BASE_URL}${imagePath}`;
  };

  const { openAuth } = useAuth();

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const activeIndex = navItems.findIndex((item) => {
    if (item.type === "profile") {
      return location.pathname.startsWith("/profile");
    }
    return isActive(item.path);
  });

  return (
    <motion.div
      animate={{
        y: showNav ? 0 : 100,
        scale: showNav ? 1 : 0.95,
        opacity: showNav ? 1 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 25,
      }}
      className="
      lg:hidden
      fixed
      bottom-0
      left-0
      right-0
      z-[9999]
      px-3
      pb-[max(env(safe-area-inset-bottom),12px)]
      "
    >
      <div
        className="
    relative
    overflow-hidden

    bg-black/90
    backdrop-blur-3xl
    border
    border-white/10

    rounded-[26px]

    h-[72px]

    flex
    items-center
    justify-around

    shadow-[0_-10px_40px_rgba(0,0,0,0.55)]
  "
      >
        <motion.div
          animate={{
            x: `${activeIndex * 100}%`,
          }}
          transition={{
            type: "spring",
            stiffness: 320,
            damping: 28,
          }}
          className="
    absolute
    bottom-[-15px]
    left-0

    w-1/5
    h-[50px]

    pointer-events-none
    z-20

    flex
    justify-center
  "
        >
          <div
            className="
      w-[90%]
      h-[35px]

      rounded-full

      bg-gradient-to-t
      from-orange-500/40
      via-orange-500/15
      to-transparent

      blur-2xl
    "
          />
        </motion.div>
        {navItems.map((item) => (
          <MobileNavItem
            key={item.path}
            {...item}
            active={
              item.type === "profile"
                ? location.pathname.startsWith("/profile")
                : isActive(item.path)
            }
            isAuthenticated={isAuthenticated}
            openAuth={openAuth}
            authChecked={authChecked}
            currentUser={currentUser}
            getImageUrl={getImageUrl}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default MobileBottomNavigation;
