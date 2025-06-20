# Changelog

## Tóm tắt

Nhánh này thực hiện việc **refactor toàn bộ kiến trúc authentication và tạo service layer** cho ứng dụng chat realtime. Những thay đổi này giúp code trở nên dễ bảo trì, có cấu trúc rõ ràng và tuân thủ best practices.

---

## Thay đổi chính

### 1. Xóa bỏ AuthContext - Chuyển hoàn toàn sang Redux

#### Những file đã xóa:

- `src/context/UseAuth.jsx` - Context API cho authentication

#### Những file đã cập nhật:

- `features/user/authReducer.js` - Thêm actions và states mới
- `features/user/AuthReduxProvider.jsx` - Cải thiện provider
- `src/components/common/PrivateRoute.jsx` - Dùng Redux thay vì Context
- `src/components/layout/SubMenu.jsx` - Dùng Redux dispatch cho logout
- `src/App.jsx` - Xóa AuthProvider wrapper
- `src/main.jsx` - Fix double StrictMode

#### 🎯 Lý do thay đổi:

```javascript
// TRƯỚC (Duplicate state management)
// File 1: AuthContext
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

// File 2: Redux
const authState = {
  user: null,
  isAuthenticated: false,
  loading: false,
};
```

```javascript
// SAU (Single source of truth)
// Chỉ Redux
const authState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  lastSuccessMessage: null,
  lastErrorMessage: null,
};
```

#### Ưu điểm:

- **Single Source of Truth**: Chỉ có 1 nơi quản lý auth state
- **Redux DevTools**: Debug dễ dàng hơn
- **Predictable State**: State changes theo predictable pattern
- **Better Testing**: Redux state dễ test hơn Context

---

### 2. Tạo Service Layer Architecture

#### Cấu trúc service mới:

```
src/service/
├── firebase/
│   ├── auth.service.js      # Xử lý authentication
│   └── user.service.js      # Xử lý user profile
├── api/
│   └── config.js           # Config cho external APIs
├── repository/
│   └── base.repository.js   # Base CRUD operations
├── utils/
│   ├── error-handler.js     # Custom error handling
│   └── response-formatter.js # Standardize response format
└── index.js                # Central exports
```

#### Lý do tạo Service Layer:

**TRƯỚC** - Logic trực tiếp trong components:

```javascript
// Login.jsx
const handleLogin = async () => {
  try {
    // Direct Firebase calls
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    // More logic...
  } catch (error) {
    // Handle error...
  }
};
```

**SAU** - Tách biệt concerns:

```javascript
// auth.service.js
export const authService = {
  async login(email, password) {
    // Business logic here
  },
};

// Login.jsx
const handleLogin = async () => {
  const result = await authService.login(email, password);
  // Only UI logic here
};
```

#### Ưu điểm Service Layer:

- **Separation of Concerns**: UI logic tách biệt business logic
- **Reusability**: Services có thể dùng lại nhiều nơi
- **Testability**: Test business logic độc lập
- **Maintainability**: Dễ maintain và update
- **Error Handling**: Centralized error handling
- **Response Format**: Consistent response structure

---

### 3. Enhanced Error Handling

#### ServiceError Class:

```javascript
export class ServiceError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR', statusCode = 500) {
    super(message);
    this.name = 'ServiceError';
    this.code = code;
    this.statusCode = statusCode;
  }
}
```

#### Standardized Response Format:

```javascript
export class ServiceResponse {
  constructor(
    success,
    data = null,
    message = '',
    code = null,
    statusCode = 200,
  ) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.code = code;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }
}
```

#### Ưu điểm:

- **Consistent Error Format**: Tất cả lỗi có format giống nhau
- **Better Debugging**: Error có code và statusCode rõ ràng
- **Predictable Response**: Frontend biết chính xác format response

---

### 4. i18n Integration với Services

#### Message Constants Refactor:

```javascript
// TRƯỚC
export const ERROR_KEYS = {
  INVALID_EMAIL: 'error.invalid_email',
};

// SAU
export const ERROR = {
  INVALID_EMAIL: 'error.invalid_email',
  LOGIN_FAILURE: 'error.login_failure',
  // More organized structure
};
```

#### Service Integration:

```javascript
// auth.service.js
export const login = async (email, password) => {
  try {
    // Logic...
    return ServiceResponse.success(userData, SUCCESS.LOGIN_SUCCESS);
  } catch (error) {
    throw new ServiceError(ERROR.LOGIN_FAILURE, error.code, 400);
  }
};
```

#### Ưu điểm:

- **Internationalization**: Hỗ trợ đa ngôn ngữ
- **Centralized Messages**: Tất cả message ở 1 nơi
- **Consistent UX**: User experience nhất quán

---

### 5. Redux Integration với Services

#### Enhanced Auth Actions:

```javascript
// TRƯỚC - Direct Firebase
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return userCredential.user;
  },
);

// SAU - Through Service Layer
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const result = await authService.login(email, password);
      return {
        user: result.data,
        messageKey: result.message,
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
```

#### Enhanced Auth Reducer:

```javascript
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    lastSuccessMessage: null, // NEW
    lastErrorMessage: null, // NEW
  },
  reducers: {
    clearMessages: (state) => {
      // NEW
      state.lastSuccessMessage = null;
      state.lastErrorMessage = null;
    },
  },
});
```

#### Ưu điểm:

- **Clean Actions**: Actions chỉ handle Redux logic
- **Service Abstraction**: Redux không biết về Firebase
- **Better Error Handling**: Consistent error format trong Redux
- **Message Management**: Quản lý success/error messages trong state

---

### 6. Component Updates

#### Login Component Pattern:

```javascript
// TRƯỚC
const Login = () => {
  const handleSubmit = async (e) => {
    // Direct service calls và UI updates
  };
};

// SAU
const Login = () => {
  const dispatch = useDispatch();
  const { loading, lastSuccessMessage, lastErrorMessage } = useSelector(
    (state) => state.auth,
  );

  // Handle messages with useEffect
  useEffect(() => {
    if (lastSuccessMessage) {
      toast.success(t(lastSuccessMessage));
      dispatch(clearMessages());
    }
    if (lastErrorMessage) {
      toast.error(t(lastErrorMessage));
      dispatch(clearMessages());
    }
  }, [lastSuccessMessage, lastErrorMessage, dispatch]);

  const handleSubmit = async (e) => {
    // Chỉ dispatch action
    dispatch(loginUser({ email, password }));
  };
};
```

#### Ưu điểm:

- **Cleaner Components**: Components chỉ handle UI logic
- **Automatic Message Handling**: useEffect tự động handle messages
- **Loading States**: Loading state từ Redux
- **Better UX**: Toast notifications với i18n

---

## Tips

1. **Luôn tách biệt concerns** - UI, business logic, state management
2. **Sử dụng TypeScript** - Better type safety
3. **Write tests** - Đặc biệt cho services và reducers
4. **Follow naming conventions** - Consistent naming
