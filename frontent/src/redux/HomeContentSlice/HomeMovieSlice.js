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

// 1️⃣ Fetch Active Home Movies (UI - Public)
export const fetchActiveHomeMovies = createAsyncThunk(
  "homeMovies/fetchActive",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/home/home-movies-active");
      return res.data.data;
    } catch (error) {
      const message = getThunkError(error, "Failed to fetch active movies");
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 2️⃣ Fetch All Home Movies (Admin)
export const fetchAllHomeMovies = createAsyncThunk(
  "homeMovies/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/home/home-movies-all");
      return res.data.data;
    } catch (error) {
      const message = getThunkError(error, "Failed to fetch all movies");
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 3️⃣ Create Home Movie Content (Admin)
export const createHomeMovieContent = createAsyncThunk(
  "homeMovies/create",
  async (formData, thunkAPI) => {
    try {
      const res = await api.post("/home/home-movies-create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    } catch (error) {
      const message = getThunkError(error, "Movie creation failed");
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 4️⃣ Update Home Movie Content (Admin)
export const updateHomeMovieContent = createAsyncThunk(
  "homeMovies/update",
  async ({ id, formData }, thunkAPI) => {
    try {
      const res = await api.put(`/home/home-movies-update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    } catch (error) {
      const message = getThunkError(error, "Movie update failed");
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 5️⃣ Delete Home Movie Content (Admin)
export const deleteHomeMovieContent = createAsyncThunk(
  "homeMovies/delete",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/home/home-movies-delete/${id}`);
      return id;
    } catch (error) {
      const message = getThunkError(error, "Movie deletion failed");
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/* =====================================================
    SLICE
===================================================== */

const homeMovieSlice = createSlice({
  name: "homeMovies",
  initialState: {
    // Admin States
    items: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: "",

    // Frontend States
    activeHomeMovies: [],
    isActiveLoading: false,
    isActiveSuccess: false,
    isActiveError: false,
    activeMessage: "",
  },
  reducers: {
    resetHomeMovieState: (state) => {
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
      .addCase(fetchActiveHomeMovies.pending, (state) => {
        state.isActiveLoading = true;
      })
      .addCase(fetchActiveHomeMovies.fulfilled, (state, action) => {
        state.isActiveLoading = false;
        state.isActiveSuccess = true;
        state.activeHomeMovies = action.payload;
      })
      .addCase(fetchActiveHomeMovies.rejected, (state, action) => {
        state.isActiveLoading = false;
        state.isActiveError = true;
        state.activeMessage = action.payload;
      })

      /* --- FETCH ALL (Admin) --- */
      .addCase(fetchAllHomeMovies.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllHomeMovies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.items = action.payload;
      })
      .addCase(fetchAllHomeMovies.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* --- CREATE --- */
      .addCase(createHomeMovieContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createHomeMovieContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.items.unshift(action.payload);
        state.message = "Movie published successfully";
      })
      .addCase(createHomeMovieContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* --- UPDATE --- */
      .addCase(updateHomeMovieContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateHomeMovieContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.message = "Movie updated successfully";
      })
      .addCase(updateHomeMovieContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* --- DELETE --- */
      .addCase(deleteHomeMovieContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteHomeMovieContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.message = "Movie deleted successfully";
      })
      .addCase(deleteHomeMovieContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetHomeMovieState } = homeMovieSlice.actions;
export default homeMovieSlice.reducer;
