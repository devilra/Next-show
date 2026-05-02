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

// 1️⃣ Fetch Active Blogs (FRONTEND - List Page)
export const fetchActiveBlogs = createAsyncThunk(
  "blogSection/fetchActive",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/home/blogs-active");
      return res.data.data; // API structure-க்கு ஏற்ப .data.data
    } catch (error) {
      const message = getThunkError(error, "Failed to fetch active blogs");
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 2️⃣ Fetch Blog Detail by ID (FRONTEND - Detail Page)
export const fetchBlogDetail = createAsyncThunk(
  "blogSection/fetchDetail",
  async (id, thunkAPI) => {
    try {
      const res = await api.get(`/home/blog-detail/${id}`);
      return res.data.data;
    } catch (error) {
      const message = getThunkError(error, "Failed to fetch blog details");
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 3️⃣ Fetch All Blogs (ADMIN)
export const fetchAllBlogs = createAsyncThunk(
  "blogSection/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/home/blogs-all");
      return res.data.data;
    } catch (error) {
      const message = getThunkError(error, "Failed to fetch all blogs");
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 4️⃣ Create Blog (ADMIN)
export const createBlog = createAsyncThunk(
  "blogSection/create",
  async (formData, thunkAPI) => {
    try {
      const res = await api.post("/home/blog-create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    } catch (error) {
      const message = getThunkError(error, "Blog creation failed");
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 5️⃣ Update Blog (ADMIN)
export const updateBlog = createAsyncThunk(
  "blogSection/update",
  async ({ id, formData }, thunkAPI) => {
    try {
      const res = await api.put(`/home/blog-update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    } catch (error) {
      const message = getThunkError(error, "Blog update failed");
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 6️⃣ Delete Blog (ADMIN)
export const deleteBlog = createAsyncThunk(
  "blogSection/delete",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/home/blog-delete/${id}`);
      return id;
    } catch (error) {
      const message = getThunkError(error, "Blog deletion failed");
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/* =====================================================
    SLICE (State Management)
===================================================== */

const blogSectionSlice = createSlice({
  name: "blogSection",
  initialState: {
    // Admin & General States
    blogs: [],
    selectedBlog: null, // Single blog detail-க்காக
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: "",

    // Frontend States
    activeBlogs: [],
    isActiveLoading: false,
    isActiveError: false,
    activeMessage: "",
  },
  reducers: {
    resetBlogState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
      state.selectedBlog = null;
      state.isActiveLoading = false;
      state.isActiveError = false;
      state.activeMessage = "";
    },
  },

  extraReducers: (builder) => {
    builder
      /* === FETCH ACTIVE BLOGS === */
      .addCase(fetchActiveBlogs.pending, (state) => {
        state.isActiveLoading = true;
      })
      .addCase(fetchActiveBlogs.fulfilled, (state, action) => {
        state.isActiveLoading = false;
        state.activeBlogs = action.payload;
      })
      .addCase(fetchActiveBlogs.rejected, (state, action) => {
        state.isActiveLoading = false;
        state.isActiveError = true;
        state.activeMessage = action.payload;
      })

      /* === FETCH BLOG DETAIL === */
      .addCase(fetchBlogDetail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBlogDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedBlog = action.payload;
      })
      .addCase(fetchBlogDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* === FETCH ALL BLOGS === */
      .addCase(fetchAllBlogs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs = action.payload;
      })
      .addCase(fetchAllBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* === CREATE BLOG === */
      .addCase(createBlog.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(createBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.blogs.unshift(action.payload); // புதிய செய்தியை முதலில் சேர்க்க
        state.message = "Blog created successfully";
      })

      .addCase(createBlog.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* === UPDATE BLOG === */

      .addCase(updateBlog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.blogs.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.blogs[index] = action.payload;
        }
        state.message = "Blog updated successfully";
      })

      .addCase(updateBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* === DELETE BLOG === */

      .addCase(deleteBlog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.blogs = state.blogs.filter((b) => b.id !== action.payload);
        state.message = "Blog deleted successfully";
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetBlogState } = blogSectionSlice.actions;
export default blogSectionSlice.reducer;
