import React from 'react';
import SubMenuItem from '../common/SubMenuItem';
import { AiOutlineSetting } from 'react-icons/ai';
import { BiLogOutCircle } from 'react-icons/bi';
import { CgProfile } from 'react-icons/cg';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logOut } from '../../../features/user/authActions';
import { auth } from '../../firebase';

const SubMenu = ({ className = '' }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await dispatch(logOut()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div
      className={`absolute z-10 w-80 rounded-xl bg-white p-2 shadow-xl ${className}`}
    >
      <SubMenuItem leftIcon={<AiOutlineSetting />}>Setting</SubMenuItem>

      <SubMenuItem
        leftIcon={<CgProfile />}
        onClick={() => navigate(`/profile/${auth.currentUser?.uid}`)}
      >
        Profile
      </SubMenuItem>

      <hr className="my-1" />

      <SubMenuItem
        leftIcon={<BiLogOutCircle />}
        className="font-semibold"
        onClick={handleLogout}
      >
        Sign out
      </SubMenuItem>
    </div>
  );
};

export default SubMenu;
