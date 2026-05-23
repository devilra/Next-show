import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  isAuthenticated: false,
  authChecked: false,
  authLoading: false,
  authError: null,
};

const UserAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    // ======================================================
    // ✅ AUTH START
    // ======================================================
    authStart: (state) => {
      state.authLoading = true;
      state.authError = null;
    },
    // ======================================================
    // ✅ AUTH SUCCESS
    // ======================================================
    authSuccess: (state, action) => {
      state.authLoading = false;
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      state.authError = null;
      state.authChecked = true;
    },
    // ======================================================
    // ✅ AUTH FAIL
    // ======================================================
    authFail: (state, action) => {
      state.authLoading = false;
      state.currentUser = null;
      state.isAuthenticated = false;
      state.authError = action.payload;
      state.authChecked = true;
    },
    // ======================================================
    // ✅ LOGOUT
    // ======================================================
    logoutUser: (state) => {
      state.currentUser = null;

      state.isAuthenticated = false;

      state.authError = null;

      state.authLoading = false;
    },
  },
});

export const { authStart, authSuccess, authFail, logoutUser } =
  UserAuthSlice.actions;

export default UserAuthSlice.reducer;
