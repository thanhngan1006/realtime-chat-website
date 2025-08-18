import React from 'react';
import Message from './Message';
import { auth } from '../../firebase';

const MessageBox = ({ messages, src }) => {
  const uid = auth.currentUser.uid;

  return (
    <div className="relative flex flex-col">
      <div className="mb-4">
        {messages.map((msg, index) => (
          <Message
            key={index}
            isYourMessage={msg.senderId === uid}
            src={src[msg.senderId] || ''}
            alt="Avatar"
            textColor="white"
            msg={msg}
          >
            {msg.messageText}
          </Message>
        ))}
      </div>
    </div>
  );
};

export default MessageBox;
