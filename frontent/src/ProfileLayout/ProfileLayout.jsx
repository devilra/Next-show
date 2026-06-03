// import { Outlet, useLocation, useNavigate } from "react-router-dom";
// import Sidebar from "./ProfileComponents/Sidebar";
// import { useState, useEffect } from "react";
// import { useSelector } from "react-redux";

// const ProfileLayout = () => {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const { currentUser, authLoading, authError, authChecked } = useSelector(
//     (state) => state.userAuth,
//   );

//   const location = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     setMobileOpen(false);
//   }, [location]);

//   // ======================================================
//   // ✅ AUTH LOADING
//   // ======================================================

//   if (authLoading || !authChecked) {
//     return (
//       <div
//         className="
//         h-screen

//         flex items-center justify-center

//         bg-[#0c0c0d]
//       "
//       >
//         {/* ============================================ */}
//         {/* ✅ JELLY SPINNER */}
//         {/* ============================================ */}

//         <div
//           className="
//           w-10 h-10

//           rounded-full

//           border-[2px]
//           border-white/10
//           border-t-red-500
//           border-r-red-400

//           animate-spin

//           motion-safe:animate-[spin_0.7s_linear_infinite]

//           shadow-[0_0_12px_rgba(239,68,68,0.45)]
//         "
//           style={{
//             animation:
//               "spin 0.7s linear infinite, jelly 1.2s ease-in-out infinite",
//           }}
//         />
//       </div>
//     );
//   }

//   // ======================================================
//   // ✅ AUTH ERROR
//   // ======================================================

//   if (authError || !currentUser) {
//     return (
//       <div
//         className="
//         h-screen

//         flex flex-col items-center justify-center

//         bg-[#0c0c0d]

//         px-6
//       "
//       >
//         <div
//           className="
//           max-w-md

//           w-full

//           rounded-3xl

//           border border-red-500/10

//           bg-zinc-900/70

//           backdrop-blur-xl

//           p-8

//           text-center
//         "
//         >
//           {/* ICON */}

//           <div
//             className="
//             mx-auto

//             w-14 h-14

//             rounded-2xl

//             flex items-center justify-center

//             bg-red-500/10

//             border border-red-500/20

//             mb-5
//           "
//           >
//             <span className="text-red-400 text-2xl">⚠</span>
//           </div>

//           {/* TITLE */}

//           <h2
//             className="
//             text-xl

//             font-bold

//             text-white

//             mb-2
//           "
//           >
//             Authentication Failed
//           </h2>

//           {/* MESSAGE */}

//           <p
//             className="
//             text-sm

//             text-zinc-400

//             leading-relaxed
//           "
//           >
//             {authError || "Unable to load profile data"}
//           </p>

//           {/* ================================================== */}
//           {/* ✅ ACTION BUTTONS */}
//           {/* ================================================== */}

//           <div className="mt-7 flex items-center justify-center gap-3">
//             {/* HOME BUTTON */}

//             <button
//               onClick={() => navigate("/")}
//               className="
//               group

//               relative

//               px-5 py-3

//               rounded-2xl

//               overflow-hidden

//               border border-orange-500/20

//               bg-gradient-to-r
//               from-orange-500/15
//               via-orange-500/5
//               to-transparent

//               hover:border-orange-400/40

//               hover:shadow-[0_0_25px_rgba(249,115,22,0.18)]

//               transition-all duration-300

//               active:scale-95
//             "
//             >
//               {/* HOVER LAYER */}

//               <div
//                 className="
//                 absolute inset-0

//                 opacity-0

//                 group-hover:opacity-100

//                 transition-opacity duration-300

//                 bg-gradient-to-r
//                 from-orange-500/10
//                 to-transparent
//               "
//               />

//               <span
//                 className="
//                 relative z-10

//                 text-sm

//                 font-semibold

//                 tracking-wide

//                 text-orange-300
//               "
//               >
//                 Go Home
//               </span>
//             </button>

//             {/* BACK BUTTON */}

//             <button
//               onClick={() => navigate(-1)}
//               className="
//               px-5 py-3

//               rounded-2xl

//               border border-zinc-700

//               bg-zinc-800/60

//               text-sm

//               font-medium

//               text-zinc-300

//               hover:bg-zinc-800

//               hover:text-white

//               transition-all duration-300

//               active:scale-95
//             "
//             >
//               Go Back
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     // ======================================================
//     // ✅ FULL SCREEN FIXED LAYOUT
//     // ======================================================

//     <div
//       className="
//         h-screen

//         overflow-hidden

//         bg-[#0c0c0d]
//       "
//     >
//       {/* ================================================== */}
//       {/* ✅ MOBILE HEADER */}
//       {/* ================================================== */}

