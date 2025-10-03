import React, { useEffect, useState } from 'react';
import { MdGroups, MdSearch } from 'react-icons/md';
import { Button, Input } from '../common';
import { UserList, UserStory } from '../user';
import { ListUsersStory } from '../../mock_data/ListUsersStory';
import { auth } from '../../firebase';
import { conversationService, userService } from '../../service';
import { useDispatch, useSelector } from 'react-redux';
import { ConversationList } from '../chat';
import {
  setConversations,
  setModeType,
  setSelectedPeopleToCreateGroup,
} from '../../../features/chat/chatReducer';
import {
  setPresenceStatus,
  setUsers,
} from '../../../features/user/userReducer';
import { FaUserGroup } from 'react-icons/fa6';
import { IoAddSharp } from 'react-icons/io5';
import { presenceService } from '../../service/firebase/presence.service';

const Sidebar = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isOpenUserToAddGroup, setIsOpenUserToAddGroup] = useState(false);
  const senderId = auth.currentUser?.uid;
  const dispatch = useDispatch();

  const { conversations, modeType, selectedPeopleToCreateGroup } = useSelector(
    (state) => state.chat,
  );
  const { users } = useSelector((state) => state.user);

  const usersExceptSender = users.filter((user) => user.id !== senderId);

  const handleAddGroup = () => {
    setIsOpenUserToAddGroup(!isOpenUserToAddGroup);
    if (!isOpenUserToAddGroup) {
      dispatch(setSelectedPeopleToCreateGroup([]));
    }
  };

  const handleCreateGroupChat = async () => {
    if (selectedPeopleToCreateGroup.length < 1) {
      console.log('Please select at least one user');
      return;
    }
    const participants = [
      senderId,
      ...selectedPeopleToCreateGroup.map((user) => user.id),
    ];
    try {
      const newGroup = await conversationService.createGroupChat(participants);
      dispatch(
        setConversations([...conversations, { ...newGroup, isGroup: true }]),
      );
      setIsOpenUserToAddGroup(false);
      dispatch(setSelectedPeopleToCreateGroup([]));
    } catch (error) {
      console.error('Error creating group chat:', error);
    }
  };

  useEffect(() => {
    if (!senderId) return;

    const fetchUsers = async () => {
      try {
        const response = await userService.searchUsers(
          searchValue.trim(),
          senderId,
        );
        dispatch(setUsers(response.data));
      } catch (error) {
        console.error('Error loading users:', error);
        setUsers([]);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchUsers();
    }, 0);

    return () => clearTimeout(delayDebounce);
  }, [searchValue, senderId, dispatch]);

  useEffect(() => {
    if (!senderId) return;

    const isGroup = modeType === 'isGroup';

    const unsubscribe = conversationService.listenToConversations(
      senderId,
      isGroup,
      (response) => {
        if (response.success) {
          dispatch(setConversations(response.data));
        } else {
          console.error('Failed to listen to conversations:', response.error);
        }
      },
    );

    return () => unsubscribe();
  }, [senderId, modeType, dispatch]);

  const handleChange = (event) => {
    setSearchValue(event.target.value);
  };

  useEffect(() => {
    const participantsIds = conversations
      .map((convo) => convo.participants.find((pId) => pId !== senderId))
      .filter(Boolean);

    if (participantsIds.length === 0) return;

    const unsubscribe = presenceService.listenToMultipleUsers(
      participantsIds,
      (userId, status) => {
        dispatch(setPresenceStatus({ userId, status }));
      },
    );

    return () => unsubscribe();
  }, [conversations, senderId, dispatch]);

  return (
    <div className="flex flex-col gap-4 px-4 pt-6 pb-4 h-screen">
      <div className="relative flex items-center text-gray-400 focus-within:text-primary-600 transition-colors group">
        <MdSearch className="pointer-events-none absolute left-4 h-5 w-5 transition-all group-focus-within:scale-110" />

        <Input
          type="text"
          value={searchValue}
          onChange={handleChange}
          placeholder="Search conversations..."
          className="w-full rounded-2xl pl-12 pr-4 py-3 bg-gray-100 dark:bg-neutral-700 border-2 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-neutral-600 transition-all duration-200 shadow-sm hover:shadow-md dark:text-white placeholder:text-gray-400"
        />
      </div>

      <UserStory userStorys={ListUsersStory} />

      <div className="flex gap-2 bg-gray-100 dark:bg-neutral-700 rounded-xl p-1">
        <button
          onClick={() => {
            dispatch(setModeType('notGroup'));
          }}
          className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg py-2.5 transition-all duration-200 ${
            modeType !== 'isGroup'
              ? 'bg-white dark:bg-neutral-600 shadow-md text-primary-600 dark:text-primary-400 transform scale-105'
              : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-neutral-600/50'
          }`}
        >
          <FaUserGroup className="h-5 w-5" />
        </button>
        <button
          onClick={() => dispatch(setModeType('isGroup'))}
          className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg py-2.5 transition-all duration-200 ${
            modeType === 'isGroup'
              ? 'bg-white dark:bg-neutral-600 shadow-md text-primary-600 dark:text-primary-400 transform scale-105'
              : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-neutral-600/50'
          }`}
        >
          <MdGroups className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {modeType !== 'isGroup' ? (
          !searchValue ? (
            <ConversationList
              conversationList={conversations.filter((c) => !c.isGroup)}
            />
          ) : (
            <UserList users={users} />
          )
        ) : !searchValue ? (
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleAddGroup}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-4 py-3 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <IoAddSharp className="h-5 w-5" />
              <span className="font-medium">Create Group</span>
            </Button>

            {isOpenUserToAddGroup && (
              <div className="flex flex-col gap-3 p-4 bg-gray-50 dark:bg-neutral-700/50 rounded-xl border border-gray-200 dark:border-neutral-600 animate-slide-in-down">
                <UserList users={usersExceptSender} />
                <Button
                  onClick={handleCreateGroupChat}
                  className="cursor-pointer bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 px-4 py-2.5 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium"
                >
                  Create group chat
                </Button>
              </div>
            )}

            <ConversationList
              conversationList={conversations.filter((c) => c.isGroup)}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Sidebar;
