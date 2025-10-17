import React, { useRef, useCallback, useState, useEffect } from 'react';
import { AiFillLike } from 'react-icons/ai';
import { IoMdAddCircle } from 'react-icons/io';
import { FaMicrophone, FaRegImage } from 'react-icons/fa';
import { MdEmojiEmotions } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from '../common';
import { IoSend } from 'react-icons/io5';
import {
  setMessageContent,
  setIsFocused,
  setEmojiPickerPosition,
  setShowEmojiPicker,
} from '../../../features/chat/chatReducer';
import EmojiPickerPortal from '../common/EmojiPickerPortal';
import ReactRecorder from './Recorder';

const MessageInput = React.memo(
  ({
    isOpenMicro,
    recorderStatus,
    mediaBlobUrl,
    onSubmit,
    onUploadFile,
    onUploadImage,
    onOpenMicro,
    onSendLike,
    onStartTyping,
    onStopTyping,
  }) => {
    const dispatch = useDispatch();
    const { messageContent, showEmojiPicker, emojiPickerPosition } =
      useSelector((state) => state.chat);
    const inputRef = useRef(null);
    const imageInputRef = useRef(null);
    const fileInputRef = useRef(null);
    const [localMessageContent, setLocalMessageContent] = useState(''); // Local state for input to prevent re-renders from Redux

    useEffect(() => {
      setLocalMessageContent(messageContent || '');
    }, [messageContent]);

    const hasTextContent = localMessageContent.trim() !== '';
    const hasAudioContent = recorderStatus === 'stopped' && mediaBlobUrl;
    const canSendMessage = hasTextContent || hasAudioContent;

    const iconButtonClass =
      'rounded-full bg-slate-100 p-2 border-1 border-gray-300 cursor-pointer  text-brand-500 transition-colors duration-200 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 dark:bg-zinc-800 dark:text-slate-200';

    const handleInputChange = useCallback(
      (e) => {
        const value = e.target.value;
        setLocalMessageContent(value);
        dispatch(setMessageContent(value));
        if (onStartTyping && value.length > 0 && !showEmojiPicker) {
          onStartTyping();
        }
      },
      [dispatch, onStartTyping, showEmojiPicker],
    );

    const handleLocalSubmit = useCallback(
      async (e) => {
        e.preventDefault();
        if (onSubmit && hasTextContent) {
          onStopTyping?.();
          onSubmit(e);
        }
        setLocalMessageContent('');
        dispatch(setMessageContent(''));
      },
      [onSubmit, dispatch, hasTextContent, onStopTyping],
    );

    const handleFocus = useCallback(() => {
      dispatch(setIsFocused(true));
      onStartTyping?.();
    }, [dispatch, onStartTyping]);

    const handleBlur = useCallback(() => {
      dispatch(setIsFocused(false));
      onStopTyping?.();
    }, [dispatch, onStopTyping]);

    const handleEmojiClick = useCallback(
      (e) => {
        setLocalMessageContent((prev) => {
          const updated = `${prev}${e.emoji}`;
          dispatch(setMessageContent(updated));
          return updated;
        });
        dispatch(setShowEmojiPicker(false));
        inputRef.current?.focus(); // Refocus after emoji insert
      },
      [dispatch],
    );

    const handleEmojiButtonClick = useCallback(
      (e) => {
        const rect = e.target.getBoundingClientRect();
        dispatch(
          setEmojiPickerPosition({
            top: rect.top - 320,
            left: rect.left,
          }),
        );
        dispatch(setShowEmojiPicker(!showEmojiPicker));
        if (!showEmojiPicker) {
          onStopTyping?.(); // Stop typing when opening emoji
        }
      },
      [dispatch, showEmojiPicker, onStopTyping],
    );

    // handleLocalSubmit updated above

    return (
      <div
        className="flex w-full flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm lg:flex-row lg:items-center dark:border-zinc-700 dark:bg-zinc-900"
        role="toolbar"
        aria-label="Message composition toolbar"
      >
        <div
          className="text-brand-500 flex items-center justify-center gap-2"
          role="group"
          aria-label="Media attachments"
        >
          <button
            onClick={() => fileInputRef.current?.click()}
            className={iconButtonClass}
            aria-label="Attach file"
            type="button"
          >
            <IoMdAddCircle className="h-5 w-5" />
          </button>
          <Input
            type="file"
            ref={fileInputRef}
            onChange={onUploadFile}
            className="hidden"
            aria-hidden="true"
          />
          <button
            onClick={() => imageInputRef.current?.click()}
            className={iconButtonClass}
            aria-label="Attach image"
            type="button"
          >
            <FaRegImage className="h-5 w-5" />
          </button>
          <Input
            type="file"
            accept="image/*"
            ref={imageInputRef}
            onChange={onUploadImage}
            className="hidden"
            aria-hidden="true"
          />
          <button
            onClick={onOpenMicro}
            className={`${iconButtonClass} ${isOpenMicro ? 'bg-rose-100 text-rose-500 dark:bg-rose-500/20 dark:text-rose-300' : ''}`}
            aria-label={
              isOpenMicro ? 'Stop voice recording' : 'Start voice recording'
            }
            type="button"
          >
            <FaMicrophone className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleLocalSubmit}
          id="chatForm"
          className="flex flex-1"
          aria-label="Send message form"
        >
          {isOpenMicro ? (
            <div className="w-full rounded-2xl border border-dashed border-white/50 bg-white/50 p-4 dark:border-zinc-700/60 dark:bg-zinc-900/70">
              <ReactRecorder aria-label="Voice recorder" />
            </div>
          ) : (
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Write a thoughtful message..."
                className="w-full"
                inputClassName="rounded-full border border-slate-200 bg-white px-16 py-3 text-slate-800 placeholder:text-slate-400 shadow-inner dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                variant="filled"
                value={localMessageContent}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                ref={inputRef}
                aria-label="Message input"
              />
              <button
                onClick={handleEmojiButtonClick}
                className="focus-visible:ring-brand-300 absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-slate-100 p-2 text-slate-500 transition-colors duration-200 hover:bg-slate-200 focus-visible:ring-2 focus-visible:outline-none dark:bg-zinc-800 dark:text-slate-300"
                type="button"
                aria-label="Open emoji picker"
              >
                <MdEmojiEmotions className="h-5 w-5" />
              </button>
            </div>
          )}
        </form>

        <EmojiPickerPortal
          show={showEmojiPicker}
          onEmojiClick={handleEmojiClick}
          position={emojiPickerPosition}
        />

        <div
          className="text-brand-500 flex items-center gap-2"
          role="group"
          aria-label="Send actions"
        >
          {canSendMessage ? (
            <button
              type="submit"
              form="chatForm"
              className="focus-visible:ring-brand-200 cursor-pointer rounded-full bg-blue-500 p-2 text-white shadow-sm transition-colors duration-200 hover:bg-blue-600 focus-visible:ring-2 focus-visible:outline-none"
              aria-label="Send message"
            >
              <IoSend size={20} />
            </button>
          ) : !isOpenMicro ? (
            <button
              onClick={onSendLike}
              className="focus-visible:ring-brand-200 cursor-pointer rounded-full bg-blue-500 p-2 text-white shadow-sm transition-colors duration-200 hover:bg-blue-600 focus-visible:ring-2 focus-visible:outline-none"
              aria-label="Send like reaction"
              type="button"
            >
              <AiFillLike className="text-brand-500 h-5 w-5" />
            </button>
          ) : null}
        </div>
      </div>
    );
  },
);

MessageInput.displayName = 'MessageInput';

export default MessageInput;
