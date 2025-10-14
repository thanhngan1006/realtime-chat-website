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
    email: 'thanhngan10604@gmail.com',
    password: '123456',
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-brand-500/20 absolute top-[-15%] left-[-15%] h-96 w-96 rounded-full blur-[180px]" />
        <div className="bg-brand-300/18 absolute right-[-10%] bottom-[-20%] h-[28rem] w-[28rem] rounded-full blur-[200px]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-white/80 shadow-[0_45px_140px_-60px_rgba(6,182,212,0.42)] backdrop-blur-2xl lg:flex-row dark:bg-zinc-900/85">
        <div className="from-brand-500 via-brand-400 to-brand-600 relative hidden flex-1 flex-col justify-between bg-gradient-to-br p-12 text-white lg:flex">
          <div className="pointer-events-none absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 h-48 w-48 rounded-full bg-white/30 blur-3xl" />
            <div className="absolute right-0 bottom-0 h-56 w-56 rounded-full bg-white/20 blur-2xl" />
          </div>
          <div className="relative z-10 space-y-6">
            <p className="text-sm tracking-[0.35em] text-white/80 uppercase">
              Realtime Chat
            </p>
            <h1 className="text-4xl leading-tight font-semibold">
              Welcome back to your connected workspace
            </h1>
            <p className="max-w-sm text-sm text-white/85">
              Elevate hybrid collaboration with immersive conversations,
              delightful reactions, and an AI copilot for every thread.
            </p>
          </div>
          <img
            className="relative z-10 mt-10 w-full max-w-md self-center drop-shadow-2xl"
            src={login}
            alt="Login illustration"
          />
        </div>

        <div className="flex w-full flex-col justify-center gap-8 p-8 sm:p-10 lg:w-[55%]">
          <div className="space-y-2 text-center lg:text-left">
            <span className="text-sm font-semibold tracking-[0.3em] text-slate-500 uppercase">
              Sign in
            </span>
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
              Enter your account
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Continue where you left off. Your chats, files, and AI notes stay
              perfectly synced across devices.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-4">
              <Input
                label="Email address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@company.com"
                variant="filled"
                inputClassName="rounded-xl bg-white/90 px-4 py-3 text-slate-700 placeholder:text-slate-400 shadow-inner dark:bg-zinc-800/90 dark:text-white"
              />
              <div className="relative flex flex-col gap-2">
                <Input
                  label="Password"
                  type={isShowPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  variant="filled"
                  inputClassName="rounded-xl bg-white/90 px-4 py-3 pr-12 text-slate-700 placeholder:text-slate-400 shadow-inner dark:bg-zinc-800/90 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setIsShowPassword((prev) => !prev)}
                  className="focus-visible:ring-brand-300 absolute top-[58%] right-4 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 focus-visible:ring-2 focus-visible:outline-none"
                  aria-label={
                    isShowPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {isShowPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-500">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="text-brand-500 focus:ring-brand-300 h-4 w-4 rounded border-slate-300"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-brand-500 hover:text-brand-600 focus-visible:ring-brand-300 font-semibold transition focus-visible:ring-2 focus-visible:outline-none"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full !rounded-xl !py-3 text-base"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Sign in'}
            </Button>

            <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span>New to Realtime Chat?</span>
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="text-brand-500 hover:text-brand-600 focus-visible:ring-brand-300 font-semibold transition focus-visible:ring-2 focus-visible:outline-none"
              >
                Create an account
              </button>
            </div>
          </form>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur">
          <FaSpinner className="text-brand-400 animate-spin text-4xl" />
        </div>
      )}
    </div>
  );
};

export default Login;
