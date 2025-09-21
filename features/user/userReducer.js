import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profileData: {},
  avatarUrl: '',
  name: '',
  loading: false,
  users: [],
  selectedUser: {},
  presenceStatuses: {},
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setPresenceStatus: (state, action) => {
      const { userId, status } = action.payload;
      if (userId) {
        state.presenceStatuses[userId] = status;
      }
    },
    setProfileData: (state, action) => {
      state.profileData = action.payload;
      if (action.payload.avatarUrl) state.avatarUrl = action.payload.avatarUrl;
      if (action.payload.name) state.name = action.payload.name;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
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
  },
});

export const {
  setPresenceStatus,
  setProfileData,
  setAvatarUrl,
  setName,
  setLoading,
  setUsers,
  setSelectedUser,
} = userSlice.actions;
export default userSlice.reducer;
