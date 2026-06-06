import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PageLevelProtectRoute = ({ children }) => {
  const { isAuthenticated, authLoading } = useSelector(
    (state) => state.userAuth,
  );
  const { openAuth } = useAuth();
  const location = useLocation();

  if (authLoading) return <div>Loading...</div>; // Optional loading

  if (!isAuthenticated) {
    // லாகின் இல்லைனா, உடனே லாகின் மாடலை ஓபன் பண்ணிட்டு Home-க்கு அனுப்பிடு
    openAuth();
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default PageLevelProtectRoute;
