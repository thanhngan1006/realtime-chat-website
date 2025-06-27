import React from 'react';
import UserItem from './UserItem';
import { formatTimestamp } from '../../service';

const UserList = ({ users }) => {
  return (
    <div className="w-full">
      {users.map((user, index) => (
        <UserItem
          key={index}
          user={user}
          name={user.name}
          imgUrl={user.avatarUrl}
          timeSendMessage={formatTimestamp(user?.lastSeen)}
          // messageContent={user.messageContent}
        />
      ))}
    </div>
  );
};

export default UserList;
