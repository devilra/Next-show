import React, { useState, useMemo, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Edit, Save, X, Settings, Info, ArrowLeft } from "lucide-react";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { FaSpinner } from "react-icons/fa";
import {
  Box,
  TextField,
  Typography,
  Stack,
  Autocomplete,
  Chip,
  Paper,
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import api from "../../../../api";
import { setGlobalLoading } from "../../../../redux/CentralizedMovieSlice/CentralizedJsonCreateSlice";
import { Trash2 } from "lucide-react"; // Trash2 icon use pannalam or X icon already iruku

const AdminMovieEditor = ({
  initialData,
  onBack,
  validateMovie,
  setBulkData,
  setAlert,
  modalOpen,
}) => {
  // 1. Initial Data Setup
  const [movies, setMovies] = useState(initialData || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [editorValue, setEditorValue] = useState("");
  const [editorInstance, setEditorInstance] = useState(null);
  const [monacoInstance, setMonacoInstance] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  console.log("Admin model Open", isModalOpen);

  // 🔥 NEW: Local state to track which fields are enabled/disabled in UI
  // JSON value-kkum ithukkum samantham illai.
  const [enabledFields, setEnabledFields] = useState({});

  // console.log(editorValue);

  // 🔥 1. TANSTACK MUTATION
  const publishMoviesMutation = useMutation({
    mutationFn: async (movieData) => {
      const response = await api.post("/admin/publish-json-movies", movieData);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["json-upload-movies"],
      });
      setAlert("success", "Movies published successfully!");
      // modalOpen(false);
    },
    onError: (error) => {
      // console.log(error.response?.data?.message);
      setAlert(
        "error",
        error.response?.data?.message || "Something went wrong!",
      );
    },
  });

  // 🔥 2. SYNC TANSTACK STATE WITH REDUX
  // TanStack-la pending-ah irukum pothu Redux-layum true panni vaikurom
  useEffect(() => {
    dispatch(setGlobalLoading(publishMoviesMutation.isPending));
  }, [publishMoviesMutation.isPending, dispatch]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const hasErrors = useMemo(() => {
    return movies.some((m) => m.__errors?.length > 0);
  }, [movies]);

  // 🔥 CUSTOM VALIDATION FUNCTION
  const validateCustomFields = (editorRef, monacoRef) => {
    const editor = editorRef || editorInstance;
    const monaco = monacoRef || monacoInstance;

    if (!editor || !monaco) return;

    const model = editor.getModel();
    const value = model.getValue();

    let markers = [];

    const regex = /"(budget|totalWorldwide|totalIndiaGross)"\s*:\s*"(.*?)"/g;

    let match;

    while ((match = regex.exec(value))) {
      const val = match[2];
      const pos = model.getPositionAt(match.index);

      // ❌ Missing ₹
      if (!val.startsWith("₹")) {
        markers.push({
          message: "❌ Missing ₹ symbol",
          severity: monacoInstance.MarkerSeverity.Error,
          startLineNumber: pos.lineNumber,
          startColumn: 1,
          endLineNumber: pos.lineNumber,
          endColumn: 100,
        });

        markers.push({
          message: "💡 Suggestion: Add ₹ at start",
          severity: monacoInstance.MarkerSeverity.Hint,
          startLineNumber: pos.lineNumber,
          startColumn: 1,
          endLineNumber: pos.lineNumber,
          endColumn: 100,
        });
      }

      // ❌ Missing Crore
      if (!val.includes("Crore")) {
        markers.push({
          message: "❌ Missing 'Crore'",
          severity: monacoInstance.MarkerSeverity.Error,
          startLineNumber: pos.lineNumber,
          startColumn: 1,
          endLineNumber: pos.lineNumber,
          endColumn: 100,
        });

        markers.push({
          message: "💡 Suggestion: End with 'Crore'",
          severity: monacoInstance.MarkerSeverity.Hint,
          startLineNumber: pos.lineNumber,
          startColumn: 1,
          endLineNumber: pos.lineNumber,
          endColumn: 100,
        });
      }
    }

    // validateCustomFields kulla intha logic-ah add pannunga
    const runDaysRegex = /"(theatreRunDays)"\s*:\s*(-?\d+)/g;
    let match3;

    while ((match3 = runDaysRegex.exec(value))) {
      const val = parseInt(match3[2]);
      const pos = model.getPositionAt(match3.index);

      if (val < 0) {
        markers.push({
          message: "❌ Theatre Run Days cannot be negative",
          severity: monaco.MarkerSeverity.Error, // monacoInstance use panna severity kidaikkum
          startLineNumber: pos.lineNumber,
          startColumn: 1,
          endLineNumber: pos.lineNumber,
          endColumn: 100,
        });
      }
    }

    const ratingRegex = /"(imdbRating|userRating)"\s*:\s*"?(\d+(\.\d+)?)"?/g;
    let match2;

    while ((match2 = ratingRegex.exec(value))) {
      const val = parseFloat(match2[2]);
      const pos = model.getPositionAt(match2.index);

      if (val > 10 || val < 0) {
        markers.push({
          message: "❌ Rating must be between 0 and 10",
          severity: monacoInstance.MarkerSeverity.Error,
          startLineNumber: pos.lineNumber,
          startColumn: 1,
          endLineNumber: pos.lineNumber,
          endColumn: 100,
        });
      }
    }

    monacoInstance.editor.setModelMarkers(model, "custom", markers);
  };

  // 1. DYNAMIC CONFIG: Add as many fields as you want here
  const FIELD_CONFIG = [
    { id: "title", label: "Movie Title", type: "text" },
    // { id: "rating", label: "IMDB Rating", type: "number" },
    // { id: "isReleased", label: "Is Released?", type: "boolean" },
    {
      id: "streamType",
      label: "Stream Type",
      type: "select",
      options: ["TRENDING", "UPCOMING", "NEW_RELEASE"],
    },
    {
      id: "releaseMode",
      label: "Release Mode",
      type: "select",
      options: ["THEATRICAL", "DIRECT_STREAMING"],
    },
    { id: "isManualUpdate", label: "Manual Update?", type: "checkbox" },
    { id: "isTheatreReleased", label: "Theatre Released?", type: "checkbox" },
    { id: "theatreRunDays", label: "Theatre Run (Days)", type: "number" },
    {
      id: "isStreamingReleased",
      label: "Streaming Released?",
      type: "checkbox",
    },
    {
      id: "trendingStartDate",
      label: "Trending Start Date",
      type: "controlled-date",
    },
    // { id: "releaseDate", label: "Release Date", type: "datetime" },
    {
      id: "theatreReleaseDate",
      label: "Theatre Release",
      type: "controlled-datetime",
    },
    { id: "ottReleaseDate", label: "OTT Release", type: "controlled-datetime" },
    {
      id: "language",
      label: "Languages",
      type: "array",
      options: ["Tamil", "Telugu", "Hindi", "English"],
    },
    {
      id: "availableOn",
      label: "Available On",
      type: "array",
      options: ["Netflix", "Prime", "Hotstar"],
    },
    {
      id: "genres",
      label: "Genres",
      type: "array",
      options: ["Action", "Drama", "Sci-Fi"],
    },
  ];

  // Editor component kulla intha function-ah add pannunga
  const handleEditorWillMount = (monaco) => {
    const modelUri = monaco.Uri.parse("a://server/movie-editor.json"); // Unique URI for this model

    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      allowComments: false,
      enableSchemaRequest: true,
      schemaValidation: "error", // 🔥 force enum errors

      schemas: [
        {
          uri: "http://myserver/movie-schema.json",
          fileMatch: ["a://server/movie-editor.json"], // Intha model-ku mattum schema link panrom
          schema: {
            type: "object",
            required: ["status", "streamType", "releaseMode"],
            properties: {
              imdbRating: {
                type: "number",
                minimum: 0,
                maximum: 10,
              },
              theatreRunDays: {
                type: "integer",
                minimum: 0,
                errorMessage: "Run days must be a positive number",
              },

              userRating: {
                type: "number",
                minimum: 0,
                maximum: 10,
              },
              status: {
                type: "string",
                enum: ["UPCOMING", "RELEASED", "TRENDING"],
                errorMessage: "Invalid status value",
              },

              streamType: {
                type: "string",
                enum: ["TRENDING", "UPCOMING", "NEW_RELEASE"],
                errorMessage: "Invalid streamType value",
              },

              releaseMode: {
                type: "string",
                enum: ["THEATRICAL", "DIRECT_STREAMING"],
                errorMessage: "Invalid releaseMode value",
              },
              boxOffice: {
                type: "object",
                properties: {
                  budget: {
                    type: "string",
                    // Corrected Pattern: Optional whitespace and mandatory symbols
                    pattern: "^₹\\s?\\d+.*\\s?Crore$",
                    description:
                      "Format requirement: Start with ₹ and end with 'Crore'",
                    errorMessage:
                      "Budget must start with ₹ and end with 'Crore' (e.g., ₹200 Crore)",
                  },
                  totalWorldwide: {
                    type: "string",
                    pattern: "^₹\\s?\\d+.*\\s?Crore$",
                    description: "Example: ₹500 Crore",
                  },
                },
              },
            },
          },
        },
      ],
    });

    // 🔥 AUTOCOMPLETE
    monaco.languages.registerCompletionItemProvider("json", {
      provideCompletionItems: () => ({
        suggestions: [
          {
            label: "₹",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: "₹ ",
          },
          {
            label: "₹ 100 Crore",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: "₹ ${1:100} Crore",
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
        ],
      }),
    });
  };

  const handleDeleteMovie = (index, movieTitle) => {
    // Optional: Oru confirm box keta nallathu, thappu thavara delete aagama iruka
    if (
      window.confirm(
        `Are you sure you want to delete "${movieTitle || "this movie"}"?`,
      )
    ) {
      const updatedList = movies.filter((_, i) => i !== index);
      setMovies(updatedList);
      setAlert("success", "Movie deleted from the list.");
    }
  };

  // 🔄 UI change aanalum Monaco-la update aagum
  const handleFieldChange = (fieldId, newValue) => {
    try {
      const currentJson = JSON.parse(editorValue);
      // Number type-ah iruntha parse panni store panrom
      const processedValue =
        typeof newValue === "string" && !isNaN(newValue) && newValue !== ""
          ? Number(newValue)
          : newValue;
      const updatedJson = { ...currentJson, [fieldId]: processedValue };
      setEditorValue(JSON.stringify(updatedJson, null, 2));
    } catch (error) {
      console.error("Fix JSON to use UI");
    }
  };

  // 🔄 Editor-la irukura string-ah JSON object-ah convert panni sidebar-ku anupuratha useMemo handle pannum
  const currentJsonData = useMemo(() => {
    try {
      return JSON.parse(editorValue);
    } catch (err) {
      return null; // Invalid JSON-ah iruntha null return pannum
    }
  }, [editorValue]);

  // Helper: Date string-ah input format-ku (YYYY-MM-DD) matha
  const formatForInput = (isoString) => {
    if (!isoString) return "";
    return isoString.split("T")[0];
  };

  // Sidebar Date Picker changes handle panna
  const handleSidebarDateChange = (field, dateValue) => {
    try {
      const currentJson = JSON.parse(editorValue);
      const isoDate = new Date(dateValue).toISOString();
      const updatedJson = { ...currentJson, [field]: isoDate };
      setEditorValue(JSON.stringify(updatedJson, null, 2));
    } catch (err) {
      console.error("Invalid JSON in editor, fix it to use sidebar controls.");
    }
  };

  // Edit Button Click - Monaco Editor-ah open pannum
  const handleEditClick = (movie, index) => {
    setEditingMovie(movie);
    setEditingIndex(index);
    setEditorValue(JSON.stringify(movie, null, 2));

    // 🔥 NEW: Reset enabled fields when opening modal
    // By default, if value exists in JSON, keep it enabled.
    const initialEnabledState = {};

    FIELD_CONFIG.forEach((field) => {
      initialEnabledState[field.id] = movie[field.id] !== undefined;
    });
    setEnabledFields(initialEnabledState);

    setIsModalOpen(true);
  };

  // Update Database Click
  const handleSave = () => {
    try {
      if (!editorInstance || !monacoInstance) {
        alert("Editor not ready!");
        return;
      }

      const model = editorInstance.getModel();

      const markers = monacoInstance.editor.getModelMarkers({
        resource: model.uri,
      });

      // ❌ block if ANY warning or error
      if (markers.length > 0) {
        setAlert("error", "Fix all errors before saving!");
        return;
      }
      const updatedMovie = JSON.parse(editorValue);

      // 🔥 RE-VALIDATE THIS MOVIE
      const newErrors = validateMovie(updatedMovie);

      // Main array-la antha specific movie-ah mattum replace panrom

      const updatedList = movies.map((m, i) =>
        i === editingIndex
          ? { ...updatedMovie, __errors: newErrors } // 🔥 IMPORTANT
          : m,
      );
      setMovies(updatedList);
      setIsModalOpen(false);
      setAlert("success", "Movie updated successfully!");
    } catch (err) {
      setAlert("error", "Invalid JSON format!");
    }
  };

  const handleSubmit = () => {
    if (hasErrors) return;
    publishMoviesMutation.mutate(movies);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="p-10 bg-[#0f172a] min-h-screen text-slate-200 font-sans w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-800 rounded-full transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white  uppercase">
                CMS DASHBOARD
              </h1>
              <p className="text-slate-400 mt-1">
                {movies.length} Movies Loaded from JSON
              </p>
            </div>
          </div>
        </div>

        {/* --- MOVIE LIST TABLE --- */}
        <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
          {movies.map((movie, index) => (
            <div
              key={movie.id || index}
              className="bg-[#1e293b] border border-slate-700 p-5 rounded-3xl flex justify-between items-center hover:border-indigo-500 transition-all group"
            >
              <div className="flex items-center gap-4 truncate">
                <div className="h-12 w-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center text-indigo-400 font-bold">
                  {index + 1}
                </div>
                <div className="truncate">
                  <h3 className="text-white truncate tracking-wider  text-md">
                    {movie.title || "No Title"}
                  </h3>
                  {/* 🔥 ERROR DISPLAY */}
                  {movie.__errors?.length > 0 ? (
                    <div className="flex items-center gap-2 mt-1">
                      <AlertTriangle size={14} className="text-red-400" />
                      <span className="text-red-400 text-xs font-semibold tracking-wide">
                        {movie.__errors.length} Issues
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-1">
                      <CheckCircle size={14} className="text-emerald-400" />
                      <span className="text-emerald-400 text-xs font-semibold tracking-wide">
                        All Good
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {/* Action Buttons: Edit & Delete */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditClick(movie, index)}
                  className="p-3 bg-slate-800 cursor-pointer text-indigo-400 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all"
                >
                  <Edit size={18} />
                </button>
                {/* 🔥 NEW: DELETE BUTTON (X ICON) */}
                <button
                  onClick={() => handleDeleteMovie(index, movie.title)}
                  className="p-3 bg-slate-800 cursor-pointer text-slate-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                  title="Delete Movie"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* --- ENTERPRISE MODAL (JSON EDITOR) --- */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 z-50">
            <div className="bg-[#1e293b] w-full max-w-[95%] h-[90vh] flex flex-col rounded-3xl border border-slate-700 shadow-2xl overflow-hidden">
              {/* Modal Header */}
              <div className="px-8 py-5 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-600/30">
                    <Settings size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl  text-white uppercase tracking-wider">
                      Advanced JSON Editor
                    </h2>
                    <p className="text-lg text-indigo-400 ">
                      Editing: {editingMovie?.title}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-slate-500 hover:text-white p-2 transition-colors"
                  >
                    <X size={28} />
                  </button>
                  <div className="h-8 w-[1px] bg-slate-700 mx-2"></div>
                  <button
                    onClick={handleSave}
                    className="bg-emerald-500 uppercase font-semibold hover:bg-emerald-400 text-slate-900 px-8 py-3 rounded-2xl  tracking-widest transition-all flex items-center gap-2 shadow-xl shadow-emerald-500/20"
                  >
                    <Save size={20} /> Update
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex flex-1 overflow-hidden">
                <div className="w-[400px] bg-slate-900/50 p-8 overflow-y-auto border-r border-slate-700 custom-scrollbar">
                  {currentJsonData ? (
                    <Stack spacing={4}>
                      {FIELD_CONFIG.map((field) => {
                        const val = currentJsonData[field.id];
                        const isFieldEnabled = enabledFields[field.id];

                        const ToggleControl = (
                          <Checkbox
                            size="small"
                            sx={{
                              color: "#818cf8",
                              "&.Mui-checked": { color: "#818cf8" },
                            }}
                            checked={!!isFieldEnabled}
                            onChange={(e) =>
                              setEnabledFields((prev) => ({
                                ...prev,
                                [field.id]: e.target.checked,
                              }))
                            }
                          />
                        );

                        // Handling Number and Text types
                        if (field.type === "text" || field.type === "number") {
                          return (
                            <Box key={field.id}>
                              <Typography
                                sx={{
                                  fontSize: "11px",
                                  fontWeight: "400",
                                }}
                                style={{ marginBottom: "10px" }}
                                className="text-indigo-400 font-bold uppercase  mb-3"
                              >
                                {field.label}
                              </Typography>
                              <TextField
                                fullWidth
                                type={field.type}
                                variant="filled"
                                value={val !== undefined ? val : ""}
                                onChange={(e) =>
                                  handleFieldChange(field.id, e.target.value)
                                }
                                sx={{
                                  backgroundColor: "#a7b5d6",
                                  borderRadius: "12px",
                                  input: {
                                    color: "#1e293b",
                                    fontWeight: "bold",
                                  },
                                }}
                              />
                            </Box>
                          );
                        }

                        // 1. BOOLEAN / CHECKBOX TYPE
                        if (field.type === "checkbox") {
                          return (
                            <FormControlLabel
                              key={field.id}
                              control={
                                <Checkbox
                                  sx={{
                                    // 1. Unchecked (Initial) state - Border light-ah theriya
                                    color: "#818cf8 !important", // Indigo-400 (or use "#ffffff" for white)

                                    // 2. Checked state - Tick panna apram vara color
                                    "&.Mui-checked": {
                                      color: "#818cf8 !important",
                                    },

                                    // 3. Icon size konjam adjust panna (Optional)
                                    "& .MuiSvgIcon-root": { fontSize: 24 },
                                  }}
                                  checked={!!val}
                                  onChange={(e) =>
                                    handleFieldChange(
                                      field.id,
                                      e.target.checked,
                                    )
                                  }
                                />
                              }
                              label={
                                <Typography
                                  sx={{
                                    fontSize: "13px",
                                  }}
                                  className="text-slate-300 font-bold uppercase"
                                >
                                  {field.label}
                                </Typography>
                              }
                            />
                          );
                        }

                        // 2. SELECT TYPE (streamType, releaseMode)
                        if (field.type === "select") {
                          return (
                            <FormControl
                              key={field.id}
                              variant="filled"
                              fullWidth
                              className="bg-[#a7b5d6]  rounded-xl overflow-hidden"
                            >
                              <InputLabel
                                sx={{
                                  color: "#0a0b0c !important", // indigo-400 hex code
                                  "&.Mui-focused": {
                                    color: "#282828 !important",
                                  }, // Focus aanaalum intha color-ae irukanum
                                  fontWeight: "bold",
                                  textTransform: "uppercase",
                                  fontSize: "16px",
                                  // paddingBottom: "10px",
                                }}
                                className="text-indigo-400 font-bold uppercase text-xs"
                              >
                                {field.label}
                              </InputLabel>
                              <Select
                                value={val || ""}
                                onChange={(e) =>
                                  handleFieldChange(field.id, e.target.value)
                                }
                                sx={{
                                  fontSize: "13px",
                                }}
                              >
                                {field.options.map((opt) => (
                                  <MenuItem
                                    sx={{
                                      fontSize: "13px",
                                    }}
                                    key={opt}
                                    value={opt}
                                  >
                                    {opt}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          );
                        }

                        // 3. ARRAY / MULTI-SELECT TYPE
                        if (field.type === "array") {
                          return (
                            <Box key={field.id}>
                              <Typography
                                variant="caption"
                                style={{ marginBottom: "5px" }}
                                className="text-indigo-400 font-bold uppercase mb-3 block"
                              >
                                {field.label}
                              </Typography>
                              <Autocomplete
                                multiple
                                options={field.options}
                                value={val || []}
                                onChange={(_, next) =>
                                  handleFieldChange(field.id, next)
                                }
                                renderTags={(value, getTagProps) =>
                                  value.map((option, index) => {
                                    const { key, ...tagProps } = getTagProps({
                                      index,
                                    }); // key-ah thaniya pirichidunga
                                    return (
                                      <Chip
                                        key={key} // key-ah direct-ah pass pannunga
                                        label={option}
                                        {...tagProps} // matha props-ah spread pannunga
                                        size="small"
                                      />
                                    );
                                  })
                                }
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    variant="filled"
                                    className="bg-[#a7b5d6] rounded-xl overflow-hidden"
                                    sx={{ input: { color: "white" } }}
                                  />
                                )}
                              />
                            </Box>
                          );
                        }

                        // 3. DATE / CALENDAR TYPE
                        if (
                          field.type === "controlled-date" ||
                          field.type === "controlled-datetime"
                        ) {
                          const PickerComponent =
                            field.type === "controlled-datetime"
                              ? DateTimePicker
                              : DatePicker;

                          const isEnabled = val !== null && val !== undefined;

                          return (
                            <Box key={field.id}>
                              <Stack
                                direction={"row"}
                                alignItems="center"
                                justifyContent={"space-between"}
                              >
                                <Typography
                                  variant="caption"
                                  style={{ marginBottom: "5px" }}
                                  className="text-indigo-400 font-bold uppercase mb-3 block"
                                >
                                  {field.label}
                                </Typography>
                                {ToggleControl}
                              </Stack>
                              <PickerComponent
                                disabled={!isFieldEnabled}
                                value={
                                  val && dayjs(val).isValid()
                                    ? dayjs(val)
                                    : null
                                }
                                onChange={(date) => {
                                  // If date is null (cleared), set field to null in JSON
                                  if (!date) {
                                    handleFieldChange(field.id, null);
                                    return;
                                  }
                                  // User full-ah date select pannirundha mattum process panna
                                  if (date && dayjs(date).isValid()) {
                                    let formattedValue;
                                    if (field.type === "controlled-datetime") {
                                      formattedValue = date.toISOString();
                                    } else {
                                      formattedValue =
                                        date.format("YYYY-MM-DD");
                                    }

                                    handleFieldChange(field.id, formattedValue);
                                  }
                                }}
                                slotProps={{
                                  textField: {
                                    fullWidth: true,
                                    variant: "filled",
                                    // readOnly: true,
                                    sx: {
                                      backgroundColor: "#a7b5d6",
                                      borderRadius: "12px",
                                      input: { color: "white" },
                                    },
                                    // 🔥 CLEAR BUTTON LOGIC STARTS HERE
                                    InputProps: {
                                      endAdornment: val ? (
                                        <InputAdornment
                                          position="end"
                                          sx={{ marginRight: 2 }}
                                        >
                                          <X
                                            size={18}
                                            className="cursor-pointer  text-slate-600 hover:rounded-full hover:text-red-500 transition-all duration-300"
                                            onClick={(e) => {
                                              e.stopPropagation(); // Picker open aaguratha thaduka
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
                      })}
                    </Stack>
                  ) : (
                    <Paper className="bg-red-500/10 border-red-500/20 p-6 text-center">
                      <Typography color="error">JSON Error</Typography>
                    </Paper>
                  )}
                </div>

                {/* RIGHT SIDE: Monaco Editor */}
                <div className="flex-1 relative">
                  <Editor
                    height="100%"
                    defaultLanguage="json"
                    theme="vs-dark"
                    value={editorValue}
                    path="a://server/movie-editor.json" // Schema 'fileMatch' oda ithu sync aagum
                    beforeMount={handleEditorWillMount}
                    onMount={(editor, monaco) => {
                      setEditorInstance(editor);
                      setMonacoInstance(monaco);
                      // 🔥 initial validation run
                      setTimeout(() => {
                        validateCustomFields(editor, monaco);
                      }, 500);
                    }}
                    onChange={(value) => {
                      setEditorValue(value);
                      setTimeout(() => {
                        validateCustomFields(editorInstance, monacoInstance);
                      }, 300);
                    }}
                    options={{
                      fontSize: 14,
                      fontFamily: "'Fira Code', monospace",
                      minimap: { enabled: false },
                      wordWrap: "on",
                      padding: { top: 20 },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {/* 🔥 FIXED BOTTOM BAR */}
        <div className="fixed bottom-0 left-0 w-full bg-[#0f172a]/95 backdrop-blur-md border-t border-slate-700 px-6 py-4 z-40">
          <div className="max-w-7xl mx-auto flex justify-end">
            <button
              disabled={hasErrors}
              onClick={handleSubmit}
              className={`px-8 py-3 rounded-xl font-bold tracking-wide shadow-lg transition-all ${
                hasErrors
                  ? "bg-gray-500 cursor-not-allowed text-white"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white"
              }`}
            >
              Publish Movies
            </button>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default AdminMovieEditor;
