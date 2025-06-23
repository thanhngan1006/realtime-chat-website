import React from 'react';

const Avatar = ({ src, className = '', alt = 'Avatar', isOnline = false }) => {
  const baseStyles = `rounded-full`;

  return (
    <div className={`relative ${className}`}>
      <img src={src} alt={alt} className={` ${baseStyles} object-cover`} />
      {isOnline && (
        <span className="absolute right-0 bottom-0 block h-3 w-3 rounded-full border-2 border-white bg-green-500" />
      )}
    </div>
  );
};

export default Avatar;
