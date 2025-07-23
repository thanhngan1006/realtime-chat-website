import React from 'react';
import ConversationItem from './ConversationItem';

const ConversationList = ({ conversationList }) => {
  return (
    <div>
      {conversationList.map((conversationItem, index) => (
        <ConversationItem key={index} conversationItem={conversationItem} />
      ))}
    </div>
  );
};

export default ConversationList;
