import React, { useEffect, useState, useRef } from 'react';
import Avatar from '../common/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import dayjs from 'dayjs';
import { Button, Input } from '../common';
import {
  setEditedMessage,
  setMessages,
  setSelectedReactionDetail,
  setUpdatedMessageText,
} from '../../../features/chat/chatReducer';
import { serverTimestamp } from 'firebase/firestore';
import { messageService } from '../../service';
import OptionsForMessage from './OptionsForMessage';
import ReactionDisplay from './ReactionDisplay';
import { AI_ASSISTANT_ID } from '../../constants/ai';

const Message = ({
  children,
  className = '',
  src = '',
  isYourMessage,
  msg,
  showAvatar,
  isFirstInGroup,
}) => {
  const [isHover, setIsHover] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(src || '');
  const {
    editedMessage,
    selectedMessageId,
    updatedMessageText,
    selectedReactionDetail,
  } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const messageContentRef = useRef(null);

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

  const handleMouseEnter = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  const handleReactionClickDetail = () => {
    dispatch(
      setSelectedReactionDetail(selectedReactionDetail ? null : msg.messageId),
    );
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        messageContentRef.current &&
        !messageContentRef.current.contains(e.target)
      ) {
        dispatch(setSelectedReactionDetail(null));
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dispatch]);

  const bubbleStyle = `relative max-w-[75%] rounded-xl px-3 py-2 shadow-sm`;
  const yourMessageStyle = `bg-blue-500 text-white`;
  const otherMessageStyle = `bg-gray-200 text-gray-800 dark:bg-zinc-700 dark:text-gray-200`;

  return (
    <div
      className={`group relative flex items-start gap-2 ${
        isFirstInGroup ? 'mt-4' : 'mt-0.5'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="w-8">
        {!isYourMessage && showAvatar && (
          <Avatar
            src={`${
              avatarUrl
                ? avatarUrl
                : msg.senderId === AI_ASSISTANT_ID
                  ? '/ai_avatar.jpg'
                  : null
            }`}
            alt="Avatar"
            className="h-8 w-8 flex-shrink-0 rounded-full"
          />
        )}
      </div>

      <div
        className={`flex w-full flex-col gap-1 ${
          isYourMessage ? 'items-end' : 'items-start'
        }`}
      >
        <div
          className={`flex items-center gap-2 ${
            isYourMessage ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          {isHover && (
            <div className={isYourMessage ? 'mr-2' : 'order-1 ml-2'}>
              <OptionsForMessage msg={msg} isYourMessage={isYourMessage} />
            </div>
          )}

          {msg.type === 0 &&
            (editedMessage === msg.messageId &&
            selectedMessageId === msg.messageId ? (
              <div
                className="relative flex max-w-[75%] items-center gap-2"
                ref={messageContentRef}
              >
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
                <ReactionDisplay
                  reactions={msg.reactions}
                  parentRef={messageContentRef}
                  onReactionClick={handleReactionClickDetail}
                />
              </div>
            ) : (
              <div
                className={`${bubbleStyle} ${
                  isYourMessage ? yourMessageStyle : otherMessageStyle
                } ${
                  isYourMessage
                    ? isFirstInGroup
                      ? 'rounded-br-none'
                      : 'rounded-r-none'
                    : isFirstInGroup
                      ? 'rounded-bl-none'
                      : 'rounded-l-none'
                } ${className}`}
                ref={messageContentRef}
              >
                <ReactMarkdown>{children}</ReactMarkdown>
                <ReactionDisplay
                  reactions={msg.reactions}
                  parentRef={messageContentRef}
                  onReactionClick={handleReactionClickDetail}
                />
              </div>
            ))}
        </div>

        {isHover && (
          <span
            className={`text-xs text-gray-500 opacity-0 group-hover:opacity-100 ${
              isYourMessage ? 'pr-2' : 'pl-2'
            }`}
          >
            {dayjs(msg.sentTime?.toDate()).format('h:mm A')}
          </span>
        )}
      </div>
    </div>
  );
};

export default Message;
