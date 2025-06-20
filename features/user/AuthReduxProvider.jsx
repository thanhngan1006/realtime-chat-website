import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import PropTypes from 'prop-types';
import { auth, db } from '../../src/firebase';
import { setUser, setLoading } from './authReducer';
import { doc, getDoc } from 'firebase/firestore';

const AuthReduxProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Optionally fetch additional user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.exists() ? userDoc.data() : null;

          dispatch(
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              ...userData,
            }),
          );
        } catch (error) {
          console.error('Error fetching user data:', error);
          dispatch(
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
            }),
          );
        }
      } else {
        dispatch(setUser(null));
      }
      dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
};

AuthReduxProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthReduxProvider;
