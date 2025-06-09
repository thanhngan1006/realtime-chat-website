import React from 'react'

const UserItem = ({ name, imgUrl, timeSendMessage, messageContent }) => {
    return (
        <div className="flex items-center p-2 border-b border-gray-200 hover:bg-gray-100">
          <img
            src={imgUrl}
            alt={`${name}'s avatar`}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sm">{name}</span>
              <span className="text-xs text-gray-500">{timeSendMessage}</span>
            </div>
            <p className="text-xs text-gray-700">{messageContent}</p>
          </div>
        </div>
      );
}

export default UserItem