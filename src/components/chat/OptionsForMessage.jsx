import React from 'react';
import Button from '../common/Button';
import { SlOptionsVertical } from 'react-icons/sl';
import { FaShare } from 'react-icons/fa';
import { MdEmojiEmotions } from 'react-icons/md';

const OptionsForMessage = () => {
  return (
    <div className="flex items-center gap-1">
      <Button
        className="rounded-full p-1"
        onClick={() => console.log('options clicked')}
      >
        <SlOptionsVertical className="h-4 w-4" />
      </Button>
      <Button
        className="rounded-full p-1"
        onClick={() => console.log('share clicked')}
      >
        <FaShare className="h-4 w-4" />
      </Button>
      <Button
        className="rounded-full p-1"
        onClick={() => console.log('emoji clicked')}
      >
        <MdEmojiEmotions className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default OptionsForMessage;
