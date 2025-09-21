import React from 'react';

const Loader = ({ size = 'md', color = 'primary' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };
  const colorClasses = {
    primary: 'border-primary',
    neutral: 'border-neutral',
    success: 'border-success',
  };
  const spinnerClass = `animate-spin rounded-full border-2 border-gray-200 border-t-2 ${colorClasses[color] || 'border-t-primary'} ${sizeClasses[size] || sizeClasses.md}`;

  return <div className={spinnerClass}></div>;
};

export default Loader;
