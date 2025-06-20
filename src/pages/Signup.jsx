import React, { useEffect, useState } from 'react';
import signup from '../assets/signup.png';
import { FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createUser } from '../../features/user/authActions';
import { validateEmail, clearMessages } from '../../features/user/authReducer';
import useNotifier from '../hooks/useNotifier';
import { ERROR } from '../constants/Message';
import { Button, Input } from '../components/common';

const Signup = () => {
  const navigate = useNavigate();
  const notify = useNotifier();
  const dispatch = useDispatch();

  const { loading, isEmailValid, user, lastSuccessMessage, lastErrorMessage } =
    useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (formData.email) {
      dispatch(validateEmail(formData.email));
    }
  }, [formData.email, dispatch]);

  // Handle success/error messages
  useEffect(() => {
    if (lastSuccessMessage) {
      notify(lastSuccessMessage, 'success');
      dispatch(clearMessages());
    }
  }, [lastSuccessMessage, notify, dispatch]);

  useEffect(() => {
    if (lastErrorMessage) {
      notify(lastErrorMessage, 'error');
      dispatch(clearMessages());
    }
  }, [lastErrorMessage, notify, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      notify(ERROR.NOT_FULL_FIELD, 'error');
      return;
    }

    if (!isEmailValid) {
      notify(ERROR.INVALID_EMAIL, 'error');
      return;
    }

    if (formData.password.length < 6) {
      notify(ERROR.INVALID_PASSWORD, 'error');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      notify(ERROR.PASSWORD_NOT_MATCH_CONFIRMED_PASSWORD, 'error');
      return;
    }

    try {
      await dispatch(
        createUser({
          email: formData.email,
          password: formData.password,
          displayName: formData.fullName,
        }),
      ).unwrap();

      // Success handling is done via useEffect watching lastSuccessMessage
    } catch (error) {
      // Error handling is done via useEffect watching lastErrorMessage
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-blue-950">
      <div className="shadow-blue flex h-4/5 w-4/5 rounded-md bg-white shadow-2xl">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
          <h1 className="text-5xl font-bold text-blue-950">Sign Up</h1>
          <h2 className="text-center text-blue-950">
            Join our community today
          </h2>
          <img className="w-4/5 object-contain" src={signup} alt="signup" />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xl font-bold">Realtime chat</span>
          </div>

          <form onSubmit={handleSubmit} className="flex w-3/5 flex-col gap-4">
            <div className="flex flex-col gap-4">
              <Input
                label="Full Name"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={isShowPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full rounded-md border border-gray-300 p-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <div
                  className="absolute right-3 bottom-0 -translate-y-1/2 transform cursor-pointer text-gray-500"
                  onClick={() => setIsShowPassword((prev) => !prev)}
                >
                  {isShowPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>

              <div className="relative">
                <Input
                  label="Confirm Password"
                  type={isShowConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full rounded-md border border-gray-300 p-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <div
                  className="absolute right-3 bottom-0 -translate-y-1/2 transform cursor-pointer text-gray-500"
                  onClick={() => setIsShowConfirmPassword((prev) => !prev)}
                >
                  {isShowConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full rounded-md bg-blue-700 p-2 text-white transition duration-200 hover:bg-blue-800"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>

            <div className="flex items-center justify-center gap-0.5">
              <span className="text-black">Already have an account? </span>
              <Button
                type="button"
                onClick={() => navigate('/login')}
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
