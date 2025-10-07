import React, { useEffect, useMemo, useState } from 'react';
import { Avatar } from '../common';
import { auth } from '../../firebase';
import { formatTimestampFromText } from '../../service/utils/format-date';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../../../features/user/userReducer';
import { useNavigate } from 'react-router-dom';
import { conversationService, userService } from '../../service';
import { AI_ASSISTANT_ID, AI_ASSISTANT_PROFILE } from '../../constants/ai';

const ConversationItem = ({ conversationItem }) => {
  const senderUserId = auth.currentUser.uid;
  const [receiverData, setReceiverData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { modeType } = useSelector((state) => state.chat);
  const { presenceStatuses, selectedUser } = useSelector((state) => state.user);

  const [senderNameInLastMessage, setSenderNameInLastMessage] = useState('');

  const receiverId = useMemo(() => {
    if (!conversationItem?.participants) return null;

    return conversationItem.participants[0] === conversationItem.participants[1]
      ? conversationItem.participants[0]
      : conversationItem.participants.find((id) => id !== senderUserId) || null;
  }, [conversationItem, senderUserId]);

  const isSelfConversation = useMemo(() => {
    if (
      !conversationItem?.participants ||
      conversationItem.participants.length < 2
    )
      return false;
    const uniqueIds = new Set(conversationItem.participants);
    return uniqueIds.size < conversationItem.participants.length;
  }, [conversationItem]);

  const baseUnread = conversationItem.unReadBy?.includes(senderUserId);
  const showUnreadIndicator =
    baseUnread && !isSelfConversation && receiverId !== AI_ASSISTANT_ID;

  const isActiveConversation =
    selectedUser?.conversationId === conversationItem.id;

  const lastMessageTimestamp = conversationItem.lastMessage?.createdAt
    ? formatTimestampFromText(conversationItem.lastMessage.createdAt)
    : conversationItem.updatedAt
      ? formatTimestampFromText(conversationItem.updatedAt)
      : '';

  const lastMessagePreview = useMemo(() => {
    const truncate = (text, maxLength = 15) => {
      if (!text) return 'No messages yet';
      return text.length > maxLength
        ? `${text.substring(0, maxLength)}...`
        : text;
    };

    if (!conversationItem?.lastMessage) return 'Start the conversation';

    const { messageText, fileName, imageUrl, audio } =
      conversationItem.lastMessage;

    if (messageText) return truncate(messageText, 55);
    if (fileName) return truncate(`Shared ${fileName}`, 45);
    if (imageUrl) return 'Shared a photo';
    if (audio) return 'Sent a voice note';
    return 'New activity';
  }, [conversationItem]);

  useEffect(() => {
    const fetchReceiverData = async () => {
      try {
        if (modeType === 'isGroup') {
          const participants = conversationItem.participants.filter(
            (id) => id !== senderUserId,
          );
          if (participants.length === 0) {
            setReceiverData({ name: 'Group Chat', avatarUrl: '' });
            return;
          }

          const groupNameData =
            await conversationService.fetchGroupName(participants);

          const groupName = groupNameData.data;

          setReceiverData({
            name: groupName,
            avatarUrl: 'https://cdn-icons-png.flaticon.com/512/69/69589.png',
          });
        } else {
          if (!receiverId) {
            console.error('No receiver found in participants');
            return;
          }

          if (receiverId == AI_ASSISTANT_ID) {
            setReceiverData({ ...AI_ASSISTANT_PROFILE });
          } else {
            const userDocSnap = await userService.getUser(receiverId);

            if (userDocSnap.success) {
              setReceiverData(userDocSnap.data);
            } else {
              console.error('No user found for receiverId:', receiverId);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching receiverData: ', error);
      }
    };

    fetchReceiverData();
  }, [conversationItem, senderUserId, dispatch, receiverId, modeType]);

  const handleClickItem = async () => {
    try {
      const conversationId = conversationItem.id;

      const getConversationData =
        await conversationService.getConversation(conversationId);
      const conversationData = getConversationData.data;

      const otherParticipants = conversationData.participants.filter(
        (id) => id !== senderUserId,
      );

      dispatch(
        setSelectedUser({
          id: modeType == 'isGroup' ? otherParticipants : receiverId,
          name: receiverData.name || 'Unknown User',
          avatarUrl: receiverData.avatarUrl || '',
          conversationId: conversationId,
        }),
      );

      if (baseUnread) {
        await conversationService.markAsRead(conversationId, senderUserId);
      }

      navigate(`/${conversationId}`);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  useEffect(() => {
    const fetchSenderName = async () => {
      if (receiverId === AI_ASSISTANT_ID) {
        console.log('AI_ASSISTANT_PROFILE.name', AI_ASSISTANT_PROFILE.name);
        setSenderNameInLastMessage(AI_ASSISTANT_PROFILE.name);
        return;
      }

      try {
        if (conversationItem.lastMessage?.senderId) {
          const senderData = await userService.getUser(
            conversationItem.lastMessage.senderId,
          );
          if (senderData.success) {
            setSenderNameInLastMessage(
              senderData.data.name || 'Người dùng ẩn danh',
            );
          } else {
            setSenderNameInLastMessage(conversationItem.lastMessage.senderId);
          }
        }
      } catch (error) {
        console.error('Error fetching sender name:', error);
        setSenderNameInLastMessage(
          conversationItem.lastMessage?.senderId || 'Unknown',
        );
      }
    };

    fetchSenderName();
  }, [conversationItem, receiverId]);

  const displayStatus = useMemo(() => {
    if (!conversationItem.isGroup) {
      const singleReceiverId = conversationItem.participants.find(
        (pId) => pId !== senderUserId,
      );
      return presenceStatuses[singleReceiverId];
    }

    if (conversationItem.isGroup) {
      const otherParticipantsIds = conversationItem.participants.filter(
        (pId) => pId !== senderUserId,
      );

      if (otherParticipantsIds.length === 0) return null;

      let anyoneOnline = false;
      let mostRecentOfflineUserStatus = null;

      for (const id of otherParticipantsIds) {
        const status = presenceStatuses[id];

        if (status?.state === 'online') {
          anyoneOnline = true;
          break;
        }

        if (status?.state === 'offline' && status.last_changed) {
          if (
            !mostRecentOfflineUserStatus ||
            status.last_changed > mostRecentOfflineUserStatus.last_changed
          ) {
            mostRecentOfflineUserStatus = status;
          }
        }
      }

      if (anyoneOnline) {
        return { state: 'online' };
      }

      return mostRecentOfflineUserStatus;
    }

    return null;
  }, [conversationItem, senderUserId, presenceStatuses]);

  const senderLabel =
    conversationItem.lastMessage?.senderId === senderUserId
      ? 'You'
      : senderNameInLastMessage;

  const cardClasses = `group relative flex w-full items-center gap-4 rounded-2xl border px-4 py-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 ${
    isActiveConversation
      ? 'border-transparent bg-gradient-to-r from-brand-500/90 via-brand-400/90 to-brand-600/90 text-white shadow-glow'
      : 'border-white/35 bg-white/65 text-slate-700 shadow-sm hover:-translate-y-0.5 hover:shadow-lg dark:border-zinc-700/40 dark:bg-zinc-900/65 dark:text-slate-200'
  }`;

  return (
    <button
      type="button"
      onClick={handleClickItem}
      className={cardClasses}
      aria-label={`Open conversation with ${receiverData.name || 'Unknown user'}`}
      aria-pressed={isActiveConversation}
    >
      <div className="relative flex-shrink-0">
        <Avatar
          src={receiverData.avatarUrl || ''}
          presenceStatus={displayStatus}
          className={`h-12 w-12 rounded-full shadow-lg ring-2 ${
            isActiveConversation
              ? 'ring-white/70'
              : 'ring-white/50 dark:ring-zinc-800'
          }`}
          aria-hidden="true"
        />
        {displayStatus?.state === 'online' && (
          <span className="absolute -right-1 -bottom-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400 shadow-md dark:border-zinc-900" />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`truncate text-base font-semibold ${
              isActiveConversation
                ? 'text-white'
                : 'text-slate-800 dark:text-slate-100'
            }`}
          >
            {receiverData.name || 'Unknown user'}
          </span>
          {lastMessageTimestamp && (
            <span
              className={`text-xs ${
                isActiveConversation
                  ? 'text-white/80'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {lastMessageTimestamp}
            </span>
          )}
        </div>
        <div
          className={`mt-1 flex min-w-0 items-center gap-1 text-sm ${
            isActiveConversation
              ? 'text-white/80'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {senderLabel && (
            <span className="inline-flex shrink-0 items-center gap-1 font-medium">
              {senderLabel}
              <span aria-hidden="true">•</span>
            </span>
          )}
          <span className="truncate" aria-label="Last message preview">
            {lastMessagePreview}
          </span>
        </div>
      </div>

      {showUnreadIndicator && !isActiveConversation && (
        <span className="bg-accent absolute top-4 right-4 h-2.5 w-2.5 rounded-full shadow-md" />
      )}
    </button>
  );
};

export default ConversationItem;
