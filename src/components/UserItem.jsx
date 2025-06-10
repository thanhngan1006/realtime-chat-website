import React from "react";

const UserItem = ({ name, imgUrl, timeSendMessage, messageContent }) => {
  return (
    <div className="flex items-center border-b border-gray-200 p-2 hover:bg-gray-100">
      <img
        src={imgUrl}
        alt={`${name}'s avatar`}
        className="mr-3 h-10 w-10 rounded-full"
      />
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
