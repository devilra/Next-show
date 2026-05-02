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

// 1️⃣ Fetch Active Trailers (UI - Public)
export const fetchActiveTrailers = createAsyncThunk(
  "newTrailers/fetchActive",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/trailers/new-trailers-active");
      return res.data.data;
    } catch (error) {
      const message = getThunkError(error, "Failed to fetch active trailers");
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// 2️⃣ Fetch All Trailers (Admin)
export const fetchAllTrailersAdmin = createAsyncThunk(
  "newTrailers/fetchAllAdmin",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/trailers/new-trailers-all");
      return res.data.data;
    } catch (error) {
      const message = getThunkError(error, "Failed to fetch all trailers");
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// 3️⃣ Create New Trailer (Admin)
// குறிப்பு: இதில் இமேஜ் இல்லாததால் வெறும் JSON டேட்டா மட்டும் அனுப்பினால் போதும்
export const createNewTrailer = createAsyncThunk(
  "newTrailers/create",
  async (trailerData, thunkAPI) => {
    try {
      const res = await api.post("/trailers/new-trailers-create", trailerData);
      return res.data.data;
    } catch (error) {
      const message = getThunkError(error, "Trailer creation failed");
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// 4️⃣ Update Trailer (Admin)
export const updateTrailerContent = createAsyncThunk(
  "newTrailers/update",
  async ({ id, updateData }, thunkAPI) => {
    try {
      const res = await api.put(
        `/trailers/new-trailers-update/${id}`,
        updateData,
      );
      return res.data.data;
    } catch (error) {
      const message = getThunkError(error, "Trailer update failed");
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// 5️⃣ Delete Trailer (Admin)
export const deleteTrailerContent = createAsyncThunk(
  "newTrailers/delete",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/trailers/new-trailers-delete/${id}`);
      return id;
    } catch (error) {
      const message = getThunkError(error, "Trailer deletion failed");
      return thunkAPI.rejectWithValue(message);
    }
  },
);

/* =====================================================
    SLICE
===================================================== */

const newTrailerSlice = createSlice({
  name: "newTrailers",
  initialState: {
    // Admin States
    items: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: "",

    // Frontend States
    activeTrailers: [],
    isActiveLoading: false,
    isActiveSuccess: false,
    isActiveError: false,
    activeMessage: "",
  },
  reducers: {
    resetNewTrailerState: (state) => {
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
      .addCase(fetchActiveTrailers.pending, (state) => {
        state.isActiveLoading = true;
      })
      .addCase(fetchActiveTrailers.fulfilled, (state, action) => {
        state.isActiveLoading = false;
        state.isActiveSuccess = true;
        state.activeTrailers = action.payload;
      })
      .addCase(fetchActiveTrailers.rejected, (state, action) => {
        state.isActiveLoading = false;
        state.isActiveError = true;
        state.activeMessage = action.payload;
      })

      /* --- FETCH ALL (Admin) --- */
      .addCase(fetchAllTrailersAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllTrailersAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.items = action.payload;
      })
      .addCase(fetchAllTrailersAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* --- CREATE --- */
      .addCase(createNewTrailer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewTrailer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.items.unshift(action.payload);
        state.message = "Trailer added successfully";
      })
      .addCase(createNewTrailer.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* --- UPDATE --- */
      .addCase(updateTrailerContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTrailerContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id,
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.message = "Trailer updated successfully";
      })
      .addCase(updateTrailerContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      /* --- DELETE --- */
      .addCase(deleteTrailerContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTrailerContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.message = "Trailer deleted successfully";
      })
      .addCase(deleteTrailerContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetNewTrailerState } = newTrailerSlice.actions;
export default newTrailerSlice.reducer;
