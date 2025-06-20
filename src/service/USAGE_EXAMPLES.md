# Service Layer Usage Examples

## Using Services in Components

### 1. User Service Example

```jsx
import React, { useState, useEffect } from 'react';
import { userService } from '@/service';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

function UserProfile() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const response = await userService.getUser(user.uid);
        setProfile(response.data);
      } catch (err) {
        setError(t(err.message));
      } finally {
        setLoading(false);
      }
    }

    if (user?.uid) {
      loadProfile();
    }
  }, [user, t]);

  const updateProfile = async (updates) => {
    try {
      const response = await userService.updateUserProfile(user.uid, updates);
      setProfile(response.data);
      showNotification(t(response.message), 'success');
    } catch (err) {
      console.error('Profile update failed:', err);
      showNotification(t(err.message), 'error');
    }
  };

  // ... rest of component
}
```

### 2. Auth Service in Redux Actions with i18n

```javascript
// features/user/authActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '@/service';

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
        messageKey: error.message,
        code: error.code,
      });
    }
  },
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ email, password, displayName }, { rejectWithValue }) => {
    try {
      const response = await authService.register(email, password, {
        displayName,
      });
      return {
        user: response.data,
        messageKey: response.message,
      };
    } catch (error) {
      return rejectWithValue({
        messageKey: error.message,
        code: error.code,
      });
    }
  },
);
```

### 3. Error Handling with i18n

```jsx
import { ServiceError, ErrorCodes } from '@/service';
import { useTranslation } from 'react-i18next';

function useServiceErrorHandler() {
  const { t } = useTranslation();

  const handleServiceError = (error) => {
    if (error instanceof ServiceError) {
      const translatedMessage = t(error.message);

      switch (error.code) {
        case ErrorCodes.USER_NOT_FOUND:
          showNotification(translatedMessage, 'error');
          break;
        case ErrorCodes.PERMISSION_DENIED:
          showNotification(translatedMessage, 'error');
          navigate('/login');
          break;
        case ErrorCodes.NETWORK_ERROR:
          showNotification(translatedMessage, 'error');
          break;
        default:
          showNotification(translatedMessage, 'error');
      }
    }
  };

  return { handleServiceError };
}
```

### 4. Login Component with i18n

```jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { loginUser } from '@/features/user/authActions';

function LoginForm() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await dispatch(loginUser(formData)).unwrap();

      showNotification(t(result.messageKey), 'success');
      navigate('/');
    } catch (error) {
      showNotification(t(error.messageKey), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? t('common.loading') : t('login.submit')}
      </button>
    </form>
  );
}
```

### 5. Repository Pattern Direct Usage

```javascript
import { BaseRepository } from '@/service';

// Create a custom repository
class PostRepository extends BaseRepository {
  constructor() {
    super('posts');
  }

  async getPublishedPosts() {
    return this.findByField('status', 'published', {
      orderByField: 'publishedAt',
      orderDirection: 'desc',
    });
  }

  async getUserPosts(userId) {
    return this.findByField('authorId', userId, {
      orderByField: 'createdAt',
      orderDirection: 'desc',
    });
  }
}

export const postRepository = new PostRepository();
```

### 6. User Search Example with i18n

```jsx
import { userService } from '@/service';
import { useTranslation } from 'react-i18next';

function UserSearch() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      const response = await userService.searchUsers(searchTerm, user.uid);
      setSearchResults(response.data);

      const message =
        t(response.message.split(':')[0]) + ': ' + response.data.length;
      showNotification(message, 'info');
    } catch (err) {
      console.error('Search failed:', err);
      showNotification(t(err.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component
}
```

### 7. Notification Hook for i18n Messages

```jsx
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

function useNotifier() {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const notify = (messageKey, variant = 'default', options = {}) => {
    const translatedMessage = t(messageKey);

    enqueueSnackbar(translatedMessage, {
      variant,
      ...options,
    });
  };

  return notify;
}

export default useNotifier;
```

