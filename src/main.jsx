import { StrictMode } from 'react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import AuthReduxProvider from '../features/user/AuthReduxProvider';

import './i18n/i18n';
import store from './store';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AuthReduxProvider>
        <StrictMode>
          <App />
        </StrictMode>
      </AuthReduxProvider>
    </Provider>
  </StrictMode>,
);
