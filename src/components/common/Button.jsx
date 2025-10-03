import React from 'react';

const Button = ({
  children,
  size = 'base',
  variant = 'default',
  isDisabled = false,
  className = '',
  ...rest
}) => {
  const sizeStyles = {
    sm: 'text-sm px-3 py-1.5',
    base: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };

  const variantStyles = {
    default: 'bg-gray-100 dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-600 text-gray-900 dark:text-white',
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-md hover:shadow-lg',
    secondary: 'bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white shadow-md hover:shadow-lg',
    outline: 'border-2 border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20',
    ghost: 'hover:bg-gray-100 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-300',
  };

  const baseStyles = 'rounded-lg font-medium transition-all duration-200 inline-flex items-center justify-center';
  const disabledStyles = isDisabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : 'hover:scale-[1.02] active:scale-[0.98]';

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${disabledStyles} ${className}`}
      disabled={isDisabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
