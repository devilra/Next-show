import { createContext, useContext, useState } from "react";

const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // ======================================================
  // ✅ SHOW SNACKBAR
  // ======================================================

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // ======================================================
  // ✅ CLOSE SNACKBAR
  // ======================================================

  const closeSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <SnackbarContext.Provider
      value={{
        snackbar,
        showSnackbar,
        closeSnackbar,
      }}
    >
      {children}
    </SnackbarContext.Provider>
  );
};

// ======================================================
// ✅ CUSTOM HOOK
// ======================================================

export const useSnackbar = () => useContext(SnackbarContext);
