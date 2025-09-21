import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { auth } from '../../firebase';
import { userService } from './user.service';
import {
  ServiceError,
  ErrorCodes,
  withErrorHandler,
} from '../utils/error-handler';
import { ServiceResponse } from '../utils/response-formatter';
import { ERROR, SUCCESS } from '../../constants/Message';

class AuthService {
  /**
   * Register a new user
   */
  register = withErrorHandler(async (email, password, additionalData = {}) => {
    if (!email || !password) {
      throw new ServiceError(
        ERROR.EMAIL_PASSWORD_REQUIRED,
        ErrorCodes.INVALID_INPUT,
        400,
      );
    }

    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    // Send verification email
    await sendEmailVerification(user);

    // Create user profile in Firestore
    const profileData = {
      email: user.email,
      displayName: additionalData.displayName || '',
      photoURL: additionalData.photoURL || '',
      ...additionalData,
    };

    await userService.createUserProfile(user.uid, profileData);

    return ServiceResponse.success(
      {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
      },
      SUCCESS.REGISTRATION_SUCCESS,
    );
  });

  /**
   * Login user
   */
  login = withErrorHandler(async (email, password) => {
    if (!email || !password) {
      throw new ServiceError(
        ERROR.EMAIL_PASSWORD_REQUIRED,
        ErrorCodes.INVALID_INPUT,
        400,
      );
    }

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    // Check if user profile exists, create if not
    const profileExists = await userService.exists(user.uid);
    if (!profileExists) {
      await userService.createUserProfile(user.uid, {
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
      });
    }

    // Update user online status
    await userService.updateUserStatus(user.uid, 'online');

    // Get user profile from Firestore
    const userProfile = await userService.getUser(user.uid);

    return ServiceResponse.success(
      {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        profile: userProfile.data,
      },
      SUCCESS.LOGIN_SUCCESS,
    );
  });

  /**
   * Logout user
   */
  logout = withErrorHandler(async () => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      // Update user status to offline
      await userService.updateUserStatus(currentUser.uid, 'offline');
    }

    await signOut(auth);

    return ServiceResponse.success(null, SUCCESS.LOGOUT_SUCCESS);
  });

  /**
   * Send password reset email
   */
  resetPassword = withErrorHandler(async (email) => {
    if (!email) {
      throw new ServiceError(
        ERROR.EMAIL_REQUIRED,
        ErrorCodes.INVALID_INPUT,
        400,
      );
    }

    await sendPasswordResetEmail(auth, email);

    return ServiceResponse.success(null, SUCCESS.PASSWORD_RESET_SENT);
  });

  /**
   * Update user password
   */
  updatePassword = withErrorHandler(async (currentPassword, newPassword) => {
    const user = auth.currentUser;

    if (!user) {
      throw new ServiceError(
        ERROR.NO_AUTHENTICATED_USER,
        ErrorCodes.PERMISSION_DENIED,
        401,
      );
    }

    if (!currentPassword || !newPassword) {
      throw new ServiceError(
        ERROR.CURRENT_NEW_PASSWORD_REQUIRED,
        ErrorCodes.INVALID_INPUT,
        400,
      );
    }

    // Re-authenticate user before password update
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword,
    );
    await reauthenticateWithCredential(user, credential);

    // Update password
    await updatePassword(user, newPassword);

    return ServiceResponse.success(null, SUCCESS.PASSWORD_UPDATED);
  });

  /**
   * Resend verification email
   */
  resendVerificationEmail = withErrorHandler(async () => {
    const user = auth.currentUser;

    if (!user) {
      throw new ServiceError(
        ERROR.NO_AUTHENTICATED_USER,
        ErrorCodes.PERMISSION_DENIED,
        401,
      );
    }

    if (user.emailVerified) {
      throw new ServiceError(
        ERROR.EMAIL_ALREADY_VERIFIED,
        ErrorCodes.INVALID_INPUT,
        400,
      );
    }

    await sendEmailVerification(user);

    return ServiceResponse.success(null, SUCCESS.VERIFICATION_EMAIL_SENT);
  });

  /**
   * Get current user
   */
  getCurrentUser = () => {
    const user = auth.currentUser;

    if (!user) {
      return null;
    }

    return {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  };

  /**
   * Check if user is authenticated
   */
  isAuthenticated = () => {
    return !!auth.currentUser;
  };

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange = (callback) => {
    return auth.onAuthStateChanged(callback);
  };
}

// Export singleton instance
export const authService = new AuthService();
