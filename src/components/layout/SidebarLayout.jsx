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
  const dispatch = useDispatch();

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

  return (
    <div className="">
      <header className="z-10 flex items-center justify-between bg-white p-2.5 text-center shadow dark:bg-zinc-800 dark:text-white">
        <button
          onClick={() => dispatch(setIsOpen(true))}
          className="relative cursor-pointer"
        >
          <Avatar className="h-10 w-10" src={avatarUrl} />
        </button>

        <Modal isOpen={isOpen} onClose={() => dispatch(setIsOpen(false))}>
          <>
            <SubMenu className="top-14 left-0" />
          </>
        </Modal>

        <h3 className="text-2xl font-bold">Chat</h3>
        <div className="flex">
          <button
            onClick={() => {
              dispatch(setTheme(''));
            }}
            className="rounded-lg bg-transparent p-3 text-black hover:bg-zinc-200 dark:text-white dark:hover:bg-zinc-100"
          >
            <LuSun />
          </button>
          <button
            onClick={() => {
              dispatch(setTheme('dark'));
            }}
            className="rounded-lg bg-transparent p-3 text-black hover:bg-zinc-200 dark:text-white dark:hover:bg-zinc-100"
          >
            <LuMoon />
          </button>
        </div>
      </header>

      <Sidebar />
    </div>
  );
};

export default SidebarLayout;
