import React, { useEffect, useState, useRef } from 'react';
import Avatar from '../common/Avatar';
import { FaFile } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input } from '../common';
import {
  setEditedMessage,
  setEmojiPickerPosition,
  setMessages,
  setSelectedMessageToReactEmoji,
  setSelectedReactionDetail,
  setShowFullEmojiPicker,
  setUpdatedMessageText,
} from '../../../features/chat/chatReducer';
import { doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { messageService } from '../../service';
import EmojiPicker from 'emoji-picker-react';
import { auth, db } from '../../firebase';
import OptionsForMessage from './OptionsForMessage';
import ReactionDisplay from './ReactionDisplay';
import { IoMdCloseCircle } from 'react-icons/io';

const Message = ({
  children,
  className = '',
  src = '',
  isYourMessage,
  msg,
}) => {
  const [isHover, setIsHover] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(src || '');
  const [reactionUsers, setReactionUsers] = useState([]);
  const {
    editedMessage,
    selectedMessageId,
    updatedMessageText,
    selectedMessageToReactEmoji,
    showFullEmojiPicker,
    selectedReactionDetail,
    recordBlobLink,
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
    setTimeout(() => {
      // if (!isHover) {
      //   dispatch(setSelectedMessageToReactEmoji('')); // Ẩn thanh phản ứng
      // }
    }, 500);
  };

  const handleReactionClick = async (emoji) => {
    const userId = auth.currentUser.uid;
    const currentReactions = msg.reactions || {};

    if (currentReactions[userId] === emoji) {
      await messageService.removeReaction(msg.messageId, userId);
    } else {
      await messageService.addReaction(msg.messageId, userId, emoji);
    }
    dispatch(setSelectedMessageToReactEmoji(''));
  };

  const handleShowFullPicker = (e) => {
    const rect = e.target.getBoundingClientRect();
    dispatch(
      setEmojiPickerPosition({
        top: rect.top - 320,
        left: rect.left,
      }),
    );
    dispatch(setShowFullEmojiPicker(true));
  };

  const handleEmojiSelect = (emojiData) => {
    const userId = auth.currentUser.uid;
    const currentReactions = msg.reactions || {};
    if (currentReactions[userId] === emojiData.emoji) {
      handleReactionClick('');
    } else {
      handleReactionClick(emojiData.emoji);
    }
    dispatch(setShowFullEmojiPicker(false));
  };

  const handleReactionClickDetail = () => {
    dispatch(
      setSelectedReactionDetail(selectedReactionDetail ? null : msg.messageId),
    );
  };

  useEffect(() => {
    const fetchReactionUsers = async () => {
      if (msg.reactions && Object.keys(msg.reactions).length > 0) {
        const userPromises = Object.keys(msg.reactions).map(async (userId) => {
          const userDocRef = doc(db, 'users', userId);
          const userDoc = await getDoc(userDocRef);
          const userData = userDoc.exists()
            ? { id: userDoc.id, ...userDoc.data() }
            : { name: 'Unknown', avatarUrl: '' };
          return { ...userData, emoji: msg.reactions[userId] };
        });
        const users = await Promise.all(userPromises);
        setReactionUsers(users);
      } else {
        setReactionUsers([]);
      }
    };
    fetchReactionUsers();
  }, [msg.reactions, selectedReactionDetail]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        messageContentRef.current &&
        !messageContentRef.current.contains(e.target)
      ) {
        dispatch(setSelectedReactionDetail(null));
        setReactionUsers([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dispatch]);

  return (
    <div
      className={`relative mb-2 flex items-center gap-2`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
              className={`relative max-w-[75%] rounded-2xl px-4 py-2 text-white ${
                isYourMessage
                  ? `rounded-br-none bg-blue-500`
                  : `rounded-bl-none bg-gray-600`
              } ${className}`}
              ref={messageContentRef}
            >
              {children}
              <ReactionDisplay
                reactions={msg.reactions}
                parentRef={messageContentRef}
                onReactionClick={handleReactionClickDetail}
              />
            </div>
          ))}

        {msg.type === 1 && (
          <>
            {msg.messageText && msg.messageText.trim() ? (
              <div
                className={`relative max-w-[75%] rounded-2xl px-4 py-2 text-white ${
                  isYourMessage
                    ? `rounded-br-none bg-blue-500`
                    : `rounded-bl-none bg-gray-600`
                } ${className}`}
                ref={messageContentRef}
              >
                {msg.messageText}
                <ReactionDisplay
                  reactions={msg.reactions}
                  parentRef={messageContentRef}
                  onReactionClick={handleReactionClickDetail}
                />
              </div>
            ) : msg.imageUrl ? (
              <div className="relative max-w-[75%]" ref={messageContentRef}>
                <img src={msg.imageUrl} alt="Sent" className="rounded-lg" />
                <ReactionDisplay
                  reactions={msg.reactions}
                  parentRef={messageContentRef}
                  onReactionClick={handleReactionClickDetail}
                />
              </div>
            ) : null}
          </>
        )}

        {msg.type === 2 && (
          <>
            {msg.messageText && msg.messageText.trim() ? (
              <div
                className={`relative flex max-w-[75%] items-center gap-2 rounded-2xl px-4 py-2 text-white ${
                  isYourMessage
                    ? `rounded-br-none bg-blue-500`
                    : `rounded-bl-none bg-gray-600`
                } ${className}`}
                ref={messageContentRef}
              >
                {msg.messageText}
                <ReactionDisplay
                  reactions={msg.reactions}
                  parentRef={messageContentRef}
                  onReactionClick={handleReactionClickDetail}
                />
              </div>
            ) : msg.file && msg.fileName ? (
              <div
                className="relative flex max-w-[75%] items-center gap-2"
                ref={messageContentRef}
              >
                <div
                  className={`rounded-2xl px-4 py-2 text-white ${
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
                <ReactionDisplay
                  reactions={msg.reactions}
                  parentRef={messageContentRef}
                  onReactionClick={handleReactionClickDetail}
                />
              </div>
            ) : null}
          </>
        )}

        {msg.type === 3 ? (
          <>
            {msg.messageText && msg.messageText.trim() ? (
              <div
                className={`relative max-w-[75%] rounded-2xl px-4 py-2 text-white ${
                  isYourMessage
                    ? `rounded-br-none bg-blue-500`
                    : `rounded-bl-none bg-gray-600`
                } ${className}`}
                ref={messageContentRef}
              >
                {msg.messageText}
                <ReactionDisplay
                  reactions={msg.reactions}
                  parentRef={messageContentRef}
                  onReactionClick={handleReactionClickDetail}
                />
              </div>
            ) : msg.video ? (
              <div className="relative max-w-[75%]" ref={messageContentRef}>
                <video controls width="300">
                  <source src={msg.video} type="video/mp4" />
                  <track
                    kind="captions"
                    src="captions_en.vtt"
                    srcLang="en"
                    label="English captions"
                    default
                  />
                  Your browser does not support the video tag.
                </video>
                <ReactionDisplay
                  reactions={msg.reactions}
                  parentRef={messageContentRef}
                  onReactionClick={handleReactionClickDetail}
                />
              </div>
            ) : null}
          </>
        ) : null}

        {msg.type === 4 ? (
          <>
            {msg.messageText && msg.messageText.trim() ? (
              <div
                className={`relative max-w-[75%] rounded-2xl px-4 py-2 text-white ${
                  isYourMessage
                    ? `rounded-br-none bg-blue-500`
                    : `rounded-bl-none bg-gray-600`
                } ${className}`}
                ref={messageContentRef}
              >
                {msg.messageText}
                <ReactionDisplay
                  reactions={msg.reactions}
                  parentRef={messageContentRef}
                  onReactionClick={handleReactionClickDetail}
                />
              </div>
            ) : msg.audio ? (
              <div className="relative max-w-[75%]" ref={messageContentRef}>
                <div className="">
                  {msg.audio ? (
                    <audio controls className="">
                      <source src={msg.audio} type="audio/mpeg" />
                      <track kind="captions" />
                      Your browser does not support the audio element.
                    </audio>
                  ) : (
                    ''
                  )}
                </div>
                <ReactionDisplay
                  reactions={msg.reactions}
                  parentRef={messageContentRef}
                  onReactionClick={handleReactionClickDetail}
                />
              </div>
            ) : null}
          </>
        ) : null}

        {selectedReactionDetail === msg.messageId &&
          reactionUsers.length > 0 && (
            <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center px-4 py-1">
              <div className="flex max-h-96 w-80 flex-col overflow-y-auto rounded-lg bg-white p-4">
                <div className="flex items-center justify-between">
                  <div></div>
                  <span className="font-bold">Cảm xúc về tin nhắn</span>
                  <Button
                    onClick={() => dispatch(setSelectedReactionDetail(null))}
                  >
                    <IoMdCloseCircle />
                  </Button>
                </div>
                <div className="mt-2 space-y-2">
                  {reactionUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar
                          src={user.avatarUrl}
                          alt={user.name}
                          className="h-10 w-10 rounded-full"
                        />
                        <span className="text-sm font-medium">{user.name}</span>
                      </div>
                      <span style={{ fontSize: '16px' }}>
                        {user.emoji}
                      </span>{' '}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        {isHover && selectedMessageToReactEmoji === msg.messageId && (
          <div
            className={`absolute flex items-center ${
              isYourMessage ? 'right-2' : 'left-2'
            }`}
            style={{
              top: '-36px',
              background: '#fff',
              borderRadius: '10px',
              padding: '5px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              zIndex: 10000,
            }}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={handleMouseLeave}
          >
            {['❤️', '😂', '😮', '😢', '👍'].map((emoji, index) => {
              const userId = auth.currentUser.uid;
              const isSelected =
                msg.reactions && msg.reactions[userId] === emoji;
              return (
                <span
                  key={index}
                  onClick={() => handleReactionClick(emoji)}
                  style={{
                    cursor: 'pointer',
                    margin: '0 2px',
                    fontSize: '18px',
                    color: isSelected ? 'red' : 'black',
                    backgroundColor: isSelected ? '#ffebee' : 'transparent',
                  }}
                >
                  {emoji}
                </span>
              );
            })}
            <span
              onClick={handleShowFullPicker}
              style={{ cursor: 'pointer', margin: '0 2px', fontSize: '18px' }}
            >
              ➕
            </span>
            {showFullEmojiPicker && (
              <div
                className=""
                style={{
                  position: 'absolute',
                  bottom: '30px',
                  right: '0',
                  zIndex: 1000,
                }}
              >
                <EmojiPicker
                  width={250}
                  height={300}
                  onEmojiClick={handleEmojiSelect}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
