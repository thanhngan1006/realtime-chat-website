import React from 'react';
import { useSnackbar } from 'notistack';
import { IoCloseOutline } from 'react-icons/io5';

const useNotifier = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const allowedVariants = ['default', 'error', 'warning', 'info', 'success'];

  const notify = (message, variant = 'default') => {
    const safeVariant = allowedVariants.includes(variant) ? variant : 'default';

    enqueueSnackbar(message, {
      variant:
        /** @type {'default' | 'error' | 'warning' | 'info' | 'success'} */ (
          safeVariant
        ),
      autoHideDuration: 3000,
      preventDuplicate: true,
      action: (key) => (
        <button
          onClick={() => closeSnackbar(key)}
          className="ml-2 text-sm text-white underline"
        >
          <IoCloseOutline />
        </button>
      ),
    });
  };

  return notify;
};

export default useNotifier;
