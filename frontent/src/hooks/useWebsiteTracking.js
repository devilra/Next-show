import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import api from "../api";

export const useWebsiteTracking = (pathname) => {
  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    const initializeSession = async () => {
      try {
        // 1. Identity Logic
        let visitorId = localStorage.getItem("visitor_id");
        if (!visitorId) {
          visitorId = uuidv4();
          localStorage.setItem("visitor_id", visitorId);
        }

        let sessionId = sessionStorage.getItem("session_id");
        if (!sessionId) {
          sessionId = uuidv4();
          sessionStorage.setItem("session_id", sessionId);
        }

        const deviceType = window.innerWidth <= 768 ? "mobile" : "desktop";

        await api.post("/admin/initialize-session", {
          visitorId,
          sessionId,
          deviceType,
          pageUrl: pathname,
          referrerUrl: document.referrer,
          browser: navigator.userAgent,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
        });

        console.log("Session initialized ✅");
      } catch (error) {
        console.error("Tracking error:", error);
      }
    };

    initializeSession();
  }, [pathname]);
};
