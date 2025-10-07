import React from 'react';
import UserItem from './UserItem';
import { formatTimestamp } from '../../service';

const UserList = ({ users }) => {
  return (
    <div className="flex flex-col gap-3">
      {users.map((user, index) => (
        <UserItem
          id={user.id}
          key={index}
          user={user}
          name={user.name}
          imgUrl={user.avatarUrl}
          timeSendMessage={formatTimestamp(user?.lastSeen)}
        />
      ))}
    </div>
  );
};

export default UserList;
