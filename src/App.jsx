import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import AppRoutes from './routes';
import { onAuthStateChanged } from 'firebase/auth';
import { presenceService } from './service/firebase/presence.service';
import { auth } from './firebase';

const App = () => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // === GỌI SETUP PRESENCE KHI ĐĂNG NHẬP ===
        presenceService.setupPresence(user.uid);
      }
      // Không cần làm gì khi đăng xuất, vì logout sẽ xử lý
    });
    return () => unsubscribe();
  }, []);

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
};

export default App;
