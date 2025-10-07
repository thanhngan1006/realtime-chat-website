import { AI_ASSISTANT_ID, AI_ASSISTANT_PROFILE } from '../../constants/ai';
import { convertFirestoreDocument } from './format-date';
import { conversationService } from '../firebase/conversation.service';
import { userService } from '../firebase/user.service';

const fallbackGroupName = (participantsCount) => {
  return participantsCount > 1
    ? `Group of ${participantsCount} people`
    : 'Group conversation';
};

export const getConversationDisplayData = async (
  conversation,
  currentUserId,
) => {
  if (!conversation || !currentUserId) {
    return null;
  }

  const otherParticipants = conversation.participants.filter(
    (participantId) => participantId !== currentUserId,
  );

  if (!conversation.isGroup) {
    const receiverId = otherParticipants[0] || currentUserId;

    if (receiverId === AI_ASSISTANT_ID) {
      return {
        name: AI_ASSISTANT_PROFILE.name,
        avatarUrl: AI_ASSISTANT_PROFILE.avatarUrl,
        participants: otherParticipants,
      };
    }

    try {
      const response = await userService.getUser(receiverId);
      if (response.success) {
        const converted = convertFirestoreDocument(response.data);
        return {
          name: converted.name || 'Unknown user',
          avatarUrl: converted.avatarUrl || '',
          participants: otherParticipants,
        };
      }
    } catch (error) {
      console.error('Unable to fetch user for conversation display:', error);
    }

    return {
      name: 'Unknown user',
      avatarUrl: '',
      participants: otherParticipants,
    };
  }

  try {
    const groupResponse =
      await conversationService.fetchGroupName(otherParticipants);

    if (groupResponse.success) {
      const rawName = groupResponse.data;
      const participantsCount = otherParticipants.length + 1;

      const cleanedName = rawName?.trim()
        ? rawName
        : fallbackGroupName(participantsCount);

      return {
        name: cleanedName,
        avatarUrl: '',
        participants: otherParticipants,
      };
    }
  } catch (error) {
    console.error('Unable to fetch group name:', error);
  }

  return {
    name: fallbackGroupName(otherParticipants.length + 1),
    avatarUrl: '',
    participants: otherParticipants,
  };
};
