import dayjs from 'dayjs';

export const formatTimestampFromText = (text) => {
  const formatted = dayjs(text).format('DD/MM/YYYY HH:mm');
  return formatted;
};
