import React from 'react';
import ConversationItem from './ConversationItem';

const ConversationList = ({
  conversationList,
  conversationDetailsMap = {},
}) => {
  if (!conversationList || conversationList.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-slate-300">
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
          details={conversationDetailsMap[conversationItem.id]}
        />
      ))}
    </div>
  );
};

export default ConversationList;
