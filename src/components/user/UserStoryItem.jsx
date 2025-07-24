import React from 'react';
import { Avatar } from '../common';

const UserStoryItem = ({ src, name }) => {
  return (
    <div className="flex flex-col items-center text-white">
      <div className="rounded-full bg-blue-600 p-0.5">
        <div className="rounded-full bg-gray-800">
          <Avatar src={src} className="h-10 w-10" />
        </div>
      </div>
      <p className="mt-2 text-sm text-black dark:text-white">{name}</p>
    </div>
  );
};

export default UserStoryItem;
