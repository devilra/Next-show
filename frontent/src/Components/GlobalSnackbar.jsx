import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useSnackbar } from "../../context/SnackbarContext";

const GlobalSnackbar = () => {
  const { snackbar, closeSnackbar } = useSnackbar();

  const snackbarStyles = {
    success: {
      bg: "#1e2422",
      border: "rgba(34, 197, 94, 0.25)",
      text: "#ffffff",
      icon: "#22c55e",
      glow: "rgba(34,197,94,0.08)",
    },
    error: {
      bg: "#221e1e",
      border: "rgba(239, 68, 68, 0.25)",
      text: "#ffffff",
      icon: "#ef4444",
      glow: "rgba(239,68,68,0.08)",
    },
    warning: {
      bg: "#22201e",
      border: "rgba(251, 191, 36, 0.25)",
      text: "#ffffff",
      icon: "#fbbf24",
      glow: "rgba(251,191,36,0.08)",
    },
    info: {
      bg: "#1e2022",
      border: "rgba(96, 165, 250, 0.25)",
      text: "#ffffff",
      icon: "#60a5fa",
      glow: "rgba(96,165,250,0.08)",
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
          borderRadius: "12px",
          overflow: "hidden",
          alignItems: "center",
          fontSize: "14px",
          fontWeight: 500,
          letterSpacing: "0.2px",
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
          color: currentStyle.text,
          background: currentStyle.bg,
          border: `1px solid ${currentStyle.border}`,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          padding: "10px 16px",
          boxShadow: `
            0 4px 24px rgba(0,0,0,0.5),
            0 0 12px ${currentStyle.glow}
          `,
          "& .MuiAlert-icon": {
            color: currentStyle.icon,
            fontSize: "20px",
            alignItems: "center",
            padding: "0",
            marginRight: "10px",
          },
          "& .MuiAlert-action": {
            color: "rgba(255,255,255,0.5)",
            alignItems: "center",
            padding: "0 0 0 12px",
            "& .MuiIconButton-root:hover": {
              color: "#ffffff",
              background: "rgba(255,255,255,0.08)",
            },
          },
          "& .MuiSvgIcon-root": {
            fontSize: "18px",
          },
          "& .MuiAlert-message": {
            padding: "0",
            lineHeight: "1.5",
          },
        }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalSnackbar;
