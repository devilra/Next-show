import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export const WATCHLIST = [
  {
    id: 1,
    title: "Vadam",
    year: 2025,
    genre: "Action • Drama",
    rating: "8.2",
    director: "Kenthiran V",
    status: "upcoming",
    thumb: null,
    initial: "V",
    color: "#C0392B",
  },
  {
    id: 2,
    title: "Kanguva",
    year: 2024,
    genre: "Action • Fantasy",
    rating: "7.4",
    director: "Siva",
    status: "released",
    thumb: null,
    initial: "K",
    color: "#1A6B4A",
  },
];

const NAV_ITEMS = [
  {
    to: "/profile",
    end: true,
    label: "My Profile",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    to: "/profile/watchlist",
    end: false,
    label: "Watchlist",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

export const USER = {
  name: "Arjun Selvam",
  username: "@arjun_cinephile",
  avatar: null,
  initials: "AS",
};

const Sidebar = ({ mobileOpen, onClose }) => {
  const navigate = useNavigate();

  return (
    <>
      {/* ====================================================== */}
      {/* ✅ MOBILE SIDEBAR */}
      {/* ====================================================== */}

      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* ============================================== */}
            {/* ✅ OVERLAY */}
            {/* ============================================== */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={onClose}
              className="
                fixed inset-0

                z-40

                bg-black/70

                backdrop-blur-[2px]

                lg:hidden
              "
            />

            {/* ============================================== */}
            {/* ✅ MOBILE DRAWER */}
            {/* ============================================== */}

            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{
                type: "spring",
                damping: 26,
                stiffness: 260,
              }}
              className="
                fixed inset-y-0 left-0

                z-50

                flex flex-col

                w-[270px]

                bg-[#0d0d0f]

                border-r border-orange-500/10

                shadow-[0_0_45px_rgba(0,0,0,0.55)]

                overflow-y-auto

                lg:hidden
              "
            >
              {/* ========================================== */}
              {/* ✅ CLOSE BUTTON */}
              {/* ========================================== */}

              <div
                className="
                  flex items-center justify-end

                  px-4 pt-4
                "
              >
                <button
                  className="
                    flex items-center justify-center

                    w-10 h-10

                    rounded-xl

                    border border-zinc-800

                    bg-zinc-900/80

                    text-zinc-400

                    hover:text-white
                    hover:border-zinc-700

                    transition-all duration-300
                  "
                  onClick={onClose}
                  aria-label="Close menu"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* ========================================== */}
              {/* ✅ ACCOUNT HEADER */}
              {/* ========================================== */}

              <div className="mb-8 mt-3">
                <button
                  onClick={() => navigate(-1)}
                  className="
                    group

                    relative

                    flex items-center gap-3

                    px-4 mx-3 py-3

                    rounded-2xl

                    border border-orange-500/10

                    bg-gradient-to-r
                    from-[#1b110d]
                    via-[#1a120f]
                    to-[#0f0f10]

                    hover:border-orange-400/30

                    hover:shadow-[0_0_25px_rgba(255,115,0,0.12)]

                    transition-all duration-300

                    overflow-hidden
                  "
                >
                  <div
                    className="
                      absolute inset-0

                      opacity-0

                      group-hover:opacity-100

                      transition-opacity duration-500

                      bg-gradient-to-r
                      from-orange-500/5
                      via-transparent
                      to-orange-400/5
                    "
                  />

                  <div
                    className="
                      relative z-10

                      w-10 h-10

                      rounded-xl

                      flex items-center justify-center

                      bg-orange-500/10

                      border border-orange-400/10

                      group-hover:bg-orange-500/15

                      transition-all duration-300
                    "
                  >
                    <svg
                      className="
                        w-5 h-5

                        text-orange-400

                        transition-transform duration-300

                        group-hover:-translate-x-1
                        group-hover:scale-110
                      "
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </div>

                  <div className="relative z-10 text-left">
                    <h2
                      className="
                        text-sm md:text-base

                        font-semibold

                        text-white

                        tracking-wide
                      "
                    >
                      Back
                    </h2>
                  </div>
                </button>
              </div>

              {/* ========================================== */}
              {/* ✅ NAVIGATION */}
              {/* ========================================== */}

              <nav className="px-3 space-y-1 flex-1">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative
                      ${
                        isActive
                          ? "bg-orange-600/15 text-orange-400 border border-orange-800/40"
                          : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-orange-500 rounded-r" />
                        )}

                        <span
                          className={
                            isActive
                              ? "text-orange-400"
                              : "text-zinc-600 group-hover:text-zinc-300"
                          }
                        >
                          {item.icon}
                        </span>

                        <span>{item.label}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>

              {/* ========================================== */}
              {/* ✅ USER FOOTER */}
              {/* ========================================== */}

              <div className="px-4 py-5 border-t border-zinc-800/50">
                <div className="flex items-center gap-3">
                  <div
                    className="
                      w-8 h-8

                      rounded-lg

                      bg-gradient-to-br
                      from-orange-600
                      to-red-800

                      flex items-center justify-center

                      text-white
                      text-xs
                      font-bold

                      shrink-0
                    "
                  >
                    {USER.initials}
                  </div>

                  <div className="min-w-0">
                    <p
                      className="
                        text-xs
                        font-semibold

                        text-zinc-200

                        truncate
                      "
                    >
                      {USER.name}
                    </p>

                    <p
                      className="
                        text-[10px]

                        text-zinc-600

                        truncate
                      "
                    >
                      {USER.username}
                    </p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ====================================================== */}
      {/* ✅ DESKTOP SIDEBAR */}
      {/* ====================================================== */}

      <aside
        className="
          hidden lg:flex

          flex-col

          w-64 shrink-0

          border-r border-zinc-800/60
        "
      >
        {/* ====================================================== */}
        {/* ✅ ACCOUNT HEADER */}
        {/* ====================================================== */}

        <div className="mb-8 pt-6">
          <button
            onClick={() => navigate(-1)}
            className="
              group

              relative

              flex items-center gap-3

              px-4 mx-2 py-3

              rounded-2xl

              border border-orange-500/10

              bg-gradient-to-r
              from-[#1b110d]
              via-[#1a120f]
              to-[#0f0f10]

              hover:border-orange-400/30

              hover:shadow-[0_0_25px_rgba(255,115,0,0.12)]

              transition-all duration-300

              overflow-hidden
            "
          >
            <div
              className="
                absolute inset-0

                opacity-0

                group-hover:opacity-100

                transition-opacity duration-500

                bg-gradient-to-r
                from-orange-500/5
                via-transparent
                to-orange-400/5
              "
            />

            <div
              className="
                relative z-10

                w-10 h-10

                rounded-xl

                flex items-center justify-center

                bg-orange-500/10

                border border-orange-400/10

                group-hover:bg-orange-500/15

                transition-all duration-300
              "
            >
              <svg
                className="
                  w-5 h-5

                  text-orange-400

                  transition-transform duration-300

                  group-hover:-translate-x-1
                  group-hover:scale-110
                "
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </div>

            <div className="relative z-10 text-left">
              <h2
                className="
                  text-sm md:text-base

                  font-semibold

                  text-white

                  tracking-wide
                "
              >
                Back
              </h2>
            </div>
          </button>
        </div>

        {/* NAV */}

        <nav className="px-3 space-y-1 flex-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative
                ${
                  isActive
                    ? "bg-orange-600/15 text-orange-400 border border-orange-800/40"
                    : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-orange-500 rounded-r" />
                  )}

                  <span
                    className={
                      isActive
                        ? "text-orange-400"
                        : "text-zinc-600 group-hover:text-zinc-300"
                    }
                  >
                    {item.icon}
                  </span>

                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* FOOTER */}

        {/* <div className="px-4 py-5 border-t border-zinc-800/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-600 to-red-800 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {USER.initials}
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-zinc-200 truncate">
                {USER.name}
              </p>

              <p className="text-[10px] text-zinc-600 truncate">
                {USER.username}
              </p>
            </div>
          </div>
        </div> */}
      </aside>
    </>
  );
};

export default Sidebar;
