import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const MobileNavItem = ({
  label,
  path,
  icon: Icon,
  active,
  type,
  isAuthenticated,
  openAuth,
  authChecked,
  currentUser,
  getImageUrl,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleClick = () => {
    // =====================================
    // PROFILE
    // =====================================

    if (type === "profile") {
      // auth status innum load aagala
      if (!authChecked) {
        return;
      }
      if (isAuthenticated) {
        navigate("/profile", {
          state: {
            from: location.pathname,
          },
        });

        return;
      }

      openAuth();

      return;
    }

    // =====================================
    // NORMAL ROUTE
    // =====================================

    navigate(path);
  };
  return (
    <button
      onClick={handleClick}
      className="
      relative
      flex
      flex-col
      items-center
      justify-center
      gap-1
      min-w-[55px]
      "
    >
      {active && (
        <motion.div
          layoutId="activeTab"
          className="
          absolute
          -top-2
          w-12
          h-12
          rounded-full
          bg-orange-500/20
          blur-xl
          "
        />
      )}

      <motion.div
        animate={{
          scale: active ? 1.15 : 1,
          y: active ? -2 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 20,
        }}
      >
        {type === "profile" && isAuthenticated && currentUser ? (
          <div
            className={`
        w-7
        h-7
        rounded-full
        overflow-hidden
        border
        ${active ? "border-orange-500" : "border-zinc-700"}
      `}
          >
            {currentUser?.profileImage ? (
              <img
                src={getImageUrl(currentUser.profileImage)}
                alt={currentUser.fullName}
                className="
            w-full
            h-full
            object-cover
          "
              />
            ) : (
              <div
                className="
            w-full
            h-full
            bg-orange-500
            flex
            items-center
            justify-center
            text-[11px]
            font-bold
            text-white
          "
              >
                {currentUser?.fullName?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </div>
        ) : (
          <Icon
            className={`text-[24px] ${
              active ? "text-orange-500" : "text-zinc-500"
            }`}
          />
        )}
      </motion.div>

      <span
        className={`text-[11px] font-medium ${
          active ? "text-orange-400" : "text-zinc-500"
        }`}
      >
        {label}
      </span>
    </button>
  );
};

export default MobileNavItem;
