/**
 * Service layer error handler
 */

export class ServiceError extends Error {
  constructor(
    message,
    code = 'SERVICE_ERROR',
    statusCode = 500,
    details = null,
  ) {
    super(message);
    this.name = 'ServiceError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

export const ErrorCodes = {
  // Firebase errors
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  CONVERSATION_NOT_FOUND: 'CONVERSATION_NOT_FOUND',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  DOCUMENT_NOT_FOUND: 'DOCUMENT_NOT_FOUND',
  COLLECTION_EMPTY: 'COLLECTION_EMPTY',

  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',

  // Validation errors
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
};

/**
 * Wraps async functions with error handling
 */
export function withErrorHandler(fn) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }

      // Handle Firebase errors
      if (error.code) {
        switch (error.code) {
          case 'permission-denied':
            throw new ServiceError(
              'You do not have permission to perform this action',
              ErrorCodes.PERMISSION_DENIED,
              403,
            );
          case 'not-found':
            throw new ServiceError(
              'The requested resource was not found',
              ErrorCodes.DOCUMENT_NOT_FOUND,
              404,
            );
          default:
            throw new ServiceError(
              error.message || 'An unexpected error occurred',
              error.code,
              500,
              { originalError: error },
            );
        }
      }

      // Default error
      throw new ServiceError(
        'An unexpected error occurred',
        'UNKNOWN_ERROR',
        500,
        { originalError: error },
      );
    }
  };
}

/**
 * Logs errors with context
 */
export function logError(error, context = {}) {
  console.error('Service Error:', {
    message: error.message,
    code: error.code,
    statusCode: error.statusCode,
    context,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  });
}
