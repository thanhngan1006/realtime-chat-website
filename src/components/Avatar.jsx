import React from 'react';

const Avatar = ({ src, className = '' }) => {
  const baseStyles = `rounded-full`;

  return (
    <div className={`${className}`}>
      <img className={`${baseStyles}`} src={`${src}`} alt="" />
    </div>
  );
};

export default Avatar;
