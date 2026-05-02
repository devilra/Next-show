import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

// Local Storage-இல் இருந்து Admin User-ஐ பெறுதல் (Login-க்கு பிறகு Refresh ஆகும்போது தேவை)

const admin = JSON.parse(localStorage.getItem("nextShow_admin"));

// ---------------------------
// Initial State
// ---------------------------

const initialState = {
  admin: admin ? admin : null, // Login செய்த Admin-இன் விவரங்கள்
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// ---------------------------
// Async Thunks (Backend API Calls)
// ---------------------------

// 1. 🔑 Register Admin
export const registerAdmin = createAsyncThunk(
  "next_show/register",
  async (adminData, thunkAPI) => {
    try {
      const response = await api.post("/auth/register", adminData);
      if (response.data) {
        // Backend-இல் Cookie செட் செய்யப்படுவதால், frontend-இல் Admin விவரங்களை மட்டும் சேமிக்கலாம்
        localStorage.setItem("nextShow_admin", JSON.stringify(response.data));
      }
      //console.log(response.data);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 2. 🔒 Login Admin

export const loginAdmin = createAsyncThunk(
  "next_show/login",
  async (adminData, thunkAPI) => {
    try {
      const response = await api.post("/auth/login", adminData);

      if (response.data) {
        // Backend-இல் Cookie செட் செய்யப்படுவதால், frontend-இல் Admin விவரங்களை மட்டும் சேமிக்கலாம்

        const userDataToStore = {
          name: response.data.name,
          role: response.data.role,
        };
        localStorage.setItem("nextShow_admin", JSON.stringify(userDataToStore));
      }

      return response.data;
    } catch (error) {
      //console.log(error.message);
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 3. 👤 Get Me Admin (Current User details)
export const getMeAdmin = createAsyncThunk(
  "next_show/getMe",
  async (_, thunkAPI) => {
    // Backend Cookie-ஐ அடிப்படையாகக் கொண்டு User விவரங்கள் அனுப்பப்படும்
    try {
      const response = await api.get("/auth/me");
      //console.log(response.data);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      // GetMe தோல்வியடைந்தால், Admin State-ஐ நீக்கிவிட்டு Logout செய்யவும்
      thunkAPI.dispatch(logoutAdmin());
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 4. 🚪 Logout Admin
export const logoutAdmin = createAsyncThunk("next_show/logout", async () => {
  // Local Storage-இல் இருந்து Admin விவரங்களை நீக்கவும்
  localStorage.removeItem("nextShow_admin");
  // Backend API-ஐ அழைத்து Cookie-ஐ நீக்கச் சொல்லவும்
  await api.post("/auth/logout");
});

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    // State-ஐ reset செய்ய ஒரு Reducer
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Register, Login - Pending State
      .addCase(registerAdmin.pending, (state) => {
        state.isLoading = false;
      })
      // Register, Login - Success State
      .addCase(registerAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.admin = action.payload; // Admin விவரங்கள் payload-இல் இருக்கும்
      })
      // Register, Login - Failure State
      .addCase(registerAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload; // Error message payload-இல் இருக்கும்
        state.admin = null;
      })
      .addCase(loginAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.admin = action.payload;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.admin = null;
      })
      // Logout - Success State
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.admin = null;
        state.isSuccess = true;
      })
      // GetMe - Pending State
      .addCase(getMeAdmin.pending, (state) => {
        state.isLoading = true;
      })
      // GetMe - Success State
      .addCase(getMeAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.admin = action.payload; // Fetch செய்யப்பட்ட Admin விவரங்கள்
      })
      // GetMe - Failure State (Logout dispatched செய்யப்பட்டிருக்கும்)
      .addCase(getMeAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.admin = null;
      });
  },
});

export const { reset } = adminSlice.actions;
export default adminSlice.reducer;
