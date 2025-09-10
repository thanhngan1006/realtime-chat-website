# Project Debug Rules (Non-Obvious Only)

- **Service Errors:** Errors from the service layer (`src/service/`) are standardized by `withErrorHandler`. Check the browser console for `ServiceError` objects, which contain a `messageKey`, `code`, and `statusCode`.
- **Redux State:** Use the Redux DevTools to inspect the state. Pay attention to the `loading` and `error` fields in each slice, as well as `lastSuccessMessage` and `lastErrorMessage` in the `auth` slice.
- **Firebase:** Use the Firebase console to monitor authentication and Firestore database changes in real-time.
- **User Status:** The user's online/offline status is updated in the `users` collection in Firestore. This can be useful for debugging presence-related issues.
