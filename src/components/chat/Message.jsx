import React, { useEffect, useState, useRef } from 'react';
import Avatar from '../common/Avatar';
import { FaFile } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';

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
import { AI_ASSISTANT_ID } from '../../constants/ai';

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

  const bubbleBaseClass =
    'relative max-w-[80%] rounded-2xl px-4 py-3 text-base leading-relaxed transition-all duration-150';
  const yourBubbleClass =
    'border border-brand-200 bg-brand-50 text-brand-900 shadow-sm';
  const otherBubbleClass =
    'border border-slate-200 bg-slate-100 text-slate-900 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-slate-100';

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
    <div className={`flex ${isYourMessage ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`relative flex items-center justify-center gap-2 rounded-3xl transition-all duration-200`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="article"
        aria-labelledby={`message-${msg.messageId}`}
      >
        {!isYourMessage && (
          <div className="flex-shrink-0">
            <Avatar
              src={`${
                avatarUrl
                  ? avatarUrl
                  : msg.senderId == AI_ASSISTANT_ID
                    ? '/ai_avatar.jpg'
                    : null
              }`}
              alt="Sender avatar"
              className="h-10 w-10 rounded-full shadow-md ring-2 ring-white/20 dark:ring-zinc-800"
            />
          </div>
        )}

        <div
          className={`flex w-full flex-col ${
            isYourMessage ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`flex w-full${
              isYourMessage ? 'justify-end' : 'justify-start'
            } ${
              isHover ? 'opacity-100' : 'pointer-events-none opacity-0'
            } transition-opacity duration-150`}
          >
            <OptionsForMessage msg={msg} isYourMessage={isYourMessage} />
          </div>

          {msg.type === 0 &&
            (editedMessage === msg.messageId &&
            selectedMessageId === msg.messageId ? (
              <div
                className="relative flex w-full max-w-[80%] flex-col gap-2"
                ref={messageContentRef}
              >
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={updatedMessageText}
                    onChange={handleUpdateMessage}
                    placeholder="Edit message..."
                    className="border-brand-300 focus:border-brand-500 flex-1 rounded-2xl border-2 px-4 py-2 focus:outline-none dark:bg-zinc-700 dark:text-white"
                    aria-label="Edit message input"
                  />
                  <Button
                    className="rounded-xl bg-emerald-500 px-4 py-2 text-white shadow-sm transition-colors duration-200 hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                    onClick={handleSaveEdit}
                    aria-label="Save edited message"
                  >
                    Save
                  </Button>
                  <Button
                    className="rounded-xl bg-slate-200 px-4 py-2 text-slate-700 transition-colors duration-200 hover:bg-slate-300 focus:ring-2 focus:ring-slate-300 focus:outline-none"
                    onClick={handleCancelEdit}
                    aria-label="Cancel editing message"
                  >
                    Cancel
                  </Button>
                </div>
                <ReactionDisplay
                  reactions={msg.reactions}
                  parentRef={messageContentRef}
                  onReactionClick={handleReactionClickDetail}
                />
              </div>
            ) : (
              <div
                className={`${bubbleBaseClass} ${
                  isYourMessage ? yourBubbleClass : otherBubbleClass
                } ${className}`}
                ref={messageContentRef}
                id={`message-${msg.messageId}`}
                aria-label={`Message from ${isYourMessage ? 'you' : 'sender'}`}
              >
                <ReactMarkdown>{children}</ReactMarkdown>
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
                  className={`${bubbleBaseClass} ${
                    isYourMessage ? yourBubbleClass : otherBubbleClass
                  } max-w-[75%] ${className}`}
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
                <div
                  className="relative max-w-[75%] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md dark:border-zinc-700 dark:bg-zinc-900/80"
                  ref={messageContentRef}
                >
                  <img
                    src={msg.imageUrl}
                    alt="Sent"
                    className="block h-full w-full object-cover"
                  />
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
                  className={`${bubbleBaseClass} ${
                    isYourMessage ? yourBubbleClass : otherBubbleClass
                  } flex max-w-[80%] items-center gap-3 ${className}`}
                  ref={messageContentRef}
                >
                  <span className="leading-relaxed">{msg.messageText}</span>
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
                    className={`${bubbleBaseClass} ${
                      isYourMessage ? yourBubbleClass : otherBubbleClass
                    } flex items-center gap-3 text-sm ${className}`}
                  >
                    <FaFile className="h-5 w-5" />
                    <a
                      href={msg.file}
                      download={msg.fileName}
                      className="font-medium underline"
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
                  className={`${bubbleBaseClass} ${
                    isYourMessage ? yourBubbleClass : otherBubbleClass
                  } ${className}`}
                  ref={messageContentRef}
                >
                  <span className="leading-relaxed">{msg.messageText}</span>
                  <ReactionDisplay
                    reactions={msg.reactions}
                    parentRef={messageContentRef}
                    onReactionClick={handleReactionClickDetail}
                  />
                </div>
              ) : msg.video ? (
                <div
                  className="relative max-w-[75%] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md dark:border-zinc-700 dark:bg-zinc-900/80"
                  ref={messageContentRef}
                >
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
                  className={`${bubbleBaseClass} ${
                    isYourMessage ? yourBubbleClass : otherBubbleClass
                  } ${className}`}
                  ref={messageContentRef}
                >
                  <span className="leading-relaxed">{msg.messageText}</span>
                  <ReactionDisplay
                    reactions={msg.reactions}
                    parentRef={messageContentRef}
                    onReactionClick={handleReactionClickDetail}
                  />
                </div>
              ) : msg.audio ? (
                <div
                  className="relative max-w-[75%] overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-md dark:border-zinc-700 dark:bg-zinc-900/80"
                  ref={messageContentRef}
                >
                  <div>
                    {msg.audio ? (
                      <audio controls className="w-full">
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
                          <span className="text-sm font-medium">
                            {user.name}
                          </span>
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
    </div>
  );
};

export default Message;