//       <header
//         className="
//           lg:hidden

//           flex items-center gap-3

//           px-4 py-3

//           border-b border-zinc-800/50

//           bg-zinc-950/80

//           backdrop-blur-sm

//           sticky top-0 z-20
//         "
//       >
//         <button
//           className="
//             text-zinc-400
//             hover:text-white

//             transition-colors
//           "
//           onClick={() => setMobileOpen(true)}
//         >
//           ☰
//         </button>

//         <span className="text-sm font-bold text-white">CineVault</span>
//       </header>

//       {/* ================================================== */}
//       {/* ✅ MAIN WRAPPER */}
//       {/* ================================================== */}

//       <div
//         className="
//           flex

//           h-full

//           max-w-7xl

//           mx-auto
//         "
//       >
//         {/* ================================================= */}
//         {/* ✅ SIDEBAR */}
//         {/* ================================================= */}

//         <aside
//           className="
//             hidden lg:flex

//             w-[280px]

//             shrink-0

//             h-full

//             overflow-y-auto

//             scrollbar-thin
//             scrollbar-thumb-zinc-800
//             scrollbar-track-transparent
//           "
//         >
//           <Sidebar
//             mobileOpen={mobileOpen}
//             onClose={() => setMobileOpen(false)}
//           />
//         </aside>

//         {/* ================================================= */}
//         {/* ✅ DIVIDER */}
//         {/* ================================================= */}

//         <div
//           className="
//             hidden lg:block

//             w-px

//             bg-zinc-800/40
//           "
//         />

//         {/* ================================================= */}
//         {/* ✅ RIGHT CONTENT */}
//         {/* ================================================= */}

