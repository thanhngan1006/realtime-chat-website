import React, { useState, forwardRef } from 'react';

const Input = forwardRef(
  (
    {
      type = 'text',
      label = '',
      placeholder = '',
      error = '',
      value: externalValue,
      onChange: externalOnChange,
      className = '',
      ...otherProps
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState('');
    const value = externalValue !== undefined ? externalValue : internalValue;
    const handleChange =
      externalOnChange || ((event) => setInternalValue(event.target.value));

    return (
      <div className="flex w-full flex-col gap-2">
        {label && (
          <label
            htmlFor={otherProps.id}
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          id={otherProps.id}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`focus:ring-primary dark:focus:ring-primary rounded-md border border-gray-300 bg-white px-3 py-2 font-sans text-gray-900 ring-0 transition-colors outline-none focus:ring-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white ${className}`}
          {...otherProps}
        />
        {error && (
          <div className="text-sm text-red-500 dark:text-red-400">{error}</div>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
