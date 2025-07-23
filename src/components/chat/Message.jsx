import React, { useEffect, useState } from 'react';
import Avatar from '../common/Avatar';
import OptionsForMessage from './OptionsForMessage';

const Message = ({
  children,
  bgColor = 'blue-500',
  textColor = 'white',
  className = '',
  src = '',
  isYourMessage,
  msg,
}) => {
  const [isHover, setIsHover] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(src || '');

  useEffect(() => {
    if (typeof src === 'function') {
      src(msg.senderId).then((url) => setAvatarUrl(url));
    } else {
      setAvatarUrl(src);
    }
  }, [src, msg.senderId]);

  return (
    <div
      className={`relative mb-2 flex items-center gap-2`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {!isYourMessage && (
        <Avatar
          src={avatarUrl}
          alt="Avatar"
          className="h-8 w-8 flex-shrink-0 rounded-full"
        />
      )}

      <div
        className={`flex w-full items-center gap-2 ${
          isYourMessage ? 'justify-end' : 'justify-start'
        }`}
      >
        {isHover &&
          (isYourMessage ? (
            <div className="">
              <OptionsForMessage msg={msg} />
            </div>
          ) : (
            <div className="order-1">
              <OptionsForMessage msg={msg} />
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
