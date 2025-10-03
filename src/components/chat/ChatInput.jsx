import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiFillLike } from 'react-icons/ai';
import { FaMicrophone, FaRegImage } from 'react-icons/fa';
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

  return (
    <div className="fixed bottom-0 grid w-[75%] grid-cols-[auto_1fr_auto] items-center gap-2 border-t border-gray-700 bg-white p-2 shadow-2xl dark:bg-zinc-800">
      <div className="relative flex items-center gap-2 text-blue-400">
        <div className="relative">
          <IoMdAddCircle
            onClick={toggleActions}
            className="h-8 w-8 cursor-pointer"
          />
          {showActions && (
            <div className="absolute bottom-10 left-0 flex flex-col gap-2 rounded-lg bg-white p-2 shadow-lg dark:bg-zinc-700">
              <div
                onClick={() => {
                  fileInputRef.current.click();
                  toggleActions();
                }}
                className="flex cursor-pointer items-center gap-2 p-1 hover:bg-gray-200 dark:hover:bg-zinc-600"
              >
                <IoMdAddCircle className="h-6 w-6" />
                <span>File</span>
                <Input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleUploadFile}
                  className="hidden"
                />
              </div>
              <div
                onClick={() => {
                  imageInputRef.current.click();
                  toggleActions();
                }}
                className="flex cursor-pointer items-center gap-2 p-1 hover:bg-gray-200 dark:hover:bg-zinc-600"
              >
                <FaRegImage className="h-6 w-6" />
                <span>Image</span>
                <Input
                  type="file"
                  accept="image/*"
                  ref={imageInputRef}
                  onChange={handleUploadImage}
                  className="hidden"
                />
              </div>
              <div
                onClick={() => {
                  handleOpenMicro();
                  toggleActions();
                }}
                className="flex cursor-pointer items-center gap-2 p-1 hover:bg-gray-200 dark:hover:bg-zinc-600"
              >
                <FaMicrophone className="h-6 w-6" />
                <span>Micro</span>
              </div>
              <div
                onClick={() => {
                  handleOpenWidget();
                  toggleActions();
                }}
                className="flex cursor-pointer items-center gap-2 p-1 hover:bg-gray-200 dark:hover:bg-zinc-600"
              >
                <MdOndemandVideo className="h-6 w-6" />
                <span>Video</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} id="chatForm" className="w-full">
        {isOpenMicro ? (
          <ReactRecorder />
        ) : (
          <div className="relative flex items-center">
            <Input
              type="text"
              placeholder="Aa"
              className="w-full rounded-full border bg-gray-100 px-10 py-2 text-gray-600 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-zinc-700 dark:text-white"
              value={messageContent}
              onChange={(e) => dispatch(setMessageContent(e.target.value))}
              onFocus={() => dispatch(setIsFocused(true))}
              onBlur={() => dispatch(setIsFocused(false))}
              ref={inputRef}
            />
            <MdEmojiEmotions
              onClick={(e) => {
                const rect = e.target.getBoundingClientRect();
                dispatch(
                  setEmojiPickerPosition({
                    top: rect.top - 320,
                    left: rect.left,
                  }),
                );
                dispatch(setShowEmojiPicker(!showEmojiPicker));
              }}
              className="absolute right-3 bottom-2.5 h-5 w-5 cursor-pointer text-gray-500"
            />
          </div>
        )}
      </form>

      <div className="text-blue-400">
        {canSendMessage ? (
          <button type="submit" form="chatForm">
            <IoSend size={24} />
          </button>
        ) : !isOpenMicro ? (
          <AiFillLike
            className="h-8 w-8 cursor-pointer"
            onClick={handleSendLikeButton}
          />
        ) : null}
      </div>
    </div>
  );
};

export default ChatInput;
