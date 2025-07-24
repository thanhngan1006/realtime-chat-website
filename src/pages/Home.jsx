import React, { useEffect, useRef, useState } from 'react';
import { AiFillLike } from 'react-icons/ai';
import { IoIosCamera, IoMdAddCircle } from 'react-icons/io';
import { FaMicrophone, FaRegImage } from 'react-icons/fa';
import { MdEmojiEmotions } from 'react-icons/md';
import { Input } from '../components/common';
import { HeadingMessageBar } from '../components/layout';
import { MessageBox } from '../components/chat';
import { useDispatch, useSelector } from 'react-redux';
import {
  setMessageContent,
  setMessages,
  setReceiverData,
} from '../../features/chat/chatReducer';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { conversationService, userService } from '../service';
import { messageService } from '../service/firebase/message.service';

const Home = () => {
  const { selectedUser } = useSelector((state) => state.user);
  const { messageContent } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const conversationId = selectedUser.conversationId;
  const { messages } = useSelector((state) => state.chat);
  const uid = auth.currentUser.uid;
  const inputRef = useRef(null);
  const [avatarUrls, setAvatarUrls] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (messageContent.trim() === '') {
      console.log('Hãy nhập nội dung tin nhắn');
      return;
    }

    try {
      const receiverIds = Array.isArray(selectedUser.id)
        ? selectedUser.id
        : [selectedUser.id || ''];

      await messageService.createNewMessage(
        uid,
        receiverIds,
        conversationId,
        messageContent,
      );

      inputRef.current.value = '';
      dispatch(setMessageContent(''));
      inputRef.current.focus();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    if (!selectedUser?.id) {
      return;
    }

    const fetchReceiverData = async () => {
      try {
        if (Array.isArray(selectedUser.id)) {
          const groupNameData = await conversationService.fetchGroupName(
            selectedUser.id,
          );

          const groupName = groupNameData.data;

          dispatch(
            setReceiverData({
              name: groupName,
              avatarUrl: '',
            }),
          );
        } else {
          // const userDoc = await getDoc(doc(db, 'users', selectedUser.id));
          const userDoc = await userService.getUser(selectedUser.id);

          // console.log('userDoc', userDoc);

          if (userDoc.success) {
            dispatch(setReceiverData(userDoc.data));
          } else {
            dispatch(setReceiverData({ name: 'Unknown User', avatarUrl: '' }));
          }
        }
      } catch (error) {
        console.error('Error fetching receiver data: ', error);
      }
    };
    fetchReceiverData();
  }, [selectedUser.id, dispatch]);

  useEffect(() => {
    if (!conversationId) {
      console.log('No conversationId available');
      dispatch(setMessages([]));
      return;
    }

    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      orderBy('sentTime', 'asc'),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const messagesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        dispatch(setMessages(messagesData));
      },
      (error) => {
        console.error('Error fetching messages: ', error);
      },
    );

    return () => unsubscribe();
  }, [dispatch, conversationId]);

  useEffect(() => {
    const fetchAvatars = async () => {
      const urls = {};
      try {
        for (const message of messages) {
          if (!urls[message.senderId]) {
            const url = await conversationService.fetchAvatarUrl(
              message.senderId,
            );
            urls[message.senderId] = url || '';
          }
        }
        setAvatarUrls(urls);
      } catch (error) {
        console.error('Error fetching avatars:', error);
      }
    };

    if (messages.length > 0) {
      fetchAvatars();
    }
  }, [messages]);

  useEffect(() => {
    const chatScreen = document.getElementById('chat-screen');
    if (chatScreen) {
      chatScreen.scrollTop = chatScreen.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex h-screen flex-col">
      <HeadingMessageBar name={selectedUser.name} activeTime="1h ago" />
      <div
        id="chat-screen"
        className="mb-10 h-full flex-1 overflow-y-auto bg-gray-200 p-4 dark:bg-zinc-600 dark:text-white"
      >
        {selectedUser && conversationId && messages.length > 0 && (
          <MessageBox messages={messages} src={avatarUrls} />
        )}
      </div>

      <div className="fixed bottom-0 grid w-[75%] grid-cols-[auto_1fr_auto] items-center gap-2 border-t border-gray-700 bg-white p-2 shadow-2xl dark:bg-zinc-800">
        <div className="flex items-center gap-2 text-blue-400">
          <IoMdAddCircle className="h-8 w-8" />
          <FaRegImage className="h-8 w-8" />
          <IoIosCamera className="h-8 w-8" />
          <FaMicrophone className="h-8 w-8" />
        </div>

        <form onSubmit={handleSubmit} className="">
          <div className="relative flex items-center">
            <Input
              type="text"
              placeholder="Aa"
              className="w-full rounded-full border bg-gray-100 px-10 py-2 text-gray-600 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-zinc-700 dark:text-white"
              value={messageContent}
              onChange={(e) => {
                dispatch(setMessageContent(e.target.value));
              }}
              ref={inputRef}
            />
            <MdEmojiEmotions
              onClick={() => console.log('ok')}
              className="absolute bottom-2.5 left-3 h-5 w-5 text-gray-500"
            />
          </div>
        </form>

        <div className="text-blue-400">
          <AiFillLike className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
};

export default Home;
