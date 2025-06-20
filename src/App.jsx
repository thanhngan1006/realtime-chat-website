import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import AppRoutes from './routes';

function App() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </SnackbarProvider>
  );
}

export default App;
