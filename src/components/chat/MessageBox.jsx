import React from 'react';
import Message from './Message';
import { auth } from '../../firebase';

const MessageBox = ({ messages, src }) => {
  const uid = auth.currentUser.uid;

  // console.log('Messages in MessageBox:', messages, Array.isArray(messages));

  return (
    <div className="relative flex flex-col">
      <div className="mb-4">
        {messages.map((msg, index) => {
          if (msg.deletedBy?.includes(uid)) {
            return null;
          }

          return (
            <Message
              key={msg.messageId || index}
              isYourMessage={msg.senderId === uid}
              src={src[msg.senderId] || ''}
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
