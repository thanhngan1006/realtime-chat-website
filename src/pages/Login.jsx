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
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 animate-fade-in">
      <div className="shadow-blue flex h-4/5 w-4/5 max-w-6xl rounded-3xl bg-white shadow-2xl overflow-hidden backdrop-blur-sm animate-scale-in">
        <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8 bg-gradient-to-br from-primary-50 to-primary-100">
          <h1 className="text-5xl font-bold text-primary-900 tracking-tight">Login</h1>
          <h2 className="text-center text-primary-800 text-lg">
            Make your account more secure
          </h2>
          <img className="w-4/5 object-contain drop-shadow-2xl" src={login} alt="ảnh login" />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
          <div className="flex flex-col items-center gap-2 mb-2">
            <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">Realtime Chat</span>
            <p className="text-gray-500 text-sm">Connect with friends instantly</p>
          </div>

          <form onSubmit={handleSubmit} className="flex w-3/5 flex-col gap-5">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <Input
                  label="Email"
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full rounded-xl border-2 border-gray-200 p-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all bg-gray-50 focus:bg-white"
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
                  className="w-full rounded-xl border-2 border-gray-200 p-3 pr-12 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all bg-gray-50 focus:bg-white"
                />
                <div
                  className="absolute right-4 bottom-0 -translate-y-1/2 transform cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => setIsShowPassword((prev) => !prev)}
                >
                  {isShowPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </div>
              </div>
            </div>

            <Button
              onClick={handleForgotPassword}
              type="button"
              className="mb-2 flex flex-col items-start justify-between !border-none !px-0 !py-0 hover:border-0 focus:outline-none focus-visible:outline-none"
            >
              <span className="cursor-pointer text-primary-600 hover:text-primary-700 font-medium transition-colors">
                Forgot password?
              </span>
            </Button>

            <Button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 p-3 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </Button>

            <div className="flex items-center justify-center gap-0.5">
              <span className="text-black">Don't have an account? </span>
              <Button
                type="button"
                onClick={() => navigate('/signup')}
                className="flex flex-col items-start justify-between !border-none !px-0 !py-0 hover:border-0 focus:outline-none focus-visible:outline-none"
              >
                <span className="cursor-pointer text-primary-600 hover:text-primary-700 font-medium transition-colors">
                  Sign up
                </span>
              </Button>
            </div>
          </form>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-2xl animate-scale-in">
            <FaSpinner className="animate-spin text-5xl text-primary-600" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
