import React from 'react';
import { Avatar } from '../common';

const UserStoryItem = ({ src, name }) => {
  return (
    <div className="flex flex-col items-center gap-2 text-slate-700 dark:text-slate-200">
      <div className="from-brand-300 to-brand-500 rounded-full bg-gradient-to-br p-[2px] shadow-sm">
        <div className="rounded-full bg-white/90 p-[2px] dark:bg-zinc-900/90">
          <Avatar src={src} className="h-12 w-12 rounded-full shadow" />
        </div>
      </div>
      <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
        {name}
      </p>
    </div>
  );
};

export default UserStoryItem;
