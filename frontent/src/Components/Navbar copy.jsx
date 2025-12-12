import { Link } from "react-router-dom";

// Orange color variable for consistency
const ORANGE_COLOR = "#ff8c00";
const DARK_STRIP_COLOR = "#444";
const BLACK_STRIP_COLOR = "#333";

// Array to store the navigation links data
// The 'isHome' flag is used to apply the active (orange) color to the HOME link.
const navLinks = [
  { to: "/", label: "Home", isHome: true },
  { to: "/new", label: "New Movies" },
  { to: "/stream", label: "Streaming Now" },
  { to: "/trailer", label: "Trailers" },
  { to: "/news", label: "News" },
  { to: "/about", label: "About Us" },
];

// The SVG Path for the curved/wave shape
const WaveSVG = () => (
  <div
    // Position the wave to cover the transition area
    // Translate-y: -20px gives a better overlap on the navbar's white space
    className="w-full h-[30px] absolute bottom-0 left-0 z-5 overflow-hidden "
  >
    <svg
      // Increased height and adjusted bottom position for a deeper, softer curve
      className="w-full h-[210px] absolute bottom-[-150px] left-0"
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
    >
      {/* The fill attribute uses the hardcoded orange color */}
      {/* The path is slightly modified to make the curve deeper like the first image */}
      <path d="M0,96L1440,0L1440,320L0,320Z" fill={ORANGE_COLOR}></path>
    </svg>
  </div>
);

const Navbar = () => {
  // Logo Icon: Using a placeholder path for the lightbulb/wings icon
  const LogoIconPath = "/KVNProduction.png";

  return (
    <header className="bg-white relative overflow-visible">
      {/* overflow-visible: Logo veliya varum pothu clipped aagakoodathu */}

      {/* 1. Top Dark Strip */}
      <div className={`h-[10px] bg-[${DARK_STRIP_COLOR}]`}></div>

      <nav
        // Increased Navbar height to give space for the large logo container
        className="flex justify-between items-center px-0 py-[10px] relative z-10 h-[30px]"
      >
        <div
          // Main Logo Container: No change in ml-[100px]
          className="flex items-center relative ml-[100px]"
        >
          {/* 2. Logo Section: Rounded white container that extends below the nav */}
          <div
            // **UPDATED** LOGO CONTAINER STYLES
            // h-[190px] -> Height is more than navbar height
            // -top-[20px] -> Pushes the container slightly up from the nav's top edge
            className={`w-[180px] h-[100px] bg-white rounded-r-[50px] shadow-xl 
                                          flex flex-col justify-center items-center 
                                          absolute left-0 -top-[20px] 
                                          overflow-hidden p-3`}
            // translateX(-100px) pushes it to the left side
            style={{
              transform: "translateX(-100px)",
              borderRadius: "0 80px 80px 0",
            }}
            // Adjusted border radius for a smoother pill shape
          >
            {/* 💡 Reverting to the first image's logo style (Icon + Separate Text) */}
            <img
              // Using the placeholder path for the original icon
              src={LogoIconPath}
              alt="KVN Icon"
              className="w-[70px] h-auto mb-1" // Smaller icon inside the large container
            />

            {/* Text separate from icon, styled as per the original image */}
            <div className="flex flex-col text-center mt-[-5px]">
              {/* Logo text comments removed for brevity */}
            </div>
          </div>

          {/* Navigation Links Positioning Adjustment */}
          <div
            // Adjust margin for the links to start correctly after the logo container
            className="flex flex-col ml-[-40px] text-black font-extrabold text-left"
            style={{ marginLeft: "100px" }}
          >
            {/* This div is effectively a spacer/aligner for the logo area */}
          </div>
        </div>

        {/* 3. Navigation Links (Using Array.map()) */}
        <ul
          // Tailwind equivalent for nav-links - Adjusted margin-top to align links centrally
          className="flex p-0 mr-[50px] mt-[-10px]"
        >
          {navLinks.map((link) => (
            <li
              // Add margin-left to all links except the first one
              key={link.to}
            >
              <Link
                to={link.to}
                className={`
                  text-lg font-bold   text-black px-[14px] transition duration-300
                `}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* 4. Orange Wave/Curve Section */}
      <WaveSVG />

      {/* 5. Bottom Black Strip for the Footer effect */}
      <div
        className={`w-full h-[50px] bg-[${BLACK_STRIP_COLOR}] relative z-10`}
      ></div>
    </header>
  );
};

export default Navbar;
