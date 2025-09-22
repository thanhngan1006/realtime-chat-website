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
  setSelectedUser,
  setUsers,
} from '../../../features/user/userReducer';
import { FaUserGroup } from 'react-icons/fa6';
import { IoAddSharp } from 'react-icons/io5';
import { presenceService } from '../../service/firebase/presence.service';
import { useNavigate } from 'react-router-dom';
import { AI_ASSISTANT_ID, AI_ASSISTANT_PROFILE } from '../../constants/ai';

const Sidebar = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isOpenUserToAddGroup, setIsOpenUserToAddGroup] = useState(false);
  const senderId = auth.currentUser?.uid;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { conversations, modeType, selectedPeopleToCreateGroup } = useSelector(
    (state) => state.chat,
  );
  const { users, selectedUser } = useSelector((state) => state.user);

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

  // === TỰ ĐỘNG CHỌN CUỘC TRÒ CHUYỆN ĐẦU TIÊN ===
  useEffect(() => {
    if (conversations.length > 0 && !selectedUser?.id && senderId) {
      console.log('Auto-selecting the first conversation...');

      const firstConversation = conversations[0];

      const selectFirstConversation = async () => {
        try {
          let userData = {
            id: null,
            name: 'Loading...',
            avatarUrl: '',
            conversationId: firstConversation.id,
          };

          if (firstConversation.isGroup) {
            const otherParticipants = firstConversation.participants.filter(
              (p) => p !== senderId,
            );
            const groupNameData =
              await conversationService.fetchGroupName(otherParticipants);
            userData.id = otherParticipants;
            userData.name = groupNameData.data;
          } else {
            const receiverId = firstConversation.participants.find(
              (p) => p !== senderId,
            );
            userData.id = receiverId;

            if (receiverId === AI_ASSISTANT_ID) {
              userData.name = AI_ASSISTANT_PROFILE.name;
              userData.avatarUrl = AI_ASSISTANT_PROFILE.avatarUrl;
            } else if (receiverId) {
              const userDoc = await userService.getUser(receiverId);
              if (userDoc.success) {
                userData.name = userDoc.data.name;
                userData.avatarUrl = userDoc.data.avatarUrl;
              }
            }
          }

          dispatch(setSelectedUser(userData));

          navigate(`/${firstConversation.id}`);
        } catch (error) {
          console.error('Error auto-selecting conversation:', error);
        }
      };

      selectFirstConversation();
    }
  }, [conversations, selectedUser, senderId, dispatch, navigate]);

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

      <UserStory userStorys={ListUsersStory} />

      <div className="flex">
        <button
          onClick={() => {
            dispatch(setModeType('notGroup'));
          }}
          className="flex flex-1 cursor-pointer items-center justify-center border-2 border-gray-200 py-1.5 hover:bg-blue-300"
        >
          <FaUserGroup className="" />
        </button>
        <button
          onClick={() => dispatch(setModeType('isGroup'))}
          className="flex flex-1 cursor-pointer items-center justify-center border-2 border-gray-200 py-1.5 hover:bg-blue-300"
        >
          <MdGroups />
        </button>
      </div>

      {/* khac nhom la hai nguoi */}
      {
        modeType !== 'isGroup' ? (
          !searchValue ? (
            <ConversationList
              conversationList={conversations.filter((c) => !c.isGroup)}
            />
          ) : (
            <UserList users={users} />
          )
        ) : !searchValue ? (
          <div className="flex flex-col">
            <Button
              onClick={handleAddGroup}
              className="flex h-10 w-10 cursor-pointer items-center justify-center bg-amber-200"
            >
              <IoAddSharp />
            </Button>

            {isOpenUserToAddGroup && (
              <div className="flex flex-col">
                <UserList users={usersExceptSender} />
                <Button
                  onClick={handleCreateGroupChat}
                  className="mt-2 cursor-pointer bg-blue-500 px-2 py-2 text-white hover:bg-blue-600"
                >
                  Create group chat
                </Button>
              </div>
            )}

            <ConversationList
              conversationList={conversations.filter((c) => c.isGroup)}
            />
          </div>
        ) : null
        // chua xu ly neu k tim kiem gi ben chat nhom thi hien thi gi
      }
    </div>
  );
};

export default Sidebar;
