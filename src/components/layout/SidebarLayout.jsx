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
      <header className="border-border bg-background z-10 flex items-center justify-between border-b p-4 text-center">
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

        <h3 className="text-foreground text-2xl font-bold">Chat</h3>
        <div className="flex gap-2">
          <button
            onClick={() => dispatch(setTheme(''))}
            className="text-foreground hover:bg-accent hover:text-accent-foreground rounded-full p-2"
          >
            <LuSun size={20} />
          </button>
          <button
            onClick={() => dispatch(setTheme('dark'))}
            className="text-foreground hover:bg-accent hover:text-accent-foreground rounded-full p-2"
          >
            <LuMoon size={20} />
          </button>
        </div>
      </header>

      <Sidebar />
    </div>
  );
};

export default SidebarLayout;
