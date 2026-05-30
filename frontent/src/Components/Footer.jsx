import { Link } from "react-router-dom";
import { FaYoutube, FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black/90 text-gray-300   border-t border-white/10">
      {/* 🔥 MAIN SECTION */}
      <div className="flex flex-row items-center px-4 md:px-10 mx-auto justify-between py-2 max-w-7xl">
        {/* LEFT - BRAND */}
        <div className="flex  flex-col  items-center md:items-start gap-1 md:max-w-sm">
          <Link to="/" className="flex self-start gap-1">
            <img
              src="/logo3.png"
              alt="NextShow Logo"
              className="w-20 h-14 object-contain"
            />
          </Link>

          <div className="flex justify-center md:justify-end gap-3 ">
            {[FaYoutube, FaInstagram, FaFacebookF, FaTwitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 hover:scale-105 transition"
              >
                <Icon className="text-[14px]" />
              </a>
            ))}
          </div>

          {/* SOCIAL */}
        </div>

        {/* 🔥 CENTER - EXPLORE SECTION */}
        {/* <div className="flex flex-col items-center  md:items-start gap-3">
            <h3 className="text-white text-sm  font-semibold tracking-wide">
              Explore
            </h3>

            <div className="flex flex-wrap justify-center md:justify-start gap-1 text-[11px]">
              {[
                { label: "Movies", to: "/movies" },
                { label: "News", to: "/news" },
                { label: "OTT", to: "/ott" },
                { label: "Trailers", to: "/trailers" },
                { label: "Top Rated", to: "/top-rated" },
                { label: "Upcoming", to: "/upcoming" },
              ].map((item, i) => (
                <Link
                  key={i}
                  to={item.to}
                  className="px-1 md:px-3 py-1 text-[11px] md:text-[12px] rounded-full md:bg-white/5  md:border md:border-white/10 hover:bg-white/10 hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] transition"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <p className="text-[12px] md:text-[13px] text-gray-500 max-w-[320px] text-center md:text-left">
              Discover trending movies, latest news, and OTT updates all in one
              place.
            </p>
          </div> */}

        {/* RIGHT - CONTACT */}
        <div className="flex flex-col gap-1 text-[12px] text-gray-400 text-center md:text-right">
          <h3 className="text-white text-sm text-end font-semibold">Contact</h3>
          <p>Have suggestions or feedback?</p>
          <p className="self-end">
            Email: <span className="text-orange-400">official@nextshow.in</span>
          </p>
          {/* <div className="flex justify-center md:justify-end gap-3 mt-2">
            {[FaYoutube, FaInstagram, FaFacebookF, FaTwitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 hover:scale-105 transition"
              >
                <Icon className="text-[14px]" />
              </a>
            ))}
          </div> */}
        </div>
      </div>

      {/* 🔥 BOTTOM BAR */}
      <div className="border-t border-white/10 text-[11px] text-gray-500 px-4 md:px-10 py-3 flex flex-col md:flex-row items-center justify-between gap-2">
        <span>© {new Date().getFullYear()} NextShow. All Rights Reserved.</span>

        <span>
          Developed by{" "}
          <a
            target="_blank"
            href="https://amigowebster.com/"
            className="text-orange-400 underline hover:text-orange-300 transition"
          >
            Nextshow Team
          </a>
        </span>
      </div>
    </footer>
  );
}
