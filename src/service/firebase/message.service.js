import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
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
      audio = '',
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
        audio: typeContent === 4 ? audio : '',
      };

      await setDoc(newDocRef, messageDoc);

      // CẬP NHẬT CONVERSATION (LOGIC MỚI) CHO CHỨC NĂNG NHẬN THÔNG BÁO KHI CÓ TIN NHẮN MỚI VÀ HIỂN THỊ LASTMESSAGE LÊN CUỘC TRÒ CHUYÊN
      try {
        const conversationRef = doc(db, 'conversations', conversationId);

        const truncate = (text, limit) => {
          if (!text) return '';
          return text.length > limit ? `${text.slice(0, limit)}…` : text;
        };

        let lastMessageSummary = '';
        switch (typeContent) {
          case 0:
            lastMessageSummary = truncate(messageContent, 160);
            break;
          case 1:
            lastMessageSummary = 'Shared a photo';
            break;
          case 2:
            lastMessageSummary = fileName
              ? `Shared ${fileName}`
              : 'Shared a file';
            break;
          case 3:
            lastMessageSummary = 'Shared a video';
            break;
          case 4:
            lastMessageSummary = 'Sent a voice note';
            break;
          default:
            lastMessageSummary = 'New message';
        }

        const messageTimestamp = serverTimestamp();

        const lastMessageData = {
          senderId: senderId,
          type: typeContent,
          text: typeContent === 0 ? messageContent : '',
          fileName: typeContent === 2 ? fileName : '',
          imageUrl: typeContent === 1 ? imageUrl : '',
          video: typeContent === 3 ? video : '',
          audio: typeContent === 4 ? audio : '',
          summary: lastMessageSummary,
          createdAt: messageTimestamp,
          sentTime: messageTimestamp,
        };

        await updateDoc(conversationRef, {
          lastMessage: lastMessageData,
          // Dùng arrayUnion để thêm những người nhận vào danh sách chưa đọc.
          // Nó sẽ không thêm nếu ID đã tồn tại.
          unReadBy: arrayUnion(...receiverIds),
          updatedAt: messageTimestamp,
        });
      } catch (error) {
        console.error(
          'Lỗi khi cập nhật conversation sau khi gửi tin nhắn:',
          error,
        );
      }

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

    const messageRef = doc(db, 'messages', id);
    const messageDoc = await getDoc(messageRef);
    const messageData = messageDoc.data();
    const conversationId = messageData.conversationId;
    const senderId = messageData.senderId;

    if (conversationId) {
      const conversationRef = doc(db, 'conversations', conversationId);
      await updateDoc(conversationRef, {
        lastMessage: {
          text: '     đã thu hồi một tin nhắn.',
          senderId: senderId,
          sentTime: serverTimestamp(),
        },
        updatedAt: serverTimestamp(),
      });
    }

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
