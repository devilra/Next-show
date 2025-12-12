import { Link } from "react-router-dom";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/new", label: "New Movies" },
  { to: "/stream", label: "Streaming Now" },
  { to: "/trailer", label: "Trailers" },
  { to: "/news", label: "News" },
  { to: "/about", label: "About Us" },
];

const menuVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header
      className="
        fixed top-0 left-0 w-full 
        backdrop-blur-md bg-black/30 
        z-50 border-b border-white/10
      "
    >
      <nav className="flex justify-between items-center px-6 md:px-10 h-[70px]">
        {/* LOGO NAME */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-white tracking-wide"
        >
          Next<span className="text-orange-400">Show</span>
        </Link>

        {/* DESKTOP MENU */}
        <ul className="hidden md:hidden lg:flex gap-6">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className="text-white/80 hover:text-white text-lg  transition"
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

      {/* MOBILE MENU WITH FRAMER MOTION */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="
              md:block lg:hidden 
              bg-black/60 backdrop-blur-xl 
              border-b border-white/10 
              p-5
            "
          >
            <ul className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-white/90 text-lg block py-1"
                    onClick={() => setIsOpen(false)}
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
