/**
 * Standardizes service responses
 */

export class ServiceResponse {
  constructor(data = null, success = true, message = '', metadata = {}) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.metadata = {
      timestamp: new Date().toISOString(),
      ...metadata,
    };
  }

  static success(data, message = 'Success', metadata = {}) {
    return new ServiceResponse(data, true, message, metadata);
  }

  static error(message = 'Error', data = null, metadata = {}) {
    return new ServiceResponse(data, false, message, metadata);
  }

  static paginated(items, page, pageSize, total) {
    return new ServiceResponse(items, true, 'Success', {
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasNext: page * pageSize < total,
        hasPrevious: page > 1,
      },
    });
  }
}

/**
 * Recursively converts Firestore Timestamps and Dates to milliseconds (numeric)
 */
export function convertTimestampsToMillis(obj) {
  if (obj === null || obj === undefined) return obj;

  if (obj.toDate && typeof obj.toDate === 'function') {
    // Firestore Timestamp
    return obj.toMillis();
  }

  if (obj instanceof Date) {
    // Date object
    return obj.getTime();
  }

  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      return obj.map(convertTimestampsToMillis);
    } else {
      const converted = {};
      for (const [key, value] of Object.entries(obj)) {
        converted[key] = convertTimestampsToMillis(value);
      }
      return converted;
    }
  }

  return obj;
}

/**
 * Formats Firestore timestamps to milliseconds
 */
export function formatTimestamp(timestamp) {
  if (!timestamp) return null;

  return convertTimestampsToMillis(timestamp);
}

/**
 * Formats Firestore document data by converting all timestamps
 */
export function formatDocument(doc) {
  if (!doc.exists) return null;

  const data = doc.data();
  const formattedData = convertTimestampsToMillis(data);
  return {
    id: doc.id,
    ...formattedData,
  };
}

/**
 * Formats array of Firestore documents
 */
export function formatDocuments(snapshot) {
  return snapshot.docs.map(formatDocument).filter(Boolean);
}
