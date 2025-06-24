import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/user/authReducer';
import userReducer from '../../features/user/userReducer';
import modalReducer from '../../features/modal/modalReducer';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    modal: modalReducer,
  },
});

export default store;
