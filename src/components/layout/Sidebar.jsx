import React, { useEffect, useState } from 'react';
import { MdSearch } from 'react-icons/md';
import { Button, Input } from '../common';
import { UserList } from '../user';
import { auth } from '../../firebase';
import { conversationService, userService } from '../../service';
import { useDispatch, useSelector } from 'react-redux';
import { ConversationList } from '../chat';
import {
  setConversations,
  setSelectedPeopleToCreateGroup,
} from '../../../features/chat/chatReducer';
import {
  setPresenceStatus,
  setUsers,
} from '../../../features/user/userReducer';
import { IoAddSharp } from 'react-icons/io5';
import { presenceService } from '../../service/firebase/presence.service';

const Sidebar = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isOpenUserToAddGroup, setIsOpenUserToAddGroup] = useState(false);
  const senderId = auth.currentUser?.uid;
  const dispatch = useDispatch();

  const { conversations, selectedPeopleToCreateGroup } = useSelector(
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

    const unsubscribe = conversationService.listenToConversations(
      senderId,
      undefined, // Fetch all conversations
      (response) => {
        if (response.success) {
          dispatch(setConversations(response.data));
        } else {
          console.error('Failed to listen to conversations:', response.error);
        }
      },
    );

    return () => unsubscribe();
  }, [senderId, dispatch]);

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
    <div className="flex flex-col gap-3 px-4 pt-4">
      <div className="relative flex items-center text-gray-400 focus-within:text-gray-600">
        <MdSearch className="mb-1xs pointer-events-none absolute mt-2 ml-3 h-5 w-5" />

        <Input
          type="text"
          value={searchValue}
          onChange={handleChange}
          placeholder="Search messenger"
          className="rounded-2xl pr-3 pl-10 dark:text-white"
        />
      </div>

      <div className="flex items-center justify-between px-2 py-2">
        <h2 className="text-xl font-bold">Chats</h2>
        <Button
          onClick={handleAddGroup}
          className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-zinc-700"
        >
          <IoAddSharp size={20} />
        </Button>
      </div>

      {isOpenUserToAddGroup && (
        <div className="p-2">
          <UserList users={usersExceptSender} />
          <Button
            onClick={handleCreateGroupChat}
            className="mt-2 w-full cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Create Group Chat
          </Button>
        </div>
      )}

      <div className="overflow-y-auto">
        {!searchValue ? (
          <ConversationList conversationList={conversations} />
        ) : (
          <UserList users={users} />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
