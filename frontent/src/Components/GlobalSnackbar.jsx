import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { useSnackbar } from "../../context/SnackbarContext";

const GlobalSnackbar = () => {
  const { snackbar, closeSnackbar } = useSnackbar();

  // ======================================================
  // ✅ ENTERPRISE GLASS COLORS
  // ======================================================

  const snackbarStyles = {
    success: {
      bg: "rgba(34, 197, 94, 0.10)",
      border: "rgba(74, 222, 128, 0.65)",
      text: "#bbf7d0",
      icon: "#4ade80",
      glow: "rgba(34,197,94,0.22)",
    },

    error: {
      bg: "rgba(239, 68, 68, 0.10)",
      border: "rgba(248, 113, 113, 0.65)",
      text: "#fecaca",
      icon: "#f87171",
      glow: "rgba(239,68,68,0.22)",
    },

    warning: {
      bg: "rgba(245, 158, 11, 0.10)",
      border: "rgba(251, 191, 36, 0.65)",
      text: "#fde68a",
      icon: "#fbbf24",
      glow: "rgba(245,158,11,0.22)",
    },

    info: {
      bg: "rgba(59, 130, 246, 0.10)",
      border: "rgba(96, 165, 250, 0.65)",
      text: "#bfdbfe",
      icon: "#60a5fa",
      glow: "rgba(59,130,246,0.22)",
    },
  };

  const currentStyle =
    snackbarStyles[snackbar.severity] || snackbarStyles.success;

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={3000}
      onClose={closeSnackbar}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      sx={{
        zIndex: "2147483647 !important",
      }}
    >
      <Alert
        onClose={closeSnackbar}
        severity={snackbar.severity}
        variant="standard"
        sx={{
          width: "100%",

          minWidth: {
            xs: "92vw",
            sm: "360px",
          },

          maxWidth: "95vw",

          borderRadius: "16px",

          overflow: "hidden",

          alignItems: "center",

          fontSize: "14px",

          fontWeight: 600,

          color: currentStyle.text,

          background: currentStyle.bg,

          border: `1.5px solid ${currentStyle.border}`,

          borderLeft: `7px solid ${currentStyle.icon}`,

          backdropFilter: "blur(18px)",

          WebkitBackdropFilter: "blur(18px)",

          boxShadow: `
            0 8px 30px rgba(0,0,0,0.35),
            0 0 20px ${currentStyle.glow}
          `,

          "& .MuiAlert-icon": {
            color: currentStyle.icon,
            fontSize: "24px",
            alignItems: "center",
          },

          "& .MuiAlert-action": {
            color: currentStyle.icon,
            alignItems: "center",
          },

          "& .MuiSvgIcon-root": {
            color: currentStyle.icon,
          },

          "& .MuiAlert-message": {
            padding: "2px 0",
          },
        }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalSnackbar;
