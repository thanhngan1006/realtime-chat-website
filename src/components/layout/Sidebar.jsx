import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { MdGroups, MdSearch } from 'react-icons/md';
import { Button, Input, Toast } from '../common';
import { UserList } from '../user';
import { auth } from '../../firebase';
import { conversationService, userService } from '../../service';
import { convertFirestoreDocument } from '../../service/utils/format-date';
import { getConversationDisplayData } from '../../service/utils/conversation-display';
import { useDispatch, useSelector } from 'react-redux';
import { ConversationList } from '../chat';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  setConversations,
  setModeType,
  setSelectedPeopleToCreateGroup,
} from '../../../features/chat/chatReducer';
import {
  setPresenceStatus,
  setUsers,
  setSelectedUser,
} from '../../../features/user/userReducer';
import { FaUserGroup } from 'react-icons/fa6';
import { IoAddSharp } from 'react-icons/io5';
import { presenceService } from '../../service/firebase/presence.service';

const Sidebar = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isOpenUserToAddGroup, setIsOpenUserToAddGroup] = useState(false);
  const [conversationDetails, setConversationDetails] = useState({});
  const [toastData, setToastData] = useState(null);
  const previousConversationsRef = useRef(new Map());
  const toastTimerRef = useRef(null);
  const senderId = auth.currentUser?.uid;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { conversations, modeType, selectedPeopleToCreateGroup } = useSelector(
    (state) => state.chat,
  );
  const { users, selectedUser } = useSelector((state) => state.user);

  const usersExceptSender = users.filter((user) => user.id !== senderId);
  const isGroupMode = modeType === 'isGroup';
  const missingConversations = useMemo(
    () =>
      conversations.filter(
        (conversation) => !conversationDetails[conversation.id],
      ),
    [conversations, conversationDetails],
  );

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

  const selectConversation = useCallback(
    async (conversation) => {
      if (!conversation || !senderId) return;

      const otherParticipants = conversation.participants.filter(
        (participantId) => participantId !== senderId,
      );

      let detail = conversationDetails[conversation.id];
      if (!detail) {
        detail = await getConversationDisplayData(conversation, senderId);
        if (detail) {
          setConversationDetails((prev) => ({
            ...prev,
            [conversation.id]: detail,
          }));
        }
      }

      dispatch(
        setSelectedUser({
          id: conversation.isGroup
            ? otherParticipants
            : (otherParticipants[0] ?? senderId),
          name: detail?.name || '',
          avatarUrl: detail?.avatarUrl || '',
          conversationId: conversation.id,
          participants: conversation.participants,
        }),
      );

      if (conversation.unReadBy?.includes(senderId)) {
        conversationService
          .markAsRead(conversation.id, senderId)
          .catch((error) =>
            console.error('Error marking conversation as read:', error),
          );
      }

      if (location.pathname !== `/${conversation.id}`) {
        navigate(`/${conversation.id}`, { replace: true });
      }
    },
    [conversationDetails, dispatch, location.pathname, navigate, senderId],
  );

  const showToast = useCallback((payload) => {
    if (!payload) return;
    setToastData(payload);
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setToastData(null);
      toastTimerRef.current = null;
    }, 5000);
  }, []);

  const handleToastClose = useCallback(() => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setToastData(null);
  }, []);

  const handleToastAction = useCallback(async () => {
    if (!toastData) return;
    const targetConversation = conversations.find(
      (conversation) => conversation.id === toastData.conversationId,
    );

    if (!targetConversation) {
      handleToastClose();
      return;
    }

    await selectConversation(targetConversation);
    handleToastClose();
  }, [toastData, conversations, selectConversation, handleToastClose]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
        toastTimerRef.current = null;
      }
    };
  }, []);

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
    if (!missingConversations.length) return;

    let cancelled = false;

    (async () => {
      const updates = {};
      for (const conversation of missingConversations) {
        const detail = await getConversationDisplayData(conversation, senderId);
        if (detail) {
          updates[conversation.id] = detail;
        }
      }

      if (!cancelled && Object.keys(updates).length) {
        setConversationDetails((prev) => ({ ...prev, ...updates }));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [missingConversations, senderId]);

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
      .flatMap((conversation) =>
        conversation.participants.filter(
          (participantId) => participantId !== senderId,
        ),
      )
      .filter(
        (participantId, index, array) => array.indexOf(participantId) === index,
      );

    if (participantsIds.length === 0) return;

    const unsubscribe = presenceService.listenToMultipleUsers(
      participantsIds,
      (userId, status) => {
        dispatch(setPresenceStatus({ userId, status }));
      },
    );

    return () => unsubscribe();
  }, [conversations, senderId, dispatch]);

  useEffect(() => {
    if (!senderId) return;

    const previousMap = previousConversationsRef.current;
    const isInitialLoad = previousMap.size === 0;
    const nextMap = new Map();

    conversations.forEach((conversation) => {
      let updatedAtValue = 0;
      if (conversation.updatedAt) {
        const parsed = new Date(conversation.updatedAt);
        updatedAtValue = Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
      }

      const unreadList = conversation.unReadBy || [];
      nextMap.set(conversation.id, {
        updatedAt: updatedAtValue,
        unRead: unreadList,
      });

      const previousEntry = previousMap.get(conversation.id);
      const previouslyUnread =
        previousEntry?.unRead?.includes(senderId) || false;
      const previousUpdatedAt = previousEntry?.updatedAt || 0;

      const nowUnread = unreadList.includes(senderId);
      const hasNewActivity =
        previousEntry === undefined || updatedAtValue > previousUpdatedAt;
      const isActiveConversation =
        selectedUser?.conversationId === conversation.id;
      const isOwnMessage = conversation.lastMessage?.senderId === senderId;

      if (
        !isOwnMessage &&
        !isActiveConversation &&
        nowUnread &&
        (!previouslyUnread || hasNewActivity) &&
        !(isInitialLoad && previousEntry === undefined)
      ) {
        const detail = conversationDetails[conversation.id];
        const rawPreview =
          conversation.lastMessage?.summary ||
          conversation.lastMessage?.text ||
          'You have a new message';

        const messageText =
          rawPreview?.toString().trim() || 'You have a new message';

        showToast({
          conversationId: conversation.id,
          title: detail?.name || 'New message',
          message: messageText,
        });
      }
    });

    previousConversationsRef.current = nextMap;
  }, [
    conversations,
    conversationDetails,
    selectedUser?.conversationId,
    senderId,
    showToast,
  ]);

  useEffect(() => {
    if (!senderId) return;
    if (!conversations.length) return;

    const pathSegments = location.pathname.split('/').filter(Boolean);

    if (pathSegments.length > 1) {
      return;
    }

    const pathConversationId = pathSegments[0] || null;

    const runSelection = async () => {
      const hasSelectedConversation = Boolean(selectedUser?.conversationId);
      const selectedConversationExists = hasSelectedConversation
        ? conversations.some(
            (conversation) => conversation.id === selectedUser.conversationId,
          )
        : false;

      if (pathConversationId) {
        const matchedConversation = conversations.find(
          (conversation) => conversation.id === pathConversationId,
        );

        if (matchedConversation) {
          if (
            !hasSelectedConversation ||
            selectedUser.conversationId !== matchedConversation.id
          ) {
            await selectConversation(matchedConversation);
          }
          return;
        }
      }

      if (hasSelectedConversation && selectedConversationExists) {
        return;
      }

      const sortedConversations = [...conversations].sort((a, b) => {
        const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return dateB - dateA;
      });

      const latestConversation = sortedConversations[0];
      if (latestConversation) {
        await selectConversation(latestConversation);
      }
    };

    runSelection();
  }, [
    conversations,
    selectedUser,
    senderId,
    location.pathname,
    selectConversation,
  ]);

  const filterButtonClass = (active) =>
    `flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 ${
      active
        ? 'border-brand-200 bg-brand-50 text-brand-700'
        : 'border-transparent bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-zinc-800 dark:text-slate-200'
    }`;

  return (
    <div className="relative flex h-full min-h-0 flex-col gap-6 bg-slate-100 px-4 py-4 text-slate-800 dark:bg-zinc-950 dark:text-slate-200">
      {toastData && (
        <div className="pointer-events-none absolute inset-x-0 top-4 z-20 flex justify-center">
          <Toast
            title={toastData.title}
            message={toastData.message}
            actionLabel="Open chat"
            onAction={handleToastAction}
            onClose={handleToastClose}
          />
        </div>
      )}
      <div className="relative flex items-center">
        <MdSearch className="pointer-events-none absolute left-4 h-5 w-5 text-slate-400 dark:text-slate-500" />
        <Input
          type="text"
          value={searchValue}
          onChange={handleChange}
          placeholder="Search conversations, people, or groups"
          variant="outlined"
          className="w-full"
          inputClassName="rounded-full border border-slate-200 bg-white px-11 py-3 text-slate-800 placeholder:text-slate-400 shadow-sm focus:ring-brand-300 dark:border-zinc-700 dark:bg-zinc-900"
          size="base"
        />
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-white p-1.5 shadow-sm dark:bg-zinc-900">
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
        <div className="absolute inset-0 rounded-2xl border border-dashed border-slate-200 opacity-70 dark:border-zinc-700" />
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
                    className="!rounded-xl !border !border-slate-200 !bg-white !px-3 !py-2 text-sm text-slate-700 shadow-sm hover:!bg-slate-100 dark:!border-zinc-700 dark:!bg-zinc-800/80 dark:text-slate-200"
                  >
                    <IoAddSharp />
                    <span className="ml-1">New group</span>
                  </Button>
                </div>

                {isOpenUserToAddGroup && (
                  <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/80">
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
                  conversationDetailsMap={conversationDetails}
                />
              </div>
            )
          ) : searchValue ? (
            <UserList users={users} />
          ) : (
            <ConversationList
              conversationList={conversations.filter((c) => !c.isGroup)}
              conversationDetailsMap={conversationDetails}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
