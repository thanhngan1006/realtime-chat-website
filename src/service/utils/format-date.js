import dayjs from 'dayjs';

export const formatTimestampFromText = (text) => {
  const formatted = dayjs(text).format('DD/MM/YYYY HH:mm');
  return formatted;
};

const convertValue = (value) => {
  if (value === null || value === undefined) return value;

  if (typeof value === 'object') {
    if (typeof value.toDate === 'function') {
      return value.toDate();
    }

    if (Array.isArray(value)) {
      return value.map((item) => convertValue(item));
    }

    return Object.entries(value).reduce((acc, [key, val]) => {
      acc[key] = convertValue(val);
      return acc;
    }, {});
  }

  return value;
};

export const convertFirestoreDocument = (doc) => {
  if (!doc || typeof doc !== 'object') return doc;
  return convertValue(doc);
};
