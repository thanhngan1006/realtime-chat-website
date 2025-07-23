import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from './pages/Layout';
import Home from './pages/Home';
import NoPage from './pages/NoPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ResetPassword from './pages/ResetPassword';
import { PrivateRoute } from './components/common';
import Profile from './pages/Profile';

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="/:conversation-id" element={<Home />} />
        <Route path="profile/:uid" element={<Profile />} />
        <Route path="*" element={<NoPage />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ResetPassword />} />
    </Routes>
  );
};

export default AppRoutes;
