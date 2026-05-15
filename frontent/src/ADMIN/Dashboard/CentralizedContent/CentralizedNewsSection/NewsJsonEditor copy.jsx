import React, { useState, useMemo, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Edit, Save, X, Settings, Info, ArrowLeft } from "lucide-react";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { FaPlus, FaSpinner } from "react-icons/fa";
import makeAnimated from "react-select/animated";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import api from "../../../../api";
import { setGlobalLoading } from "../../../../redux/CentralizedMovieSlice/CentralizedJsonCreateSlice";
import { Trash2 } from "lucide-react"; // Trash2 icon use pannalam or X icon already iruku
import ReactSelect from "react-select";
import {
  CATEGORY_ENUM,
  categoryOptions,
  newsTypeOptions,
} from "./constants/newsSelectOptions";

const animatedComponents = makeAnimated();

const STREAMING_PLATFORMS = [
  {
    id: "aha",
    name: "Aha",
    logo: "/Streaming_logo/Aha.webp",
    className: "w-12 h-12 rounded-lg border object-contain",
  },
  {
    id: "erosnow",
    name: "erosnow",
    logo: "/Streaming_logo/erosnow.webp",
    className: "w-12 h-12 rounded-lg border object-contain",
  },
  {
    id: "hungama",
    name: "Hungama",
    logo: "/Streaming_logo/Hungama.webp",
    className: "w-12 h-12 rounded-lg border object-contain",
  },
  {
    id: "jiohotstar",
    name: "jiohotstar",
    logo: "/Streaming_logo/jiohotstar.jpg",
    className: "w-12 h-12 rounded-lg border object-contain",
  },
  {
    id: "jojotv",
    name: "JojoTV",
    logo: "/Streaming_logo/JojoTV.webp",
    className: "w-12 h-12 rounded-lg border object-contain",
  },
  {
    id: "lionsgateplay",
    name: "LionsgatePlay",
    logo: "/Streaming_logo/LionsgatePlay.webp",
    className: "w-12 h-12 rounded-lg border object-contain",
  },
  {
    id: "mx",
    name: "mx",
    logo: "/Streaming_logo/mx.jpg",
    className: "w-12 h-12 rounded-lg border object-contain",
  },
  {
    id: "netflix",
    name: "netflix",
    logo: "/Streaming_logo/netflix.jpg",
    className: "w-12 h-12 rounded-lg border object-contain",
  },
  {
    id: "playflix",
    name: "playflix",
    logo: "/Streaming_logo/playflix.webp",
    className: "w-12 h-12 rounded-lg border object-contain",
  },
  {
    id: "prime",
    name: "prime",
    logo: "/Streaming_logo/prime.jpg",
    className: "w-12 h-12 rounded-lg border object-contain",
  },
  {
    id: "sony",
    name: "sony",
    logo: "/Streaming_logo/sony.webp",
    className: "w-12 h-12 rounded-lg border object-contain",
  },
  {
    id: "sunnxt",
    name: "sunNxt",
    logo: "/Streaming_logo/sunNxt.jpg",
    className: "w-12 h-12 rounded-lg border object-contain",
  },
  {
    id: "timesplay",
    name: "Timesplay",
    logo: "/Streaming_logo/Timesplay.webp",
    className: "w-12 h-12 rounded-lg border object-contain",
  },
  {
    id: "ultra",
    name: "Ultra",
    logo: "/Streaming_logo/Ultra.webp",
    className: "w-12 h-12 rounded-lg border object-contain",
  },
  {
    id: "z5",
    name: "Z5",
    logo: "/Streaming_logo/Z5.webp",
    className: "w-12 h-12 rounded-lg border object-contain",
  },
];

