import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/user/authReducer';
import userReducer from '../../features/user/userReducer';
import modalReducer from '../../features/modal/modalReducer';
import chatReducer from '../../features/chat/chatReducer';
import commonReducer from '../../features/common/commonReducer';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    modal: modalReducer,
    chat: chatReducer,
    common: commonReducer,
  },
});

export default store;
