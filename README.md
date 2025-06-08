# realtime-chat-website

A React.js web chat application built with Vite and Tailwind CSS.

## Getting Started

Follow these steps to get the project up and running locally:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd web-chat
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

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
│   ├── App.jsx      # Main App component
│   ├── App.css      # App styles
│   ├── index.css    # Global styles
│   └── main.jsx     # Application entry point
├── index.html       # HTML template
├── package.json     # Dependencies and scripts
└── vite.config.js   # Vite configuration
```

## Technologies Used

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **ESLint** - Code linting
- **PostCSS** - CSS processing

## Development

The project uses Vite for fast development with Hot Module Replacement (HMR). Changes to your code will automatically reflect in the browser without losing component state.
