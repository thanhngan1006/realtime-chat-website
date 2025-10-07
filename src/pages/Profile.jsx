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

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-rose-300">
        {error}
      </div>
    );

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-brand-500/15 absolute top-[-20%] left-[-20%] h-[28rem] w-[28rem] rounded-full blur-[220px]" />
        <div className="bg-brand-300/18 absolute right-[-15%] bottom-[-20%] h-[30rem] w-[30rem] rounded-full blur-[240px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-16">
        <button
          onClick={() => navigate('/')}
          className="focus-visible:ring-brand-200 flex w-fit items-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-white/20 focus-visible:ring-2 focus-visible:outline-none"
        >
          <IoMdArrowBack className="h-5 w-5" />
          Back to chat
        </button>

        <div className="grid gap-8 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="rounded-3xl border border-white/20 bg-white/80 p-8 text-center shadow-[0_40px_120px_-60px_rgba(6,182,212,0.35)] backdrop-blur-2xl dark:border-zinc-700/60 dark:bg-zinc-900/80">
              <div className="relative mx-auto h-36 w-36">
                <Avatar
                  src={profileData?.avatarUrl}
                  className="h-36 w-36 rounded-3xl shadow-xl ring-4 ring-white/70 dark:ring-zinc-800"
                />
                {auth.currentUser.uid === uid && (
                  <>
                    <button
                      onClick={handleAvatarClick}
                      type="button"
                      className="from-brand-500 to-brand-600 focus-visible:ring-brand-200 absolute right-2 bottom-2 rounded-full bg-gradient-to-br p-3 text-white shadow-lg transition hover:shadow-xl focus-visible:ring-2 focus-visible:outline-none"
                    >
                      <FaEdit />
                    </button>
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
              <div className="mt-6 space-y-2">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  {profileData?.name}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {profileData?.email}
                </p>
              </div>
            </div>
          </aside>

          <section className="lg:col-span-8">
            <div className="rounded-3xl border border-white/20 bg-white/85 p-8 shadow-[0_40px_140px_-70px_rgba(6,182,212,0.32)] backdrop-blur-2xl dark:border-zinc-700/60 dark:bg-zinc-900/80">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Profile details
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Manage what your teammates see when chatting with you.
                  </p>
                </div>
                {auth.currentUser.uid === uid && !isEditing && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="!rounded-xl"
                    onClick={() => setIsEditing(true)}
                  >
                    <FaEdit />
                    <span className="ml-2">Edit profile</span>
                  </Button>
                )}
              </div>

              <div className="mt-6 space-y-4">
                {isEditing ? (
                  <>
                    <Input
                      label="Display name"
                      type="text"
                      value={editedData.name || ''}
                      onChange={(e) =>
                        handleInputChange('name', e.target.value)
                      }
                      variant="filled"
                      inputClassName="rounded-xl bg-white/90 px-4 py-3 text-slate-700 placeholder:text-slate-400 shadow-inner dark:bg-zinc-800/90 dark:text-white"
                    />

                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={handleUpdate}
                        variant="primary"
                        className="!rounded-xl"
                      >
                        Save changes
                      </Button>
                      <Button
                        onClick={() => {
                          setIsEditing(false);
                          setEditedData(profileData);
                        }}
                        variant="secondary"
                        className="!rounded-xl"
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <ProfileRow label="Name" value={profileData?.name} />
                    <ProfileRow label="Email" value={profileData?.email} />
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
