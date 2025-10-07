import React from 'react';
import { IoMdAdd } from 'react-icons/io';
import UserStoryItem from './UserStoryItem';

const UserStory = ({ userStorys }) => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      <button
        type="button"
        className="group focus-visible:ring-brand-300 flex flex-col items-center gap-2 rounded-2xl border border-white/55 bg-white/75 p-3 shadow-sm transition-colors duration-200 hover:bg-white/85 focus-visible:ring-2 focus-visible:outline-none dark:border-zinc-700/40 dark:bg-zinc-900/60 dark:hover:bg-zinc-900"
      >
        <div className="from-brand-500 to-brand-600 relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-lg">
          <IoMdAdd className="h-5 w-5" />
        </div>
        <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
          Add
        </span>
      </button>

      <div className="flex gap-3">
        {userStorys.map((story, index) => (
          <UserStoryItem name={story.name} src={story.src} key={index} />
        ))}
      </div>
    </div>
  );
};

export default UserStory;
