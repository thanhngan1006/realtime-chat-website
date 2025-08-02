import React, { useEffect, useState, useRef } from 'react';
import { Avatar, Button, Input } from '../components/common';
import { FaEdit } from 'react-icons/fa';
import { auth, db } from '../firebase';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { IoMdArrowBack } from 'react-icons/io';
import ProfileRow from '../components/layout/ProfileRow';
import { fileService, userService } from '../service';
import { useDispatch, useSelector } from 'react-redux';
import {
  setAvatarUrl,
  setLoading,
  setProfileData,
} from '../../features/user/userReducer';

const Profile = () => {
  const { uid } = useParams();
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { profileData, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        dispatch(setLoading(true));
        const data = await userService.getUser(uid);
        const userData = data.data;
        dispatch(setProfileData(userData));
        setEditedData({ name: userData.name });
      } catch (err) {
        setError('Can not fetch profile data');
        if (err.code === 404) {
          setError('User not found');
        }
        console.error(err);
      } finally {
        dispatch(setLoading(false));
      }
    };

    if (uid) {
      fetchProfileData();
    }
  }, [uid, dispatch]);

  const handleUpdate = async () => {
    try {
      const updatedDoc = await userService.update(uid, {
        name: editedData.name,
      });

      dispatch(setProfileData(updatedDoc));
      setIsEditing(false);
    } catch (err) {
      console.error('Can not update profile:', err);
      setError('Failed to update profile');
    }
  };

  const handleInputChange = (field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    try {
      const { base64 } = await fileService.handleFileRead(e);
      const userRef = doc(db, 'users', uid);

      await updateDoc(userRef, { avatarUrl: base64 });

      const updatedData = await userService.getUser(uid);
      dispatch(setAvatarUrl(updatedData.data.avatarUrl));
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setError('Failed to upload avatar');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="relative">
      <div className="relative flex h-screen w-full items-center justify-center bg-gray-200 dark:bg-zinc-800">
        <div className="absolute top-0 h-[15%] w-full bg-blue-400 dark:bg-zinc-600"></div>
        <div className="absolute bottom-0 h-[15%] w-full bg-blue-400 dark:bg-zinc-600"></div>

        <div className="z-10 flex h-[90%] w-[85%] rounded-2xl bg-white shadow-2xl dark:bg-zinc-700">
          <div className="flex flex-1/3 flex-col items-center gap-2 border-r border-gray-500 p-4">
            <div className="relative h-32 w-32">
              <Avatar
                src={profileData?.avatarUrl}
                className="h-32 w-32 rounded-full bg-red-400"
              />
              {auth.currentUser.uid === uid && (
                <>
                  <Button
                    onClick={handleAvatarClick}
                    className="absolute top-24 right-0 rounded-full bg-blue-500 p-2 text-white transition-colors hover:bg-blue-600"
                  >
                    <FaEdit />
                  </Button>
                  <Input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </>
              )}
            </div>
            <span className="font-bold text-blue-500">
              {profileData?.email}
            </span>
          </div>

          <div className="flex-2/3 p-4">
            <div className="mx-auto mt-8 max-w-md space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <Input
                      label="Name"
                      type="text"
                      value={editedData.name || ''}
                      onChange={(e) =>
                        handleInputChange('name', e.target.value)
                      }
                      className="w-full border-b border-gray-400 text-xl focus:border-blue-500 focus:outline-none dark:text-white"
                    />
                  </div>
                  <div className="mt-4 flex space-x-4">
                    <Button
                      onClick={handleUpdate}
                      className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        setEditedData(profileData);
                      }}
                      className="rounded bg-gray-400 px-4 py-2 text-white hover:bg-gray-500"
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <ProfileRow label="Name" value={profileData?.name} />
                  <ProfileRow label="Email" value={profileData?.email} />
                  {auth.currentUser.uid === uid && (
                    <Button
                      className="mt-4 flex items-center space-x-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                      onClick={() => setIsEditing(true)}
                    >
                      <FaEdit />
                      <span>Edit Profile</span>
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Button className="absolute top-4 left-4" onClick={() => navigate('/')}>
        <IoMdArrowBack className="h-6 w-6 font-bold text-white" />
      </Button>
    </div>
  );
};

export default Profile;
