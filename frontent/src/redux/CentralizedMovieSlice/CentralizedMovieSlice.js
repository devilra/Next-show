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

export const fetchNewMoviesPage = createAsyncThunk(
  "centralizedMovies/fetchNewMovies",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/centralized/newMovies-pageData");
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getThunkError(error, "Failed to load new movies")
      );
    }
  }
);

export const fetchStreamingNowPage = createAsyncThunk(
  "centralizedMovies/fetchStreaming",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/centralized/streamingNow-pageData");
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getThunkError(error, "Failed to load streaming data")
      );
    }
  }
);

export const fetchMovieBySlug = createAsyncThunk(
  "centralizedMovies/fetchBySlug",
  async (slug, thunkAPI) => {
    try {
      const res = await api.get(`/centralized/movie-details/${slug}`);
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getThunkError(error, "Movie not found"));
    }
  }
);

export const fetchAllMoviesAdmin = createAsyncThunk(
  "centralizedMovies/fetchAllAdmin",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/centralized/all-movies");
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getThunkError(error, "Failed to fetch admin list")
      );
    }
  }
);

export const createMovie = createAsyncThunk(
  "centralizedMovies/create",
  async (formData, thunkAPI) => {
    try {
      const res = await api.post("/centralized/create-movie", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getThunkError(error, "Creation failed"));
    }
  }
);

export const updateMovie = createAsyncThunk(
  "centralizedMovies/update",
  async ({ id, formData }, thunkAPI) => {
    try {
      const res = await api.put(`/centralized/update-movie/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getThunkError(error, "Update failed"));
    }
  }
);

export const deleteMovie = createAsyncThunk(
  "centralizedMovies/delete",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/centralized/delete-movie/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(getThunkError(error, "Deletion failed"));
    }
  }
);

/* =====================================================
    SLICE
===================================================== */

const centralizedMovieSlice = createSlice({
  name: "centralizedMovies",
  initialState: {
    movies: [],
    currentMovie: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: "",

    newMoviesData: { upcoming: [], newReleases: [] },
    streamingData: { upcoming: [], newReleases: [] },
    isPublicLoading: false,
    isPublicError: false,
  },
  reducers: {
    resetMovieState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
      state.isPublicLoading = false;
      state.isPublicError = false;
    },
  },

  extraReducers: (builder) => {
    builder
      /* --- 1. FETCH NEW MOVIES PAGE --- */
      .addCase(fetchNewMoviesPage.pending, (state) => {
        state.isPublicLoading = true;
      })
      .addCase(fetchNewMoviesPage.fulfilled, (state, action) => {
        state.isPublicLoading = false;
        state.newMoviesData = action.payload;
      })
      .addCase(fetchNewMoviesPage.rejected, (state, action) => {
        state.isPublicLoading = false;
        state.isPublicError = true;
        state.message = action.payload;
      })

      /* --- 2. FETCH STREAMING NOW PAGE --- */
      .addCase(fetchStreamingNowPage.pending, (state) => {
        state.isPublicLoading = true;
      })
      .addCase(fetchStreamingNowPage.fulfilled, (state, action) => {
        state.isPublicLoading = false;
        state.streamingData = action.payload;
      })
      .addCase(fetchStreamingNowPage.rejected, (state, action) => {
        state.isPublicLoading = false;
        state.isPublicError = true;
        state.message = action.payload;
      })

      /* --- 3. FETCH SINGLE MOVIE BY SLUG --- */
      .addCase(fetchMovieBySlug.pending, (state) => {
        state.isPublicLoading = true;
      })
      .addCase(fetchMovieBySlug.fulfilled, (state, action) => {
        state.isPublicLoading = false;
        state.currentMovie = action.payload;
      })
      .addCase(fetchMovieBySlug.rejected, (state, action) => {
        state.isPublicLoading = false;
        state.isPublicError = true;
        state.message = action.payload;
      })

      /* --- 4. ADMIN: FETCH ALL --- */
      .addCase(fetchAllMoviesAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllMoviesAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.movies = action.payload;
      })
      .addCase(fetchAllMoviesAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* --- 5. ADMIN: CREATE MOVIE --- */
      .addCase(createMovie.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createMovie.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.movies.unshift(action.payload);
        state.message = "Movie created successfully!";
      })
      .addCase(createMovie.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* --- 6. ADMIN: UPDATE MOVIE --- */
      .addCase(updateMovie.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateMovie.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.movies.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) state.movies[index] = action.payload;
        state.message = "Movie updated successfully!";
      })
      .addCase(updateMovie.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* --- 7. ADMIN: DELETE MOVIE --- */
      .addCase(deleteMovie.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.movies = state.movies.filter((m) => m.id !== action.payload);
        state.message = "Movie deleted successfully!";
      })
      .addCase(deleteMovie.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetMovieState } = centralizedMovieSlice.actions;
export default centralizedMovieSlice.reducer;
