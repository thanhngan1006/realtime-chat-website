import React, { useEffect, useState } from 'react';
import reset from '../assets/reset.png';
import { FaSpinner } from 'react-icons/fa';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';
import useNotifier from '../hooks/useNotifier';
import { ERROR } from '../constants/Message';
import { useDispatch, useSelector } from 'react-redux';
import { resetPasswordForUser } from '../../features/user/authActions';
import { validateEmail, clearMessages } from '../../features/user/authReducer';

const ResetPassword = () => {
  const navigate = useNavigate();
  const notify = useNotifier();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');

  const { loading, isEmailValid, lastSuccessMessage, lastErrorMessage } =
    useSelector((state) => state.auth);

  useEffect(() => {
    if (email) {
      dispatch(validateEmail(email));
    }
  }, [email, dispatch]);

  // Handle success/error messages
  useEffect(() => {
    if (lastSuccessMessage) {
      notify(lastSuccessMessage, 'success');
      dispatch(clearMessages());
      // Navigate back to login after successful reset request
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [lastSuccessMessage, notify, dispatch, navigate]);

  useEffect(() => {
    if (lastErrorMessage) {
      notify(lastErrorMessage, 'error');
      dispatch(clearMessages());
    }
  }, [lastErrorMessage, notify, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      notify(ERROR.NOT_ENTER_EMAIL, 'error');
      return;
    }

    if (!isEmailValid) {
      notify(ERROR.INVALID_EMAIL, 'error');
      return;
    }

    try {
      await dispatch(resetPasswordForUser(email)).unwrap();
      // Success handling is done via useEffect watching lastSuccessMessage
    } catch (error) {
      // Error handling is done via useEffect watching lastErrorMessage
      console.error('Reset password error:', error);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-brand-500/20 absolute top-[-16%] left-[-12%] h-[24rem] w-[24rem] rounded-full blur-[200px]" />
        <div className="bg-brand-300/18 absolute right-[-10%] bottom-[-16%] h-[26rem] w-[26rem] rounded-full blur-[200px]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-white/80 shadow-[0_40px_120px_-60px_rgba(6,182,212,0.38)] backdrop-blur-2xl md:flex-row dark:bg-zinc-900/85">
        <div className="from-brand-500 via-brand-400 to-brand-600 relative hidden flex-1 flex-col justify-between bg-gradient-to-br p-12 text-white md:flex">
          <div className="pointer-events-none absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 h-44 w-44 rounded-full bg-white/30 blur-3xl" />
            <div className="absolute right-0 bottom-0 h-52 w-52 rounded-full bg-white/20 blur-2xl" />
          </div>
          <div className="relative z-10 space-y-6">
            <p className="text-sm tracking-[0.35em] text-white/80 uppercase">
              Reset password
            </p>
            <h1 className="text-4xl leading-tight font-semibold">
              Reclaim access to your conversations
            </h1>
            <p className="max-w-sm text-sm text-white/85">
              Enter your email to receive a secure reset link. Back in moments,
              with your teams and timelines exactly where you left them.
            </p>
          </div>
          <img
            className="relative z-10 mt-10 w-full max-w-sm self-center drop-shadow-2xl"
            src={reset}
            alt="Reset password illustration"
          />
        </div>

        <div className="flex w-full flex-col justify-center gap-8 p-8 sm:p-10 md:w-[55%]">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-sm font-semibold tracking-[0.3em] text-slate-500 uppercase">
              Recover access
            </span>
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
              We’ve got your back
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Provide the email tied to your Realtime Chat account. We’ll send a
              magic link to reset your password securely.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Email address"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              variant="filled"
              inputClassName="rounded-xl bg-white/90 px-4 py-3 text-slate-700 placeholder:text-slate-400 shadow-inner dark:bg-zinc-800/90 dark:text-white"
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full !rounded-xl !py-3 text-base"
              disabled={loading}
            >
              {loading ? 'Sending reset link...' : 'Send reset link'}
            </Button>

            <div className="rounded-2xl border border-white/50 bg-white/70 p-4 text-sm text-slate-500 shadow-sm backdrop-blur-xl dark:border-zinc-700/60 dark:bg-zinc-800/70 dark:text-slate-400">
              Didn’t receive the email? Remember to check your spam folder or
              request another link after a few minutes.
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span>Remembered your password?</span>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-brand-500 hover:text-brand-600 focus-visible:ring-brand-300 font-semibold transition focus-visible:ring-2 focus-visible:outline-none"
              >
                Return to sign in
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

export default ResetPassword;
