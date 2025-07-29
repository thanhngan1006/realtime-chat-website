import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: '',
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const { setTheme } = commonSlice.actions;

export default commonSlice.reducer;
