# Project Documentation Rules (Non-Obvious Only)

- **Feature-Sliced Structure:** The `features/` and `components/` directories are organized by feature (e.g., `chat`, `user`). This is the primary organizational principle of the codebase.
- **Service Layer:** The `src/service/` directory contains all backend-related logic. `firebase/` contains the raw service calls, `repository/` contains the generic Firestore repository, and `utils/` contains helpers for error handling and response formatting.
- **Redux Logic:** Redux actions, reducers, and thunks are co-located within their respective feature folders in the `features/` directory.
- **No Tests:** There is no testing framework set up, so don't look for tests or try to run them.
