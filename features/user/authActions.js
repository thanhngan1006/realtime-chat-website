import { createAsyncThunk } from '@reduxjs/toolkit';
import { authService, userService } from '../../src/service';
import { ERROR } from '../../src/constants/Message';

export const createUser = createAsyncThunk(
  'auth/createUser',
  async ({ email, password, displayName }, { rejectWithValue }) => {
    try {
      const response = await authService.register(email, password, {
        displayName: displayName || '',
      });

      return {
        user: response.data,
        messageKey: response.message,
      };
    } catch (error) {
      return rejectWithValue({
        messageKey: error.message,
        code: error.code,
        statusCode: error.statusCode,
      });
    }
  },
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authService.login(email, password);

      return {
        user: response.data,
        messageKey: response.message,
      };
    } catch (error) {
      return rejectWithValue({
        messageKey: ERROR.LOGIN_FAILURE,
        code: error.code,
        statusCode: error.statusCode,
      });
    }
  },
);

export const resetPasswordForUser = createAsyncThunk(
  'auth/resetPasswordForUser',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword(email);

      return {
        email,
        messageKey: response.message,
      };
    } catch (error) {
      return rejectWithValue({
        messageKey: ERROR.RESET_FAILURE,
        code: error.code,
        statusCode: error.statusCode,
      });
    }
  },
);

export const logOut = createAsyncThunk(
  'auth/logOut',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.logout();

      return {
        messageKey: response.message,
      };
    } catch (error) {
      return rejectWithValue({
        messageKey: ERROR.LOGOUT_FAILURE,
        code: error.code,
        statusCode: error.statusCode,
      });
    }
  },
);

export const updateUserPassword = createAsyncThunk(
  'auth/updateUserPassword',
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await authService.updatePassword(
        currentPassword,
        newPassword,
      );

      return {
        messageKey: response.message,
      };
    } catch (error) {
      return rejectWithValue({
        messageKey: ERROR.UPDATE_PASSWORD_FAILURE,
        code: error.code,
        statusCode: error.statusCode,
      });
    }
  },
);

export const resendVerificationEmail = createAsyncThunk(
  'auth/resendVerificationEmail',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.resendVerificationEmail();

      return {
        messageKey: response.message,
      };
    } catch (error) {
      return rejectWithValue({
        messageKey: ERROR.RESEND_VERIFICATION_EMAIL_FAILURE,
        code: error.code,
        statusCode: error.statusCode,
      });
    }
  },
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async ({ userId, updates }, { rejectWithValue }) => {
    try {
      const response = await userService.updateUserProfile(userId, updates);

      return {
        user: response.data,
        messageKey: response.message,
      };
    } catch (error) {
      return rejectWithValue({
        messageKey: ERROR.UPDATE_USER_PROFILE_FAILURE,
        code: error.code,
        statusCode: error.statusCode,
      });
    }
  },
);

export const validateEmail = (email) => ({
  type: 'auth/validateEmail',
  payload: /\S+@\S+\.\S+/.test(email),
});
