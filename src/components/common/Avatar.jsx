import React from 'react';
import { useTimeAgo } from '../../hooks/useTimeAgo';

const Avatar = ({ src, className = '', alt = 'Avatar', presenceStatus }) => {
  const timeAgo = useTimeAgo(presenceStatus?.last_changed);

  const renderStatusIndicator = () => {
    if (!presenceStatus?.state) return null;
    if (presenceStatus.state === 'online') {
      return (
        <span className="absolute right-0 bottom-0 block h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500 dark:border-zinc-800" />
      );
    }
    if (presenceStatus.state === 'offline' && presenceStatus.last_changed) {
      return (
        <div className="absolute right-0 bottom-0 flex items-center justify-center rounded-full border-2 border-white bg-green-500 px-1 py-0.5 dark:border-zinc-800">
          <span className="text-[9px] font-bold text-white">{timeAgo}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      <img
        src={src}
        alt={alt}
        className="h-full w-full rounded-full object-cover"
      />
      {renderStatusIndicator()}
    </div>
  );
};

export default Avatar;
