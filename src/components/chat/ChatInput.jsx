import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiFillLike } from 'react-icons/ai';
import { FaMicrophone, FaRegImage, FaFile } from 'react-icons/fa';
import { IoMdAddCircle } from 'react-icons/io';
import { IoSend } from 'react-icons/io5';
import { MdEmojiEmotions, MdOndemandVideo } from 'react-icons/md';
import { Input } from '../common';
import ReactRecorder from './Recorder';
import {
  setEmojiPickerPosition,
  setIsFocused,
  setMessageContent,
  setShowEmojiPicker,
} from '../../../features/chat/chatReducer';

const ChatInput = ({
  handleSubmit,
  handleSendLikeButton,
  handleUploadFile,
  handleUploadImage,
  handleOpenMicro,
  handleOpenWidget,
}) => {
  const dispatch = useDispatch();
  const {
    messageContent,
    showEmojiPicker,
    isOpenMicro,
    recorderStatus,
    mediaBlobUrl,
  } = useSelector((state) => state.chat);
  const inputRef = useRef(null);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [showActions, setShowActions] = useState(false);

  const hasTextContent = messageContent.trim() !== '';
  const hasAudioContent = recorderStatus === 'stopped' && mediaBlobUrl;
  const canSendMessage = hasTextContent || hasAudioContent;

  const toggleActions = () => {
    setShowActions(!showActions);
  };

  const actionButtons = [
    {
      icon: <FaFile />,
      label: 'File',
      onClick: () => fileInputRef.current.click(),
    },
    {
      icon: <FaRegImage />,
      label: 'Image',
      onClick: () => imageInputRef.current.click(),
    },
    { icon: <FaMicrophone />, label: 'Micro', onClick: handleOpenMicro },
    { icon: <MdOndemandVideo />, label: 'Video', onClick: handleOpenWidget },
  ];

  return (
    <div className="border-t border-gray-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
      <div className="relative flex items-center gap-4">
        {/* Action Menu */}
        <div className="relative">
          <button
            onClick={toggleActions}
            className="rounded-full p-2 text-blue-500 hover:bg-gray-200 dark:hover:bg-zinc-700"
          >
            <IoMdAddCircle size={24} />
          </button>
          {showActions && (
            <div
              className="ring-opacity-5 absolute bottom-12 left-0 mb-2 flex flex-col gap-2 rounded-lg bg-white p-2 shadow-lg ring-1 ring-black dark:bg-zinc-900"
              style={{
                transformOrigin: 'bottom left',
                transition: 'transform 0.2s ease-out, opacity 0.2s ease-out',
                transform: showActions ? 'scale(1)' : 'scale(0.95)',
                opacity: showActions ? 1 : 0,
              }}
            >
              {actionButtons.map((button, index) => (
                <div
                  key={index}
                  onClick={() => {
                    button.onClick();
                    toggleActions();
                  }}
                  className="flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-gray-100 dark:hover:bg-zinc-700"
                >
                  {button.icon}
                  <span className="text-sm">{button.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} id="chatForm" className="flex-1">
          {isOpenMicro ? (
            <ReactRecorder />
          ) : (
            <div className="relative flex items-center">
              <Input
                type="text"
                placeholder="Aa"
                className="w-full rounded-full border-none bg-gray-100 py-2 pr-10 pl-4 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:text-white"
                value={messageContent}
                onChange={(e) => dispatch(setMessageContent(e.target.value))}
                onFocus={() => dispatch(setIsFocused(true))}
                onBlur={() => dispatch(setIsFocused(false))}
                ref={inputRef}
              />
              <button
                type="button"
                onClick={(e) => {
                  const rect = e.target.getBoundingClientRect();
                  dispatch(
                    setEmojiPickerPosition({
                      top: rect.top - 450,
                      left: rect.left - 300,
                    }),
                  );
                  dispatch(setShowEmojiPicker(!showEmojiPicker));
                }}
                className="absolute inset-y-0 right-3 flex items-center"
              >
                <MdEmojiEmotions className="h-6 w-6 text-gray-500 hover:text-blue-500" />
              </button>
            </div>
          )}
        </form>

        {/* Send/Like Button */}
        <div className="text-blue-500">
          {canSendMessage ? (
            <button
              type="submit"
              form="chatForm"
              className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-zinc-700"
            >
              <IoSend size={24} />
            </button>
          ) : !isOpenMicro ? (
            <button
              onClick={handleSendLikeButton}
              className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-zinc-700"
            >
              <AiFillLike size={24} />
            </button>
          ) : null}
        </div>

        {/* Hidden Inputs for File/Image */}
        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleUploadFile}
          className="hidden"
        />
        <Input
          type="file"
          accept="image/*"
          ref={imageInputRef}
          onChange={handleUploadImage}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ChatInput;
