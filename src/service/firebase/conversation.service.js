import {
  arrayRemove,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { BaseRepository } from '../repository/base.repository';
import {
  ErrorCodes,
  ServiceError,
  withErrorHandler,
} from '../utils/error-handler';
import { db } from '../../firebase';
import { formatDocuments, ServiceResponse } from '../utils/response-formatter';

const CONVERSATION_MESSAGES = {
  CONVESATION_CREATED: 'conversation.conversation_created_success',
  SENDER_ID_OR_RECEIVER_ID_REQUIRED:
    'conversation.sender_id_and_receiver_id_required',
  CONVERSATION_ALREADY_EXIST: 'conversation.conversation_already_exist',
  CONVERSATION_MINIMUM_SIZE: 'conversation.group_min_participants_required',
};

class ConversationService extends BaseRepository {
  constructor() {
    super('conversations');
  }

  // // generate conversation id with sorted participant IDs
  generateConversationId = (senderId, receiverId) => {
    return [senderId, receiverId].sort().join('_');
  };

  createNewChat = withErrorHandler(async (senderId, receiverId) => {
    if (!senderId || !receiverId) {
      throw new ServiceError(
        CONVERSATION_MESSAGES.SENDER_ID_OR_RECEIVER_ID_REQUIRED,
      );
    }

    const conversationsRef = collection(db, 'conversations');
    const q = query(
      conversationsRef,
      where('key', '==', this.generateConversationId(senderId, receiverId)),
    );

    const snapshot = await getDocs(q);

    if (snapshot.docs.length > 0) {
      return snapshot.docs[0].id;
    }

    const conversationDoc = {
      participants: [senderId, receiverId],
      typingStatuses: {
        [senderId]: false,
        [receiverId]: false,
      },
      lastMessage: null,
      isGroup: false,
      key: this.generateConversationId(senderId, receiverId),
      unReadBy: [],
    };

    const docRef = await this.create(conversationDoc);
    return docRef.id;
  });

  createGroupChat = withErrorHandler(async (participants) => {
    if (participants.length < 2) {
      throw new ServiceError('conversation.group_min_participants_required');
    }

    const conversationsRef = collection(db, 'conversations');
    const q = query(
      conversationsRef,
      where('key', '==', this.generateConversationId(participants)),
    );

    const snapshot = await getDocs(q);

    if (snapshot.docs.length > 0) {
      return snapshot.docs[0].data();
    }

    const typingStatuses = participants.reduce((acc, participant) => {
      acc[participant] = false;
      return acc;
    }, {});

    const groupDoc = {
      participants,
      lastMessage: null,
      typingStatuses,
      isGroup: true,
      key: this.generateConversationId(participants),
      unReadBy: [],
    };

    const docRef = await this.create(groupDoc);
    return { id: docRef.id, ...groupDoc };
  });

  listenToConversations = (userId, isGroup, callback) => {
    if (!userId) {
      console.error('User ID is required to listen to conversations.');
      return () => {};
    }

    const q = query(
      this.collectionRef,
      where('participants', 'array-contains', userId),
      where('isGroup', '==', isGroup),
      orderBy('updatedAt', 'desc'),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const conversations = formatDocuments(snapshot);
        callback(ServiceResponse.success(conversations));
      },
      (error) => {
        console.error('Error listening to conversations:', error);
        callback(
          ServiceResponse.fail(null, 'Error listening to conversations'),
        );
      },
    );

    return unsubscribe;
  };

  markAsRead = withErrorHandler(async (conversationId, userId) => {
    if (!conversationId || !userId) return;
    const data = {
      unReadBy: arrayRemove(userId),
    };

    const updateDoc = await this.update(conversationId, data);

    return updateDoc;
  });

  fetchConversation = withErrorHandler(async (senderId, isGroup = false) => {
    const q = query(
      this.collectionRef,
      where('participants', 'array-contains', senderId),
      where('isGroup', '==', isGroup),
      orderBy('updatedAt', 'desc'),
    );

    const snapshot = await getDocs(q);
    const conversations = formatDocuments(snapshot);
    return ServiceResponse.success(conversations);
  });

  fetchGroupName = withErrorHandler(async (participants) => {
    const usersQuery = query(
      collection(db, 'users'),
      where('uid', 'in', participants.slice(0, 10)),
    );
    const querySnapshot = await getDocs(usersQuery);
    const userData = querySnapshot.docs.map((doc) => doc.data());

    const groupName = userData.map((user) => user.name).join(', ');
    return ServiceResponse.success(groupName, 'Lấy tên nhóm thành công');
  });

  fetchAvatarUrl = withErrorHandler(async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      return userDoc.exists() ? userDoc.data().avatarUrl || '' : '';
    } catch (error) {
      console.error('Error fetching avatar:', error);
      return '';
    }
  });

  getConversation = withErrorHandler(async (conversationId) => {
    const conversation = await this.findById(conversationId);

    if (!conversation) {
      throw new ServiceError(
        'Conversation not found',
        ErrorCodes.CONVERSATION_NOT_FOUND,
        404,
      );
    }

    return ServiceResponse.success(conversation);
  });
}

export const conversationService = new ConversationService();
