import React from 'react';

const Button = ({
  children,
  size = 'base',
  variant = 'default',
  isDisabled = false,
  isLoading = false,
  className = '',
  ...rest
}) => {
  const baseSize = `text-${size} px-4 py-2 rounded-md font-sans transition-colors`;
  const disabledStyles =
    isDisabled || isLoading ? 'opacity-50 cursor-not-allowed' : '';

  let variantStyles = '';
  switch (variant) {
    case 'primary':
      variantStyles =
        'bg-primary text-white hover:bg-primary/90 dark:bg-primary dark:text-white';
      break;
    case 'secondary':
      variantStyles =
        'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600';
      break;
    case 'default':
    default:
      variantStyles =
        'border border-neutral text-neutral hover:bg-neutral/10 dark:border-neutral dark:text-neutral dark:hover:bg-neutral/10';
      break;
  }

  const content = isLoading ? (
    <span className="flex items-center gap-2">
      <div className="dark:border-neutral h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
      Loading...
    </span>
  ) : (
    children
  );

  return (
    <button
      className={`${baseSize} ${variantStyles} ${disabledStyles} ${className}`}
      disabled={isDisabled || isLoading}
      {...rest}
    >
      {content}
    </button>
  );
};

export default Button;
