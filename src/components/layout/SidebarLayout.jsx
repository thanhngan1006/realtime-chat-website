import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar } from '../common';
import SubMenu from './SubMenu';
import { HiOutlinePencilAlt } from 'react-icons/hi';
import Sidebar from './Sidebar';
import { auth } from '../../firebase';
import { userService } from '../../service';
import { setAvatarUrl } from '../../../features/user/userReducer';
import Modal from '../common/Modal';
import { setIsOpen } from '../../../features/modal/modalReducer';

const SidebarLayout = () => {
  const { isOpen } = useSelector((state) => state.modal);
  const { user } = useSelector((state) => state.auth);
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
      <header className="flex items-center justify-between bg-white p-2.5 text-center shadow">
        <button
          onClick={() => dispatch(setIsOpen(true))}
          className="relative cursor-pointer"
        >
          <Avatar className="h-10 w-10" isOnline={!!user} src={avatarUrl} />
        </button>

        <Modal isOpen={isOpen} onClose={() => dispatch(setIsOpen(false))}>
          <>
            <SubMenu className="top-14 left-0" />
          </>
        </Modal>

        <h3 className="text-2xl font-bold">Chat</h3>
        <div className="flex gap-2">
          <HiOutlinePencilAlt className="h-8 w-8" />
        </div>
      </header>

      <Sidebar />
    </div>
  );
};

export default SidebarLayout;
