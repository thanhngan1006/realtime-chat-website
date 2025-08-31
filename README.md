# Web Chat

A real-time chat application built with React, Vite, Tailwind CSS, and Firebase.

## Features

- User authentication (signup, login, logout, password reset)
- Real-time messaging with individuals and groups
- User profiles and status (online, offline, etc.)
- Search for other users
- Send text messages, emojis, and file attachments

## Getting Started

Follow these steps to get the project up and running locally:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd web-chat
    ```

2.  **Set up environment variables:**
    ```bash
    cp .env.example .env
    ```
    Then edit `.env` and fill in your actual Firebase configuration values. You can get these from your Firebase project settings.

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Start the development server:**
    ```bash
    npm run dev
    ```

## Usage

Once the development server is running, you can:

1.  **Sign up for a new account** or **log in** with an existing one.
2.  **Search for other users** on the platform.
3.  **Start a new conversation** by selecting a user from the search results.
4.  **Send and receive messages** in real-time.

## Configuration

The application requires the following environment variables for Firebase integration:

- `VITE_FIREBASE_API_KEY` - Your Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN` - Your Firebase auth domain
- `VITE_FIREBASE_PROJECT_ID` - Your Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET` - Your Firebase storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID` - Your Firebase messaging sender ID
- `VITE_FIREBASE_APP_ID` - Your Firebase app ID
- `VITE_FIREBASE_MEASUREMENT_ID` - Your Firebase measurement ID

**Note:** Never commit your `.env` file to version control. Use `.env.example` as a template.

## API Documentation

The application's backend is powered by Firebase, and the interaction with Firebase is handled through a service layer. Here are the main services and their methods:

### AuthService (`src/service/firebase/auth.service.js`)

- `register(email, password, additionalData)`: Registers a new user.
- `login(email, password)`: Logs in a user.
- `logout()`: Logs out the current user.
- `resetPassword(email)`: Sends a password reset email.
- `updatePassword(currentPassword, newPassword)`: Updates the user's password.
- `resendVerificationEmail()`: Resends the email verification email.
- `getCurrentUser()`: Gets the current authenticated user.
- `isAuthenticated()`: Checks if a user is authenticated.
- `onAuthStateChange(callback)`: Subscribes to authentication state changes.

### UserService (`src/service/firebase/user.service.js`)

- `createUserProfile(uid, userData)`: Creates a new user profile in Firestore.
- `getUser(userId)`: Gets a user's profile by their ID.
- `updateUserProfile(userId, updates)`: Updates a user's profile.
- `searchUsers(searchTerm)`: Searches for users by display name or email.
- `updateUserStatus(userId, status)`: Updates a user's online status.
- `getUserContacts(userId)`: Gets a user's contacts.
- `addContact(userId, contactId)`: Adds a new contact.
- `createNewConversationInUser(senderId, receiverId, id)`: Creates a new conversation between two users.

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Run the linter and formatter to ensure your code follows the project's style guidelines:
    ```bash
    npm run lint:fix
    npm run format
    ```
5.  Commit your changes (`git commit -m 'Add some feature'`).
6.  Push to the branch (`git push origin feature/your-feature-name`).
7.  Open a pull request.

## License

This project is not currently licensed.
