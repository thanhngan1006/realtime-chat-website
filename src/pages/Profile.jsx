import React, { useEffect, useState } from 'react';
import { Avatar, Button, Input } from '../components/common';
import { FaEdit } from 'react-icons/fa';
import { db } from '../firebase';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const Profile = () => {
  const { uid } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setProfileData(userDoc.data());
        } else {
          setError('User not found');
        }
      } catch (err) {
        setError('Can not fetch profile data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (uid) {
      fetchProfileData();
    }
  }, [uid]);

  const handleUpdateName = async () => {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, { name: editedName });
      setProfileData((prev) => ({ ...prev, name: editedName }));
      setIsEditing(false);
    } catch (err) {
      console.error('Can not update name:', err);
    }
  };

  const handleUpdateAvatar = async () => {};

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 p-4">
      <div className="flex w-full max-w-md flex-col items-center space-y-6 rounded-2xl bg-white p-8 shadow-xl">
        <div className="relative">
          <Avatar
            src={profileData?.avatarUrl || ''}
            className="h-24 w-24 rounded-full border-4 border-white shadow-md"
          />
          <button className="absolute right-0 bottom-0 rounded-full bg-blue-500 p-2 text-white transition-colors hover:bg-blue-600">
            <FaEdit />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {isEditing ? (
            <>
              <Input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="border-b border-gray-400 text-2xl focus:border-blue-500 focus:outline-none"
              />
              <Button
                onClick={handleUpdateName}
                className="rounded bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
              >
                Save
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                className="rounded px-2 py-1 text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-gray-800">
                {profileData?.name}
              </h2>
              <Button
                className="flex items-center space-x-1 font-medium text-blue-500 hover:text-blue-600"
                onClick={() => {
                  setEditedName(profileData?.name || '');
                  setIsEditing(true);
                }}
              >
                <FaEdit />
                <span>Edit</span>
              </Button>
            </>
          )}
        </div>

        <div className="text-lg text-gray-600">
          <span>{profileData?.email}</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
