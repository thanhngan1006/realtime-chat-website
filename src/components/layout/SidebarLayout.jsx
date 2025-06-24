import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar } from '../common';
import SubMenu from './SubMenu';
import { IoSearch } from 'react-icons/io5';
import { HiOutlinePencilAlt } from 'react-icons/hi';
import Sidebar from './Sidebar';
import { auth } from '../../firebase';
import { userService } from '../../service';
import { setAvatarUrl } from '../../../features/user/userReducer';
const userId = auth.currentUser?.uid;

const SidebarLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { avatarUrl } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (userId) {
          const data = await userService.getUser(userId);
          dispatch(setAvatarUrl(data.data.avatarUrl));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <div className="">
      <header className="flex items-center justify-between bg-white p-2.5 text-center shadow">
        <button onClick={handleOpen} className="relative cursor-pointer">
          <Avatar className="h-10 w-10" isOnline={!!user} src={avatarUrl} />
        </button>

        {isOpen ? <SubMenu className="top-14 left-0" /> : null}

        <h3 className="text-2xl font-bold">Chat</h3>
        <div className="flex gap-2">
          <IoSearch className="h-8 w-8" onClick={() => {}} />
          <HiOutlinePencilAlt className="h-8 w-8" onClick={() => {}} />
        </div>
      </header>

      <Sidebar />
    </div>
  );
};

export default SidebarLayout;
