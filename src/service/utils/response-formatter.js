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
 * Formats Firestore timestamps to ISO strings
 */
export function formatTimestamp(timestamp) {
  if (!timestamp) return null;

  // Handle Firestore Timestamp
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toISOString();
  }

  // Handle Date object
  if (timestamp instanceof Date) {
    return timestamp.toISOString();
  }

  // Handle string timestamp
  if (typeof timestamp === 'string') {
    return new Date(timestamp).toISOString();
  }

  return null;
}

/**
 * Formats Firestore document data
 */
export function formatDocument(doc) {
  if (!doc.exists) return null;

  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: formatTimestamp(data.createdAt),
    updatedAt: formatTimestamp(data.updatedAt),
  };
}

/**
 * Formats array of Firestore documents
 */
export function formatDocuments(snapshot) {
  return snapshot.docs.map(formatDocument).filter(Boolean);
}
