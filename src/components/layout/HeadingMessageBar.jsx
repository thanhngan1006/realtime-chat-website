import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Avatar } from '../common';
import { AI_ASSISTANT_ID } from '../../constants/ai';
import { useTimeAgo } from '../../hooks/useTimeAgo';

const HeadingMessageBar = () => {
  const { selectedUser, presenceStatuses } = useSelector((state) => state.user);

  const displayStatus = useMemo(() => {
    if (!selectedUser?.id) return null;

    if (selectedUser.id === AI_ASSISTANT_ID) return { state: 'online' };

    const isGroupChat = Array.isArray(selectedUser.id);

    if (!isGroupChat) {
      return presenceStatuses[selectedUser.id];
    }

    if (isGroupChat) {
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

      if (anyoneOnline) {
        return { state: 'online' };
      }
      return mostRecentOfflineUserStatus;
    }

    return null;
  }, [selectedUser, presenceStatuses]);

  const timeAgoText = useTimeAgo(displayStatus?.last_changed);

  const renderActiveStatus = () => {
    if (!displayStatus) {
      if (Array.isArray(selectedUser?.id)) {
        const memberCount = selectedUser.id.length + 1;
        return (
          <span className="text-sm text-gray-500">
            {memberCount} thành viên
          </span>
        );
      }
      return null;
    }

    if (displayStatus.state === 'online') {
      return <span className="text-sm text-green-500">Đang hoạt động</span>;
    }

    if (displayStatus.state === 'offline' && displayStatus.last_changed) {
      return (
        <span className="text-sm text-gray-500">
          Hoạt động {timeAgoText} trước
        </span>
      );
    }

    return <span className="text-sm text-gray-500">Không hoạt động</span>;
  };

  return (
    <div className="flex items-center gap-4 border-b p-2 dark:border-gray-700">
      <Avatar src={selectedUser?.avatarUrl || ''} className="h-10 w-10" />
      <div className="flex flex-col">
        <span className="font-bold">
          {selectedUser?.name || 'Chọn một cuộc trò chuyện'}
        </span>
        {renderActiveStatus()}
      </div>
    </div>
  );
};

export default HeadingMessageBar;
