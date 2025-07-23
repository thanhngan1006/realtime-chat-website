import {
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { BaseRepository } from '../repository/base.repository';
import { ServiceError, withErrorHandler } from '../utils/error-handler';
import { formatDocuments, ServiceResponse } from '../utils/response-formatter';

const MESSAGES_NOTIFICATION = {
  DATA_TO_CREATE_MESSAGE_REQUIRE: 'messages.data_to_create_message_required',
  FETCH_MESSAGES_SUCCESS: 'messages.fetch_messages_success',
  CONVERSATION_ID_REQUIRED: 'messages.conversation_id_required',
};

class MessageService extends BaseRepository {
  constructor() {
    super('messages');
  }

  createNewMessage = withErrorHandler(
    async (senderId, receiverIds, conversationId, messageContent) => {
      if (!senderId || !receiverIds || !messageContent || !conversationId) {
        throw new ServiceError(
          MESSAGES_NOTIFICATION.DATA_TO_CREATE_MESSAGE_REQUIRE,
        );
      }

      const messageDoc = {
        conversationId: conversationId,
        readStatus: false,
        messageText: messageContent,
        receiverIds: receiverIds,
        senderId: senderId,
        type: 0,
        sentTime: serverTimestamp(),
      };

      const newMessage = await this.create(messageDoc);
      return ServiceResponse.success(newMessage, 'Message sent successfully');
    },
  );
}

export const messageService = new MessageService();
