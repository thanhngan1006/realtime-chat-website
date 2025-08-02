import React from 'react';
import { Avatar } from '../common';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../../../features/user/userReducer';
import { auth } from '../../firebase';
import { conversationService } from '../../service';
import {
  setConversations,
  setSelectedPeopleToCreateGroup,
} from '../../../features/chat/chatReducer';

const UserItem = ({ name, imgUrl, user }) => {
  const senderUserId = auth.currentUser.uid;
  const dispatch = useDispatch();
  const { modeType, selectedPeopleToCreateGroup } = useSelector(
    (state) => state.chat,
  );

  const fetchConversations = async () => {
    try {
      const response =
        await conversationService.fetchConversation(senderUserId);
      dispatch(setConversations(response.data));
    } catch (error) {
      console.error('Error reloading conversations:', error);
    }
  };

  const handleClickItem = async (e) => {
    e.stopPropagation();

    if (modeType == 'notGroup') {
      try {
        const conversationId = await conversationService.createNewChat(
          senderUserId,
          user.id,
        );
        dispatch(setSelectedUser({ ...user, conversationId }));
        await fetchConversations();
      } catch (error) {
        console.error('Error creating chat:', error);
      }
    } else if (modeType == 'isGroup') {
      const isSelected = selectedPeopleToCreateGroup.some(
        (selectedUser) => selectedUser.id === user.id,
      );
      if (isSelected) {
        dispatch(
          setSelectedPeopleToCreateGroup(
            selectedPeopleToCreateGroup.filter(
              (selectedUser) => selectedUser.id !== user.id,
            ),
          ),
        );
      } else {
        dispatch(
          setSelectedPeopleToCreateGroup([
            ...selectedPeopleToCreateGroup,
            user,
          ]),
        );
      }
    } else {
      console.log('khong co gi ');
    }
  };

  const isSelected = selectedPeopleToCreateGroup.some(
    (selectedUser) => selectedUser.id === user.id,
  );

  return (
    <div
      className="flex cursor-pointer items-center gap-3 border-b border-gray-200 p-2 hover:bg-gray-100"
      onClick={handleClickItem}
    >
      <Avatar src={imgUrl} className="h-12 w-12 rounded-full" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">{name}</span>
          {isSelected && (
            <span className="text-xs text-green-500">Selected</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserItem;
