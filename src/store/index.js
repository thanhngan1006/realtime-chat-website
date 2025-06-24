import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/user/authReducer';
import userReducer from '../../features/user/userReducer';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
});

export default store;
