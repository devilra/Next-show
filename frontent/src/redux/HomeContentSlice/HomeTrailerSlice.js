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

// 1️⃣ Fetch Active Home Trailers (UI - Public)
export const fetchActiveHomeTrailers = createAsyncThunk(
  "homeTrailers/fetchActive",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/home/home-trailers-active");
      return res.data.data;
    } catch (error) {
      const message = getThunkError(error, "Failed to fetch active trailers");
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 2️⃣ Fetch All Home Trailers (Admin)
export const fetchAllHomeTrailers = createAsyncThunk(
  "homeTrailers/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/home/home-trailers-all");
      return res.data.data;
    } catch (error) {
      const message = getThunkError(error, "Failed to fetch all trailers");
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 3️⃣ Create Home Trailer Content (Admin)
export const createHomeTrailerContent = createAsyncThunk(
  "homeTrailers/create",
  async (formData, thunkAPI) => {
    try {
      const res = await api.post("/home/home-trailers-create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    } catch (error) {
      const message = getThunkError(error, "Trailer creation failed");
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 4️⃣ Update Home Trailer Content (Admin)
export const updateHomeTrailerContent = createAsyncThunk(
  "homeTrailers/update",
  async ({ id, formData }, thunkAPI) => {
    try {
      const res = await api.put(`/home/home-trailers-update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    } catch (error) {
      const message = getThunkError(error, "Trailer update failed");
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 5️⃣ Delete Home Trailer Content (Admin)
export const deleteHomeTrailerContent = createAsyncThunk(
  "homeTrailers/delete",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/home/home-trailers-delete/${id}`);
      return id;
    } catch (error) {
      const message = getThunkError(error, "Trailer deletion failed");
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/* =====================================================
    SLICE
===================================================== */

const homeTrailerSlice = createSlice({
  name: "homeTrailers",
  initialState: {
    // Admin States
    items: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: "",

    // Frontend States
    activeHomeTrailers: [],
    isActiveLoading: false,
    isActiveSuccess: false,
    isActiveError: false,
    activeMessage: "",
  },
  reducers: {
    resetHomeTrailerState: (state) => {
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
      .addCase(fetchActiveHomeTrailers.pending, (state) => {
        state.isActiveLoading = true;
      })
      .addCase(fetchActiveHomeTrailers.fulfilled, (state, action) => {
        state.isActiveLoading = false;
        state.isActiveSuccess = true;
        state.activeHomeTrailers = action.payload;
      })
      .addCase(fetchActiveHomeTrailers.rejected, (state, action) => {
        state.isActiveLoading = false;
        state.isActiveError = true;
        state.activeMessage = action.payload;
      })

      /* --- FETCH ALL (Admin) --- */
      .addCase(fetchAllHomeTrailers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllHomeTrailers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.items = action.payload;
      })
      .addCase(fetchAllHomeTrailers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* --- CREATE --- */
      .addCase(createHomeTrailerContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createHomeTrailerContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.items.unshift(action.payload);
        state.message = "Trailer published successfully";
      })
      .addCase(createHomeTrailerContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* --- UPDATE --- */
      .addCase(updateHomeTrailerContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateHomeTrailerContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.message = "Trailer updated successfully";
      })
      .addCase(updateHomeTrailerContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* --- DELETE --- */
      .addCase(deleteHomeTrailerContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteHomeTrailerContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.message = "Trailer deleted successfully";
      })
      .addCase(deleteHomeTrailerContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetHomeTrailerState } = homeTrailerSlice.actions;
export default homeTrailerSlice.reducer;
