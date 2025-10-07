import React, { useState, forwardRef } from 'react';

const Input = forwardRef(
  (
    {
      type = 'text',
      label = '',
      placeholder = '',
      error = '',
      variant = 'outlined',
      size = 'base',
      className = '',
      inputClassName = '',
      disabled = false,
      ...otherProps
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleChange = (event) => {
      // Call the provided onChange handler if it exists
      if (otherProps.onChange) {
        otherProps.onChange(event);
      }
    };

    const baseStyles =
      'block w-full transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variants = {
      outlined:
        'border-2 border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-brand-500 dark:focus:border-brand-400 focus:ring-brand-500 dark:focus:ring-brand-400',
      filled:
        'bg-gray-100 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-zinc-800 focus:border-brand-500 dark:focus:border-brand-400 focus:ring-brand-500 dark:focus:ring-brand-400',
      underlined:
        'border-b-2 border-gray-300 dark:border-zinc-600 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-brand-500 dark:focus:border-brand-400 focus:ring-0',
    };

    const sizes = {
      sm: 'px-3 py-2 text-sm',
      base: 'px-4 py-3 text-base',
      lg: 'px-4 py-4 text-lg',
    };

    const errorStyles = error
      ? 'border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500 dark:focus:ring-red-400'
      : '';

    return (
      <div className={`flex w-full flex-col gap-2 ${className}`}>
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          onChange={handleChange}
          onFocus={(e) => {
            setIsFocused(true);
            // Call the provided onFocus handler if it exists
            if (otherProps.onFocus) {
              otherProps.onFocus(e);
            }
          }}
          onBlur={(e) => {
            setIsFocused(false);
            // Call the provided onBlur handler if it exists
            if (otherProps.onBlur) {
              otherProps.onBlur(e);
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${errorStyles} ${inputClassName} ${isFocused ? 'ring-brand-500 dark:ring-brand-400 ring-2' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? 'input-error' : undefined}
          {...otherProps}
        />
        {error && (
          <p
            id="input-error"
            className="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