## Best Practices

1. **Always handle errors** - Services throw ServiceError with message keys for i18n
2. **Use loading states** - Services are async, show loading indicators
3. **Translate message keys** - Use `t(response.message)` or `t(error.message)`
4. **Handle success messages** - ServiceResponse includes message keys for success notifications
5. **Use the service layer** - Don't import Firebase directly in components
6. **Consistent error handling** - Create reusable error handling hooks
7. **Message keys not text** - Services return i18n keys, not hardcoded text
8. **Check response structure** - Services return `{ success, data, message, metadata }`

## Using Services with Redux Actions

### 1. Login Component Example

```jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { loginUser, validateEmail } from '@/features/user/authActions';
import { clearMessages } from '@/features/user/authReducer';
import useNotifier from '@/hooks/useNotifier';

function LoginForm() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const notify = useNotifier();

  const { loading, isEmailValid, user, lastSuccessMessage, lastErrorMessage } =
    useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: '', password: '' });

  // Handle success/error messages from Redux state
  useEffect(() => {
    if (lastSuccessMessage) {
      notify(lastSuccessMessage, 'success');
      dispatch(clearMessages());
    }
  }, [lastSuccessMessage, notify, dispatch]);

  useEffect(() => {
    if (lastErrorMessage) {
      notify(lastErrorMessage, 'error');
      dispatch(clearMessages());
    }
  }, [lastErrorMessage, notify, dispatch]);

  // Validate email as user types
  useEffect(() => {
    if (formData.email) {
      dispatch(validateEmail(formData.email));
    }
  }, [formData.email, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(loginUser(formData)).unwrap();
      // Success handling via useEffect watching lastSuccessMessage
    } catch (error) {
      // Error handling via useEffect watching lastErrorMessage
      console.error('Login error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={formData.email}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, email: e.target.value }))
        }
        placeholder="Email"
      />
      <input
        type="password"
        value={formData.password}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, password: e.target.value }))
        }
        placeholder="Password"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### 2. Signup Component Example

```jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createUser } from '@/features/user/authActions';
import { clearMessages } from '@/features/user/authReducer';
import useNotifier from '@/hooks/useNotifier';

function SignupForm() {
  const dispatch = useDispatch();
  const notify = useNotifier();

  const { loading, lastSuccessMessage, lastErrorMessage } = useSelector(
    (state) => state.auth,
  );
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
  });

  // Handle messages
  useEffect(() => {
    if (lastSuccessMessage) {
      notify(lastSuccessMessage, 'success');
      dispatch(clearMessages());
    }
  }, [lastSuccessMessage, notify, dispatch]);

  useEffect(() => {
    if (lastErrorMessage) {
      notify(lastErrorMessage, 'error');
      dispatch(clearMessages());
    }
  }, [lastErrorMessage, notify, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(createUser(formData)).unwrap();
      // Success: user created, verification email sent
    } catch (error) {
      // Error handled via Redux state
      console.error('Signup error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.displayName}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, displayName: e.target.value }))
        }
        placeholder="Full Name"
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, email: e.target.value }))
        }
        placeholder="Email"
      />
      <input
        type="password"
        value={formData.password}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, password: e.target.value }))
        }
        placeholder="Password"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating Account...' : 'Sign Up'}
      </button>
    </form>
  );
}
```

### 3. Profile Update Example

```jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '@/features/user/authActions';
import { clearMessages } from '@/features/user/authReducer';
import useNotifier from '@/hooks/useNotifier';

