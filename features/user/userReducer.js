import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profileData: {},
  avatarUrl: '',
  name: '',
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfileData: (state, action) => {
      state.profileData = action.payload;
      //   if (action.payload.avatarUrl) state.avatarUrl = action.payload.avatarUrl;
      if (action.payload.name) state.name = action.payload.name;
    },
    setAvatarUrl: (state, action) => {
      state.avatarUrl = action.payload;
      if (state.profileData) state.profileData.avatarUrl = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
      if (state.profileData) state.profileData.name = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setProfileData, setAvatarUrl, setName, setLoading, setError } =
  userSlice.actions;
export default userSlice.reducer;
