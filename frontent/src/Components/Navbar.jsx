import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/new", label: "New Movies" },
  { to: "/stream", label: "Streaming Now" },
  // { to: "/trailer", label: "Trailers" },
  { to: "/news", label: "News" },
  { to: "/about", label: "About Us" },
  { to: "/auth/login", label: "Login" },
];

const menuVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.25 } },
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // ⭐ current path

  return (
    <header
      className="
      fixed top-0 left-0 w-full 
      backdrop-blur-md bg-black/30 
      z-50 border-b border-white/10
    "
    >
      <nav className="flex justify-between items-center px-6 md:px-10 h-[80px]">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/logo3.png"
            alt="NextShow Logo"
            className="w-20 h-20 object-contain drop-shadow-lg"
          />
        </Link>

        {/* DESKTOP MENU */}
        <ul className="hidden md:hidden lg:flex gap-2">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`
                  text-md transition p-3
                  ${
                    location.pathname === link.to
                      ? "text-white font-bold "
                      : "text-white/70 hover:text-white"
                  }
                `}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* HAMBURGER ICON */}
        <button
          className="md:block lg:hidden text-white text-3xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <HiX /> : <HiMenu />}
        </button>
      </nav>

      {/* MOBILE DROPDOWN */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:block lg:hidden bg-black/60 backdrop-blur-xl border-b border-white/10 p-5"
          >
            <ul className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className={`
                      text-lg block py-1 
                      ${
                        location.pathname === link.to
                          ? "text-orange-400 font-bold"
                          : "text-white/90"
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
