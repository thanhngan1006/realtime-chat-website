import React from 'react';

const Button = ({
  children,
  size = 'base',
  isDisabled = false,
  className = '',
  ...rest
}) => {
  const baseStyles = `text-${size} rounded`;
  const disabledStyles = isDisabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      className={`${baseStyles} ${disabledStyles} ${className}`}
      disabled={isDisabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
