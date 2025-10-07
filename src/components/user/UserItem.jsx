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
    <button
      type="button"
      onClick={handleClickItem}
      className={`group focus-visible:ring-brand-300 flex w-full items-center gap-3 rounded-2xl border border-white/55 bg-white/85 p-3 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:outline-none dark:border-zinc-700/40 dark:bg-zinc-900/70 ${isSelected ? 'ring-brand-300 ring-2' : ''}`}
    >
      <Avatar
        src={imgUrl}
        className="h-12 w-12 rounded-full shadow-lg ring-2 ring-white/50 dark:ring-zinc-800"
      />
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {name}
          </span>
          {isSelected && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:bg-emerald-400/20 dark:text-emerald-300">
              Selected
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default UserItem;
