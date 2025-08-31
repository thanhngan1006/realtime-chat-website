import React from 'react';
import { createPortal } from 'react-dom';
import EmojiPicker from 'emoji-picker-react';

const EmojiPickerPortal = ({
  onEmojiClick,
  show,
  position = { top: 0, left: 0 },
  width = 250,
  height = 300,
}) => {
  if (!show) return null;

  return createPortal(
    <div
      className="fixed z-[9999]"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <EmojiPicker
        onEmojiClick={onEmojiClick}
        width={width}
        height={height}
        theme="auto"
        searchDisabled={true}
        skinTonesDisabled={true}
      />
    </div>,
    document.body,
  );
};

export default EmojiPickerPortal;
