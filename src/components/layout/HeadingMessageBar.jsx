import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Avatar } from '../common';
import { AI_ASSISTANT_ID } from '../../constants/ai';
import { useTimeAgo } from '../../hooks/useTimeAgo';
import { auth } from '../../firebase';
import { userService } from '../../service';
import GroupAvatar from '../common/GroupAvatar';

const HeadingMessageBar = () => {
  const { selectedUser, presenceStatuses } = useSelector((state) => state.user);
  const { receiverData } = useSelector((state) => state.chat);

  const activeName = selectedUser?.name || receiverData?.name || '';
  const activeAvatar = selectedUser?.avatarUrl || receiverData?.avatarUrl || '';
  const uid = auth.currentUser?.uid;
  const [groupAvatarUrls, setGroupAvatarUrls] = useState([]);
  const isGroupChat = Array.isArray(selectedUser?.id);

  useEffect(() => {
    if (!isGroupChat) {
      setGroupAvatarUrls([]);
      return;
    }

    const fetchGroupAvatars = async () => {
      let idsToFetch = selectedUser.id;

      if (selectedUser.id.length === 1) {
        idsToFetch = [uid, ...selectedUser.id];
      }

      idsToFetch = idsToFetch.slice(0, 2);

      try {
        const avatarPromises = idsToFetch.map((id) => userService.getUser(id));
        const userDocs = await Promise.all(avatarPromises);

        const urls = userDocs.map((doc) =>
          doc.success ? doc.data.avatarUrl : '/default-avatar.png',
        );
        setGroupAvatarUrls(urls);
      } catch (error) {
        console.error('Error fetching group avatars for heading:', error);
      }
    };

    fetchGroupAvatars();
  }, [selectedUser, isGroupChat, uid]);

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
          <span className="inline-flex items-center gap-2 rounded-full bg-white/40 px-3 py-1 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:bg-zinc-800/70 dark:text-slate-400">
            <span aria-hidden="true">•</span>
            {memberCount} members
          </span>
        );
      }
      return null;
    }

    if (displayStatus.state === 'online') {
      return (
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-600 uppercase dark:bg-emerald-400/15 dark:text-emerald-300">
          <span
            className="h-2 w-2 rounded-full bg-emerald-400"
            aria-hidden="true"
          />
          Online now
        </span>
      );
    }

    if (displayStatus.state === 'offline' && displayStatus.last_changed) {
      return (
        <span className="inline-flex items-center gap-2 rounded-full bg-white/40 px-3 py-1 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:bg-zinc-800/70 dark:text-slate-400">
          <span
            className="h-2 w-2 rounded-full bg-slate-400"
            aria-hidden="true"
          />
          Last active {timeAgoText} ago
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-white/40 px-3 py-1 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:bg-zinc-800/70 dark:text-slate-400">
        <span
          className="h-2 w-2 rounded-full bg-slate-400"
          aria-hidden="true"
        />
        Inactive
      </span>
    );
  };

  return (
    <div className="group relative z-10 flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition-all duration-200 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative">
          <Avatar
            src={activeAvatar}
            fallback={activeName}
            presenceStatus={displayStatus}
            className="h-14 w-14 rounded-3xl shadow-xl ring-2 ring-white/50 transition-transform duration-200 group-hover:scale-105 dark:ring-zinc-800"
            aria-label={`Avatar of ${activeName || 'Selected user'}`}
          />
        </div>
        <div className="flex min-w-0 flex-col">
          <h2
            className="truncate text-2xl font-semibold tracking-tight text-slate-900 dark:text-white"
            aria-label="Conversation title"
          >
            {activeName || 'Chọn một cuộc trò chuyện'}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {renderActiveStatus()}
            {Array.isArray(selectedUser?.id) && (
              <span className="text-xs font-semibold tracking-wide text-slate-400 uppercase dark:text-slate-500">
                {selectedUser.id.length + 1} members
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-full bg-slate-100 p-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:bg-zinc-800/80">
        <button
          className="focus-visible:ring-brand-300 rounded-full bg-white/80 p-2 text-slate-500 transition-colors duration-200 hover:bg-white focus-visible:ring-2 focus-visible:outline-none dark:bg-zinc-700/80 dark:text-slate-300"
          aria-label="More options"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>
        <div className="flex items-center gap-4 border-b p-2 dark:border-gray-700">
          {isGroupChat ? (
            <GroupAvatar
              src1={groupAvatarUrls[0]}
              src2={groupAvatarUrls[1]}
              className="h-10 w-10"
            />
          ) : (
            <Avatar
              src={selectedUser?.avatarUrl || ''}
              presenceStatus={displayStatus}
              className="h-10 w-10"
            />
          )}
          <div className="flex flex-col">
            <span className="font-bold">
              {selectedUser?.name || 'Chọn một cuộc trò chuyện'}
            </span>
            {renderActiveStatus()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeadingMessageBar;
