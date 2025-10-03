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
          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-gray-400"></span>
            {memberCount} thành viên
          </span>
        );
      }
      return null;
    }

    if (displayStatus.state === 'online') {
      return (
        <span className="text-sm text-secondary-600 dark:text-secondary-400 font-medium flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-secondary-500 animate-pulse"></span>
          Đang hoạt động
        </span>
      );
    }

    if (displayStatus.state === 'offline' && displayStatus.last_changed) {
      return (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Hoạt động {timeAgoText} trước
        </span>
      );
    }

    return (
      <span className="text-sm text-gray-500 dark:text-gray-400">
        Không hoạt động
      </span>
    );
  };

  return (
    <div className="flex items-center gap-4 border-b border-gray-200 dark:border-neutral-700 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md p-4 shadow-sm animate-slide-in-down">
      <div className="relative">
        <Avatar
          src={selectedUser?.avatarUrl || ''}
          className="h-12 w-12 ring-2 ring-primary-500/20 transition-all hover:ring-primary-500/40"
        />
        {displayStatus?.state === 'online' && (
          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-secondary-500 border-2 border-white dark:border-neutral-800 animate-pulse"></span>
        )}
      </div>
      <div className="flex flex-col flex-1">
        <span className="font-semibold text-lg text-gray-900 dark:text-white">
          {selectedUser?.name || 'Chọn một cuộc trò chuyện'}
        </span>
        {renderActiveStatus()}
      </div>
    </div>
  );
};

export default HeadingMessageBar;
