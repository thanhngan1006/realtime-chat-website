import React, { useEffect, useMemo, useState } from 'react';
import { Avatar } from '../common';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { formatTimestampFromText } from '../../service/utils/format-date';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../../../features/user/userReducer';
import { useNavigate } from 'react-router-dom';
import { conversationService } from '../../service';

const ConversationItem = ({ conversationItem }) => {
  const senderUserId = auth.currentUser.uid;
  const [receiverData, setReceiverData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isGroupModeSelected } = useSelector((state) => state.chat);

  const receiverId = useMemo(() => {
    if (!conversationItem?.participants) return null;

    return conversationItem.participants[0] === conversationItem.participants[1]
      ? conversationItem.participants[0]
      : conversationItem.participants.find((id) => id !== senderUserId) || null;
  }, [conversationItem, senderUserId]);

  useEffect(() => {
    const fetchReceiverData = async () => {
      try {
        if (isGroupModeSelected === 'isGroup') {
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

          const userDocRef = doc(db, 'users', receiverId);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setReceiverData(userDocSnap.data());
          } else {
            console.error('No user found for receiverId:', receiverId);
          }
        }
      } catch (error) {
        console.error('Error fetching receiverData: ', error);
      }
    };

    fetchReceiverData();
  }, [
    conversationItem,
    senderUserId,
    dispatch,
    receiverId,
    isGroupModeSelected,
  ]);

  const handleClickItem = async () => {
    try {
      const conversationId = conversationItem.id;
      const docRef = doc(db, 'conversations', conversationId);
      const docSnap = await getDoc(docRef);
      const conversationData = docSnap.data();

      const otherParticipants = conversationData.participants.filter(
        (id) => id !== senderUserId,
      );

      // console.log('otherParticipants', otherParticipants);
      // console.log('conversationId', conversationId);

      dispatch(
        setSelectedUser({
          id: isGroupModeSelected == 'isGroup' ? otherParticipants : receiverId,
          name: receiverData.name || 'Unknown User',
          avatarUrl: receiverData.avatarUrl || '',
          conversationId: conversationId,
        }),
      );

      navigate(`/${conversationId}`);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  return (
    <div
      className="flex items-center gap-3 border-b border-gray-200 p-2 hover:bg-gray-100"
      onClick={handleClickItem}
    >
      <Avatar
        src={receiverData.avatarUrl || ''}
        className="h-12 w-12 rounded-full"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">
            {receiverData.name || 'Unknown User'}{' '}
          </span>
          <span className="text-xs text-gray-500">
            {formatTimestampFromText(conversationItem.updatedAt) ||
              'No messages yet'}{' '}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