function ProfileUpdateForm() {
  const dispatch = useDispatch();
  const notify = useNotifier();

  const { user, loading, lastSuccessMessage, lastErrorMessage } = useSelector(
    (state) => state.auth,
  );
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    bio: user?.bio || '',
  });

  // Handle messages
  useEffect(() => {
    if (lastSuccessMessage) {
      notify(lastSuccessMessage, 'success');
      dispatch(clearMessages());
    }
  }, [lastSuccessMessage, notify, dispatch]);

  useEffect(() => {
    if (lastErrorMessage) {
      notify(lastErrorMessage, 'error');
      dispatch(clearMessages());
    }
  }, [lastErrorMessage, notify, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(
        updateUserProfile({
          userId: user.uid,
          updates: profileData,
        }),
      ).unwrap();
      // Success: profile updated
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={profileData.displayName}
        onChange={(e) =>
          setProfileData((prev) => ({ ...prev, displayName: e.target.value }))
        }
        placeholder="Display Name"
      />
      <textarea
        value={profileData.bio}
        onChange={(e) =>
          setProfileData((prev) => ({ ...prev, bio: e.target.value }))
        }
        placeholder="Bio"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  );
}
```

### 4. Password Reset Example

```jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPasswordForUser } from '@/features/user/authActions';
import { clearMessages } from '@/features/user/authReducer';
import useNotifier from '@/hooks/useNotifier';

function PasswordResetForm() {
  const dispatch = useDispatch();
  const notify = useNotifier();

  const { loading, lastSuccessMessage, lastErrorMessage } = useSelector(
    (state) => state.auth,
  );
  const [email, setEmail] = useState('');

  // Handle messages
  useEffect(() => {
    if (lastSuccessMessage) {
      notify(lastSuccessMessage, 'success');
      dispatch(clearMessages());
    }
  }, [lastSuccessMessage, notify, dispatch]);

  useEffect(() => {
    if (lastErrorMessage) {
      notify(lastErrorMessage, 'error');
      dispatch(clearMessages());
    }
  }, [lastErrorMessage, notify, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(resetPasswordForUser(email)).unwrap();
      // Success: reset email sent
    } catch (error) {
      console.error('Reset password error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send Reset Email'}
      </button>
    </form>
  );
}
```

### 5. Logout Component Example

```jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { logOut } from '@/features/user/authActions';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logOut()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

### 6. useNotifier Hook for i18n Messages

```jsx
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

function useNotifier() {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const notify = (messageKey, variant = 'default', options = {}) => {
    // Translate the message key
    const translatedMessage = t(messageKey);

    enqueueSnackbar(translatedMessage, {
      variant,
      ...options,
    });
  };

  return notify;
}

export default useNotifier;
```

## Redux State Structure

```javascript
// Auth state in Redux store
{
  auth: {
    user: null | { uid, email, displayName, ... },
    loading: boolean,
    error: string | null,
    isEmailValid: boolean,
    lastSuccessMessage: string | null, // i18n key
    lastErrorMessage: string | null,   // i18n key
  }
}
```

## Available Actions

```javascript
// Import from features/user/authActions
import {
  createUser, // Register new user
  loginUser, // Login user
  logOut, // Logout user
  resetPasswordForUser, // Send password reset email
  updateUserPassword, // Update user password
  resendVerificationEmail, // Resend verification email
  updateUserProfile, // Update user profile
  validateEmail, // Validate email format (sync)
} from '@/features/user/authActions';

// Import from features/user/authReducer
import {
  setUser,
  setLoading,
  setError,
  clearError,
  clearMessages,
  validateEmail,
} from '@/features/user/authReducer';
```

## Best Practices

1. **Use Redux Actions** - Always use Redux actions, not service methods directly
2. **Handle Messages via useEffect** - Watch `lastSuccessMessage` and `lastErrorMessage`
3. **Clear Messages** - Always clear messages after handling them
4. **Use unwrap()** - Use `.unwrap()` to get the payload or throw on error
5. **Translate Messages** - Use `useNotifier` hook to translate and show messages
6. **Loading States** - Use Redux `loading` state for UI feedback
7. **Error Boundaries** - Consider error boundaries for unexpected errors
8. **Consistent Patterns** - Follow the same pattern across all components
