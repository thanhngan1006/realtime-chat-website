import React, { useEffect, useState } from 'react';
import Avatar from '../common/Avatar';
import OptionsForMessage from './OptionsForMessage';
import { FaFile } from 'react-icons/fa';

const Message = ({
  children,
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

        {msg.type === 0 && (
          <div
            className={`max-w-[75%] rounded-2xl px-4 py-2 text-white ${
              isYourMessage
                ? `rounded-br-none bg-blue-500`
                : `rounded-bl-none bg-gray-600`
            } ${className}`}
          >
            {children}
          </div>
        )}

        {msg.type === 1 && msg.imageUrl && (
          <img
            src={msg.imageUrl}
            alt="Sent"
            className="max-w-[75%] rounded-lg"
          />
        )}

        {msg.type === 2 && (
          <div
            className={`flex max-w-[75%] items-center gap-2 rounded-2xl px-4 py-2 text-white ${
              isYourMessage
                ? `rounded-br-none bg-blue-500`
                : `rounded-bl-none bg-gray-600`
            } ${className}`}
          >
            <FaFile className="h-5 w-5" />
            <a
              href={msg.file}
              download={msg.fileName}
              className="text-white underline"
            >
              {msg.fileName}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
