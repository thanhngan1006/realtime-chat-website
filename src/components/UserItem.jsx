import React from 'react';
import Avatar from './Avatar';

const UserItem = ({ name, imgUrl, timeSendMessage, messageContent }) => {
  return (
    <div className="flex items-center gap-3 border-b border-gray-200 p-2 hover:bg-gray-100">
      <Avatar src={imgUrl} className="h-12 w-12 rounded-full" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">{name}</span>
          <span className="text-xs text-gray-500">{timeSendMessage}</span>
        </div>
        <p className="text-xs text-gray-700">{messageContent}</p>
      </div>
    </div>
  );
};

export default UserItem;
