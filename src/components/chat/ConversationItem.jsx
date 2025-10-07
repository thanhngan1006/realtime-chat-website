import React, { useEffect, useMemo, useState } from 'react';
import { Avatar } from '../common';
import { auth } from '../../firebase';
import { formatTimestampFromText } from '../../service/utils/format-date';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../../../features/user/userReducer';
import { useNavigate } from 'react-router-dom';
import { conversationService, userService } from '../../service';
import { AI_ASSISTANT_ID, AI_ASSISTANT_PROFILE } from '../../constants/ai';

const ConversationItem = ({ conversationItem, details }) => {
  const senderUserId = auth.currentUser.uid;
  const [receiverData, setReceiverData] = useState(details || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { presenceStatuses, selectedUser } = useSelector((state) => state.user);

  const [senderNameInLastMessage, setSenderNameInLastMessage] = useState('');

  useEffect(() => {
    if (details) {
      setReceiverData(details);
    }
  }, [details]);

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

  const lastMessageTimestamp = useMemo(() => {
    const candidate =
      conversationItem.lastMessage?.createdAt ||
      conversationItem.lastMessage?.sentTime ||
      conversationItem.updatedAt;

    if (!candidate) return '';

    const parsed =
      typeof candidate.toDate === 'function'
        ? candidate.toDate()
        : new Date(candidate);

    if (!parsed || Number.isNaN(parsed.getTime())) return '';

    return formatTimestampFromText(parsed);
  }, [conversationItem.lastMessage, conversationItem.updatedAt]);

  const lastMessagePreview = useMemo(() => {
    const truncate = (text, maxLength = 15) => {
      if (!text) return '';
      return text.length > maxLength
        ? `${text.substring(0, maxLength)}...`
        : text;
    };

    const lastMessageData = conversationItem?.lastMessage || {};

    const summary = truncate(lastMessageData.summary, 55);
    if (summary) return summary;

    const text = lastMessageData.text || lastMessageData.messageText;
    if (text) {
      const cleanedText = text.startsWith(': ') ? text.slice(2) : text;
      const truncated = truncate(cleanedText, 55);
      if (truncated) return truncated;
    }

    if (lastMessageData.fileName) {
      return truncate(`Shared ${lastMessageData.fileName}`, 45);
    }

    if (lastMessageData.imageUrl) return 'Shared a photo';
    if (lastMessageData.video) return 'Shared a video';
    if (lastMessageData.audio) return 'Sent a voice note';

    return 'Start the conversation';
  }, [conversationItem]);

  useEffect(() => {
    if (details) return;

    const fetchReceiverData = async () => {
      try {
        if (conversationItem.isGroup) {
          const participants = conversationItem.participants.filter(
            (id) => id !== senderUserId,
          );

          if (participants.length === 0) {
            setReceiverData({ name: 'Group conversation', avatarUrl: '' });
            return;
          }

          const groupNameData =
            await conversationService.fetchGroupName(participants);

          const groupName = groupNameData.success ? groupNameData.data : '';

          setReceiverData({
            name: groupName || 'Group conversation',
            avatarUrl: '',
          });
        } else {
          if (!receiverId) {
            console.error('No receiver found in participants');
            return;
          }

          if (receiverId === AI_ASSISTANT_ID) {
            setReceiverData({ ...AI_ASSISTANT_PROFILE });
            return;
          }

          const userDocSnap = await userService.getUser(receiverId);

          if (userDocSnap.success) {
            setReceiverData(userDocSnap.data);
          } else {
            console.error('No user found for receiverId:', receiverId);
          }
        }
      } catch (error) {
        console.error('Error fetching receiverData: ', error);
      }
    };

    fetchReceiverData();
  }, [conversationItem, senderUserId, receiverId, details]);

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
          id: conversationItem.isGroup ? otherParticipants : receiverId,
          name: receiverData.name || details?.name || 'Unknown user',
          avatarUrl: receiverData.avatarUrl || details?.avatarUrl || '',
          conversationId: conversationId,
          participants: conversationData.participants,
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
      : senderNameInLastMessage ||
        (conversationItem.isGroup ? 'Someone' : receiverData.name || '');

  const cardClasses = `group relative flex w-full items-center gap-4 rounded-2xl border px-4 py-3 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 ${
    isActiveConversation
      ? 'border-brand-200 bg-brand-50 text-brand-800 shadow-sm dark:border-brand-500/40 dark:bg-brand-500/10 dark:text-white'
      : 'border-slate-200 bg-white text-slate-700 shadow-sm hover:border-brand-200 hover:bg-brand-50/60 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-slate-200'
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
          fallback={receiverData.name}
          presenceStatus={displayStatus}
          className={`h-12 w-12 rounded-full shadow-lg ring-2 ${
            isActiveConversation
              ? 'ring-white/70'
              : 'ring-white/50 dark:ring-zinc-800'
          }`}
          aria-hidden="true"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`truncate text-base font-semibold ${
              isActiveConversation
                ? 'text-brand-900 dark:text-white'
                : 'text-slate-800 dark:text-slate-100'
            }`}
          >
            {receiverData.name || 'Unknown user'}
          </span>
          {lastMessageTimestamp && (
            <span
              className={`text-xs ${
                isActiveConversation
                  ? 'text-brand-700 dark:text-slate-300'
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
              ? 'text-brand-700 dark:text-slate-300'
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
