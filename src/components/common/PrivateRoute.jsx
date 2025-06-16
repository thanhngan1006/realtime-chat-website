import React from 'react';
import { useContext } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/UseAuth';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';

const PrivateRoute = ({ children }) => {
  const { loading, user, setUser, setLoading } = useContext(AuthContext);

  if (loading) {
    return <span className="loading loading-dots loading-lg"></span>;
  }

  if (auth.currentUser) {
    return children;
  }

  return <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node,
};

export default PrivateRoute;
