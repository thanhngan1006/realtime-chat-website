import React, { useMemo } from 'react';
import { useTimeAgo } from '../../hooks/useTimeAgo';

const extractInitials = (text) => {
  if (!text) return 'U';

  const normalized = text.trim();
  if (!normalized) return 'U';

  const parts = normalized.split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const Avatar = ({
  src,
  className = '',
  alt = 'Avatar',
  presenceStatus,
  fallback,
}) => {
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

  const fallbackText = useMemo(
    () => fallback || alt || 'User',
    [fallback, alt],
  );
  const initials = useMemo(() => extractInitials(fallbackText), [fallbackText]);

  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-200 text-base font-semibold text-slate-700 uppercase dark:bg-zinc-700 dark:text-white">
          {initials}
        </div>
      )}
      {renderStatusIndicator()}
    </div>
  );
};

export default Avatar;
