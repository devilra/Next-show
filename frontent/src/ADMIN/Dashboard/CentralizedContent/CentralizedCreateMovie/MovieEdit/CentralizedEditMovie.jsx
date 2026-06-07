import React, { useState, useMemo, useEffect, useCallback } from "react";
import Editor from "@monaco-editor/react";
import {
  Save,
  X,
  Settings,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import makeAnimated from "react-select/animated";
import {
  Box,
  TextField,
  Typography,
  Stack,
  Chip,
  Switch,
  FormControlLabel,
  InputAdornment,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  LocalizationProvider,
  DatePicker,
  DateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ReactSelect from "react-select";
import api from "../../../../../api";

const animatedComponents = makeAnimated();

// ─────────────────────────────────────────────
// FIELD CONFIG  (same shape as AdminMovieEditor)
// ─────────────────────────────────────────────
const FIELD_CONFIG = [
  { id: "title", label: "Movie Title", type: "text" },
  {
    id: "streamType",
    label: "Stream Type",
    type: "select",
    options: ["TRENDING", "UPCOMING", "NEW_RELEASE"],
  },
  {
    id: "movieStatus",
    label: "Movie Status",
    type: "select",
    options: ["WAITING", "RELEASED", "COMPLETED"],
  },
  {
    id: "releaseMode",
    label: "Release Mode",
    type: "select",
    options: ["THEATRICAL", "DIRECT_STREAMING"],
  },
  { id: "isManualUpdate", label: "Manual Update?", type: "checkbox" },
  { id: "isTrending", label: "Is Trending?", type: "checkbox" },
  { id: "isTheatreReleased", label: "Theatre Released?", type: "checkbox" },
  { id: "isStreamingReleased", label: "Streaming Released?", type: "checkbox" },
  { id: "theatreRunDays", label: "Theatre Run (Days)", type: "number" },
  { id: "trendingDays", label: "Trending Days", type: "number" },
  { id: "imdbRating", label: "IMDB Rating (0-10)", type: "number" },
  { id: "userRating", label: "User Rating (0-10)", type: "number" },
  {
    id: "trendingStartDate",
    label: "Trending Start Date",
    type: "controlled-date",
  },
  {
    id: "theatreReleaseDate",
    label: "Theatre Release Date/Time",
    type: "controlled-datetime",
  },
  {
    id: "ottReleaseDate",
    label: "OTT Release Date/Time",
    type: "controlled-datetime",
  },
  {
    id: "ReactSelect",
    label: "Select Casts",
    type: "ReactSelect",
  },
  {
    id: "language",
    label: "Languages",
    type: "array",
    options: ["Tamil", "Telugu", "Hindi", "English", "Malayalam", "Kannada"],
  },
  {
    id: "availableOn",
    label: "Available On",
    type: "array",
    options: [
      { id: "aha", name: "Aha", logo: "/Streaming_logo/Aha.webp" },
      { id: "erosnow", name: "ErosNow", logo: "/Streaming_logo/erosnow.webp" },
      { id: "hungama", name: "Hungama", logo: "/Streaming_logo/Hungama.webp" },
      {
        id: "jiohotstar",
        name: "JioHotstar",
        logo: "/Streaming_logo/jiohotstar.jpg",
      },
      { id: "netflix", name: "Netflix", logo: "/Streaming_logo/netflix.jpg" },
      { id: "prime", name: "Prime", logo: "/Streaming_logo/prime.jpg" },
      { id: "sony", name: "Sony", logo: "/Streaming_logo/sony.webp" },
      { id: "sunnxt", name: "SunNxt", logo: "/Streaming_logo/sunNxt.jpg" },
      { id: "z5", name: "Z5", logo: "/Streaming_logo/Z5.webp" },
      { id: "mx", name: "MX", logo: "/Streaming_logo/mx.jpg" },
    ],
  },
  {
    id: "genres",
    label: "Genres",
    type: "array",
    options: [
      "Action",
      "Adventure",
      "Animation",
      "Biography",
      "Comedy",
      "Crime",
      "Documentary",
      "Drama",
      "Family",
      "Fantasy",
      "History",
      "Horror",
      "Music",
      "Mystery",
      "Romance",
      "Sci-Fi",
      "Sport",
      "Thriller",
      "War",
      "Superhero",
      "Psychological",
      "Suspense",
      "Dark Comedy",
      "Survival",
    ],
  },
  { id: "certification", label: "Certification", type: "text" },
  { id: "durationOrSeason", label: "Duration / Season", type: "text" },
  { id: "director", label: "Director", type: "text" },
  { id: "trailerUrl", label: "Trailer URL", type: "text" },
  { id: "watchUrl", label: "Watch URL", type: "text" },
];

// ─────────────────────────────────────────────
// REACT-SELECT custom styles
// ─────────────────────────────────────────────
const rsStyles = {
  control: (b, s) => ({
    ...b,
    backgroundColor: "#0f172a",
    borderColor: s.isFocused ? "#f97316" : "#334155",
    boxShadow: "none",
    borderRadius: "12px",
    padding: "4px",
    "&:hover": { borderColor: "#f97316" },
  }),
  menu: (b) => ({
    ...b,
    backgroundColor: "#020617",
    borderRadius: "12px",
    border: "1px solid #1e293b",
    zIndex: 9999,
  }),
  option: (b, s) => ({
    ...b,
    backgroundColor: s.isFocused
      ? "#1e293b"
      : s.isSelected
        ? "#f97316"
        : "transparent",
    color: s.isSelected ? "#fff" : "#cbd5e1",
    padding: "10px 14px",
    cursor: "pointer",
  }),
  multiValue: (b) => ({
    ...b,
    backgroundColor: "#f97316",
    borderRadius: "8px",
  }),
  multiValueLabel: (b) => ({ ...b, color: "#fff", fontWeight: "600" }),
  multiValueRemove: (b) => ({
    ...b,
    color: "#fff",
    ":hover": { backgroundColor: "transparent" },
  }),
  placeholder: (b) => ({ ...b, color: "#64748b" }),
  input: (b) => ({ ...b, color: "#fff" }),
  singleValue: (b) => ({ ...b, color: "#fff" }),
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const CentralizedEditMovie = ({ movie, onBack, setAlert }) => {
  const queryClient = useQueryClient();

  // Monaco instances
  const [editorInstance, setEditorInstance] = useState(null);
  const [monacoInstance, setMonacoInstance] = useState(null);

  // JSON editor value — initialise from movie prop
  const buildInitialJson = useCallback((m) => {
    // Stringify arrays / objects that backend returns as strings
    const clean = { ...m };
    [
      "language",
      "availableOn",
      "genres",
      "mediaLinks",
      "galleryLinks",
      "boxOffice",
      "releaseInfo",
      "streamReleaseInfo",
      "castDetails",
    ].forEach((f) => {
      if (clean[f] && typeof clean[f] === "string") {
        try {
          clean[f] = JSON.parse(clean[f]);
        } catch (_) {}
      }
    });
    return JSON.stringify(clean, null, 2);
  }, []);

  const [editorValue, setEditorValue] = useState(() => buildInitialJson(movie));
  const [openSelect, setOpenSelect] = useState(null);
  const [enabledFields, setEnabledFields] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  // ─── Sync editorValue when movie prop changes ───
  useEffect(() => {
    setEditorValue(buildInitialJson(movie));
    setIsDirty(false);
  }, [movie, buildInitialJson]);

  // ─── Casts query ───
  const { data: castsData, isLoading: castsLoading } = useQuery({
    queryKey: ["all-casts"],
    // queryFn: async () => (await api.get("/admin/all-cast")).data.data,
    queryFn: async () => {
      const res = await api.get("/admin/all-cast");
      return res.data.data;
    },
  });

  // ─── Update mutation ───
  const updateMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await api.put(
        `/admin/edit-json-movie/${payload.id}`,
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["json-upload-movies"] });
      setAlert("success", "Movie updated successfully!");
      setIsDirty(false);
    },
    onError: (err) => {
      setAlert("error", err.response?.data?.message || "Update failed!");
    },
  });

  // ─── Derived parsed JSON (for sidebar) ───
  const currentJsonData = useMemo(() => {
    try {
      return JSON.parse(editorValue);
    } catch {
      return null;
    }
  }, [editorValue]);

  // ─── Monaco custom validation ───
  const validateCustomFields = useCallback((editor, monaco) => {
    if (!editor || !monaco) return;
    const model = editor.getModel();
    const value = model.getValue();
    const markers = [];

    // Rating check
    const ratingRe = /"(imdbRating|userRating)"\s*:\s*"?(\d+(\.\d+)?)"?/g;
    let m;
    while ((m = ratingRe.exec(value))) {
      const val = parseFloat(m[2]);
      const pos = model.getPositionAt(m.index);
      if (val > 10 || val < 0) {
        markers.push({
          message: "❌ Rating must be between 0 and 10",
          severity: monaco.MarkerSeverity.Error,
          startLineNumber: pos.lineNumber,
          startColumn: 1,
          endLineNumber: pos.lineNumber,
          endColumn: 100,
        });
      }
    }

    // theatreRunDays check
    const runRe = /"(theatreRunDays)"\s*:\s*(-?\d+)/g;
    while ((m = runRe.exec(value))) {
      const val = parseInt(m[2]);
      const pos = model.getPositionAt(m.index);
      if (val < 0) {
        markers.push({
          message: "❌ Theatre Run Days cannot be negative",
          severity: monaco.MarkerSeverity.Error,
          startLineNumber: pos.lineNumber,
          startColumn: 1,
          endLineNumber: pos.lineNumber,
          endColumn: 100,
        });
      }
    }

    monaco.editor.setModelMarkers(model, "custom", markers);
  }, []);

  // ─── Monaco beforeMount — schema + autocomplete ───
  const handleEditorWillMount = (monaco) => {
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      allowComments: false,
      enableSchemaRequest: true,
      schemaValidation: "error",
      schemas: [
        {
          uri: "http://myserver/edit-movie-schema.json",
          fileMatch: ["a://server/edit-movie.json"],
          schema: {
            type: "object",
            properties: {
              imdbRating: { type: "number", minimum: 0, maximum: 10 },
              userRating: { type: "number", minimum: 0, maximum: 10 },
              theatreRunDays: { type: "integer", minimum: 0 },
              streamType: {
                type: "string",
                enum: ["TRENDING", "UPCOMING", "NEW_RELEASE"],
              },
              movieStatus: {
                type: "string",
                enum: ["WAITING", "RELEASED", "COMPLETED"],
              },
              releaseMode: {
                type: "string",
                enum: ["THEATRICAL", "DIRECT_STREAMING"],
              },
            },
          },
        },
      ],
    });
  };

  // ─── Field change → update editor JSON ───
  const handleFieldChange = (fieldId, newValue) => {
    try {
      const current = JSON.parse(editorValue);
      const processed =
        typeof newValue === "string" && newValue !== "" && !isNaN(newValue)
          ? Number(newValue)
          : newValue;
      setEditorValue(
        JSON.stringify({ ...current, [fieldId]: processed }, null, 2),
      );
      setIsDirty(true);
    } catch {
      console.error("Fix JSON first");
    }
  };

  // ─── Cast sync effect ───
  useEffect(() => {
    try {
      const parsed = JSON.parse(editorValue);
      if (!castsData?.length) return;
      const cast = parsed.cast || [];
      const existingDetails = parsed.castDetails || [];
      const updated = cast
        .map((name) => {
          const found = castsData.find((c) => c.label === name);
          if (!found) return null;
          return (
            existingDetails.find((c) => c.castId === found.value) || {
              castId: found.value,
              characterName: "",
              roleCategory: "",
              isLeadRole: false,
            }
          );
        })
        .filter(Boolean);
      if (JSON.stringify(existingDetails) !== JSON.stringify(updated)) {
        setEditorValue(
          JSON.stringify({ ...parsed, castDetails: updated }, null, 2),
        );
      }
    } catch {}
  }, [editorValue, castsData]);

  // ─── Save handler ───
  const handleSave = () => {
    if (!editorInstance || !monacoInstance) {
      setAlert("error", "Editor not ready!");
      return;
    }
    const markers = monacoInstance.editor.getModelMarkers({
      resource: editorInstance.getModel().uri,
    });
    if (markers.length > 0) {
      setAlert("error", "Fix all errors before saving!");
      return;
    }
    try {
      const payload = JSON.parse(editorValue);
      if (!payload.id) {
        setAlert("error", "Movie ID missing!");
        return;
      }
      updateMutation.mutate(payload);
    } catch {
      setAlert("error", "Invalid JSON format!");
    }
  };

  // ─── CustomOption for ReactSelect ───
  const CustomOption = ({ data, innerRef, innerProps }) => (
    <div
      ref={innerRef}
      {...innerProps}
      className="flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-800 border-b border-slate-700/50"
    >
      <img
        src={data.image || "https://via.placeholder.com/40?text=Cast"}
        alt={data.label}
        className="w-10 h-10 rounded-full object-cover border border-slate-600"
      />
      <div className="flex flex-col">
        <span className="text-sm font-bold text-white">{data.label}</span>
        <span className="text-[10px] text-slate-400 uppercase">
          {data.profession || "Actor"}
        </span>
      </div>
    </div>
  );

  // ─── Marker count for header badge ───
  const [markerCount, setMarkerCount] = useState(0);
  useEffect(() => {
    if (!editorInstance || !monacoInstance) return;
    const model = editorInstance.getModel();
    if (!model) return;
    const markers = monacoInstance.editor.getModelMarkers({
      resource: model.uri,
    });
    setMarkerCount(markers.length);
  }, [editorValue, editorInstance, monacoInstance]);

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="fixed inset-0 bg-[#020617] z-50 flex flex-col overflow-hidden">
        {/* ── TOP BAR ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0a0f1e]">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                <Settings size={20} className="text-orange-400" />
              </div>
              <div>
                <h1 className="text-white font-bold text-base uppercase tracking-wider">
                  Edit Movie
                </h1>
                <p className="text-orange-400 text-sm truncate max-w-[300px]">
                  {currentJsonData?.title || movie?.title || "Loading..."}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Dirty indicator */}
            {isDirty && (
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold bg-amber-400/10 px-3 py-1.5 rounded-lg border border-amber-400/20">
                <RefreshCw size={12} className="animate-spin" />
                Unsaved Changes
              </div>
            )}

            {/* Error badge */}
            {markerCount > 0 ? (
              <div className="flex items-center gap-1.5 text-red-400 text-xs font-semibold bg-red-400/10 px-3 py-1.5 rounded-lg border border-red-400/20">
                <AlertTriangle size={12} />
                {markerCount} Error{markerCount > 1 ? "s" : ""}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold bg-emerald-400/10 px-3 py-1.5 rounded-lg border border-emerald-400/20">
                <CheckCircle size={12} />
                Valid JSON
              </div>
            )}

            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 rounded-xl tracking-wide transition-all shadow-lg shadow-orange-500/20"
            >
              {updateMutation.isPending ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {updateMutation.isPending ? "Saving..." : "Update Movie"}
            </button>
          </div>
        </div>

        {/* ── BODY: SIDEBAR + EDITOR ── */}
        <div className="flex flex-1 overflow-hidden">
          {/* LEFT SIDEBAR */}
          <div className="w-[380px] bg-[#0a0f1e] border-r border-slate-800 overflow-y-auto p-6 custom-scrollbar">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-5">
              Movie Fields
            </p>

            {currentJsonData ? (
              <Stack spacing={3.5}>
                {FIELD_CONFIG.map((field) => {
                  const val = currentJsonData[field.id];
                  const isEnabled =
                    enabledFields[field.id] ??
                    (val !== undefined && val !== null);

                  const ToggleCheckbox = (
                    <Checkbox
                      size="small"
                      sx={{
                        color: "#f97316",
                        "&.Mui-checked": { color: "#f97316" },
                        p: 0.5,
                      }}
                      checked={!!isEnabled}
                      onChange={(e) =>
                        setEnabledFields((p) => ({
                          ...p,
                          [field.id]: e.target.checked,
                        }))
                      }
                    />
                  );

                  // TEXT / NUMBER
                  if (field.type === "text" || field.type === "number") {
                    return (
                      <Box key={field.id}>
                        <Typography
                          sx={{
                            fontSize: "10px",
                            fontWeight: 700,
                            color: "#f97316",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            mb: 1,
                          }}
                        >
                          {field.label}
                        </Typography>
                        <TextField
                          fullWidth
                          type={field.type}
                          variant="filled"
                          size="small"
                          value={val !== undefined && val !== null ? val : ""}
                          onChange={(e) =>
                            handleFieldChange(field.id, e.target.value)
                          }
                          sx={{
                            backgroundColor: "#1e293b",
                            borderRadius: "10px",
                            "& .MuiFilledInput-root": {
                              backgroundColor: "#1e293b",
                              borderRadius: "10px",
                              "&:hover": { backgroundColor: "#1e293b" },
                              "&.Mui-focused": { backgroundColor: "#1e293b" },
                            },
                            input: {
                              color: "#fff",
                              fontWeight: 500,
                              fontSize: "13px",
                            },
                          }}
                        />
                      </Box>
                    );
                  }

                  // REACT SELECT (cast)
                  if (field.type === "ReactSelect") {
                    return (
                      <Box key={field.id}>
                        <Typography
                          sx={{
                            fontSize: "10px",
                            fontWeight: 700,
                            color: "#f97316",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            mb: 1,
                          }}
                        >
                          Select Casts
                        </Typography>
                        <ReactSelect
                          isMulti
                          isLoading={castsLoading}
                          components={{
                            ...animatedComponents,
                            Option: CustomOption,
                          }}
                          options={castsData || []}
                          styles={rsStyles}
                          value={
                            castsData?.filter((opt) =>
                              currentJsonData.cast?.includes(opt.label),
                            ) || []
                          }
                          placeholder={
                            castsLoading ? "Loading..." : "Search actors..."
                          }
                          onChange={(selected) => {
                            const list = selected || [];
                            try {
                              const current = JSON.parse(editorValue);
                              const existing = current.castDetails || [];
                              setEditorValue(
                                JSON.stringify(
                                  {
                                    ...current,
                                    cast: list.map((s) => s.label),
                                    castDetails: list.map(
                                      (s) =>
                                        existing.find(
                                          (c) => c.castId === s.value,
                                        ) || {
                                          castId: s.value,
                                          characterName: "",
                                          roleCategory: "",
                                          isLeadRole: false,
                                        },
                                    ),
                                  },
                                  null,
                                  2,
                                ),
                              );
                              setIsDirty(true);
                            } catch {}
                          }}
                        />
                      </Box>
                    );
                  }

                  // CHECKBOX
                  if (field.type === "checkbox") {
                    return (
                      <FormControlLabel
                        key={field.id}
                        control={
                          <Checkbox
                            sx={{
                              color: "#f97316 !important",
                              "&.Mui-checked": { color: "#f97316 !important" },
                            }}
                            checked={!!val}
                            onChange={(e) =>
                              handleFieldChange(field.id, e.target.checked)
                            }
                          />
                        }
                        label={
                          <Typography
                            sx={{
                              fontSize: "12px",
                              color: "#cbd5e1",
                              fontWeight: 600,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                            }}
                          >
                            {field.label}
                          </Typography>
                        }
                      />
                    );
                  }

                  // SELECT
                  if (field.type === "select") {
                    return (
                      <FormControl
                        key={field.id}
                        variant="filled"
                        fullWidth
                        size="small"
                        sx={{
                          "& .MuiFilledInput-root": {
                            backgroundColor: "#1e293b",
                            borderRadius: "10px",
                            "&:hover": { backgroundColor: "#1e293b" },
                            "&.Mui-focused": { backgroundColor: "#1e293b" },
                          },
                        }}
                      >
                        <InputLabel
                          sx={{
                            color: "#f97316 !important",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            fontSize: "11px",
                            "&.Mui-focused": { color: "#f97316 !important" },
                          }}
                        >
                          {field.label}
                        </InputLabel>
                        <Select
                          value={val || ""}
                          onChange={(e) =>
                            handleFieldChange(field.id, e.target.value)
                          }
                          sx={{
                            color: "#fff",
                            fontSize: "13px",
                            fontWeight: 600,
                          }}
                        >
                          {field.options.map((opt) => (
                            <MenuItem
                              key={opt}
                              value={opt}
                              sx={{ fontSize: "13px" }}
                            >
                              {opt}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    );
                  }

                  // ARRAY / MULTI-SELECT
                  if (field.type === "array") {
                    const currentVal = Array.isArray(currentJsonData[field.id])
                      ? currentJsonData[field.id]
                      : currentJsonData[field.id]
                        ? [currentJsonData[field.id]]
                        : [];
                    return (
                      <FormControl
                        key={field.id}
                        variant="filled"
                        fullWidth
                        size="small"
                        sx={{
                          "& .MuiFilledInput-root": {
                            backgroundColor: "#1e293b",
                            borderRadius: "10px",
                            "&:hover": { backgroundColor: "#1e293b" },
                            "&.Mui-focused": { backgroundColor: "#1e293b" },
                          },
                        }}
                      >
                        <InputLabel
                          sx={{
                            color: "#f97316 !important",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            fontSize: "11px",
                            "&.Mui-focused": { color: "#f97316 !important" },
                          }}
                        >
                          {field.label}
                        </InputLabel>
                        <Select
                          multiple
                          open={openSelect === field.id}
                          value={currentVal}
                          onOpen={() => setOpenSelect(field.id)}
                          onClose={() => setOpenSelect(null)}
                          onChange={(e) => {
                            handleFieldChange(field.id, e.target.value);
                            setOpenSelect(null);
                          }}
                          sx={{ color: "#fff", fontSize: "13px" }}
                          renderValue={(selected) => (
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "6px",
                                py: "4px",
                              }}
                            >
                              {selected.map((v) => {
                                const opt =
                                  field.options.find(
                                    (o) => o.id === v || o === v,
                                  ) || v;
                                return (
                                  <Chip
                                    key={v}
                                    label={
                                      typeof opt === "string" ? opt : opt.name
                                    }
                                    size="small"
                                    onDelete={(e) => {
                                      e.stopPropagation();
                                      handleFieldChange(
                                        field.id,
                                        selected.filter((x) => x !== v),
                                      );
                                    }}
                                    deleteIcon={
                                      <X
                                        size={10}
                                        onMouseDown={(e) => e.stopPropagation()}
                                      />
                                    }
                                    sx={{
                                      backgroundColor: "#f97316",
                                      color: "#fff",
                                      fontWeight: 600,
                                      fontSize: "10px",
                                      borderRadius: "6px",
                                      height: "22px",
                                    }}
                                  />
                                );
                              })}
                            </Box>
                          )}
                        >
                          {field.options.map((opt) => (
                            <MenuItem
                              key={opt.id || opt}
                              value={opt.id || opt}
                              sx={{ fontSize: "13px" }}
                            >
                              {opt.logo && (
                                <img
                                  src={opt.logo}
                                  width="18"
                                  style={{ marginRight: 8 }}
                                />
                              )}
                              {typeof opt === "string" ? opt : opt.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    );
                  }

                  // DATE / DATETIME
                  if (
                    field.type === "controlled-date" ||
                    field.type === "controlled-datetime"
                  ) {
                    const Picker =
                      field.type === "controlled-datetime"
                        ? DateTimePicker
                        : DatePicker;
                    return (
                      <Box key={field.id}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          sx={{ mb: 1 }}
                        >
                          <Typography
                            sx={{
                              fontSize: "10px",
                              fontWeight: 700,
                              color: "#f97316",
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                            }}
                          >
                            {field.label}
                          </Typography>
                          {ToggleCheckbox}
                        </Stack>
                        <Picker
                          disabled={!isEnabled}
                          value={
                            val && dayjs(val).isValid() ? dayjs(val) : null
                          }
                          onChange={(date) => {
                            if (!date) {
                              handleFieldChange(field.id, null);
                              return;
                            }
                            if (dayjs(date).isValid()) {
                              handleFieldChange(
                                field.id,
                                field.type === "controlled-datetime"
                                  ? date.toISOString()
                                  : date.format("YYYY-MM-DD"),
                              );
                            }
                          }}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              variant: "filled",
                              size: "small",
                              sx: {
                                "& .MuiFilledInput-root": {
                                  backgroundColor: "#1e293b",
                                  borderRadius: "10px",
                                  "&:hover": { backgroundColor: "#1e293b" },
                                  "&.Mui-focused": {
                                    backgroundColor: "#1e293b",
                                  },
                                },
                                input: { color: "#fff", fontSize: "13px" },
                              },
                              InputProps: {
                                endAdornment: val ? (
                                  <InputAdornment position="end" sx={{ mr: 1 }}>
                                    <X
                                      size={14}
                                      className="cursor-pointer text-slate-500 hover:text-red-400 transition-colors"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleFieldChange(field.id, null);
                                      }}
                                    />
                                  </InputAdornment>
                                ) : null,
                              },
                            },
                          }}
                        />
                      </Box>
                    );
                  }

                  return null;
                })}
              </Stack>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <AlertTriangle size={24} className="text-red-400" />
                <p className="text-red-400 text-sm font-semibold">
                  Invalid JSON — Fix editor first
                </p>
              </div>
            )}
          </div>

          {/* RIGHT: MONACO EDITOR */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Editor top info bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#0d1117] border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                <span className="text-slate-500 text-xs ml-2 font-mono">
                  movie-editor.json
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-600 text-[10px] font-mono">
                  ID: {currentJsonData?.id || movie?.id}
                </span>
                <span className="text-slate-600 text-[10px]">•</span>
                <span className="text-slate-600 text-[10px] font-mono">
                  {editorValue.length} chars
                </span>
              </div>
            </div>

            <Editor
              height="100%"
              defaultLanguage="json"
              theme="vs-dark"
              value={editorValue}
              path="a://server/edit-movie.json"
              beforeMount={handleEditorWillMount}
              onMount={(editor, monaco) => {
                setEditorInstance(editor);
                setMonacoInstance(monaco);
                setTimeout(() => validateCustomFields(editor, monaco), 500);
              }}
              onChange={(value) => {
                setEditorValue(value || "");
                setIsDirty(true);
                setTimeout(
                  () => validateCustomFields(editorInstance, monacoInstance),
                  300,
                );
              }}
              options={{
                fontSize: 13,
                fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                minimap: { enabled: false },
                wordWrap: "on",
                padding: { top: 20, bottom: 20 },
                scrollBeyondLastLine: false,
                formatOnPaste: true,
                bracketPairColorization: { enabled: true },
                renderLineHighlight: "gutter",
              }}
            />
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default CentralizedEditMovie;
