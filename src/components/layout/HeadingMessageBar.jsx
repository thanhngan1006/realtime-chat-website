import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Avatar, Button } from '../common';
import { AI_ASSISTANT_ID } from '../../constants/ai';
import { useTimeAgo } from '../../hooks/useTimeAgo';
import { FiPhone, FiVideo, FiInfo } from 'react-icons/fi';

const HeadingMessageBar = () => {
  const { selectedUser, presenceStatuses } = useSelector((state) => state.user);

  const displayStatus = useMemo(() => {
    if (!selectedUser?.id) return null;
    if (selectedUser.id === AI_ASSISTANT_ID) return { state: 'online' };

    const isGroupChat = Array.isArray(selectedUser.id);
    if (!isGroupChat) {
      return presenceStatuses[selectedUser.id];
    }

    const otherParticipantsIds = selectedUser.id;
    let anyoneOnline = false;
    let mostRecentOfflineUserStatus = null;

    for (const id of otherParticipantsIds) {
      const status = presenceStatuses[id];
      if (status?.state === 'online') {
        anyoneOnline = true;
        break;
      }
      if (status?.state === 'offline' && status.last_changed) {
        if (
          !mostRecentOfflineUserStatus ||
          status.last_changed > mostRecentOfflineUserStatus.last_changed
        ) {
          mostRecentOfflineUserStatus = status;
        }
      }
    }

    return anyoneOnline ? { state: 'online' } : mostRecentOfflineUserStatus;
  }, [selectedUser, presenceStatuses]);

  const timeAgoText = useTimeAgo(displayStatus?.last_changed);

  const renderActiveStatus = () => {
    if (!selectedUser?.id) {
      return (
        <span className="text-lg font-bold">
          Chọn một cuộc trò chuyện để bắt đầu
        </span>
      );
    }

    const isOnline = displayStatus?.state === 'online';
    const statusDotClass = `w-2.5 h-2.5 rounded-full ${
      isOnline ? 'bg-green-500' : 'bg-gray-400'
    }`;

    let statusText;
    if (Array.isArray(selectedUser.id) && !displayStatus) {
      const memberCount = selectedUser.id.length + 1;
      statusText = `${memberCount} thành viên`;
    } else if (isOnline) {
      statusText = 'Đang hoạt động';
    } else if (
      displayStatus?.state === 'offline' &&
      displayStatus.last_changed
    ) {
      statusText = `Hoạt động ${timeAgoText} trước`;
    } else {
      statusText = 'Không hoạt động';
    }

    return (
      <>
        <Avatar src={selectedUser.avatarUrl || ''} className="h-10 w-10" />
        <div className="flex flex-col">
          <span className="font-bold">{selectedUser.name}</span>
          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
            <span className={statusDotClass} />
            <span>{statusText}</span>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="flex items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
      <div className="flex items-center gap-4">{renderActiveStatus()}</div>
      {selectedUser?.id && (
        <div className="flex items-center gap-2">
          <Button className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-zinc-700">
            <FiPhone size={20} />
          </Button>
          <Button className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-zinc-700">
            <FiVideo size={20} />
          </Button>
          <Button className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-zinc-700">
            <FiInfo size={20} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default HeadingMessageBar;
