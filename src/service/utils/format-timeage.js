export const formatTimeAgo = (timestamp) => {
  if (!timestamp) return '';
  const now = new Date();
  const past = new Date(timestamp);
  const seconds = Math.floor((now - past) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' năm';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' t';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' n';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + 'g';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + 'p';
  return '0p';
};
