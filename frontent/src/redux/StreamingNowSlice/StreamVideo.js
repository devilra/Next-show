import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

/* =====================================================
    HELPERS
===================================================== */
const getThunkError = (error, defaultMessage) => {
  const message =
    (error.response && error.response.data && error.response.data.message) ||
    error.message ||
    error.toString();

  return message === "Request failed with status code 401"
    ? defaultMessage
    : message;
};

/* =====================================================
    ASYNC THUNKS
===================================================== */

// 1️⃣ Fetch Active Content (UI - Public)
export const fetchActiveStreaming = createAsyncThunk(
  "streamingNow/fetchActive",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/stream/streaming-active");
      // Backend response structure: res.data.data
      return res.data.data;
    } catch (error) {
      const message = getThunkError(error, "Failed to fetch streaming content");
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 2️⃣ Fetch All Content (Admin)
export const fetchAllStreaming = createAsyncThunk(
  "streamingNow/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/stream/streaming-all");
      return res.data.data;
    } catch (error) {
      const message = getThunkError(error, "Failed to fetch all content");
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 3️⃣ Create Content (Admin)
export const createStreamingContent = createAsyncThunk(
  "streamingNow/create",
  async (formData, thunkAPI) => {
    try {
      const res = await api.post("/stream/streaming-create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    } catch (error) {
      const message = getThunkError(error, "Creation failed");
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 4️⃣ Update Content (Admin)
export const updateStreamingContent = createAsyncThunk(
  "streamingNow/update",
  async ({ id, formData }, thunkAPI) => {
    try {
      const res = await api.put(`/stream/streaming-update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    } catch (error) {
      const message = getThunkError(error, "Update failed");
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 5️⃣ Delete Content (Admin)
export const deleteStreamingContent = createAsyncThunk(
  "streamingNow/delete",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/stream/streaming-delete/${id}`);
      return id;
    } catch (error) {
      const message = getThunkError(error, "Deletion failed");
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/* =====================================================
    SLICE
===================================================== */

const streamingNowVideo = createSlice({
  name: "streamingNow",
  initialState: {
    // Admin States
    items: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: "",

    // Frontend States
    activeItems: [],
    isActiveLoading: false,
    isActiveSuccess: false,
    isActiveError: false,
    activeMessage: "",
  },
  reducers: {
    resetStreamingState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
      state.isActiveLoading = false;
      state.isActiveSuccess = false;
      state.isActiveError = false;
      state.activeMessage = "";
    },
  },

  extraReducers: (builder) => {
    builder
      /* --- FETCH ACTIVE --- */
      .addCase(fetchActiveStreaming.pending, (state) => {
        state.isActiveLoading = true;
      })
      .addCase(fetchActiveStreaming.fulfilled, (state, action) => {
        state.isActiveLoading = false;
        state.isActiveSuccess = true;
        state.activeItems = action.payload;
      })
      .addCase(fetchActiveStreaming.rejected, (state, action) => {
        state.isActiveLoading = false;
        state.isActiveError = true;
        state.activeMessage = action.payload;
      })

      /* --- FETCH ALL (Admin) --- */
      .addCase(fetchAllStreaming.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllStreaming.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.items = action.payload;
      })
      .addCase(fetchAllStreaming.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* --- CREATE --- */
      .addCase(createStreamingContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createStreamingContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.items.unshift(action.payload); // புதியதை முதலில் சேர்க்க
        state.message = "Streaming content published successfully";
      })
      .addCase(createStreamingContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* --- UPDATE --- */
      .addCase(updateStreamingContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateStreamingContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.message = "Content updated successfully";
      })
      .addCase(updateStreamingContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* --- DELETE --- */
      .addCase(deleteStreamingContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteStreamingContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.message = "Deleted successfully";
      })
      .addCase(deleteStreamingContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetStreamingState } = streamingNowVideo.actions;
export default streamingNowVideo.reducer;
