import React from 'react';
import ConversationItem from './ConversationItem';

const ConversationList = ({ conversationList }) => {
  return (
    <div>
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
