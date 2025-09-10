import React from 'react';
import Message from './Message';
import { auth } from '../../firebase';

const MessageBox = ({ messages, avatarUrls }) => {
  const uid = auth.currentUser.uid;

  const visibleMessages = messages.filter(
    (msg) => !msg.deletedBy?.includes(uid),
  );

  return (
    <div className="relative flex flex-col">
      <div className="mb-4">
        {visibleMessages.map((msg, index) => {
          return (
            <Message
              key={msg.messageId || index}
              isYourMessage={msg.senderId === uid}
              src={avatarUrls[msg.senderId] || ''}
              alt="Avatar"
              textColor="white"
              msg={msg}
            >
              {msg.messageText}
            </Message>
          );
        })}
      </div>
    </div>
  );
};

export default MessageBox;
