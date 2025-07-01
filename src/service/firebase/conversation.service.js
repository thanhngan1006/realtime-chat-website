import { collection, getDoc, query, where } from 'firebase/firestore';
import { BaseRepository } from '../repository/base.repository';
import { ServiceError, withErrorHandler } from '../utils/error-handler';
import { db } from '../../firebase';

const CONVERSATION_MESSAGES = {
  CONVESATION_CREATED: 'conversation.conversation_created_success',
  SENDER_ID_OR_RECEIVER_ID_REQUIRED:
    'conversation.sender_id_and_receiver_id_required',
  CONVERSATION_ALREADY_EXIST: 'conversation.conversation_already_exist',
};

class ConversationService extends BaseRepository {
  constructor() {
    super('conversations');
  }

  findOrCreateConversation = withErrorHandler(async (senderId, receiverId) => {
    if (!senderId || !receiverId) {
      throw new ServiceError(
        CONVERSATION_MESSAGES.SENDER_ID_OR_RECEIVER_ID_REQUIRED,
      );
    }

    const conversationsRef = collection(db, 'conversations');
    const q = query(
      conversationsRef,
      where('participants', 'array-contains', senderId),
      where('participants', 'array-contains', receiverId),
      where('isGroup', '==', false),
    );
    const snapshot = await getDoc(q);

    if (snapshot.exists()) {
      return snapshot.data();
    }

    const conversationDoc = {
      participants: [senderId, receiverId],
      lastMessage: null,
      isGroup: false,
    };

    return await this.create(conversationDoc);
  });
}

export const conversationService = new ConversationService();
