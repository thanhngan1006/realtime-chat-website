import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { BaseRepository } from '../repository/base.repository';
import { ServiceError, withErrorHandler } from '../utils/error-handler';
import { formatDocument, ServiceResponse } from '../utils/response-formatter';
import { db } from '../../firebase';

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
    async ({
      senderId,
      receiverIds,
      conversationId,
      messageContent,
      typeContent,
      imageUrl = '',
      file = '',
      fileName = '',
      video = '',
    }) => {
      if (
        !senderId ||
        !receiverIds ||
        !conversationId ||
        typeContent === undefined
      ) {
        throw new ServiceError(
          MESSAGES_NOTIFICATION.DATA_TO_CREATE_MESSAGE_REQUIRE,
        );
      }

      const newDocRef = doc(collection(db, 'messages'));
      const messageId = newDocRef.id;

      const messageDoc = {
        messageId: messageId,
        conversationId: conversationId,
        readStatus: false,
        messageText: typeContent === 0 ? messageContent : '',
        receiverIds: receiverIds,
        senderId: senderId,
        type: typeContent,
        imageUrl: typeContent === 1 ? imageUrl : '',
        file: typeContent === 2 ? file : '',
        fileName: typeContent === 2 ? fileName : '',
        sentTime: serverTimestamp(),
        deletedBy: [],
        video: typeContent === 3 ? video : '',
      };

      await setDoc(newDocRef, messageDoc);

      const newDoc = await getDoc(newDocRef);
      const formattedDoc = formatDocument(newDoc);

      return ServiceResponse.success(
        formattedDoc,
        'Tin nhắn đã được gửi thành công',
      );
    },
  );

  updateFieldWhenDeleteMessage = withErrorHandler(async (id, deletedUserId) => {
    const data = { deletedBy: arrayUnion(deletedUserId) };

    const updatedDoc = await this.update(id, data);
    return updatedDoc || { deletedBy: [] };
  });

  recallMessage = withErrorHandler(async (id) => {
    const data = {
      messageText: 'Tin nhắn đã được thu hồi',
    };
    const updatedDoc = await this.update(id, data);
    return updatedDoc;
  });

  editMessage = withErrorHandler(async (id, updatedText) => {
    const data = {
      messageText: updatedText,
      updatedAt: serverTimestamp(),
    };
    const updateDoc = await this.update(id, data);
    return updateDoc;
  });

  addReaction = withErrorHandler(async (messageId, userId, emoji) => {
    const data = {
      [`reactions.${userId}`]: emoji,
    };
    const updateDoc = await this.update(messageId, data);
    return updateDoc;
  });

  removeReaction = withErrorHandler(async (messageId, userId) => {
    const data = {
      [`reactions.${userId}`]: null,
    };
    const updateDoc = await this.update(messageId, data);
    return updateDoc;
  });
}

export const messageService = new MessageService();
