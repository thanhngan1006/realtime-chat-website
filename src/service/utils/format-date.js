export const formatTimestampFromText = (text) => {
  if (!text) return '';

  const cleaned = text
    .replace(' at ', ' ')
    .replace(' ', '')
    .replace('UTC+7', '+07:00');

  const date = new Date(cleaned);

  if (isNaN(date)) return 'Invalid date';

  const pad = (n) => n.toString().padStart(2, '0');

  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};
