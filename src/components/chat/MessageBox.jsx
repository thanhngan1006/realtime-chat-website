import React from 'react';
import Message from './Message';
import { auth } from '../../firebase';
import dayjs from 'dayjs';

const MessageBox = ({ messages, avatarUrls }) => {
  const uid = auth.currentUser.uid;

  const visibleMessages = messages.filter(
    (msg) => !msg.deletedBy?.includes(uid),
  );

  const shouldShowDateHeader = (currentMsg, previousMsg) => {
    if (!previousMsg) return true;
    const currentMsgDate = dayjs(currentMsg.sentTime?.toDate());
    const previousMsgDate = dayjs(previousMsg.sentTime?.toDate());
    return !currentMsgDate.isSame(previousMsgDate, 'day');
  };

  return (
    <div className="relative flex flex-col-reverse">
      <div className="mb-4">
        {visibleMessages.map((msg, index) => {
          const previousMsg = visibleMessages[index + 1];
          const nextMsg = visibleMessages[index - 1];

          const isFirstInGroup =
            !previousMsg || previousMsg.senderId !== msg.senderId;
          const showAvatar = !nextMsg || nextMsg.senderId !== msg.senderId;

          const showDateHeader = shouldShowDateHeader(msg, previousMsg);

          return (
            <React.Fragment key={msg.messageId || index}>
              {showDateHeader && (
                <div className="my-4 text-center text-sm text-gray-500">
                  {dayjs(msg.sentTime?.toDate()).format('MMMM D, YYYY')}
                </div>
              )}
              <Message
                isYourMessage={msg.senderId === uid}
                src={avatarUrls[msg.senderId] || ''}
                alt="Avatar"
                textColor="white"
                msg={msg}
                showAvatar={showAvatar}
                isFirstInGroup={isFirstInGroup}
              >
                {msg.messageText}
              </Message>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default MessageBox;
