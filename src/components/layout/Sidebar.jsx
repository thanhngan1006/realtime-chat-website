import React from 'react';
import { MdSearch } from 'react-icons/md';
import { Input } from '../common';
import { UserList, UserStory } from '../user';
import { ListUsersStory } from '../../mock_data/ListUsersStory';
import { ListUser } from '../../mock_data/ListUser';

const Sidebar = () => {
  return (
    <div className="flex flex-col gap-3 px-4 pt-4">
      <div className="relative flex items-center text-gray-400 focus-within:text-gray-600">
        <MdSearch className="mb-1xs pointer-events-none absolute mt-2 ml-3 h-5 w-5" />

        <Input
          type="text"
          placeholder="Search messenger"
          className="rounded-2xl pr-3 pl-10"
        />
      </div>

      <UserStory userStorys={ListUsersStory} />

      <UserList users={ListUser} />
    </div>
  );
};

export default Sidebar;
