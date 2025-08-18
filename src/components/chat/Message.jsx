import React, { useEffect, useState } from 'react';
import Avatar from '../common/Avatar';
import OptionsForMessage from './OptionsForMessage';
import { FaFile } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input } from '../common';
import {
  setEditedMessage,
  setMessages,
  setUpdatedMessageText,
} from '../../../features/chat/chatReducer';
import { serverTimestamp } from 'firebase/firestore';
import { messageService } from '../../service';

const Message = ({
  children,
  className = '',
  src = '',
  isYourMessage,
  msg,
}) => {
  const [isHover, setIsHover] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(src || '');
  const { editedMessage, selectedMessageId, updatedMessageText } = useSelector(
    (state) => state.chat,
  );
  const dispatch = useDispatch();

  const handleUpdateMessage = (e) => {
    dispatch(setUpdatedMessageText(e.target.value));
  };

  useEffect(() => {
    if (typeof src === 'function') {
      src(msg.senderId).then((url) => setAvatarUrl(url));
    } else {
      setAvatarUrl(src);
    }
  }, [src, msg.senderId]);

  const handleSaveEdit = async () => {
    if (updatedMessageText.trim() === '') return;

    await messageService.editMessage(editedMessage, updatedMessageText);
    dispatch(
      setMessages((prevMessages) => {
        return prevMessages.map((msgItem) =>
          msgItem.messageId === msg.messageId
            ? {
                ...msgItem,
                messageText: updatedMessageText,
                updatedAt: serverTimestamp(),
              }
            : msgItem,
        );
      }),
    );
    dispatch(setEditedMessage(null));
    dispatch(setUpdatedMessageText(''));
  };

  const handleCancelEdit = () => {
    dispatch(setEditedMessage(null));
    dispatch(setUpdatedMessageText(''));
  };

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
              <OptionsForMessage msg={msg} isYourMessage={isYourMessage} />
            </div>
          ) : (
            <div className="order-1">
              <OptionsForMessage msg={msg} isYourMessage={isYourMessage} />
            </div>
          ))}

        {msg.type === 0 &&
          (editedMessage === msg.messageId &&
          selectedMessageId === msg.messageId ? (
            <div className="flex max-w-[75%] items-center gap-2">
              <Input
                type="text"
                value={updatedMessageText}
                onChange={handleUpdateMessage}
                placeholder="Edit message"
                className="rounded-2xl pr-3 pl-10 dark:text-white"
              />
              <Button
                className="rounded bg-blue-400 px-4 py-2 text-white hover:bg-blue-600"
                onClick={handleSaveEdit}
              >
                Save
              </Button>
              <Button
                className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 text-white ${
                isYourMessage
                  ? `rounded-br-none bg-blue-500`
                  : `rounded-bl-none bg-gray-600`
              } ${className}`}
            >
              {children}
            </div>
          ))}

        {msg.type === 1 && (
          <>
            {msg.messageText && msg.messageText.trim() ? (
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 text-white ${
                  isYourMessage
                    ? `rounded-br-none bg-blue-500`
                    : `rounded-bl-none bg-gray-600`
                } ${className}`}
              >
                {msg.messageText}
              </div>
            ) : msg.imageUrl ? (
              <img
                src={msg.imageUrl}
                alt="Sent"
                className="max-w-[75%] rounded-lg"
              />
            ) : null}
          </>
        )}

        {msg.type === 2 && (
          <>
            {msg.messageText && msg.messageText.trim() ? (
              <div
                className={`flex max-w-[75%] items-center gap-2 rounded-2xl px-4 py-2 text-white ${
                  isYourMessage
                    ? `rounded-br-none bg-blue-500`
                    : `rounded-bl-none bg-gray-600`
                } ${className}`}
              >
                {msg.messageText}
              </div>
            ) : msg.file && msg.fileName ? (
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
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default Message;
