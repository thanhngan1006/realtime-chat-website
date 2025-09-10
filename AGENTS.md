# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Commands

- `npm run dev`: Runs the development server.
- `npm run build`: Builds the project for production.
- `npm run lint`: Lints the codebase.
- `npm run lint:fix`: Lints and automatically fixes issues.
- `npm run format`: Formats the code using Prettier.

## Architecture

- **Stack:** React, Vite, Redux, Tailwind CSS, Firebase.
- **State Management:** Redux is used with a feature-sliced structure (see `features/` directory). Async actions are handled with `createAsyncThunk`.
- **Backend:** Firebase is used for authentication and database (Firestore). A generic repository pattern is used for Firestore interactions (see `src/service/repository/base.repository.js`).
- **Routing:** `react-router-dom` is used for routing. A `PrivateRoute` component (`src/components/common/PrivateRoute.jsx`) protects authenticated routes.
- **Services:** Services are implemented as singletons and use a centralized error handler (`withErrorHandler`) and response formatter (`ServiceResponse`).

## Code Style

- **Formatting:** Prettier is used with single quotes and a print width of 80 characters.
- **Linting:** ESLint is used. `prop-types` are disabled.

## Testing

- There is currently no testing framework set up for this project.
