import React from 'react';
import Message from './Message';

const MessageBox = ({ messages, isYourMessage, src = '' }) => {
  return (
    <div className="relative flex flex-col">
      <div className="mb-4">
        {messages.map((msg, index) => (
          <Message
            key={index}
            isYourMessage={isYourMessage}
            src={src}
            isShowAvatar={!isYourMessage && index === 0}
            bgColor={isYourMessage ? 'blue-500' : 'gray-600'}
            textColor="white"
          >
            {msg}
          </Message>
        ))}
      </div>
    </div>
  );
};

export default MessageBox;
