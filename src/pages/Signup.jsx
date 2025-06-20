import React, { useContext, useEffect, useState } from 'react';
import signup from '../assets/signup.png';
import { FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { sendEmailVerification } from 'firebase/auth';
import useNotifier from '../hooks/useNotifier';
import { AuthContext } from '../context/UseAuth';
import { ERROR_KEYS, SUCCESS_KEYS } from '../constants/Message';
import { useTranslation } from 'react-i18next';
import { Button, Input } from '../components/common';
import { useDispatch, useSelector } from 'react-redux';
import { createUser, validateEmail } from '../../features/user/authActions';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const notify = useNotifier();
  const dispatch = useDispatch();

  // const { createUser, loading, setLoading, validateEmail } =
  //   useContext(AuthContext);

  const { loading, isEmailValid } = useSelector((state) => state.auth);

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmedPassword, setIsShowConfirmedPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmedPassword: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (formData.email) {
      dispatch(validateEmail(formData.email));
    }
  }, [formData.email, dispatch]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmedPassword
    ) {
      setError(t(ERROR_KEYS.NOT_FULL_FIELD));
      return;
    }

    if (formData.password.length < 6) {
      setError(t(ERROR_KEYS.INVALID_PASSWORD));
      return;
    }

    if (formData.password !== formData.confirmedPassword) {
      {
        setError(t(ERROR_KEYS.PASSWORD_NOT_MATCH_CONFIRMED_PASSWORD));
        return;
      }
    }

    if (!isEmailValid) {
      setError(t(ERROR_KEYS.INVALID_EMAIL));
      return;
    }

    try {
      const result = await dispatch(
        createUser({ email: formData.email, password: formData.password }),
      ).unwrap();

      await sendEmailVerification(result);

      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, 'users', user.uid), {
          name: formData.fullName,
          email: formData.email,
          avatarUrl: '',
        });
      }

      notify(t(SUCCESS_KEYS.SIGNUP_SUCCESS), 'success');
      setError('');
      navigate('/login');
    } catch (error) {
      setError(t(ERROR_KEYS.ERROR_DEFAULT));
      notify(t(ERROR_KEYS.SIGNUP_FAILURE), 'error');
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-blue-950">
      <div className="shadow-blue flex h-4/5 w-4/5 rounded-md bg-white shadow-2xl">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
          <h1 className="text-5xl font-bold text-blue-950">Sign up</h1>
          <h2 className="text-center text-blue-950">Create new account</h2>
          <img className="w-4/5 object-contain" src={signup} alt="ảnh signup" />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xl font-bold">Realtime chat</span>
          </div>

          <form onSubmit={handleSubmit} className="flex w-3/5 flex-col gap-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <Input
                  label="Fullname"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleOnChange}
                  placeholder="Enter fullname"
                  className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <Input
                  label="Email"
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleOnChange}
                  placeholder="Enter email"
                  className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="relative flex flex-col items-center gap-1">
                <Input
                  label="Password"
                  type={isShowPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleOnChange}
                  placeholder="Enter password"
                  className="w-full rounded-md border border-gray-300 p-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <div
                  className="absolute right-3 bottom-0 -translate-y-1/2 transform cursor-pointer text-gray-500"
                  onClick={() => setIsShowPassword((prev) => !prev)}
                >
                  {isShowPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>

              <div className="relative flex flex-col items-center gap-1">
                <Input
                  label="Confirmed Password"
                  type={isShowConfirmedPassword ? 'text' : 'password'}
                  name="confirmedPassword"
                  value={formData.confirmedPassword}
                  onChange={handleOnChange}
                  placeholder="Enter password"
                  className="w-full rounded-md border border-gray-300 p-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <div
                  className="absolute right-3 bottom-0 -translate-y-1/2 transform cursor-pointer text-gray-500"
                  onClick={() => setIsShowConfirmedPassword((prev) => !prev)}
                >
                  {isShowConfirmedPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button
              type="submit"
              className="mt-4 w-full rounded-md bg-blue-700 p-2 text-white transition duration-200 hover:bg-blue-800"
            >
              Sign up
            </Button>

            <div className="flex items-center justify-center gap-0.5">
              <span className="text-black">Already have an account? </span>
              <Button
                type="button"
                onClick={() => {
                  navigate('/login');
                }}
                className="flex flex-col items-start justify-between !border-none !px-0 !py-0 hover:border-0 focus:outline-none focus-visible:outline-none"
              >
                <span className="cursor-pointer text-blue-800 hover:text-blue-950">
                  Login
                </span>
              </Button>
            </div>
          </form>
        </div>
      </div>

      {loading && (
        <div className="fixed flex items-center justify-center">
          <FaSpinner className="animate-spin text-4xl text-blue-700" />
        </div>
      )}
    </div>
  );
};

export default Signup;
