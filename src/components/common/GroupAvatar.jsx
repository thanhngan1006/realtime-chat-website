import React from 'react';

const GroupAvatar = ({ src1, src2, className = 'h-12 w-12' }) => {
  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      <img
        src={src1 || '/default-avatar.png'}
        alt="Group Avatar 1"
        className="absolute top-0 left-0 h-2/3 w-2/3 rounded-full border-2 border-white object-cover dark:border-zinc-800"
      />
      <img
        src={src2 || '/default-avatar.png'}
        alt="Group Avatar 2"
        className="absolute right-0 bottom-0 h-3/4 w-3/4 rounded-full border-2 border-white object-cover dark:border-zinc-800"
      />
    </div>
  );
};

export default GroupAvatar;
