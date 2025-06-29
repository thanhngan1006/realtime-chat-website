import React from 'react';
import { Avatar } from '../common';
import { useDispatch } from 'react-redux';
import { setSelectedUser } from '../../../features/user/userReducer';
import { conversationService } from '../../service/firebase/conversation.service';
import { auth } from '../../firebase';

const UserItem = ({ name, imgUrl, timeSendMessage, user }) => {
  const senderUserId = auth.currentUser.uid;
  const dispatch = useDispatch();

  const handleClickItem = async () => {
    try {
      console.log('Current user:', auth.currentUser);
      console.log('senderUserId and id:', senderUserId, user.id);
      dispatch(setSelectedUser(user));
      await conversationService.createNewChat(senderUserId, user.id);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  return (
    <div
      className="flex items-center gap-3 border-b border-gray-200 p-2 hover:bg-gray-100"
      onClick={handleClickItem}
    >
      <Avatar src={imgUrl} className="h-12 w-12 rounded-full" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">{name}</span>
          <span className="text-xs text-gray-500">{timeSendMessage}</span>
        </div>
        {/* <p className="text-xs text-gray-700">{messageContent}</p> */}
      </div>
    </div>
  );
};

export default UserItem;
