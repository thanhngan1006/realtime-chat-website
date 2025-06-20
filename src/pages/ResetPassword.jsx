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
    <div className="flex h-screen w-full items-center justify-center bg-blue-950">
      <div className="shadow-blue flex h-4/5 w-4/5 rounded-md bg-white shadow-2xl">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
          <h1 className="text-5xl font-bold text-blue-950">Reset Password</h1>
          <h2 className="text-center text-blue-950">
            Enter your email to reset your password
          </h2>
          <img
            className="w-4/5 object-contain"
            src={reset}
            alt="reset password"
          />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xl font-bold">Realtime chat</span>
          </div>

          <form onSubmit={handleSubmit} className="flex w-3/5 flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Input
                label="Email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-md bg-blue-700 p-2 text-white transition duration-200 hover:bg-blue-800"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Email'}
            </Button>

            <div className="flex items-center justify-center gap-0.5">
              <span className="text-black">Remember your password? </span>
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

export default ResetPassword;
