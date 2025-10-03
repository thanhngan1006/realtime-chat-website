import React, { useEffect, useRef, useState } from 'react';
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

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-pulse text-primary-600 dark:text-primary-400 text-lg font-medium">
        Loading...
      </div>
    </div>
  );
  if (error) return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-red-500 dark:text-red-400 text-lg">{error}</div>
    </div>
  );

  return (
    <div className="relative">
      <div className="relative flex h-screen w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800">
        <div className="absolute top-0 h-[20%] w-full bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700"></div>
        <div className="absolute bottom-0 h-[20%] w-full bg-gradient-to-r from-secondary-500 via-secondary-600 to-secondary-700"></div>

        <div className="z-10 flex h-[85%] w-[85%] max-w-5xl rounded-3xl bg-white/95 dark:bg-neutral-800/95 backdrop-blur-md shadow-2xl animate-scale-in overflow-hidden">
          <div className="flex flex-1/3 flex-col items-center gap-4 border-r border-gray-200 dark:border-neutral-700 p-8 bg-gradient-to-b from-gray-50 to-white dark:from-neutral-800 dark:to-neutral-800">
            <div className="relative h-36 w-36">
              <Avatar
                src={profileData?.avatarUrl}
                className="h-36 w-36 rounded-full ring-4 ring-primary-500/30 shadow-xl"
              />
              {auth.currentUser.uid === uid && (
                <>
                  <Button
                    onClick={handleAvatarClick}
                    variant="primary"
                    className="absolute bottom-0 right-0 !rounded-full !p-3 shadow-lg"
                  >
                    <FaEdit className="h-4 w-4" />
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
            <span className="font-semibold text-primary-600 dark:text-primary-400 text-center break-all px-4">
              {profileData?.email}
            </span>
          </div>

          <div className="flex-2/3 p-8">
            <div className="mx-auto mt-8 max-w-md space-y-6">
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
                    />
                  </div>
                  <div className="mt-6 flex gap-3">
                    <Button
                      onClick={handleUpdate}
                      variant="primary"
                      className="flex-1"
                    >
                      Save Changes
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        setEditedData(profileData);
                      }}
                      variant="outline"
                      className="flex-1"
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
                      variant="primary"
                      className="mt-6 gap-2"
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

      <Button
        variant="ghost"
        className="absolute top-6 left-6 !rounded-full !p-3 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md shadow-lg hover:shadow-xl"
        onClick={() => navigate('/')}
      >
        <IoMdArrowBack className="h-6 w-6 text-gray-900 dark:text-white" />
      </Button>
    </div>
  );
};

export default Profile;
