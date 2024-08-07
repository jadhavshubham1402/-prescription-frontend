import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: () => initialState,
  },
});

export const {
  setToken,
  setUser,
  setTopic,
  setCurrentQue,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
