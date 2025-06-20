import { createSlice } from '@reduxjs/toolkit';
import {
  createUser,
  loginUser,
  logOut,
  resetPasswordForUser,
  updateUserPassword,
  resendVerificationEmail,
  updateUserProfile,
} from './authActions';

const initialState = {
  user: null,
  loading: false,
  error: null,
  isEmailValid: false,
  lastSuccessMessage: null,
  lastErrorMessage: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.lastErrorMessage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
      state.lastErrorMessage = null;
    },
    clearMessages: (state) => {
      state.lastSuccessMessage = null;
      state.lastErrorMessage = null;
    },
    validateEmail: (state, action) => {
      state.isEmailValid = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create User
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastErrorMessage = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
        state.lastSuccessMessage = action.payload.messageKey;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.messageKey;
        state.lastErrorMessage = action.payload.messageKey;
      })

      // Login User
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastErrorMessage = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
        state.lastSuccessMessage = action.payload.messageKey;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.messageKey;
        state.lastErrorMessage = action.payload.messageKey;
      })

      // Log Out
      .addCase(logOut.pending, (state) => {
        state.loading = true;
      })
      .addCase(logOut.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = null;
        state.lastSuccessMessage = action.payload.messageKey;
      })
      .addCase(logOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.messageKey;
        state.lastErrorMessage = action.payload.messageKey;
      })

      // Reset Password
      .addCase(resetPasswordForUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastErrorMessage = null;
      })
      .addCase(resetPasswordForUser.fulfilled, (state, action) => {
        state.loading = false;
        state.lastSuccessMessage = action.payload.messageKey;
      })
      .addCase(resetPasswordForUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.messageKey;
        state.lastErrorMessage = action.payload.messageKey;
      })

      // Update Password
      .addCase(updateUserPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastErrorMessage = null;
      })
      .addCase(updateUserPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.lastSuccessMessage = action.payload.messageKey;
      })
      .addCase(updateUserPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.messageKey;
        state.lastErrorMessage = action.payload.messageKey;
      })

      // Resend Verification Email
      .addCase(resendVerificationEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastErrorMessage = null;
      })
      .addCase(resendVerificationEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.lastSuccessMessage = action.payload.messageKey;
      })
      .addCase(resendVerificationEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.messageKey;
        state.lastErrorMessage = action.payload.messageKey;
      })

      // Update User Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastErrorMessage = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload.user };
        state.error = null;
        state.lastSuccessMessage = action.payload.messageKey;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.messageKey;
        state.lastErrorMessage = action.payload.messageKey;
      });
  },
});

export const {
  setUser,
  setLoading,
  setError,
  clearError,
  clearMessages,
  validateEmail,
} = authSlice.actions;

export default authSlice.reducer;
