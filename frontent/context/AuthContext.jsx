import { createContext, useContext, useState } from "react";
import AuthComponent from "../src/Components/LoginSignupComponent";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  //   console.log("IsAuthOpen", isAuthOpen);

  const openAuth = () => setIsAuthOpen(true);
  const closeAuth = () => setIsAuthOpen(false);

  return (
    <AuthContext.Provider value={{ isAuthOpen, openAuth, closeAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
