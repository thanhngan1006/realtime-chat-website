import { useState, useEffect } from 'react';
import { formatTimeAgo } from '../service/utils/format-timeage';

export const useTimeAgo = (timestamp) => {
  const [timeAgo, setTimeAgo] = useState(() => formatTimeAgo(timestamp));

  useEffect(() => {
    if (!timestamp) {
      setTimeAgo(null);
      return;
    }

    const intervalId = setInterval(() => {
      setTimeAgo(formatTimeAgo(timestamp));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timestamp]);

  return timeAgo;
};
