import React, { useEffect, useState } from 'react';
import { MdSearch } from 'react-icons/md';
import { Input } from '../common';
import { UserList, UserStory } from '../user';
import { ListUsersStory } from '../../mock_data/ListUsersStory';
import { auth } from '../../firebase';
import { userService } from '../../service';
import { useDispatch, useSelector } from 'react-redux';
import { setUsers } from '../../../features/user/userReducer';

const Sidebar = () => {
  const [searchValue, setSearchValue] = useState('');
  const userId = auth.currentUser?.uid;
  const { users } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userId) return;

    const fetchUsers = async () => {
      try {
        const response = await userService.searchUsers(
          searchValue.trim(),
          userId,
        );
        dispatch(setUsers(response.data));
      } catch (error) {
        console.error('Error loading users:', error);
        setUsers([]);
      }
    };

    // fetchUsers();
    const delayDebounce = setTimeout(() => {
      fetchUsers();
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [searchValue, userId, dispatch]);

  const handleChange = (event) => {
    setSearchValue(event.target.value);
  };

  return (
    <div className="flex flex-col gap-3 px-4 pt-4">
      <div className="relative flex items-center text-gray-400 focus-within:text-gray-600">
        <MdSearch className="mb-1xs pointer-events-none absolute mt-2 ml-3 h-5 w-5" />

        <Input
          type="text"
          value={searchValue}
          onChange={handleChange}
          placeholder="Search messenger"
          className="rounded-2xl pr-3 pl-10"
        />
      </div>

      <UserStory userStorys={ListUsersStory} />

      <UserList users={users} />
    </div>
  );
};

export default Sidebar;
