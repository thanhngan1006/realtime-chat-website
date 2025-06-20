import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { auth } from '../../firebase';

const PrivateRoute = ({ children }) => {
  const { loading, user } = useSelector((state) => state.auth);

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  // Check both Firebase auth and Redux state
  if (auth.currentUser || user) {
    return children;
  }

  return <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
