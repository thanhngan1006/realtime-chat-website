import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar } from '../common';
import SubMenu from './SubMenu';
import Sidebar from './Sidebar';
import { auth } from '../../firebase';
import { userService } from '../../service';
import { setAvatarUrl } from '../../../features/user/userReducer';
import Modal from '../common/Modal';
import { setIsOpen } from '../../../features/modal/modalReducer';
import { LuMoon, LuSun } from 'react-icons/lu';
import { setTheme } from '../../../features/common/commonReducer';

const SidebarLayout = () => {
  const { isOpen } = useSelector((state) => state.modal);
  const { avatarUrl } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.common);
  const dispatch = useDispatch();
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (userId) {
          const data = await userService.getUser(userId);
          dispatch(setAvatarUrl(data.data.avatarUrl));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [dispatch]);

  const handleToggleTheme = () => {
    dispatch(setTheme(isDarkMode ? '' : 'dark'));
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="from-brand-300 via-brand-200 relative overflow-hidden rounded-2xl bg-gradient-to-br to-sky-200 p-6 text-slate-800 shadow-[0_28px_80px_-60px_rgba(6,182,212,0.38)]">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute top-10 -left-16 h-44 w-44 rounded-full bg-white/30 blur-2xl" />
          <div className="absolute top-0 right-0 h-36 w-36 rounded-full bg-white/20 blur-2xl" />
        </div>

        <div className="relative flex flex-col gap-6 text-slate-800">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => dispatch(setIsOpen(true))}
                className="relative rounded-full border border-white/60 bg-white/70 p-1.5 shadow-lg transition duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:outline-none"
                aria-label="Open profile menu"
              >
                <Avatar
                  className="h-12 w-12 rounded-full shadow-lg ring-2 ring-white/60"
                  src={avatarUrl}
                />
              </button>

              <div className="flex flex-col">
                <span className="text-xs tracking-[0.25em] text-slate-500 uppercase">
                  Realtime Chat
                </span>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                  Conversations
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Dive back into your messages and stay in perfect sync.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleTheme}
              className={`focus-visible:ring-brand-200 relative flex h-10 w-20 items-center rounded-full border border-white/70 bg-white/70 p-1 transition duration-200 focus-visible:ring-2 focus-visible:outline-none dark:border-zinc-700 dark:bg-zinc-900/70 ${isDarkMode ? 'justify-end' : 'justify-start'}`}
              aria-label="Toggle color theme"
            >
              <span className="sr-only">Toggle color theme</span>
              <span className="pointer-events-none grid h-7 w-7 place-items-center rounded-full bg-white text-slate-600 shadow-sm dark:bg-zinc-800 dark:text-slate-200">
                {isDarkMode ? (
                  <LuMoon className="h-4 w-4" />
                ) : (
                  <LuSun className="h-4 w-4" />
                )}
              </span>
            </button>
          </div>

          <Modal isOpen={isOpen} onClose={() => dispatch(setIsOpen(false))}>
            <SubMenu className="top-20 left-4" />
          </Modal>

          <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
            <div className="rounded-xl border border-white/60 bg-white/70 p-3">
              <p className="text-xs tracking-wide text-slate-500 uppercase">
                Inbox vibes
              </p>
              <p className="mt-1 font-semibold text-slate-800">
                Human + AI moments
              </p>
            </div>
            <div className="rounded-xl border border-white/60 bg-white/70 p-3">
              <p className="text-xs tracking-wide text-slate-500 uppercase">
                Presence
              </p>
              <p className="mt-1 font-semibold text-slate-800">
                Real-time awareness
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mt-5 min-h-0 flex-1 px-1 pb-6">
        <Sidebar />
      </div>
    </div>
  );
};

export default SidebarLayout;
