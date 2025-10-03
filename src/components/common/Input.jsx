import React, { forwardRef } from 'react';

const Input = forwardRef(
  (
    {
      type = 'text',
      label = '',
      placeholder = '',
      error = '',
      className = '',
      ...otherProps
    },
    ref,
  ) => {
    const baseInputStyles = 'w-full px-4 py-2.5 border-2 rounded-xl transition-all duration-200 focus:outline-none';
    const normalStyles = 'border-gray-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500';
    const focusStyles = 'focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/30';
    const errorStyles = error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900/30'
      : '';

    return (
      <div className="flex w-full flex-col gap-2">
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={`${baseInputStyles} ${normalStyles} ${focusStyles} ${errorStyles} ${className}`}
          {...otherProps}
        />
        {error && (
          <div className="text-sm text-red-500 dark:text-red-400 ml-1 flex items-center gap-1 animate-slide-in-down">
            <span>⚠</span>
            {error}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
