import { Link } from "react-router-dom";
import { FaYoutube, FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black/90 text-gray-300 pt-12 pb-6 border-t border-white/10">
      {/* Top Section */}
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-10">
        {/* Brand Section */}
        <div>
          {/* Logo + Brand Name */}
          <div className="flex items-center gap-3">
            <img
              src="/logo3.png"
              alt="NextShow Logo"
              className="w-32 h-24 object-contain drop-shadow-lg"
            />
            {/* <h2 className="text-2xl font-extrabold tracking-wide">
              Next<span className="text-orange-400">Show</span>
            </h2> */}
          </div>

          <p className="text-gray-400 mt-3 text-sm leading-relaxed">
            Your trusted source for authentic movie reviews, latest trailers,
            teasers, and cinema updates.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-4">
            <a
              href="#"
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition"
            >
              <FaYoutube className="text-xl" />
            </a>
            <a
              href="#"
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition"
            >
              <FaInstagram className="text-xl" />
            </a>
            <a
              href="#"
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition"
            >
              <FaFacebookF className="text-xl" />
            </a>
            <a
              href="#"
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition"
            >
              <FaTwitter className="text-xl" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link to="/trailer" className="hover:text-white">
                Latest Trailers
              </Link>
            </li>
            <li>
              <Link to="/new" className="hover:text-white">
                New Releases
              </Link>
            </li>
            <li>
              <Link to="/stream" className="hover:text-white">
                Upcoming Movies
              </Link>
            </li>
          </ul>
        </div>

        {/* Movie Categories */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Categories</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Action</li>
            <li className="hover:text-white cursor-pointer">Thriller</li>
            <li className="hover:text-white cursor-pointer">Drama</li>
            <li className="hover:text-white cursor-pointer">Romance</li>
            {/* <li className="hover:text-white cursor-pointer">Sci-Fi</li> */}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Contact</h3>
          <p className="text-sm text-gray-400">
            Have suggestions? Want your trailer reviewed?
          </p>
          <p className="mt-2 text-sm">
            Email: <span className="text-orange-400">contact@nextshow.com</span>
          </p>
        </div>
      </div>

      {/* Bottom Copy */}

      <div className="text-xs text-gray-500 mt-10 border-t flex flex-col items-center gap-2 md:flex-row md:justify-between md:px-5 border-white/10 pt-4">
        <h1>© {new Date().getFullYear()} NextShow. All Rights Reserved.</h1>

        <div className="text-xs">
          {" "}
          <span> developed by </span>
          <a
            target="_blank"
            href="https://amigowebster.com/"
            className="text-orange-400 underline"
          >
            amigowebster
          </a>
        </div>
      </div>
    </footer>
  );
}
