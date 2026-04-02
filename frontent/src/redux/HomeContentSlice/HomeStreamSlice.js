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

// 1️⃣ Fetch Active Home Content (UI - Public)
export const fetchActiveHomeStream = createAsyncThunk(
  "homeStreaming/fetchActive",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/home/home-streaming-active");
      return res.data.data;
    } catch (error) {
      const message = getThunkError(
        error,
        "Failed to fetch home streaming content"
      );
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 2️⃣ Fetch All Home Content (Admin)
export const fetchAllHomeStream = createAsyncThunk(
  "homeStreaming/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/home/home-streaming-all");
      return res.data.data;
    } catch (error) {
      const message = getThunkError(error, "Failed to fetch all home content");
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 3️⃣ Create Home Content (Admin)
export const createHomeStreamContent = createAsyncThunk(
  "homeStreaming/create",
  async (formData, thunkAPI) => {
    try {
      const res = await api.post("/home/home-streaming-create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    } catch (error) {
      const message = getThunkError(error, "Creation failed");
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 4️⃣ Update Home Content (Admin)
export const updateHomeStreamContent = createAsyncThunk(
  "homeStreaming/update",
  async ({ id, formData }, thunkAPI) => {
    try {
      const res = await api.put(`/home/home-streaming-update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    } catch (error) {
      const message = getThunkError(error, "Update failed");
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 5️⃣ Delete Home Content (Admin)
export const deleteHomeStreamContent = createAsyncThunk(
  "homeStreaming/delete",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/home/home-streaming-delete/${id}`);
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

const homeStreamSlice = createSlice({
  name: "homeStreaming",
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
    resetHomeStreamState: (state) => {
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
      .addCase(fetchActiveHomeStream.pending, (state) => {
        state.isActiveLoading = true;
      })
      .addCase(fetchActiveHomeStream.fulfilled, (state, action) => {
        state.isActiveLoading = false;
        state.isActiveSuccess = true;
        state.activeItems = action.payload;
      })
      .addCase(fetchActiveHomeStream.rejected, (state, action) => {
        state.isActiveLoading = false;
        state.isActiveError = true;
        state.activeMessage = action.payload;
      })

      /* --- FETCH ALL (Admin) --- */
      .addCase(fetchAllHomeStream.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllHomeStream.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.items = action.payload;
      })
      .addCase(fetchAllHomeStream.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* --- CREATE --- */
      .addCase(createHomeStreamContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createHomeStreamContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.items.unshift(action.payload);
        state.message = "Home streaming content published successfully";
      })
      .addCase(createHomeStreamContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* --- UPDATE --- */
      .addCase(updateHomeStreamContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateHomeStreamContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.message = "Home content updated successfully";
      })
      .addCase(updateHomeStreamContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* --- DELETE --- */
      .addCase(deleteHomeStreamContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteHomeStreamContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.message = "Deleted successfully";
      })
      .addCase(deleteHomeStreamContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetHomeStreamState } = homeStreamSlice.actions;
export default homeStreamSlice.reducer;
