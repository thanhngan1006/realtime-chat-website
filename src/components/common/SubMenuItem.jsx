import React from 'react';

const SubMenuItem = ({
  leftIcon,
  rightIcon = null,
  children,
  className = '',
  onClick = () => {},
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between px-4 py-2 text-left transition-colors hover:bg-gray-100 ${className}`}
    >
      <div className="flex items-center gap-3">
        {leftIcon && <span className="text-lg">{leftIcon}</span>}
        <span className="text-sm text-gray-800">{children}</span>
      </div>
      {rightIcon && <span className="text-gray-400">{rightIcon}</span>}
    </button>
  );
};

export default SubMenuItem;
