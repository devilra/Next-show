import { createSlice } from "@reduxjs/toolkit";

const movieSlice = createSlice({
  name: "centralizedJsonMovies",
  initialState: {
    isGlobalLoading: false, // TanStack isPending-ah inga sync pannuvom
  },
  reducers: {
    setGlobalLoading: (state, action) => {
      state.isGlobalLoading = action.payload;
    },
  },
});

export const { setGlobalLoading } = movieSlice.actions;
export default movieSlice.reducer;
