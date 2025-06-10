# realtime-chat-website

A React.js web chat application built with Vite and Tailwind CSS.

## Getting Started

Follow these steps to get the project up and running locally:

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd web-chat
   ```

2. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Then edit `.env` and fill in your actual Firebase configuration values. You can get these from your Firebase project settings.

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

The application requires the following environment variables for Firebase integration:

- `VITE_FIREBASE_API_KEY` - Your Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN` - Your Firebase auth domain
- `VITE_FIREBASE_PROJECT_ID` - Your Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET` - Your Firebase storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID` - Your Firebase messaging sender ID
- `VITE_FIREBASE_APP_ID` - Your Firebase app ID
- `VITE_FIREBASE_MEASUREMENT_ID` - Your Firebase measurement ID

**Note:** Never commit your `.env` file to version control. Use `.env.example` as a template.

## Available Scripts

- `npm run dev` - Start the development server with hot reload
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## Project Structure

```
web-chat/
├── public/          # Static assets
├── src/             # Source code
│   ├── assets/      # Images, fonts, etc.
│   ├── components/  # Reusable React components
│   ├── pages/       # Page components
│   ├── mock_data/   # Mock data for development
│   ├── App.jsx      # Main App component
│   ├── App.css      # App styles
│   ├── index.css    # Global styles
│   ├── firebase.jsx # Firebase configuration
│   └── main.jsx     # Application entry point
├── .env.example     # Environment variables template
├── index.html       # HTML template
├── package.json     # Dependencies and scripts
└── vite.config.js   # Vite configuration
```

## Technologies Used

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Firebase** - Backend services (Firestore, Analytics)
- **ESLint** - Code linting
- **PostCSS** - CSS processing

## Development

The project uses Vite for fast development with Hot Module Replacement (HMR). Changes to your code will automatically reflect in the browser without losing component state.
