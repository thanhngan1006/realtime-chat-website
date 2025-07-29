/**
 * Central export for all services
 */

// Firebase services
export { authService } from './firebase/auth.service';
export { userService } from './firebase/user.service';
export { conversationService } from './firebase/conversation.service';
export { messageService } from './firebase/message.service';

// Repository pattern
export { BaseRepository } from './repository/base.repository';

// Utilities
export {
  ServiceError,
  ErrorCodes,
  withErrorHandler,
  logError,
} from './utils/error-handler';

export {
  ServiceResponse,
  formatTimestamp,
  formatDocument,
  formatDocuments,
} from './utils/response-formatter';
