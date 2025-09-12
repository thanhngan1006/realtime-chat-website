# Project Coding Rules (Non-Obvious Only)

- **Services:** Services in `src/service/` are singletons. Always import the exported instance (e.g., `import { authService } from '...'`).
- **Error Handling:** All service methods must be wrapped with `withErrorHandler` from `src/service/utils/error-handler.js`. This utility standardizes error responses.
- **Response Formatting:** Successful service responses should be wrapped in `ServiceResponse.success` from `src/service/utils/response-formatter.js`.
- **Firestore:** Use the `BaseRepository` (`src/service/repository/base.repository.js`) for all Firestore interactions. It handles timestamps and data formatting automatically.
- **Redux:** Follow the feature-sliced pattern in the `features/` directory. Use `createAsyncThunk` for all async actions, and handle them in the `extraReducers` of a slice.
- **Notifications:** Use the `useNotifier` hook (`src/hooks/useNotifier.jsx`) for all user-facing notifications. It handles translation and styling.
