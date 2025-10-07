import React, { useEffect, useState } from 'react';
import { MdGroups, MdSearch } from 'react-icons/md';
import { Button, Input } from '../common';
import { UserList, UserStory } from '../user';
import { ListUsersStory } from '../../mock_data/ListUsersStory';
import { auth } from '../../firebase';
import { conversationService, userService } from '../../service';
import { convertFirestoreDocument } from '../../service/utils/format-date';
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
  const isGroupMode = modeType === 'isGroup';

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
        // Convert Firestore Timestamps to JavaScript dates for Redux compatibility
        const convertedUsers = response.data.map((user) =>
          convertFirestoreDocument(user),
        );
        dispatch(setUsers(convertedUsers));
      } catch (error) {
        console.error('Error loading users:', error);
        dispatch(setUsers([]));
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

  const filterButtonClass = (active) =>
    `flex flex-1 items-center justify-center gap-2 rounded-2xl border border-transparent px-3 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 ${
      active
        ? 'bg-gradient-to-r from-brand-300 to-brand-400 text-slate-800 shadow-[0_16px_45px_-30px_rgba(6,182,212,0.35)]'
        : 'bg-white/70 text-slate-600 hover:bg-white/85 dark:bg-zinc-800/70 dark:text-slate-200 dark:hover:bg-zinc-800'
    }`;

  return (
    <div className="flex h-full min-h-0 flex-col gap-6 px-4 text-slate-700 dark:text-slate-200">
      <div className="relative flex items-center">
        <MdSearch className="pointer-events-none absolute left-4 h-5 w-5 text-slate-400 dark:text-slate-500" />
        <Input
          type="text"
          value={searchValue}
          onChange={handleChange}
          placeholder="Search conversations, people, or groups"
          variant="filled"
          className="w-full !gap-0 rounded-2xl"
          size="base"
        />
      </div>

      <div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur-xl dark:border-zinc-700/40 dark:bg-zinc-900/60">
        <UserStory userStorys={ListUsersStory} />
      </div>

      <div className="flex items-center gap-2 rounded-2xl bg-white/75 p-1.5 shadow-inner backdrop-blur-xl dark:bg-zinc-900/70">
        <button
          onClick={() => dispatch(setModeType('notGroup'))}
          className={filterButtonClass(!isGroupMode)}
          type="button"
          aria-pressed={!isGroupMode}
        >
          <FaUserGroup />
          <span>Direct</span>
        </button>
        <button
          onClick={() => dispatch(setModeType('isGroup'))}
          className={filterButtonClass(isGroupMode)}
          type="button"
          aria-pressed={isGroupMode}
        >
          <MdGroups />
          <span>Groups</span>
        </button>
      </div>

      <div className="relative min-h-0 flex-1">
        <div className="absolute inset-0 rounded-3xl border border-dashed border-white/45 opacity-70 dark:border-zinc-700/40" />
        <div className="relative h-full overflow-y-auto px-1 pt-4 pb-6">
          {isGroupMode ? (
            searchValue ? (
              <UserList users={usersExceptSender} />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                    Collaborate together
                  </h2>
                  <Button
                    onClick={handleAddGroup}
                    variant="secondary"
                    size="sm"
                    className="!rounded-xl !bg-white/80 !px-3 !py-2 text-sm text-slate-700 shadow-sm hover:!bg-white dark:!bg-zinc-800/80 dark:text-slate-200"
                  >
                    <IoAddSharp />
                    <span className="ml-1">New group</span>
                  </Button>
                </div>

                {isOpenUserToAddGroup && (
                  <div className="space-y-3 rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur-xl dark:border-zinc-700/40 dark:bg-zinc-900/70">
                    <h3 className="text-sm font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                      Select people
                    </h3>
                    <UserList users={usersExceptSender} />
                    <Button
                      onClick={handleCreateGroupChat}
                      variant="primary"
                      size="sm"
                      className="w-full !rounded-xl"
                    >
                      Create group chat
                    </Button>
                  </div>
                )}

                <ConversationList
                  conversationList={conversations.filter((c) => c.isGroup)}
                />
              </div>
            )
          ) : searchValue ? (
            <UserList users={users} />
          ) : (
            <ConversationList
              conversationList={conversations.filter((c) => !c.isGroup)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
