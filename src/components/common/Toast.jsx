import React from 'react';

const Toast = ({ title, message, actionLabel, onAction, onClose }) => {
  return (
    <div className="pointer-events-auto flex max-w-sm items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
      <div className="bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-200 flex h-10 w-10 items-center justify-center rounded-full">
        <span className="text-lg" aria-hidden="true">
          ✨
        </span>
      </div>
      <div className="flex-1">
        {title ? (
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {title}
          </p>
        ) : null}
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
          {message}
        </p>
        {actionLabel ? (
          <button
            type="button"
            onClick={onAction}
            className="text-brand-600 hover:text-brand-500 focus-visible:ring-brand-300 dark:text-brand-300 dark:hover:text-brand-200 mt-3 inline-flex items-center gap-1 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="focus-visible:ring-brand-300 rounded-full p-1 text-slate-400 transition-colors hover:text-slate-600 focus:outline-none focus-visible:ring-2 dark:text-slate-500 dark:hover:text-slate-300"
        aria-label="Dismiss notification"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default Toast;
