import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  user: null,
  loading: false,
  error: null,
  isEmailValid: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    validateEmail: (state, action) => {
      state.isEmailValid = action.payload;
    },
  },
});

export const { setUser, validateEmail } = authSlice.actions;
export default authSlice.reducer;