//         <main
//           className="
//             flex-1
//             min-w-0
//             h-full
//             overflow-y-auto
//             px-4 lg:px-8
//             py-6 lg:py-8
//             scrollbar-thin
//             scrollbar-thumb-zinc-800
//             scrollbar-track-transparent
//           "
//         >
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default ProfileLayout;

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./ProfileComponents/Sidebar";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const ProfileLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { currentUser, authLoading, authError, authChecked } = useSelector(
    (state) => state.userAuth,
  );

  const location = useLocation();

  const navigate = useNavigate();

  // ======================================================
  // ✅ CLOSE MOBILE SIDEBAR ON ROUTE CHANGE
  // ======================================================

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  // ======================================================
  // ✅ AUTH LOADING
  // ======================================================

  if (authLoading || !authChecked) {
    return (
      <div
        className="
          h-screen

          flex items-center justify-center

          bg-[#0c0c0d]
        "
      >
        {/* ============================================ */}
        {/* ✅ JELLY SPINNER */}
        {/* ============================================ */}

        <div
          className="
            w-10 h-10

            rounded-full

            border-[2px]
            border-white/10
            border-t-red-500
            border-r-red-400

            animate-spin

            motion-safe:animate-[spin_0.7s_linear_infinite]

            shadow-[0_0_12px_rgba(239,68,68,0.45)]
          "
          style={{
            animation:
              "spin 0.7s linear infinite, jelly 1.2s ease-in-out infinite",
          }}
        />
      </div>
    );
  }

  // ======================================================
  // ✅ AUTH ERROR
  // ======================================================

  if (authError || !currentUser) {
    return (
      <div
        className="
          h-screen

          flex flex-col items-center justify-center

          bg-[#0c0c0d]

          px-6
        "
      >
        <div
          className="
            max-w-md

            w-full

            rounded-3xl

            border border-red-500/10

            bg-zinc-900/70

            backdrop-blur-xl

            p-8

            text-center
          "
        >
          {/* ICON */}

          <div
            className="
              mx-auto

              w-14 h-14

              rounded-2xl

              flex items-center justify-center

              bg-red-500/10

              border border-red-500/20

              mb-5
            "
          >
            <span className="text-red-400 text-2xl">⚠</span>
          </div>

          {/* TITLE */}

          <h2
            className="
              text-xl

              font-bold

              text-white

              mb-2
            "
          >
            Authentication Failed
          </h2>

          {/* MESSAGE */}

          <p
            className="
              text-sm

              text-zinc-400

              leading-relaxed
            "
          >
            {authError || "Unable to load profile data"}
          </p>

          {/* ================================================== */}
          {/* ✅ ACTION BUTTONS */}
          {/* ================================================== */}

          <div className="mt-7 flex items-center justify-center gap-3">
            {/* HOME BUTTON */}

            <button
              onClick={() => navigate("/")}
              className="
                group

                relative

                px-5 py-3

                rounded-2xl

                overflow-hidden

                border border-orange-500/20

                bg-gradient-to-r
                from-orange-500/15
                via-orange-500/5
                to-transparent

                hover:border-orange-400/40

                hover:shadow-[0_0_25px_rgba(249,115,22,0.18)]

                transition-all duration-300

                active:scale-95
              "
            >
              {/* HOVER LAYER */}

              <div
                className="
                  absolute inset-0

                  opacity-0

                  group-hover:opacity-100

                  transition-opacity duration-300

                  bg-gradient-to-r
                  from-orange-500/10
                  to-transparent
                "
              />

              <span
                className="
                  relative z-10

                  text-sm

                  font-semibold

                  tracking-wide

                  text-orange-300
                "
              >
                Go Home
              </span>
            </button>

            {/* BACK BUTTON */}

            <button
              onClick={() => navigate(-1)}
              className="
                px-5 py-3

                rounded-2xl

                border border-zinc-700

                bg-zinc-800/60

                text-sm

                font-medium

                text-zinc-300

                hover:bg-zinc-800

                hover:text-white

                transition-all duration-300

                active:scale-95
              "
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    // ======================================================
    // ✅ FULL SCREEN FIXED LAYOUT
    // ======================================================

    <div
      className="
        h-screen

        overflow-hidden

        bg-[#0c0c0d]
      "
    >
      {/* ================================================== */}
      {/* ✅ MOBILE HEADER */}
      {/* ================================================== */}

      <header
        className="
          lg:hidden

          flex items-center justify-between

          px-4 py-3

          border-b border-zinc-800/50

          bg-zinc-950/90

          backdrop-blur-md

          sticky top-0 z-30
        "
      >
        {/* LEFT */}

        <div className="flex items-center gap-3">
          {/* HAMBURGER */}

          <button
            className="
              flex items-center justify-center

              w-9 h-9

              rounded-xl

              border border-zinc-800

              bg-zinc-900/80

              text-zinc-300

              hover:text-white
              hover:border-zinc-700

              transition-all duration-300
            "
            onClick={() => setMobileOpen(true)}
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
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* LOGO */}

          {/* <div className="flex items-center gap-2">
            <div
              className="
                w-8 h-8

                rounded-xl

                bg-gradient-to-br
                from-orange-500
                to-red-700

                flex items-center justify-center

                text-white
                text-sm
                font-black
              "
            >
              N
            </div>

            <span
              className="
                text-base

                font-bold

                tracking-wide

                text-white
              "
            >
              NextShow
            </span>
          </div> */}
        </div>

        {/* RIGHT */}

        {/* <div
          className="
            w-9 h-9

            rounded-xl

            overflow-hidden

            border border-orange-500/20
          "
        >
          {currentUser?.profileImage ? (
            <img
              src={currentUser.profileImage}
              alt={currentUser.fullName}
              className="
                w-full h-full

                object-cover
              "
            />
          ) : (
            <div
              className="
                w-full h-full

                bg-gradient-to-br
                from-orange-600
                to-red-800

                flex items-center justify-center

                text-white
                text-xs
                font-bold
              "
            >
              {currentUser?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}
        </div> */}
      </header>

      {/* ================================================== */}
      {/* ✅ MAIN WRAPPER */}
      {/* ================================================== */}

      <div
        className="
          flex

          h-[calc(100vh-65px)] lg:h-full

          max-w-7xl

          mx-auto
        "
      >
        {/* MOBILE SIDEBAR */}
        <div className="lg:hidden">
          <Sidebar
            mobileOpen={mobileOpen}
            onClose={() => setMobileOpen(false)}
          />
        </div>

        {/* ================================================= */}
        {/* ✅ DESKTOP SIDEBAR */}
        {/* ================================================= */}

        <aside
          className="
            hidden lg:flex

            w-[280px]

            shrink-0

            h-full

            overflow-y-auto

            scrollbar-thin
            scrollbar-thumb-zinc-800
            scrollbar-track-transparent
          "
        >
          <Sidebar mobileOpen={false} onClose={() => setMobileOpen(false)} />
        </aside>

        {/* ================================================= */}
        {/* ✅ DIVIDER */}
        {/* ================================================= */}

        <div
          className="
            hidden lg:block

            w-px

            bg-zinc-800/40
          "
        />

        {/* ================================================= */}
        {/* ✅ RIGHT CONTENT */}
        {/* ================================================= */}

        <main
          className="
            flex-1

            min-w-0

            h-full

            overflow-y-auto

            px-4 lg:px-8

            py-5 lg:py-8

            scrollbar-thin
            scrollbar-thumb-zinc-800
            scrollbar-track-transparent
          "
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProfileLayout;
