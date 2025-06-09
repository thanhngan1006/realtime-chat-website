import React from 'react';

const Button = ({
  children,
  size = "base",        
  bgColor = "blue-500", 
  isDisabled = false,
  className = "",
  ...rest           
}) => {
  const baseStyles = `text-${size} bg-${bgColor} px-4 py-2 rounded`;
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



