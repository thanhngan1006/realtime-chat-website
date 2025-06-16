# Real-time Chat Application Documentation

## Overview

This documentation provides comprehensive information about the real-time chat application built with React and Firebase. The application enables real-time messaging between users with features like user authentication, message history, and user status tracking.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Component Documentation](#component-documentation)
4. [State Management](#state-management)
5. [Authentication](#authentication)
6. [Styling](#styling)
7. [Best Practices](#best-practices)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository

```bash
git clone [repository-url]
cd realtime-chat-website
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

4. Start the development server

```bash
npm run dev
# or
yarn dev
```

## Project Structure

```
src/
├── components/
│   ├── chat/          # Chat-related components
│   ├── layout/        # Layout components
│   ├── user/          # User-related components
│   └── common/        # Reusable components
├── context/           # React context providers
├── pages/            # Page components
├── mock_data/        # Mock data for development
├── assets/           # Static assets
└── firebase.jsx      # Firebase configuration
```

## Component Documentation

Detailed documentation for each component category:

- [Chat Components](./components/chat/README.md)

  - Message
  - MessageBox
  - OptionsForMessage

- [Layout Components](./components/layout/README.md)

  - Sidebar
  - HeadingMessageBar
  - SubMenu

- [User Components](./components/user/README.md)

  - UserItem
  - UserList
  - UserStory
  - UserStoryItem
  - SearchPeople

- [Common Components](./components/common/README.md)
  - Avatar
  - Button
  - Input
  - Loader
  - PrivateRoute
  - SubMenuItem

## State Management

The application uses React Context for state management, particularly for:

- User authentication state
- Chat messages
- User presence
- Application settings

## Authentication

The application uses Firebase Authentication with the following features:

- Email/password authentication
- Password reset functionality
- Protected routes
- Session management

## Styling

The application uses:

- Tailwind CSS for styling
- Custom CSS for specific components
- Responsive design principles
- Consistent color scheme and spacing

## Best Practices

### Code Organization

1. Components are organized by functionality
2. Common components are reusable
3. Clear separation of concerns
4. Consistent file naming

### Performance

1. Lazy loading of components
2. Optimized image loading
3. Efficient state updates
4. Proper error handling

### Security

1. Protected routes
2. Secure authentication
3. Input validation
4. XSS prevention

### Accessibility

1. Semantic HTML
2. ARIA labels
3. Keyboard navigation
4. Screen reader support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
