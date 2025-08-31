# Project Architecture Rules (Non-Obvious Only)

- **Singleton Services:** The service layer (`src/service/`) is built on singletons. This pattern must be maintained for any new services.
- **Generic Repository:** The `BaseRepository` (`src/service/repository/base.repository.js`) is the required pattern for all Firestore interactions. Do not write custom Firestore queries directly in services.
- **Centralized Error Handling:** All new service methods must use the `withErrorHandler` utility to ensure consistent error handling across the application.
- **Feature-Sliced Redux:** New features should follow the existing feature-sliced pattern for Redux, with actions, reducers, and thunks co-located in a new folder under `features/`.
- **Authentication:** All new routes that require a logged-in user must be wrapped in the `PrivateRoute` component.