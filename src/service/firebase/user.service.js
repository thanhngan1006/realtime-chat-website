import {
  doc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  orderBy,
} from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db, auth } from '../../firebase';
import { BaseRepository } from '../repository/base.repository';
import {
  ServiceError,
  ErrorCodes,
  withErrorHandler,
} from '../utils/error-handler';
import { ServiceResponse } from '../utils/response-formatter';
import { CONVERSATION_MESSAGES } from '../../constants/Message';

// User service specific message keys
const USER_MESSAGES = {
  PROFILE_CREATED: 'user.profile_created_success',
  PROFILE_UPDATED: 'user.profile_updated_success',
  STATUS_UPDATED: 'user.status_updated_success',
  CONTACT_ADDED: 'user.contact_added_success',
  USERS_FOUND: 'user.users_found',
  USER_ID_DATA_REQUIRED: 'user.user_id_data_required',
  USER_ID_UPDATES_REQUIRED: 'user.user_id_updates_required',
  SEARCH_TERM_REQUIRED: 'user.search_term_required',
  CANNOT_ADD_YOURSELF: 'user.cannot_add_yourself_contact',
  CONTACT_USER_NOT_FOUND: 'user.contact_user_not_found',
  INVALID_STATUS: 'user.invalid_status',
};

class UserService extends BaseRepository {
  constructor() {
    super('users');
  }

  /**
   * Create a new user profile in Firestore
   */
  createUserProfile = withErrorHandler(async (uid, userData) => {
    if (!uid || !userData) {
      throw new ServiceError(
        USER_MESSAGES.USER_ID_DATA_REQUIRED,
        ErrorCodes.INVALID_INPUT,
        400,
      );
    }

    const userDoc = {
      uid,
      email: userData.email,
      name: userData.displayName || '',
      avatarUrl: userData.photoURL || '',
      bio: userData.bio || '',
      status: 'online',
      lastSeen: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(this.collectionRef, uid), userDoc);

    return ServiceResponse.success(userDoc, USER_MESSAGES.PROFILE_CREATED);
  });

  /**
   * Get user by ID with enhanced data
   */
  getUser = withErrorHandler(async (userId) => {
    const user = await this.findById(userId);

    if (!user) {
      throw new ServiceError('User not found', ErrorCodes.USER_NOT_FOUND, 404);
    }

    // Add any additional user data processing here
    return ServiceResponse.success(user);
  });

  /**
   * Update user profile
   */
  updateUserProfile = withErrorHandler(async (userId, updates) => {
    if (!userId || !updates) {
      throw new ServiceError(
        USER_MESSAGES.USER_ID_UPDATES_REQUIRED,
        ErrorCodes.INVALID_INPUT,
        400,
      );
    }

    // Update Firestore document
    const updatedUser = await this.update(userId, updates);

    // Update Firebase Auth profile if display name or photo changed
    if (auth.currentUser && auth.currentUser.uid === userId) {
      const authUpdates = {};
      if (updates.displayName) authUpdates.displayName = updates.displayName;
      if (updates.photoURL) authUpdates.photoURL = updates.photoURL;

      if (Object.keys(authUpdates).length > 0) {
        await updateProfile(auth.currentUser, authUpdates);
      }
    }

    return ServiceResponse.success(updatedUser, USER_MESSAGES.PROFILE_UPDATED);
  });

