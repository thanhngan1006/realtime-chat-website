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
    <div className="flex h-full flex-col gap-3 bg-card px-4 pt-4 text-card-foreground">
      <div className="relative flex items-center text-muted-foreground focus-within:text-foreground">
        <MdSearch className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform" />
        <Input
          type="text"
          value={searchValue}
          onChange={handleChange}
          placeholder="Search messenger"
          className="w-full rounded-full bg-muted py-2 pr-3 pl-10"
        />
      </div>

      <div className="flex items-center justify-between px-2 py-2">
        <h2 className="text-xl font-bold">Chats</h2>
        <Button
          onClick={handleAddGroup}
          className="rounded-full p-2 hover:bg-accent"
        >
          <IoAddSharp size={20} />
        </Button>
      </div>

      {isOpenUserToAddGroup && (
        <div className="p-2">
          <UserList users={usersExceptSender} />
          <Button
            onClick={handleCreateGroupChat}
            className="mt-2 w-full cursor-pointer rounded-lg bg-primary py-2 px-4 text-primary-foreground hover:bg-primary/90"
          >
            Create Group Chat
          </Button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
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