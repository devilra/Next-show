import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  HiSearch,
  HiOutlineTranslate,
  HiChevronRight,
  HiUserCircle,
} from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

// Login-ai veliya irunthu remove pannittu menu kulla sethurukaen
const navLinks = [
  { to: "/new", label: "New Movies" },
  { to: "/stream", label: "Streaming Now" },
  { to: "/news", label: "News" },
  { to: "/about", label: "About Us" },
];

const languages = ["Tamil", "English", "Hindi", "Telugu", "Malayalam"];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("Tamil");
  const [searchQuery, setSearchQuery] = useState("");

  const location = useLocation();
  const menuRef = useRef(null); // Menu outside click-kku
  const langRef = useRef(null); // Language outside click-kku

  // ─── OUTSIDE CLICK LOGIC ───
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target))
        setIsOpen(false);
      if (langRef.current && !langRef.current.contains(event.target))
        setIsLangOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ─── HAMBURGER ANIMATION (Fixed X Logic & Thicker Stroke) ───
  const topBar = { closed: { rotate: 0, y: 0 }, opened: { rotate: 45, y: 8 } };
  const midBar = {
    closed: { opacity: 1, x: 0 },
    opened: { opacity: 0, x: -10 },
  };
  const botBar = {
    closed: { rotate: 0, y: 0 },
    opened: { rotate: -45, y: -8 },
  };

  return (
    <header className="fixed top-0 left-0 w-full backdrop-blur-md bg-black/40 z-[9999] border-b border-white/5">
      <nav className="flex justify-between items-center px-6 md:px-10 h-[80px] max-w-[1600px] mx-auto">
        {/* 1. LOGO */}
        <Link to="/" className="shrink-0">
          <img
            src="/logo3.png"
            alt="Logo"
            className="w-16 h-16 object-contain"
          />
        </Link>

        {/* 2. SEARCH BAR */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full flex items-center bg-white/5 border border-white/10 rounded-full p-1 group focus-within:border-orange-500/40">
            <HiSearch className="ml-4 text-white/30 text-xl group-focus-within:text-orange-500" />
            <input
              type="text"
              placeholder="Search movies..."
              className="flex-1 bg-transparent border-none text-white text-sm py-2 px-3 focus:outline-none placeholder:text-white/20"
            />
            <button className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-tighter transition-all">
              SEARCH
            </button>
          </div>
        </div>

        {/* 3. RIGHT SECTION (Language + Hamburger) */}
        <div className="flex items-center gap-6">
          {/* LANGUAGE ICON DROPDOWN */}
          <div className="relative hidden lg:block" ref={langRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-all text-sm font-medium"
            >
              <HiOutlineTranslate className="text-xl" />
              <span>{selectedLang}</span>
              <motion.div
                animate={{ rotate: isLangOpen ? 90 : 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <HiChevronRight className="text-white/40" />
              </motion.div>
            </button>

            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 5 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="absolute top-full right-0 mt-2 w-40 bg-[#121212] border border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-xl"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setSelectedLang(lang);
                        setIsLangOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                    >
                      {lang}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CUSTOM HAMBURGER (Only Desktop View) */}
          <div className="relative flex items-center" ref={menuRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex flex-col gap-[6px] p-2 cursor-pointer z-[10000] items-end"
            >
              {/* Stroke increase panna height 3px kuduthurukaen */}
              <motion.div
                variants={topBar}
                animate={isOpen ? "opened" : "closed"}
                className="w-6 h-[3px] bg-white rounded-full shadow-sm"
              />
              <motion.div
                variants={midBar}
                animate={isOpen ? "opened" : "closed"}
                className="w-6 h-[3px] bg-white rounded-full shadow-sm"
              />
              <motion.div
                variants={botBar}
                animate={isOpen ? "opened" : "closed"}
                className="w-4 h-[3px] bg-white rounded-full shadow-sm"
              />
            </button>

            {/* DESKTOP MENU DROPDOWN */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: 20 }}
                  className="absolute top-[65px] right-0 w-[260px] bg-[#0c0c0c]/98 backdrop-blur-3xl border border-white/10 rounded-[28px] p-4 shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
                >
                  <div className="flex flex-col gap-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setIsOpen(false)}
                        className={`group flex items-center justify-between px-5 py-4 rounded-[18px] transition-all ${
                          location.pathname === link.to
                            ? "bg-orange-500 text-white"
                            : "hover:bg-white/5 text-white/60 hover:text-white"
                        }`}
                      >
                        <span className="text-[15px] font-bold tracking-tight">
                          {link.label}
                        </span>
                      </Link>
                    ))}

                    {/* LOGIN SECTION INSIDE MENU */}
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <Link
                        to="/auth/login"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 w-full bg-white/5 hover:bg-white/10 p-4 rounded-[18px] transition-all text-white border border-white/5"
                      >
                        <div className="p-2 bg-orange-500/20 rounded-lg text-orange-500">
                          <HiUserCircle className="text-xl" />
                        </div>
                        <span className="font-bold text-sm">Login</span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
