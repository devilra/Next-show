// CustomDatePicker.jsx
import { useState, useRef, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import dayjs from "dayjs";

const darkOrangeTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#f97316" },
    background: { default: "#09090b", paper: "#0f0f10" },
    text: { primary: "#f4f4f5", secondary: "#71717a" },
  },
  components: {
    MuiPickersCalendarHeader: {
      styleOverrides: {
        root: { color: "#f97316", paddingTop: "8px", paddingBottom: "8px" },
        label: {
          fontSize: "13px",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#f97316",
        },
        switchViewButton: { color: "#f97316" },
      },
    },
    MuiPickersArrowSwitcher: {
      styleOverrides: {
        button: {
          color: "#f97316",
          "&:hover": { backgroundColor: "rgba(249,115,22,0.1)" },
        },
      },
    },
    MuiDayCalendar: {
      styleOverrides: {
        header: {
          " .MuiDayCalendar-weekDayLabel": {
            color: "#52525b",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.1em",
          },
        },
      },
    },
    MuiPickersDay: {
      styleOverrides: {
        root: {
          color: "#d4d4d8",
          fontSize: "12px",
          fontWeight: 500,
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: "rgba(249,115,22,0.15)",
            color: "#f97316",
          },
          "&.Mui-selected": {
            backgroundColor: "#f97316",
            color: "#fff",
            fontWeight: 700,
            "&:hover": { backgroundColor: "#ea6c0a" },
            "&:focus": { backgroundColor: "#f97316" },
          },
          "&.MuiPickersDay-today:not(.Mui-selected)": {
            border: "1.5px solid #f97316",
            color: "#f97316",
            backgroundColor: "transparent",
          },
        },
      },
    },
    MuiYearCalendar: {
      styleOverrides: {
        root: {
          width: "100%", // Year கிரிட் முழு வித் எடுக்க
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-track": { background: "#18181b" },
          "&::-webkit-scrollbar-thumb": {
            background: "#f97316",
            borderRadius: "2px",
          },
        },
      },
    },
    MuiPickersYear: {
      styleOverrides: {
        yearButton: {
          color: "#a1a1aa",
          fontSize: "13px",
          fontWeight: 500,
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: "rgba(249,115,22,0.12)",
            color: "#f97316",
          },
          "&.Mui-selected": {
            backgroundColor: "#f97316",
            color: "#fff",
            fontWeight: 700,
            "&:hover": { backgroundColor: "#ea6c0a" },
          },
        },
      },
    },
    MuiMonthCalendar: {
      styleOverrides: {
        root: {
          width: "100%", // Month கிரிட் முழு வித் எடுக்க
        },
      },
    },
    MuiPickersMonth: {
      styleOverrides: {
        monthButton: {
          color: "#a1a1aa",
          fontSize: "13px",
          fontWeight: 500,
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: "rgba(249,115,22,0.12)",
            color: "#f97316",
          },
          "&.Mui-selected": {
            backgroundColor: "#f97316",
            color: "#fff",
            fontWeight: 700,
          },
        },
      },
    },
    MuiDateCalendar: {
      styleOverrides: {
        root: {
          width: "320px", // 280px-ல இருந்து 320px ஆக மாற்றப்பட்டுள்ளது (MUI default width)
          maxHeight: "none",
          backgroundColor: "#0f0f10",
          border: "1px solid rgba(249,115,22,0.2)",
          borderRadius: "14px",
          padding: "8px",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(249,115,22,0.1)",
        },
      },
    },
    MuiPickersFadeTransitionGroup: {
      styleOverrides: {
        root: {
          " .MuiDayCalendar-monthContainer": { position: "relative" },
        },
      },
    },
  },
});

const CustomDatePicker = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [calendarPos, setCalendarPos] = useState({ top: 0, left: 0 });
  const [currentView, setCurrentView] = useState("day");

  const containerRef = useRef(null);
  const calendarRef = useRef(null);

  const dayjsValue = value ? dayjs(value) : null;

  const handleChange = (newVal, selectionState) => {
    if (newVal && newVal.isValid()) {
      onChange(newVal.format("YYYY-MM-DD"));

      if (selectionState === "finish" && currentView === "day") {
        setOpen(false);
      }
    }
  };

  const handleToggle = () => {
    if (!open && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const calendarWidth = 336; // 320 + padding adjustments
      const calendarHeight = 340;

      let left = rect.left;
      let top = rect.bottom + 8;

      if (left + calendarWidth > window.innerWidth - 16) {
        left = window.innerWidth - calendarWidth - 16;
      }
      if (left < 8) left = 8;
      if (top + calendarHeight > window.innerHeight - 16) {
        top = rect.top - calendarHeight - 8;
      }

      setCalendarPos({ top, left });
      setCurrentView("day");
    }
    setOpen((p) => !p);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.ownerDocument.documentElement.contains(e.target)) {
        return;
      }

      const isInContainer =
        containerRef.current && containerRef.current.contains(e.target);
      const isInCalendar =
        calendarRef.current && calendarRef.current.contains(e.target);

      if (!isInContainer && !isInCalendar) {
        setOpen(false);
        setCurrentView("day");
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    const handleClose = (e) => {
      if (calendarRef.current && calendarRef.current.contains(e.target)) {
        return;
      }
      setOpen(false);
      setCurrentView("day");
    };

    if (open) {
      window.addEventListener("scroll", handleClose, true);
      window.addEventListener("resize", handleClose);
    }
    return () => {
      window.removeEventListener("scroll", handleClose, true);
      window.removeEventListener("resize", handleClose);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        className="
          flex items-center gap-2
          bg-zinc-950
          border border-orange-500/40
          focus:border-orange-500
          rounded-lg
          text-white text-xs
          px-3 py-1.5
          outline-none
          w-40
          transition-all duration-200
          shadow-[0_0_0_2px_rgba(249,115,22,0.08)]
          hover:border-orange-500/70
          cursor-pointer
          justify-between
        "
      >
        <span className={dayjsValue ? "text-white" : "text-zinc-600"}>
          {dayjsValue ? dayjsValue.format("DD-MM-YYYY") : "Select date"}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#f97316"
          strokeWidth="2.5"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </button>

      {open && (
        <div
          ref={calendarRef}
          style={{
            position: "fixed",
            top: calendarPos.top,
            left: calendarPos.left,
            zIndex: 9999,
          }}
        >
          <ThemeProvider theme={darkOrangeTheme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                value={dayjsValue}
                onChange={handleChange}
                views={["year", "month", "day"]}
                openTo="day"
                onViewChange={(view) => setCurrentView(view)}
              />
            </LocalizationProvider>
          </ThemeProvider>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
