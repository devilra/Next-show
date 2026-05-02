import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { HiMenu, HiSearch, HiX } from "react-icons/hi";
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
  const [searchQuery, setSearchQuery] = useState("");

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
        <Link to="/" className="flex items-center shrink-0 gap-2">
          <img
            src="/logo3.png"
            alt="NextShow Logo"
            className="w-20 h-20 object-contain drop-shadow-lg"
          />
        </Link>

        {/* 2. CENTER SEARCH BAR (Desktop & Tablet) */}
        <div className="hidden md:flex flex-1 max-w-lg mx-5">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="relative w-full group flex items-center"
          >
            {/* 1. Main Search Wrapper */}
            <div className="relative w-full flex items-center bg-white/5 border border-white/10 rounded-full p-1.5 transition-all duration-300 group-focus-within:bg-black/40 group-focus-within:border-orange-500/50 group-focus-within:ring-4 group-focus-within:ring-orange-500/10 shadow-2xl">
              {/* 2. Left Icon (Static/Decorative) */}
              <div className="pl-4 pr-2 text-white/40 group-focus-within:text-orange-500 transition-colors">
                <HiSearch className="text-xl" />
              </div>

              {/* 3. The Input Field */}
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none text-white text-sm py-1 px-2 focus:outline-none placeholder:text-white/30"
              />

              {/* 4. Action Button Group (Input kulla irukura button) */}
              <button
                type="submit"
                className="bg-orange-500 cursor-pointer hover:bg-orange-600 text-white px-4 py-[6px] rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-orange-500/20"
              >
                <span>Search</span>
                {/* Oru chinna arrow or extra icon optional */}
              </button>
            </div>

            {/* 🌟 Background Glow (Optional - Subtle decoration) */}
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/0 via-orange-500/10 to-orange-500/0 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
          </form>
        </div>

        {/* DESKTOP MENU */}
        <ul className="hidden md:hidden lg:flex  shrink-0 gap-2">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`
                  text-sm transition p-3
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