const NewsJsonEditor = ({
  initialData,
  onBack,
  validateMovie,
  setBulkNewsData,
  setAlert,
  modalOpen,
}) => {
  // 1. Initial Data Setup
  const [movies, setMovies] = useState(
    (initialData || []).map((item) => ({
      ...item,
      __errors: [],
    })),
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [editorValue, setEditorValue] = useState("");
  const [editorInstance, setEditorInstance] = useState(null);
  const [monacoInstance, setMonacoInstance] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [openSelect, setOpenSelect] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);

  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  // 🔥 NEW: Local state to track which fields are enabled/disabled in UI
  // JSON value-kkum ithukkum samantham illai.
  const [enabledFields, setEnabledFields] = useState({});
  const [deletingImagePath, setDeletingImagePath] = useState(null);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [manualImageUrl, setManualImageUrl] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [newTagData, setNewTagData] = useState({
    name: "",
    tagType: "",
    description: "",
    color: "#6366f1",
  });
  // 🔥 1. FETCH ALL CASTS DATA
  const {
    data: castsData,
    isLoading: castsLoading,
    isError: castsError,
  } = useQuery({
    queryKey: ["all-casts"],
    queryFn: async () => {
      const response = await api.get("/admin/all-cast");
      // console.log(response.data);
      return response.data.data;
    },
  });

  const {
    data: allTags = [],
    isLoading: tagsLoading,
    refetch: refetchTags,
  } = useQuery({
    queryKey: ["all-tags"],
    queryFn: async () => {
      const resposne = await api.get("/admin/tags-all");
      return resposne.data.data || [];
    },
  });

  const tagsOptions = allTags.map((tag) => ({
    value: tag.name,
    label: tag.name,
    color: tag.color,
    tagType: tag.tagType,
  }));

  // console.log(editorValue);

  const createTagMutation = useMutation({
    mutationFn: async (tagData) => {
      const response = await api.post("/admin/tag-create", tagData);
      return response.data;
    },
    onSuccess: async (data) => {
      // 🔥 refetch all tags everywhere

      await queryClient.invalidateQueries({
        queryKey: ["all-tags"],
      });

      // 🔥 latest cache fetch

      const latestTags = await queryClient.fetchQuery({
        queryKey: ["all-tags"],
        queryFn: async () => {
          const response = await api.get("/admin/tags-all");

          return response.data.data || [];
        },
        // 🔥 find newly created tag
      });
      const createdTag = latestTags.find((tag) => tag.id === data.data.id);

      // 🔥 auto add into editor
      if (createdTag) {
        const currentJson = JSON.parse(editorValue);
        const updatedTags = [...(currentJson.tags || []), createdTag.name];
        handleFieldChange("tags", updatedTags);
      }
      setAlert("success", "Tag created successfully!");
      setIsTagModalOpen(false);
      setNewTagData({
        name: "",
        tagType: "",
        description: "",
        color: "#6366f1",
      });
    },
    onError: (error) => {
      setAlert(
        "error",
        error?.response?.data?.message || "Failed to create tag",
      );
    },
  });

  // 🔥 1. TANSTACK MUTATION
  const publishNewsMutation = useMutation({
    mutationFn: async (newsData) => {
      const response = await api.post("/admin/create-news", newsData);

      return response.data;
    },

    onSuccess: (data) => {
      // ✅ Refetch News List
      queryClient.invalidateQueries({
        queryKey: ["centralized-news"],
      });

      // ✅ Success Alert
      setAlert("success", data?.message || "News published successfully!");

      // Optional
      // modalOpen(false);
    },

    onError: (error) => {
      console.log(error);

      setAlert(
        "error",
        error?.response?.data?.message ||
          "Something went wrong while publishing news!",
      );
    },
  });

  const uploadNewsImagesMutation = useMutation({
    mutationFn: async ({ files }) => {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("newsImages", file);
      });

      // ======================================================
      // 🔥 EXISTING FOLDER REUSE
      // ======================================================

      try {
        const parsed = JSON.parse(editorValue);

        if (parsed?.imageFolderId) {
          formData.append("imageFolderId", parsed.imageFolderId);
        }
      } catch (err) {}

      const response = await api.post("/admin/upload-news-images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    },

    // ======================================================
    // 🔥 SUCCESS
    // ======================================================

    onSuccess: (data, variables) => {
      const uploadedPaths = data?.data || [];

      try {
        const parsed = JSON.parse(editorValue);

        // ======================================================
        // 🔥 EXISTING SERVER IMAGES
        // ======================================================

        const existingImages = Array.isArray(parsed?.newsImages)
          ? parsed.newsImages
          : [];

        // ======================================================
        // 🔥 MERGE IMAGES
        // ======================================================

        const mergedImages = [
          ...new Set([...existingImages, ...uploadedPaths]),
        ];

        // ======================================================
        // 🔥 AUTO IMAGE FOLDER ID
        // ======================================================

        let existingFolderId = parsed?.imageFolderId || "";

        if (!existingFolderId && uploadedPaths.length > 0) {
          const parts = uploadedPaths[0].split("/");

          existingFolderId = parts[3] || "";
        }

        // ======================================================
        // 🔥 JSON UPDATE
        // ======================================================

        const updatedJson = {
          ...parsed,

          newsImages: mergedImages,

          imageFolderId: existingFolderId,
        };

        setEditorValue(JSON.stringify(updatedJson, null, 2));

        // ======================================================
        // 🔥 REMOVE PREVIEW AFTER SUCCESS
        // ======================================================

        setPreviewImages([]);

        // ======================================================
        // 🔥 SUCCESS ALERT
        // ======================================================

        setAlert("success", data?.message || "Images uploaded successfully!");
      } catch (err) {
        console.log(err);
      }
    },

    // ======================================================
    // 🔥 ERROR
    // ======================================================

    onError: (error) => {
      setPreviewImages([]);

      setAlert(
        "error",
        error?.response?.data?.message || "Image upload failed!",
      );
    },
  });

  const deleteNewsImageMutation = useMutation({
    mutationFn: async (imagePath) => {
      // console.log("Image path", imagepath);
      const response = await api.delete("/admin/delete-news-image", {
        data: {
          imagePath,
        },
      });
      return response.data;
    },
    onSuccess: (_, deletingImagePath) => {
      try {
        const parsed = JSON.parse(editorValue);
        // 🔥 remove deleted image from JSON
        const updatedImages = (parsed.newsImages || []).filter(
          (img) => img !== deletingImagePath,
        );
        const updatedJson = {
          ...parsed,
          newsImages: updatedImages,
        };
        // 🔥 update editor UI instantly
        setEditorValue(JSON.stringify(updatedJson, null, 2));
        setAlert("success", "Image deleted successfully!");
      } catch (err) {
        console.log(err);
      }
      setDeletingImagePath(null);
    },
    onError: (error) => {
      setDeletingImagePath(null);
      console.log(error);
      setAlert(
        "error",
        error?.response?.data?.message || "Failed to delete image!",
      );
    },
  });

  // 🔥 2. SYNC TANSTACK STATE WITH REDUX
  // TanStack-la pending-ah irukum pothu Redux-layum true panni vaikurom
  useEffect(() => {
    dispatch(setGlobalLoading(publishNewsMutation.isPending));
  }, [publishNewsMutation.isPending, dispatch]);

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

  const isExternalImage = (path) => {
    return (
      path.startsWith("http://") ||
      path.startsWith("https://") ||
      path.startsWith("data:image") ||
      path.startsWith("blob:")
    );
  };

  const isUploadedImage = (path) => {
    return !isExternalImage(path);
  };

  const isYoutubeUrl = (url) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const getYoutubeThumbnail = (url) => {
    try {
      let videoId = "";

      if (url.includes("youtube.com/watch?v=")) {
        videoId = new URL(url).searchParams.get("v");
      }

      if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0];
      }

      if (!videoId) return "";

      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    } catch {
      return "";
    }
  };

  // 🔥 CUSTOM VALIDATION FUNCTION
  const validateCustomFields = (editorRef, monacoRef) => {
    const editor = editorRef || editorInstance;
    const monaco = monacoRef || monacoInstance;

    if (!editor || !monaco) return;

    const model = editor.getModel();

    monacoInstance.editor.setModelMarkers(model, "custom", []);
  };

  // 1. DYNAMIC CONFIG: Add as many fields as you want here
  const FIELD_CONFIG = [
    // ======================================================
    // ✅ TITLE
    // ======================================================
    {
      id: "title",
      label: "News Title",
      type: "text",
    },
    {
      id: "shortDescription",
      label: "Short Description",
      type: "textarea",
    },
    {
      id: "longDescription",
      label: "Long Description",
      type: "textarea",
    },
    {
      id: "newsImages",
      label: "News Images",
      type: "file-upload",
    },
    {
      id: "imageFolderId",
      label: "Image Folder ID",
      type: "text",
      disabled: true,
    },
    {
      id: "categories",
      label: "Categories",
      type: "ReactSelect",
      isMulti: true,
      options: categoryOptions,
    },
    {
      id: "newsTypes",
      label: "News Types",
      type: "ReactSelect",
      isMulti: true,
      options: newsTypeOptions,
    },
    // { id: "releaseDate", label: "Release Date", type: "datetime" },
    {
      id: "tags",
      label: "Tags",
      type: "ReactSelect",
      isMulti: true,
      options: tagsOptions,
    },
    {
      id: "isTrending",
      label: "Trending News",
      type: "checkbox",
    },
    {
      id: "status",
      label: "News Status",
      type: "status-tabs",

      options: [
        {
          value: "DRAFT",
          label: "Draft",
        },

        {
          value: "PUBLISHED",
          label: "Published",
        },

        {
          value: "ARCHIVED",
          label: "Archived",
        },
      ],
    },
  ];

  // Editor component kulla intha function-ah add pannunga
  const handleEditorWillMount = (monaco) => {
    const modelUri = monaco.Uri.parse("a://server/movie-editor.json"); // Unique URI for this model

    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      allowComments: false,
      enableSchemaRequest: false,
      // schemaValidation: "error", // 🔥 force enum errors

      schemas: [
        {
          uri: "http://myserver/movie-schema.json",
          fileMatch: ["a://server/movie-editor.json"], // Intha model-ku mattum schema link panrom
          schema: {
            type: "object",
            additionalProperties: true,
            required: [
              "title",
              "shortDescription",
              "longDescription",
              "newsImages",
              "categories",
              "newsTypes",
              "tags",
            ],
            properties: {
              // ======================================================
              // ✅ BASIC
              // ======================================================

              title: {
                type: "string",
                minLength: 10,
              },

              shortDescription: {
                type: "string",
                // minLength: 100,
              },

              longDescription: {
                type: "string",
                // minLength: 100,
              },

              authorName: {
                type: "string",
              },

              // ======================================================
              // ✅ ARRAYS
              // ======================================================

              newsImages: {
                type: "array",

                items: {
                  type: "string",
                },
              },

              videoUrl: {
                type: "array",

                items: {
                  type: "string",
                },
              },

              categories: {
                type: "array",

                items: {
                  type: "string",
                },
              },

              newsTypes: {
                type: "array",

                items: {
                  type: "string",
                },
              },

              tags: {
                type: "array",

                items: {
                  type: "string",
                },
              },
              isTrending: {
                type: "boolean",
              },

              status: {
                type: "string",

                enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
              },
              // ======================================================
              // ✅ ADDITIONAL FIELDS
              // ======================================================
              additionalFields: {
                type: "object",

                // 🔥 STRICT CHECK ILLAI
                additionalProperties: true,
              },
              // ======================================================
              // ✅ ERRORS
              // ======================================================

              __errors: {
                type: "array",

                items: {
                  type: "string",
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
            label: "true",

            kind: monaco.languages.CompletionItemKind.Keyword,

            insertText: "true",
          },

          {
            label: "false",

            kind: monaco.languages.CompletionItemKind.Keyword,

            insertText: "false",
          },

          {
            label: "status",

            kind: monaco.languages.CompletionItemKind.Property,

            insertText: `"status": "$1"`,

            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },

          {
            label: "newsImages",

            kind: monaco.languages.CompletionItemKind.Property,

            insertText: `"newsImages": []`,
          },

          {
            label: "videoUrl",

            kind: monaco.languages.CompletionItemKind.Property,

            insertText: `"videoUrl": []`,
          },

          {
            label: "categories",

            kind: monaco.languages.CompletionItemKind.Property,

            insertText: `"categories": []`,
          },

          {
            label: "newsTypes",

            kind: monaco.languages.CompletionItemKind.Property,

            insertText: `"newsTypes": []`,
          },

          {
            label: "tags",

            kind: monaco.languages.CompletionItemKind.Property,

            insertText: `"tags": []`,
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
      // const updatedJson = { ...currentJson, [fieldId]: processedValue };

      // ======================================================
      // 🔥 START WITH EXISTING JSON
      // ======================================================
      let updatedJson = { ...currentJson };

      // ======================================================
      // ✅ CHECKBOX LOGIC
      // ======================================================
      if (fieldId === "isTrending") {
        if (processedValue === true) {
          updatedJson.isTrending = true;
        } else {
          delete updatedJson.isTrending;
        }
      }

      // ======================================================
      // ✅ STATUS TOGGLE LOGIC
      // ======================================================
      else if (fieldId === "status") {
        // same status click pannuna remove
        if (currentJson.status === processedValue) {
          delete updatedJson.status;
        } else {
          updatedJson.status = processedValue;
        }
      }
      // ======================================================
      // ✅ DEFAULT FIELD UPDATE
      // ======================================================
      else {
        updatedJson[fieldId] = processedValue;
      }
      // ======================================================
      // 🔥 UPDATE EDITOR
      // ======================================================

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

      // 🔥 ONLY ERROR MARKERS
      const realErrors = markers.filter(
        (marker) => marker.severity === monacoInstance.MarkerSeverity.Error,
      );

      if (realErrors.length > 0) {
        setAlert("error", "Fix all JSON errors before saving!");
        return;
      }

      const updatedMovie = JSON.parse(editorValue);

      // 🔥 REMOVE OLD VALIDATION
      const newErrors = [];

      const updatedList = movies.map((m, i) =>
        i === editingIndex
          ? {
              ...updatedMovie,
              __errors: newErrors,
            }
          : m,
      );

      setMovies(updatedList);

      setIsModalOpen(false);

      setAlert("success", "News updated successfully!");
    } catch (err) {
      setAlert("error", "Invalid JSON format!");
    }
  };

  const handleNewsImageUpload = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    // ======================================================
    // 🔥 LOCAL PREVIEW ONLY
    // ======================================================

    const localPreviewImages = files.map((file) => ({
      id: crypto.randomUUID(),
      preview: URL.createObjectURL(file),
    }));

    // preview show
    setPreviewImages((prev) => [...prev, ...localPreviewImages]);

    // ======================================================
    // 🔥 API UPLOAD
    // ======================================================

    uploadNewsImagesMutation.mutate({
      files,
      previewIds: localPreviewImages.map((img) => img.id),
    });

    // reset input
    e.target.value = "";
  };

  const handleSubmit = () => {
    if (hasErrors) return;
    publishNewsMutation.mutate(movies);
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#0f172a", // dark bg
      borderColor: state.isFocused ? "#6366f1" : "#334155",
      boxShadow: "none",
      borderRadius: "14px",
      padding: "6px",
      minHeight: "50px",
      "&:hover": {
        borderColor: "#6366f1",
      },
    }),

    menu: (base) => ({
      ...base,
      backgroundColor: "#020617",
      borderRadius: "12px",
      overflow: "hidden",
      border: "1px solid #1e293b",
      zIndex: 9999,
    }),

    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? "#1e293b"
        : state.isSelected
          ? "#6366f1"
          : "transparent",
      color: state.isSelected ? "#fff" : "#cbd5f5",
      padding: "10px 14px",
      cursor: "pointer",
    }),

    multiValue: (base) => ({
      ...base,

      backgroundColor: "#6366f1",
      borderRadius: "8px",
      padding: "2px 6px",
      fontSize: "12px",
    }),

    multiValueLabel: (base) => ({
      ...base,
      color: "#fff",
      fontWeight: "600",
    }),

    multiValueRemove: (base) => ({
      ...base,
      color: "#fff",
      cursor: "pointer",
      ":hover": {
        backgroundColor: "none",
        color: "#fff",
      },
    }),

    placeholder: (base) => ({
      ...base,
      color: "#64748b",
    }),

    input: (base) => ({
      ...base,
      color: "#fff",
    }),

    singleValue: (base) => ({
      ...base,
      color: "#fff",
    }),
  };

  useEffect(() => {
    try {
      const parsed = JSON.parse(editorValue);

      const cast = parsed.cast || [];
      const existingDetails = parsed.castDetails || [];

      // 🔥 castsData இல்லனா skip (API load ஆகணும்)
      if (!castsData || castsData.length === 0) return;

      // 🔥 map name → id
      const updatedCastDetails = cast
        .map((name) => {
          const foundCast = castsData.find((c) => c.label === name);

          if (!foundCast) return null;

          const existing = existingDetails.find(
            (c) => c.castId === foundCast.value,
          );

          return (
            existing || {
              castId: foundCast.value,
              characterName: "",
              roleCategory: "",
              isLeadRole: false,
            }
          );
        })
        .filter(Boolean);

      // 🔥 compare panna (infinite loop avoid)
      const isSame =
        JSON.stringify(existingDetails) === JSON.stringify(updatedCastDetails);

      if (!isSame) {
        const updatedJson = {
          ...parsed,
          castDetails: updatedCastDetails,
        };

        setEditorValue(JSON.stringify(updatedJson, null, 2));
      }
    } catch (err) {
      // invalid JSON ignore
    }
  }, [editorValue, castsData]);

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
                {movies.length} News Loaded from JSON
              </p>
            </div>
          </div>
        </div>

        {/* --- MOVIE LIST TABLE --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 pb-14 gap-6">
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
                  <h3 className="text-white truncate w-[200px] tracking-wider  text-md">
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
                    {/* 🔥 MARQUEE CONTAINER */}
                    <div className="relative overflow-hidden w-[420px] mt-1">
                      <div className="news-marquee whitespace-nowrap text-lg text-indigo-400">
                        <span className="inline-block pr-16">
                          Editing: {editingMovie?.title}
                        </span>

                        {/* 🔥 DUPLICATE FOR SMOOTH LOOP */}
                        <span className="inline-block pr-16">
                          Editing: {editingMovie?.title}
                        </span>
                      </div>
                    </div>
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

                        const renderLabel = () => (
                          <Typography
                            sx={{
                              fontSize: "11px",
                              fontWeight: "700",
                              mb: 1.2,
                              letterSpacing: "0.5px",
                            }}
                            className="text-indigo-400 uppercase"
                          >
                            {field.label}
                          </Typography>
                        );

                        // =========================================================
                        // ✅ TEXT / TEXTAREA / NUMBER
                        // =========================================================
                        if (
                          field.type === "text" ||
                          field.type === "number" ||
                          field.type === "textarea"
                        ) {
                          return (
                            <Box key={field.id}>
                              {renderLabel()}
                              <TextField
                                fullWidth
                                multiline={field.type === "textarea"}
                                rows={field.rows || 2}
                                type={
                                  field.type === "number" ? "number" : "text"
                                }
                                variant="filled"
                                value={val ?? ""}
                                placeholder={field.placeholder || ""}
                                onChange={(e) =>
                                  handleFieldChange(field.id, e.target.value)
                                }
                                sx={{
                                  "& .MuiFilledInput-root": {
                                    backgroundColor: "#cbd5e1",
                                    borderRadius: "16px",
                                    overflow: "hidden",

                                    "&:hover": {
                                      backgroundColor: "#dbe4f0",
                                    },

                                    "&.Mui-focused": {
                                      backgroundColor: "#e2e8f0",
                                    },

                                    "&:before": {
                                      borderBottom: "none",
                                    },

                                    "&:after": {
                                      borderBottom: "none",
                                    },
                                  },

                                  "& .MuiFilledInput-input": {
                                    color: "#0f172a",
                                    fontWeight: 600,
                                    fontSize: "14px",
                                    padding: "16px",
                                  },

                                  "& textarea": {
                                    color: "#0f172a",
                                    fontWeight: 600,
                                    fontSize: "14px",
                                  },
                                }}
                              />
                            </Box>
                          );
                        }

                        {
                          /* Multi-Select Field - Always Visible */
                        }

                        if (field.type === "ReactSelect") {
                          return (
                            <Box key={field.id}>
                              {renderLabel()}
                              <ReactSelect
                                isMulti={field.isMulti}
                                isLoading={castsLoading}
                                components={
                                  field.id === "tags"
                                    ? {
                                        ...animatedComponents,

                                        MenuList: (props) => {
                                          const filteredOptions =
                                            props.selectProps.options?.filter(
                                              (option) =>
                                                option.label
                                                  .toLowerCase()
                                                  .includes(
                                                    newTagName.toLowerCase(),
                                                  ),
                                            ) || [];

                                          const showAddButton =
                                            newTagName.trim() &&
                                            filteredOptions.length === 0;

                                          return (
                                            <div>
                                              {props.children}

                                              {showAddButton && (
                                                <div
                                                  className="
            px-4
            py-3
            text-indigo-400
            cursor-pointer
            hover:bg-slate-800
            font-semibold
            border-t
            border-slate-700
            flex
            items-center
            gap-2
          "
                                                  onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();

                                                    setNewTagData((prev) => ({
                                                      ...prev,
                                                      name: newTagName,
                                                    }));

                                                    setIsTagModalOpen(true);
                                                  }}
                                                >
                                                  <FaPlus />
                                                  Add "{newTagName}" Tag
                                                </div>
                                              )}
                                            </div>
                                          );
                                        },
                                      }
                                    : animatedComponents
                                }
                                closeMenuOnSelect={!field.isMulti}
                                noOptionsMessage={({ inputValue }) => {
                                  if (field.id !== "tags") {
                                    return "No Options";
                                  }

                                  return inputValue
                                    ? `No matching tag found`
                                    : "Type to search tags";
                                }}
                                options={field.options || []}
                                styles={customStyles}
                                value={
                                  field.options?.filter((opt) =>
                                    Array.isArray(val)
                                      ? val.includes(opt.value)
                                      : opt.value === val,
                                  ) || []
                                }
                                placeholder={`Select ${field.label}`}
                                onInputChange={(value) => {
                                  setNewTagName(value);
                                }}
                                classNamePrefix="react-select"
                                // onChange={(selected) => {
                                //   const values = selected
                                //     ? selected.map((s) => s.label)
                                //     : [];
                                //   handleFieldChange("cast", values);
                                //   // Inga unga state update logic (e.g., formik.setFieldValue) add pannikalam
                                // }}

                                // onChange={(selected) => {
                                //   const selectedList = selected || [];
                                //   try {
                                //     setEditorValue((prev) => {
                                //       const currentJson = JSON.parse(prev);

                                //       // ✅ cast பெயர்கள்

                                //       const castNames = selectedList.map(
                                //         (s) => s.label,
                                //       );

                                //       // ✅ existing castDetails preserve pannum

                                //       const existing =
                                //         currentJson.castDetails || [];

                                //       // ✅ புதிய castDetails உருவாக்கம்

                                //       const castDetails = selectedList.map(
                                //         (s) => {
                                //           const found = existing.find(
                                //             (c) => c.castId === s.value,
                                //           );
                                //           return (
                                //             found || {
                                //               castId: s.value,
                                //               characterName: "",
                                //               roleCategory: "",
                                //               isLeadRole: false,
                                //             }
                                //           );
                                //         },
                                //       );
                                //       const updatedJson = {
                                //         ...currentJson,
                                //         cast: castNames,
                                //         castDetails: castDetails,
                                //       };
                                //       return JSON.stringify(
                                //         updatedJson,
                                //         null,
                                //         2,
                                //       );
                                //     });
                                //   } catch (error) {
                                //     console.error("Invalid JSON");
                                //   }
                                // }}
                                onChange={(selected) => {
                                  if (field.isMulti) {
                                    const values = selected
                                      ? selected.map((item) => item.value)
                                      : [];

                                    handleFieldChange(field.id, values);
                                  } else {
                                    handleFieldChange(
                                      field.id,
                                      selected?.value || "",
                                    );
                                  }
                                }}
                              />
                            </Box>
                          );
                        }

                        // =========================================================
                        // ✅ STATUS TABS
                        // =========================================================

                        if (field.type === "status-tabs") {
                          return (
                            <Box key={field.id}>
                              {renderLabel()}

                              <div className="grid grid-cols-3 gap-3">
                                {field.options.map((status) => {
                                  const active =
                                    currentJsonData?.status === status.value;

                                  return (
                                    <button
                                      key={status.value}
                                      type="button"
                                      onClick={() =>
                                        handleFieldChange(
                                          field.id,
                                          status.value,
                                        )
                                      }
                                      className={`
                        h-[48px]
                        rounded-2xl
                        text-xs
                        font-bold
                        tracking-wide
                        transition-all
                        border

                        ${
                          active
                            ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                            : "bg-slate-800 border-slate-700 text-slate-300 hover:border-indigo-500"
                        }
                      `}
                                    >
                                      {status.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </Box>
                          );
                        }

                        // =========================================================
                        // ✅ CHECKBOX
                        // =========================================================

                        if (field.type === "checkbox") {
                          return (
                            <div
                              key={field.id}
                              className="
                bg-slate-800/70
                border
                border-slate-700
                rounded-2xl
                px-4
                py-3
                flex
                items-center
                justify-between
              "
                            >
                              <div>
                                <h4 className="text-white text-sm font-semibold">
                                  {field.label}
                                </h4>

                                <p className="text-slate-400 text-xs mt-1">
                                  Enable this option
                                </p>
                              </div>

                              <Checkbox
                                checked={!!val}
                                onChange={(e) =>
                                  handleFieldChange(field.id, e.target.checked)
                                }
                                sx={{
                                  color: "#818cf8",

                                  "&.Mui-checked": {
                                    color: "#818cf8",
                                  },

                                  "& .MuiSvgIcon-root": {
                                    fontSize: 28,
                                  },
                                }}
                              />
                            </div>
                          );
                        }

                        // =========================================================
                        // ✅ IMAGE ARRAY
                        // =========================================================

                        if (field.type === "file-upload") {
                          return (
                            <Box key={field.id}>
                              {renderLabel()}

                              {/* HIDDEN INPUT */}
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleNewsImageUpload}
                              />

                              <div
                                className={`
                                            relative
                                            min-h-[260px]
                                            rounded-3xl
                                            border-2
                                            border-dashed
                                            border-slate-700
                                            bg-[#0f172a]
                                            p-5
                                            transition-all
                                            overflow-hidden

          ${uploadNewsImagesMutation.isPending || deleteNewsImageMutation.isPending ? "opacity-60 pointer-events-none" : ""}
        `}
                              >
                                {/* ===================================================== */}
                                {/* 🔥 FULL CONTAINER LOADING OVERLAY */}
                                {/* ===================================================== */}

                                {(uploadNewsImagesMutation.isPending ||
                                  deleteNewsImageMutation.isPending) && (
                                  <div
                                    className="
                                      absolute
                                      inset-0
                                      z-30
                                      bg-slate-950/70
                                      backdrop-blur-sm
                                      flex
                                      items-center
                                      justify-center
                                    "
                                  >
                                    <div className="flex flex-col items-center gap-4">
                                      <FaSpinner className="animate-spin text-4xl text-indigo-400" />

                                      <p
                                        className="
                  text-indigo-300
                  font-bold
                  tracking-widest
                  animate-pulse
                  text-lg
                "
                                      >
                                        {deleteNewsImageMutation.isPending
                                          ? "Deleting Image..."
                                          : "Uploading Images..."}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {/* ===================================================== */}
                                {/* 🔥 TOP SECTION */}
                                {/* ===================================================== */}

                                <div className="flex items-center justify-between mb-5">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      fileInputRef.current?.click()
                                    }
                                    className="
              bg-indigo-600
              hover:bg-indigo-500
              active:scale-[0.98]
              transition-all
              px-6
              py-3
              rounded-2xl
              text-white
              font-bold
              tracking-wide
              shadow-lg
              shadow-indigo-500/30
            "
                                  >
                                    Click To Upload
                                  </button>

                                  <div className="text-right">
                                    <p className="text-slate-400 text-xs uppercase tracking-wider">
                                      Max 10 Images
                                    </p>

                                    <p className="text-slate-500 text-[11px] mt-1">
                                      JPG • PNG • WEBP
                                    </p>
                                  </div>
                                </div>

                                {/* ===================================================== */}
                                {/* 🔥 EMPTY STATE */}
                                {/* ===================================================== */}

                                {!previewImages.length &&
                                !(val && val.length > 0) ? (
                                  <div
                                    className="
              h-[140px]
              flex
              flex-col
              items-center
              justify-center
              text-center
            "
                                  >
                                    <p className="text-slate-400 text-lg font-semibold">
                                      No Images Uploaded
                                    </p>

                                    <p className="text-slate-500 text-sm mt-2">
                                      Upload news thumbnails or gallery images
                                    </p>
                                  </div>
                                ) : (
                                  <div
                                    className="
              flex
              flex-wrap
              gap-4
              items-start
            "
                                  >
                                    {/* ===================================================== */}
                                    {/* 🔥 PREVIEW IMAGES */}
                                    {/* ===================================================== */}

                                    {previewImages.map((img, index) => (
                                      <div
                                        key={img.id || index}
                                        className="
                  relative
                  w-[95px]
                  h-[95px]
                  rounded-2xl
                  overflow-hidden
                  border
                  border-slate-700
                  bg-slate-800
                  shadow-lg
                  group
                "
                                      >
                                        <img
                                          src={img.preview}
                                          alt=""
                                          className="
                    w-full
                    h-full
                    object-cover
                  "
                                        />

                                        {/* 🔥 individual upload loading */}
                                        {img.isUploading && (
                                          <div
                                            className="
                                                    absolute
                                                    inset-0
                                                    bg-black/60
                                                    flex
                                                    items-center
                                                    justify-center
                                                  "
                                          >
                                            <FaSpinner className="animate-spin text-white text-xl" />
                                          </div>
                                        )}
                                      </div>
                                    ))}

                                    {/* ===================================================== */}
                                    {/* 🔥 SERVER IMAGES */}
                                    {/* ===================================================== */}

                                    {(val || [])
                                      .filter((img) => isUploadedImage(img))
                                      .map((img, index) => (
                                        <div
                                          key={index}
                                          className="
                                            relative
                                            w-[60px]
                                            h-[60px]
                                            rounded-xl
                                            overflow-hidden
                                            border
                                            border-slate-700
                                            bg-slate-800
                                            shadow-lg
                                            group
                                          "
                                        >
                                          <img
                                            src={`${import.meta.env.VITE_IMAGE_BASE_URL}${img}`}
                                            alt=""
                                            className="
                    w-[60px]
                    h-[60px]
                    object-cover
                  "
                                          />

                                          {/* ===================================================== */}
                                          {/* 🔥 DELETE BUTTON */}
                                          {/* ===================================================== */}

                                          <button
                                            type="button"
                                            onClick={() => {
                                              setDeletingImagePath(img);
                                              deleteNewsImageMutation.mutate(
                                                img,
                                              );
                                            }}
                                            className="
                    absolute
                    -top-1
                    -right-1
                    bg-red-500
                    hover:bg-red-600
                    text-white
                    rounded-full
                    p-1.5
                    transition-all
                    shadow-lg
                  "
                                          >
                                            {deletingImagePath === img ? (
                                              <FaSpinner className="animate-spin text-[10px]" />
                                            ) : (
                                              <Trash2 size={12} />
                                            )}
                                          </button>
                                        </div>
                                      ))}
                                  </div>
                                )}
                              </div>

                              {/* ===================================================== */}
                              {/* 🔥 EXTERNAL IMAGE URL TEXTAREA */}
                              {/* ===================================================== */}

                              <div className="mb-3 mt-5">
                                {/* LABEL */}
                                <div className="mb-3">
                                  <p className="text-indigo-400 uppercase text-[12px] font-semibold tracking-wide">
                                    External Image URLs
                                  </p>
                                </div>

                                {/* TEXTAREA */}
                                <textarea
                                  value={manualImageUrl}
                                  disabled={uploadNewsImagesMutation.isPending}
                                  // onChange={(e) => {
                                  //   const value = e.target.value;

                                  //   // ======================================================
                                  //   // ✅ AUTO COMMA ADD
                                  //   // ======================================================

                                  //   const formattedValue = value
                                  //     .split("\n")
                                  //     .map((line) => {
                                  //       const trimmed = line.trim();

                                  //       // empty line skip
                                  //       if (!trimmed) return "";

                                  //       // already comma iruntha duplicate add panna venda
                                  //       if (trimmed.endsWith(",")) {
                                  //         return trimmed;
                                  //       }

                                  //       // auto comma add
                                  //       return `${trimmed},`;
                                  //     })
                                  //     .join("\n");

                                  //   setManualImageUrl(formattedValue);
                                  // }}
                                  onChange={(e) => {
                                    setManualImageUrl(e.target.value);
                                  }}
                                  onPaste={(e) => {
                                    e.preventDefault();

                                    // ======================================================
                                    // ✅ GET PASTED URL
                                    // ======================================================

                                    const pastedText = e.clipboardData
                                      .getData("text")
                                      .trim();

                                    if (!pastedText) return;

                                    // ======================================================
                                    // ✅ AUTO COMMA + NEW LINE
                                    // ======================================================

                                    setManualImageUrl((prev) => {
                                      const cleanedPrev = prev.trim();

                                      // first url
                                      if (!cleanedPrev) {
                                        return `${pastedText},\n`;
                                      }

                                      // next urls
                                      return `${cleanedPrev}\n${pastedText},\n`;
                                    });
                                  }}
                                  placeholder={`https://example.com/image1.jpg`}
                                  rows={5}
                                  className="
      w-full
      rounded-2xl
      bg-slate-800
      border
      border-slate-700
      px-4
      py-4
      text-white
      text-sm
      outline-none
      resize-none
      transition-all
      focus:border-indigo-500
      focus:ring-2
      focus:ring-indigo-500/20
    "
                                />

                                {/* BUTTON */}
                                <button
                                  type="button"
                                  disabled={
                                    uploadNewsImagesMutation.isPending ||
                                    !manualImageUrl.trim()
                                  }
                                  onClick={() => {
                                    if (!manualImageUrl.trim()) return;

                                    try {
                                      const parsed = JSON.parse(editorValue);

                                      // ======================================================
                                      // ✅ EXISTING IMAGES
                                      // ======================================================

                                      const existingImages = Array.isArray(
                                        parsed.newsImages,
                                      )
                                        ? parsed.newsImages
                                        : [];

                                      // ======================================================
                                      // ✅ SPLIT MULTIPLE URLS
                                      // ======================================================

                                      const urls = manualImageUrl
                                        .split("\n")
                                        .map((url) => {
                                          // ======================================================
                                          // ✅ REMOVE LAST DISPLAY COMMA ONLY
                                          // ======================================================

                                          let cleaned = url.trim();

                                          // only ending comma remove
                                          if (cleaned.endsWith(",")) {
                                            cleaned = cleaned.slice(0, -1);
                                          }

                                          return cleaned.trim();
                                        })
                                        .filter(Boolean);

                                      // ======================================================
                                      // ✅ REMOVE DUPLICATES
                                      // ======================================================

                                      const updatedImages = [
                                        ...new Set([
                                          ...existingImages,
                                          ...urls,
                                        ]),
                                      ];

                                      // ======================================================
                                      // ✅ UPDATE JSON
                                      // ======================================================

                                      const updatedJson = {
                                        ...parsed,
                                        newsImages: updatedImages,
                                      };

                                      setEditorValue(
                                        JSON.stringify(updatedJson, null, 2),
                                      );

                                      // ======================================================
                                      // ✅ CLEAR TEXTAREA
                                      // ======================================================

                                      setManualImageUrl("");

                                      setAlert(
                                        "success",
                                        "External images added successfully!",
                                      );
                                    } catch (err) {
                                      setAlert("error", "Invalid JSON");
                                    }
                                  }}
                                  className="
                                        mt-3
                                        w-full
                                        h-12
                                        rounded-2xl
                                        bg-indigo-600
                                        hover:bg-indigo-500
                                        text-white
                                        font-bold
                                        tracking-wide
                                        transition-all
                                        shadow-lg
                                        shadow-indigo-500/20
                                        disabled:opacity-50
                                      disabled:cursor-not-allowed
                                      disabled:hover:bg-indigo-600
                                      "
                                >
                                  Add External Images
                                </button>
                              </div>
                            </Box>
                          );
                        }

                        {
                          /* 🔥 EXTERNAL IMAGE URL INPUT */
                        }
                        {
                          /* ===================================================== */
                        }
                      })}
                    </Stack>
                  ) : (
                    <Paper className="bg-red-500/10 border-red-500/20 p-6 text-center">
                      <Typography color="error">JSON Error</Typography>
                    </Paper>
                  )}
                </div>

                {isTagModalOpen && (
                  <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 w-full max-w-md rounded-3xl p-6 border border-slate-700 shadow-2xl">
                      <h2 className="text-2xl font-bold text-white mb-6">
                        Create New Tag
                      </h2>

                      <div className="space-y-4">
                        {/* TAG NAME */}
                        <input
                          type="text"
                          value={newTagData.name}
                          onChange={(e) =>
                            setNewTagData({
                              ...newTagData,
                              name: e.target.value,
                            })
                          }
                          placeholder="Tag Name"
                          className="
                                      w-full
                                      h-12
                                      rounded-xl
                                      bg-slate-800
                                      border
                                      border-slate-700
                                      px-4
                                      text-white
                                      outline-none
                                    "
                        />

                        {/* TAG TYPE */}
                        <input
                          type="text"
                          value={newTagData.tagType}
                          onChange={(e) =>
                            setNewTagData({
                              ...newTagData,
                              tagType: e.target.value,
                            })
                          }
                          placeholder="Tag Type"
                          className="
                                      w-full
                                      h-12
                                      rounded-xl
                                      bg-slate-800
                                      border
                                      border-slate-700
                                      px-4
                                      text-white
                                      outline-none
                                    "
                        />

                        {/* DESCRIPTION */}
                        <textarea
                          value={newTagData.description}
                          onChange={(e) =>
                            setNewTagData({
                              ...newTagData,
                              description: e.target.value,
                            })
                          }
                          placeholder="Description"
                          rows={4}
                          className="
                                      w-full
                                      rounded-xl
                                      bg-slate-800
                                      border
                                      border-slate-700
                                      px-4
                                      py-3
                                      text-white
                                      outline-none
                                      resize-none
                                    "
                        />

                        {/* COLOR */}
                        <div>
                          <p className="text-slate-400 text-sm mb-2">
                            Tag Color
                          </p>

                          <input
                            type="color"
                            value={newTagData.color}
                            onChange={(e) =>
                              setNewTagData({
                                ...newTagData,
                                color: e.target.value,
                              })
                            }
                            className="
                                        w-full
                                        h-12
                                        rounded-xl
                                        bg-slate-800
                                        border
                                        border-slate-700
                                        cursor-pointer
                                      "
                          />
                        </div>
                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="flex justify-end gap-3 mt-6">
                        <button
                          type="button"
                          onClick={() => setIsTagModalOpen(false)}
                          className="
                                        px-5
                                        py-3
                                        rounded-xl
                                        bg-slate-700
                                        hover:bg-slate-600
                                        text-white
                                        transition-all
                                      "
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          disabled={createTagMutation.isPending}
                          onClick={() => createTagMutation.mutate(newTagData)}
                          className="
                                          px-5
                                          py-3
                                          rounded-xl
                                          bg-indigo-600
                                          hover:bg-indigo-500
                                          disabled:opacity-50
                                          text-white
                                          font-bold
                                          transition-all
                                          flex
                                          items-center
                                          gap-2
                                        "
                        >
                          {createTagMutation.isPending ? (
                            <>
                              <FaSpinner className="animate-spin" />
                              Creating...
                            </>
                          ) : (
                            "Create Tag"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

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

export default NewsJsonEditor;
