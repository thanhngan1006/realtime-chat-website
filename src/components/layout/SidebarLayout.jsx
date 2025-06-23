import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Avatar } from '../common';
import SubMenu from './SubMenu';
import { IoSearch } from 'react-icons/io5';
import { HiOutlinePencilAlt } from 'react-icons/hi';
import Sidebar from './Sidebar';

const SidebarLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="">
      <header className="flex items-center justify-between bg-white p-2.5 text-center shadow">
        <button onClick={handleOpen} className="relative cursor-pointer">
          <Avatar
            className="h-10 w-10"
            isOnline={!!user}
            src="https://ui-avatars.com/api/?name=Linda&background=random"
          />
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
