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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-brand-500/20 absolute top-[-18%] left-[-12%] h-[28rem] w-[28rem] rounded-full blur-[200px]" />
        <div className="bg-brand-300/18 absolute right-[-12%] bottom-[-18%] h-[30rem] w-[30rem] rounded-full blur-[220px]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-white/80 shadow-[0_45px_140px_-60px_rgba(6,182,212,0.42)] backdrop-blur-2xl lg:flex-row dark:bg-zinc-900/85">
        <div className="from-brand-500 via-brand-400 to-brand-600 relative hidden flex-1 flex-col justify-between bg-gradient-to-br p-12 text-white lg:flex">
          <div className="pointer-events-none absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 h-48 w-48 rounded-full bg-white/30 blur-3xl" />
            <div className="absolute right-0 bottom-0 h-56 w-56 rounded-full bg-white/20 blur-2xl" />
          </div>
          <div className="relative z-10 space-y-6">
            <p className="text-sm tracking-[0.35em] text-white/80 uppercase">
              Create account
            </p>
            <h1 className="text-4xl leading-tight font-semibold">
              Craft a vibrant HQ for every conversation
            </h1>
            <p className="max-w-sm text-sm text-white/85">
              Orchestrate projects, celebrate wins, and let AI capture the
              highlights while you stay present for what matters.
            </p>
          </div>
          <img
            className="relative z-10 mt-10 w-full max-w-md self-center drop-shadow-2xl"
            src={signup}
            alt="Signup illustration"
          />
        </div>

        <div className="flex w-full flex-col justify-center gap-8 p-8 sm:p-10 lg:w-[55%]">
          <div className="space-y-2 text-center lg:text-left">
            <span className="text-sm font-semibold tracking-[0.3em] text-slate-500 uppercase">
              Join the movement
            </span>
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
              Start your journey
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Define your workspace, invite your teams, and unlock AI-assisted
              collaboration built for velocity.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Full name"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Alex Johnson"
                variant="filled"
                inputClassName="rounded-xl bg-white/90 px-4 py-3 text-slate-700 placeholder:text-slate-400 shadow-inner dark:bg-zinc-800/90 dark:text-white"
                className="md:col-span-2"
              />

              <Input
                label="Work email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@company.com"
                variant="filled"
                inputClassName="rounded-xl bg-white/90 px-4 py-3 text-slate-700 placeholder:text-slate-400 shadow-inner dark:bg-zinc-800/90 dark:text-white"
                className="md:col-span-2"
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={isShowPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
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

              <div className="relative">
                <Input
                  label="Confirm password"
                  type={isShowConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  variant="filled"
                  inputClassName="rounded-xl bg-white/90 px-4 py-3 pr-12 text-slate-700 placeholder:text-slate-400 shadow-inner dark:bg-zinc-800/90 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setIsShowConfirmPassword((prev) => !prev)}
                  className="focus-visible:ring-brand-300 absolute top-[58%] right-4 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 focus-visible:ring-2 focus-visible:outline-none"
                  aria-label={
                    isShowConfirmPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {isShowConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/50 bg-white/70 p-4 text-sm text-slate-500 shadow-sm backdrop-blur-xl dark:border-zinc-700/60 dark:bg-zinc-800/70 dark:text-slate-400">
              By creating an account you agree to our{' '}
              <button
                type="button"
                className="text-brand-500 hover:text-brand-600 font-semibold underline"
              >
                Terms
              </button>{' '}
              and{' '}
              <button
                type="button"
                className="text-brand-500 hover:text-brand-600 font-semibold underline"
              >
                Privacy Policy
              </button>
              .
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full !rounded-xl !py-3 text-base"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>

            <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span>Already part of our community?</span>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-brand-500 hover:text-brand-600 focus-visible:ring-brand-300 font-semibold transition focus-visible:ring-2 focus-visible:outline-none"
              >
                Sign in
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

export default Signup;
