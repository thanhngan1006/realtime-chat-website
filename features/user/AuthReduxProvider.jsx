import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import PropTypes from 'prop-types';
import { auth } from '../../src/firebase';
import { setUser } from './authReducer';

const AuthReduxProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      dispatch(setUser(currentUser));
    });

    return () => unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
};
AuthReduxProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthReduxProvider;
