import React from 'react';
import ConversationItem from './ConversationItem';

const ConversationList = ({ conversationList }) => {
  if (!conversationList || conversationList.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/55 bg-white/75 p-6 text-center text-sm text-slate-500 shadow-sm dark:border-zinc-700/40 dark:bg-zinc-900/60 dark:text-slate-400">
        No conversations yet. Start a new chat to keep the momentum going.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {conversationList.map((conversationItem) => (
        <ConversationItem
          key={conversationItem.id}
          conversationItem={conversationItem}
        />
      ))}
    </div>
  );
};

export default ConversationList;
