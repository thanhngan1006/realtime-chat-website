import React, { useContext, useEffect, useState } from 'react';
import reset from '../assets/reset.png';
import { FaSpinner } from 'react-icons/fa';
import Input from '../components/Input';
import useNotifier from '../hooks/useNotifier';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/UseAuth';
import { ERROR_KEYS } from '../constants/Message';
import { useTranslation } from 'react-i18next';

const ResetPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const notify = useNotifier();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const { resetPasswordForUser, validateEmail, loading, setLoading } =
    useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError(t(ERROR_KEYS.NOTENTEREMTAIL));
      return;
    }

    if (!validateEmail(email)) {
      setError(t(ERROR_KEYS.INVALID_EMAIL));
      return;
    }
    setLoading(true);

    // con check mail da dang ky hay chua

    try {
      await resetPasswordForUser(email);
      notify(t(ERROR_KEYS.RESET_SUCCESS), 'success');
      setSuccess(true);
      setError('');
    } catch (error) {
      notify(t(ERROR_KEYS.RESET_FAILURE), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setError('');
    if (success) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-blue-950">
      <div className="shadow-blue flex h-4/5 w-4/5 rounded-md bg-white shadow-2xl">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
          <h1 className="text-5xl font-bold text-blue-950">Reset password</h1>
          <h2 className="text-center text-blue-950">Get your new password</h2>
          <img className="w-4/5 object-contain" src={reset} alt="ảnh login" />
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button
              type="submit"
              className="w-full rounded-md bg-blue-700 p-2 text-white transition duration-200 hover:bg-blue-800"
            >
              {loading ? (
                <div className="items-center justify-center">
                  <FaSpinner className="animate-spin" />
                  <span>Reset...</span>
                </div>
              ) : (
                'Reset'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
