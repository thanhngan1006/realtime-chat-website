import React from 'react';
import {
  IoIosInformationCircle,
  IoIosNotificationsOutline,
} from 'react-icons/io';
import { SlOptionsVertical } from 'react-icons/sl';
import { FaPhoneAlt } from 'react-icons/fa';
import { MdVideoCall } from 'react-icons/md';
import { Avatar, Button } from '../common';

const HeadingMessageBar = ({ name, activeTime }) => {
  return (
    <div className="flex items-center justify-between border-1 border-gray-200 bg-white px-6 py-2">
      <div className="flex items-center gap-2">
        <Avatar
          className="h-10 w-10"
          src="https://ui-avatars.com/api/?name=Linda&background=random"
        />

        <div className="flex flex-col">
          <span className="font-bold text-black">{name}</span>
          <span className="text-sm">{activeTime}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button className="px-2 py-2" onClick={() => {}}>
          <FaPhoneAlt className="h-6 w-6 text-blue-500 hover:text-blue-600" />
        </Button>
        <Button className="px-2 py-2" onClick={() => {}}>
          <MdVideoCall className="h-6 w-6 text-blue-500 hover:text-blue-600" />
        </Button>

        <Button className="px-2 py-2" onClick={() => {}}>
          <IoIosInformationCircle className="h-6 w-6 text-blue-500 hover:text-blue-600" />
        </Button>
      </div>
    </div>
  );
};

export default HeadingMessageBar;
