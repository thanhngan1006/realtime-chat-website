import React from 'react';

const ProfileRow = ({ label, value }) => {
  return (
    <div className="rounded-2xl border border-white/40 bg-white/70 p-5 shadow-sm backdrop-blur-xl dark:border-zinc-700/60 dark:bg-zinc-900/70">
      <span className="text-xs font-semibold tracking-[0.25em] text-slate-400 uppercase dark:text-slate-500">
        {label}
      </span>
      <span className="mt-2 block text-base font-semibold text-slate-900 dark:text-white">
        {value || '—'}
      </span>
    </div>
  );
};

export default ProfileRow;
