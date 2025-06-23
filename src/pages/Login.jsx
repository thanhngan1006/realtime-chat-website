import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import login from '../assets/login.jpeg';
import { FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useNavigate } from 'react-router-dom';
import useNotifier from '../hooks/useNotifier';
import { ERROR } from '../constants/Message';
import { setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth } from '../firebase';
import { loginUser, validateEmail } from '../../features/user/authActions';
import { clearMessages } from '../../features/user/authReducer';

const Login = () => {
  const navigate = useNavigate();
  const notify = useNotifier();
  const dispatch = useDispatch();

  const { loading, isEmailValid, user, lastSuccessMessage, lastErrorMessage } =
    useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isShowPassword, setIsShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      console.log('user', user);
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

    if (!formData.email || !formData.password) {
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

    try {
      await setPersistence(auth, browserLocalPersistence);
      await dispatch(
        loginUser({
          email: formData.email,
          password: formData.password,
        }),
      ).unwrap();

      // Success handling is done via useEffect watching lastSuccessMessage
    } catch (error) {
      // Error handling is done via useEffect watching lastErrorMessage
      console.error('Login error:', error);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-blue-950">
      <div className="shadow-blue flex h-4/5 w-4/5 rounded-md bg-white shadow-2xl">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
          <h1 className="text-5xl font-bold text-blue-950">Login</h1>
          <h2 className="text-center text-blue-950">
            Make your account more secure
          </h2>
          <img className="w-4/5 object-contain" src={login} alt="ảnh login" />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xl font-bold">Realtime chat</span>
          </div>

          <form onSubmit={handleSubmit} className="flex w-3/5 flex-col gap-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <Input
                  label="Email"
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="relative flex flex-col items-center gap-1">
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
            </div>

            <Button
              onClick={handleForgotPassword}
              type="button"
              className="mb-4 flex flex-col items-start justify-between !border-none !px-0 !py-0 hover:border-0 focus:outline-none focus-visible:outline-none"
            >
              <span className="cursor-pointer text-blue-800 hover:text-blue-950">
                Forgot password?
              </span>
            </Button>

            <Button
              type="submit"
              className="w-full rounded-md bg-blue-700 p-2 text-white transition duration-200 hover:bg-blue-800"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            <div className="flex items-center justify-center gap-0.5">
              <span className="text-black">Don't have an account? </span>
              <Button
                type="button"
                onClick={() => navigate('/signup')}
                className="flex flex-col items-start justify-between !border-none !px-0 !py-0 hover:border-0 focus:outline-none focus-visible:outline-none"
              >
                <span className="cursor-pointer text-blue-800 hover:text-blue-950">
                  Sign up
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

export default Login;
