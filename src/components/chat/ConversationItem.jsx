import React, { useEffect, useMemo, useState } from 'react';
import { Avatar } from '../common';
import { auth } from '../../firebase';
import { formatTimestampFromText } from '../../service/utils/format-date';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../../../features/user/userReducer';
import { useNavigate } from 'react-router-dom';
import { conversationService, userService } from '../../service';
import { AI_ASSISTANT_ID, AI_ASSISTANT_PROFILE } from '../../constants/ai';
import GroupAvatar from '../common/GroupAvatar';

const ConversationItem = ({ conversationItem }) => {
  const senderUserId = auth.currentUser.uid;
  const [receiverData, setReceiverData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { modeType } = useSelector((state) => state.chat);
  const [groupAvatarUrls, setGroupAvatarUrls] = useState([]);

  const [senderNameInLastMessage, setSenderNameInLastMessage] = useState('');

  const receiverId = useMemo(() => {
    if (!conversationItem?.participants) return null;

    return conversationItem.participants[0] === conversationItem.participants[1]
      ? conversationItem.participants[0]
      : conversationItem.participants.find((id) => id !== senderUserId) || null;
  }, [conversationItem, senderUserId]);

  const presenceStatuses = useSelector((state) => state.user.presenceStatuses);

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

  const truncateText = (text, maxLength = 15) => {
    if (!text) return 'No messages yet';
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  };

  useEffect(() => {
    const fetchReceiverData = async () => {
      try {
        if (modeType === 'isGroup') {
          const participants = conversationItem.participants.filter(
            (id) => id !== senderUserId,
          );
          if (participants.length === 0) {
            setReceiverData({ name: 'Chỉ có bạn', avatarUrl: '' });
            return;
          }

          const groupNameData =
            await conversationService.fetchGroupName(participants);

          const groupName = groupNameData.data;

          setReceiverData({
            name: groupName,
            // avatarUrl: 'https://cdn-icons-png.flaticon.com/512/69/69589.png',
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

  useEffect(() => {
    if (!conversationItem.isGroup) {
      setGroupAvatarUrls([]);
      return;
    }
    const fetchGroupAvatars = async () => {
      let otherParticipants = conversationItem.participants.filter(
        (id) => id !== senderUserId,
      );

      if (otherParticipants.length === 1) {
        otherParticipants.unshift(senderUserId);
      }

      const idsToFetch = otherParticipants.slice(0, 2);

      try {
        const avatarPromises = idsToFetch.map((id) => userService.getUser(id));
        const userDocs = await Promise.all(avatarPromises);

        const urls = userDocs.map((doc) =>
          doc.success ? doc.data.avatarUrl : '/default-avatar.png',
        );
        setGroupAvatarUrls(urls);
      } catch (error) {
        console.error('Error fetching group avatars:', error);
      }
    };

    fetchGroupAvatars();
  }, [conversationItem, senderUserId]);

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

  return (
    <div
      className={`flex items-center gap-3 border-b border-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-500 ${showUnreadIndicator ? 'bg-blue-50 font-bold dark:bg-gray-700' : ''} `}
      onClick={handleClickItem}
    >
      {conversationItem.isGroup ? (
        <GroupAvatar
          src1={groupAvatarUrls[0]}
          src2={groupAvatarUrls[1]}
          className="h-12 w-12"
        />
      ) : (
        <Avatar
          src={receiverData.avatarUrl || ''}
          presenceStatus={displayStatus}
          className="h-12 w-12 rounded-full"
        />
      )}

      <div className="flex-1 flex-col">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">
            {receiverData.name || 'Unknown User'}{' '}
          </span>

          <span className="text-xs text-gray-500">
            {formatTimestampFromText(conversationItem.updatedAt) ||
              'No messages yet'}{' '}
          </span>
        </div>
        {}

        <span>
          {`${conversationItem.lastMessage?.senderId === senderUserId ? `Bạn` : senderNameInLastMessage ? `${senderNameInLastMessage}` : ''}${truncateText(conversationItem.lastMessage?.text)} `}
        </span>
      </div>

      {showUnreadIndicator && (
        <span className="h-3 w-3 rounded-full bg-blue-500"></span>
      )}
    </div>
  );
};

export default ConversationItem;
