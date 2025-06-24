import React, { useState } from 'react';
import Avatar from '../common/Avatar';
import OptionsForMessage from './OptionsForMessage';

const Message = ({
  children,
  bgColor = 'blue-500',
  textColor = 'white',
  className = '',
  src = '',
  isYourMessage,
  isShowAvatar,
}) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <div
      className={`relative mb-2 flex items-center gap-2`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {!isYourMessage && isShowAvatar && (
        <Avatar src={src} className="h-8 w-8 flex-shrink-0 rounded-full" />
      )}

      <div
        className={`flex w-full items-center gap-2 ${
          isYourMessage ? 'justify-end' : 'justify-start'
        } ${!isYourMessage && !isShowAvatar ? 'ml-10' : ''}`}
      >
        {isHover &&
          (isYourMessage ? (
            <div className="">
              <OptionsForMessage />
            </div>
          ) : (
            <div className="order-1">
              <OptionsForMessage />
            </div>
          ))}

        <div
          className={`max-w-[75%] rounded-2xl px-4 py-2 text-${textColor} ${
            isYourMessage
              ? `bg-${bgColor} rounded-br-none bg-blue-500`
              : 'rounded-bl-none bg-gray-500'
          } ${className}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Message;
