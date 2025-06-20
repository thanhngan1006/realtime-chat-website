import React, { useContext } from 'react';
import SubMenuItem from '../common/SubMenuItem';

import { AiOutlineSetting } from 'react-icons/ai';
import { BiLogOutCircle } from 'react-icons/bi';
import { MdHelpOutline } from 'react-icons/md';
import { CgProfile } from 'react-icons/cg';
import { AuthContext } from '../../context/UseAuth';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { auth } from '../../firebase';

const SubMenu = ({ className = '' }) => {
  const { logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div
      className={`absolute z-10 w-80 rounded-xl bg-white p-2 shadow-xl ${className}`}
    >
      <SubMenuItem leftIcon={<AiOutlineSetting />}>Setting</SubMenuItem>

      <SubMenuItem
        leftIcon={<CgProfile />}
        onClick={() => navigate(`/profile/${auth.currentUser.uid}`)}
      >
        Profile
      </SubMenuItem>

      <hr className="my-1" />

      <SubMenuItem
        leftIcon={<BiLogOutCircle />}
        className="font-semibold"
        onClick={logOut}
      >
        Sign out
      </SubMenuItem>
    </div>
  );
};

export default SubMenu;
