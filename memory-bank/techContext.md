# Technical Context

## Technologies Used

### Frontend

- **React** (v18+)

  - Functional components
  - Hooks
  - Context API
  - React Router

- **Styling**

  - Tailwind CSS
  - Custom CSS
  - Responsive design

- **State Management**
  - React Context
  - Custom hooks
  - Local state

### Backend (Firebase)

- **Authentication**

  - Email/password
  - Session management
  - Protected routes

- **Database**

  - Firestore
  - Real-time updates
  - Data persistence

- **Storage**
  - File uploads
  - Image storage
  - Media handling

## Development Setup

### Prerequisites

- Node.js (v14+)
- npm or yarn
- Git
- Firebase account

### Environment Variables

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

### Development Tools

- **Vite**

  - Fast development server
  - Hot module replacement
  - Build optimization

- **ESLint**

  - Code quality
  - Style enforcement
  - Best practices

- **Prettier**
  - Code formatting
  - Consistent style
  - Auto-formatting

## Dependencies

### Core Dependencies

```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "react-router-dom": "^6.0.0",
  "firebase": "^9.0.0",
  "tailwindcss": "^3.0.0"
}
```

### Development Dependencies

```json
{
  "vite": "^4.0.0",
  "eslint": "^8.0.0",
  "prettier": "^2.0.0",
  "@types/react": "^18.0.0",
  "@types/react-dom": "^18.0.0"
}
```

## Technical Constraints

### Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Performance Requirements

- First contentful paint < 2s
- Time to interactive < 3s
- Real-time updates < 1s
- Bundle size < 200KB

### Security Requirements

- HTTPS only
- Secure authentication
- Input validation
- XSS prevention

## Tool Usage Patterns

### Git Workflow

1. Feature branches
2. Pull requests
3. Code review
4. Merge to main

### Development Process

1. Local development
2. Code review
3. Testing
4. Deployment

### Deployment

1. Build optimization
2. Environment configuration
3. Firebase deployment
4. Monitoring setup
