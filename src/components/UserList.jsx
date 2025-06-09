import React from 'react'
import UserItem from './UserItem';

const UserList = ({ users }) => {
    return (
        <div className="w-full">
          {users.map((user, index) => (
            <UserItem
              key={index}
              name={user.name}
              imgUrl={user.imgUrl}
              timeSendMessage={user.timeSendMessage}
              messageContent={user.messageContent}
            />
          ))}
        </div>
      );
}

export default UserList