  /**
   * Search users by display name or email
   */
  searchUsers = withErrorHandler(async (searchTerm) => {
    if (!searchTerm) {
      const allQuery = query(this.collectionRef, orderBy('lastSeen', 'desc'));
      const snapshot = await getDocs(allQuery);
      const allUsers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return ServiceResponse.success(
        allUsers,
        `${USER_MESSAGES.USERS_FOUND}: ${allUsers.length}`,
      );
    }

    const searchLower = searchTerm.toLowerCase();

    // Search by display name
    const nameQuery = query(
      this.collectionRef,
      where('name', '>=', searchTerm),
      where('name', '<=', searchTerm + '\uf8ff'),
    );

    const nameSnapshot = await getDocs(nameQuery);
    const nameResults = nameSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Search by email (exact match for privacy)
    const emailQuery = query(
      this.collectionRef,
      where('email', '==', searchLower),
    );

    const emailSnapshot = await getDocs(emailQuery);
    const emailResults = emailSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Combine and deduplicate results
    const allResults = [...nameResults, ...emailResults];
    const uniqueResults = Array.from(
      new Map(allResults.map((user) => [user.id, user])).values(),
    );

    // Filter out current user
    // const filteredResults = uniqueResults.filter(
    //   (user) => user.id !== currentUserId,
    // );

    return ServiceResponse.success(
      uniqueResults,
      `${USER_MESSAGES.USERS_FOUND}: ${uniqueResults.length}`,
    );
  });

  /**
   * Update user online status
   */
  updateUserStatus = withErrorHandler(async (userId, status) => {
    const validStatuses = ['online', 'away', 'busy', 'offline'];

    if (!validStatuses.includes(status)) {
      throw new ServiceError(
        `${USER_MESSAGES.INVALID_STATUS}: ${validStatuses.join(', ')}`,
        ErrorCodes.INVALID_INPUT,
        400,
      );
    }

    const updates = {
      status,
      lastSeen: serverTimestamp(),
    };

    await updateDoc(doc(this.collectionRef, userId), updates);

    return ServiceResponse.success({ status }, USER_MESSAGES.STATUS_UPDATED);
  });

  /**
   * Get user's friends/contacts
   */
  getUserContacts = withErrorHandler(async (userId) => {
    // This assumes you have a subcollection for contacts
    const contactsRef = collection(db, `users/${userId}/contacts`);
    const snapshot = await getDocs(contactsRef);

    const contacts = await Promise.all(
      snapshot.docs.map(async (contactDoc) => {
        const contactData = contactDoc.data();
        const userDetails = await this.getUser(contactData.userId);
        return {
          ...contactData,
          userDetails: userDetails.data,
        };
      }),
    );

    return ServiceResponse.success(contacts);
  });

  /**
   * Add a contact
   */
  addContact = withErrorHandler(async (userId, contactId) => {
    if (userId === contactId) {
      throw new ServiceError(
        USER_MESSAGES.CANNOT_ADD_YOURSELF,
        ErrorCodes.INVALID_INPUT,
        400,
      );
    }

    // Check if contact exists
    const contactExists = await this.exists(contactId);
    if (!contactExists) {
      throw new ServiceError(
        USER_MESSAGES.CONTACT_USER_NOT_FOUND,
        ErrorCodes.USER_NOT_FOUND,
        404,
      );
    }

    const contactRef = doc(db, `users/${userId}/contacts`, contactId);
    await setDoc(contactRef, {
      userId: contactId,
      addedAt: serverTimestamp(),
    });

    return ServiceResponse.success({ contactId }, USER_MESSAGES.CONTACT_ADDED);
  });

  handleFileRead = withErrorHandler(async (event) => {
    const file = event.target.files[0];
    const base64 = await this.convertBase64(file);
    return base64;
  });

  convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  createNewConversationInUser = withErrorHandler(
    async (senderId, receiverId, id) => {
      if (!senderId || !receiverId) {
        throw new ServiceError(
          CONVERSATION_MESSAGES.SENDER_ID_OR_RECEIVER_ID_REQUIRED,
        );
      }

      const conversationDoc = {
        conversationId: id,
        unreadMessage: '',
        lastMessage: '',
      };

      await this.createSubCollection(
        senderId,
        'conversations',
        conversationDoc,
      );
      await this.createSubCollection(
        receiverId,
        'conversations',
        conversationDoc,
      );
    },
  );
}

// Export singleton instance
export const userService = new UserService();
