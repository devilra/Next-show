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

// 1️⃣ Fetch Active Videos (FRONTEND - Public UI)
export const fetchActiveVideos = createAsyncThunk(
  "videoSection/fetchActive",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/home/video-active"); // Route: /api/home/video-active
      return res.data;
    } catch (error) {
      const message = getThunkError(error, "Failed to fetch active videos");
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 2️⃣ Fetch All Videos (ADMIN)
export const fetchAllVideos = createAsyncThunk(
  "videoSection/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/home/video-all"); // Route: /api/home/video-all
      return res.data;
    } catch (error) {
      const message = getThunkError(error, "Failed to fetch all videos");
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 3️⃣ Create Video Section (ADMIN)
export const createVideoSection = createAsyncThunk(
  "videoSection/create",
  async (formData, thunkAPI) => {
    try {
      const res = await api.post("/home/video-create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    } catch (error) {
      const message = getThunkError(error, "Video creation failed");
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 4️⃣ Update Video Section (ADMIN)
export const updateVideoSection = createAsyncThunk(
  "videoSection/update",
  async ({ id, formData }, thunkAPI) => {
    try {
      const res = await api.put(`/home/video-update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    } catch (error) {
      const message = getThunkError(error, "Video update failed");
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 5️⃣ Delete Video Section (ADMIN)
export const deleteVideoSection = createAsyncThunk(
  "videoSection/delete",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/home/video-delete/${id}`);
      return id;
    } catch (error) {
      const message = getThunkError(error, "Video deletion failed");
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/* =====================================================
    SLICE (State Management)
===================================================== */

const videoSectionSlice = createSlice({
  name: "videoSection",
  initialState: {
    // Admin States
    videos: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: "",

    // Frontend States
    activeVideos: [],
    isActiveLoading: false,
    isActiveSuccess: false,
    isActiveError: false,
    activeMessage: "",
  },
  reducers: {
    resetVideoState: (state) => {
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
      /* === FETCH ACTIVE VIDEOS === */
      .addCase(fetchActiveVideos.pending, (state) => {
        state.isActiveLoading = true;
      })
      .addCase(fetchActiveVideos.fulfilled, (state, action) => {
        state.isActiveLoading = false;
        state.isActiveSuccess = true;
        state.activeVideos = action.payload;
      })
      .addCase(fetchActiveVideos.rejected, (state, action) => {
        state.isActiveLoading = false;
        state.isActiveError = true;
        state.activeMessage = action.payload;
      })

      /* === FETCH ALL VIDEOS === */
      .addCase(fetchAllVideos.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllVideos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.videos = action.payload;
      })
      .addCase(fetchAllVideos.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* === CREATE VIDEO === */
      .addCase(createVideoSection.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createVideoSection.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.videos.push(action.payload);
        state.message = "Video created successfully";
      })
      .addCase(createVideoSection.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* === UPDATE VIDEO === */
      .addCase(updateVideoSection.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateVideoSection.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.videos.findIndex((v) => v.id === action.payload.id);
        if (index !== -1) {
          state.videos[index] = action.payload;
        }
        state.message = "Video updated successfully";
      })
      .addCase(updateVideoSection.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* === DELETE VIDEO === */
      .addCase(deleteVideoSection.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteVideoSection.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.videos = state.videos.filter((v) => v.id !== action.payload);
        state.message = "Video deleted successfully";
      })
      .addCase(deleteVideoSection.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetVideoState } = videoSectionSlice.actions;
export default videoSectionSlice.reducer;
