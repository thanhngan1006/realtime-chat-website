import React, { useEffect, useRef, useState } from 'react';
import { AiFillLike } from 'react-icons/ai';
import { IoIosCamera, IoMdAddCircle } from 'react-icons/io';
import { FaMicrophone, FaRegImage } from 'react-icons/fa';
import { MdEmojiEmotions, MdOndemandVideo } from 'react-icons/md';
import { Input } from '../components/common';
import { HeadingMessageBar } from '../components/layout';
import { MessageBox } from '../components/chat';
import { useDispatch, useSelector } from 'react-redux';
import {
  setEmojiPickerPosition,
  setIsFocused,
  setIsOpenMicro,
  setMessageContent,
  setMessages,
  setReceiverData,
  setShowEmojiPicker,
  setTypingStatus,
} from '../../features/chat/chatReducer';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { conversationService, fileService, userService } from '../service';
import { messageService } from '../service/firebase/message.service';
import TypingDots from '../components/chat/TypingDots';
import EmojiPickerPortal from '../components/common/EmojiPickerPortal';
import ReactRecorder from '../components/chat/Recorder';

const Home = () => {
  const { selectedUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const conversationId = selectedUser.conversationId;
  const {
    messages,
    messageContent,
    emojiPickerPosition,
    isFocused,
    typingStatus,
    showEmojiPicker,
    isOpenMicro,
  } = useSelector((state) => state.chat);
  const uid = auth.currentUser.uid;
  const inputRef = useRef(null);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [avatarUrls, setAvatarUrls] = useState({});
  const [typingUsers, setTypingUsers] = useState([]);
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  // const propsRef = useRef();

  const handleOpenMicro = () => {
    dispatch(setIsOpenMicro(!isOpenMicro));

    console.log('isOpenMicro', isOpenMicro);
  };

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

      await messageService.createNewMessage({
        senderId: uid,
        receiverIds: receiverIds,
        conversationId: conversationId,
        messageContent: messageContent || '',
        typeContent: 0,
      });

      inputRef.current.value = '';
      dispatch(setMessageContent(''));
      inputRef.current.focus();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSendFile = () => {
    fileInputRef.current.click();
  };

  const handleUploadFile = async (e) => {
    try {
      const receiverIds = Array.isArray(selectedUser.id)
        ? selectedUser.id
        : [selectedUser.id || ''];

      const { base64, fileName } = await fileService.handleFileRead(e);

      await messageService.createNewMessage({
        senderId: uid,
        receiverIds: receiverIds,
        conversationId: conversationId,
        messageContent: messageContent || '',
        fileName: fileName,
        file: base64,
        typeContent: 2,
      });

      fileInputRef.current.value = '';
      inputRef.current.focus();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSendImage = () => {
    imageInputRef.current.click();
  };

  const handleUploadImage = async (e) => {
    try {
      const receiverIds = Array.isArray(selectedUser.id)
        ? selectedUser.id
        : [selectedUser.id || ''];

      const { base64 } = await fileService.handleFileRead(e);

      await messageService.createNewMessage({
        senderId: uid,
        receiverIds: receiverIds,
        conversationId: conversationId,
        messageContent: messageContent || '',
        imageUrl: base64,
        typeContent: 1,
      });

      imageInputRef.current.value = '';
      inputRef.current.focus();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: 'dbwmvrxbd',
        uploadPreset: 'smycavha',
        resourceType: 'video',
        clientAllowedFormats: ['mp4', 'mov'],
      },
      async (error, result) => {
        if (!error && result && result.event === 'success') {
          const videoUrl = result.info.secure_url;

          const receiverIds = Array.isArray(selectedUser.id)
            ? selectedUser.id
            : [selectedUser.id || ''];

          await messageService.createNewMessage({
            senderId: uid,
            receiverIds: receiverIds,
            conversationId: conversationId,
            messageContent: messageContent || '',
            video: videoUrl,
            typeContent: 3,
          });
        }
      },
    );
  }, [conversationId, messageContent, selectedUser.id, uid]);

  const handleOpenWidget = () => {
    if (widgetRef.current) {
      widgetRef.current.open(); // Mở widget khi click
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
        console.log('Is array', Array.isArray(messagesData));
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

  // =======Chức năng hiển thị ai đang nhập tin nhắn =========
  useEffect(() => {
    if (!conversationId) return;

    const updateTypingStatus = async (isTyping) => {
      const conversationRef = doc(db, 'conversations', conversationId);
      await updateDoc(conversationRef, {
        [`typingStatuses.${uid}`]: isTyping,
      });
    };

    const debounce = (func, delay) => {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
      };
    };

    const handleTyping = debounce(async () => {
      if (messageContent.trim() !== '' && isFocused) {
        await updateTypingStatus(true);
      }
    }, 300);

    const handleStopTyping = async () => {
      if (messageContent.trim() === '' || !isFocused) {
        await updateTypingStatus(false);
      }
    };

    const inputElement = inputRef.current;

    if (inputElement) {
      inputElement.addEventListener('input', handleTyping);
      inputElement.addEventListener('blur', handleStopTyping);

      return () => {
        inputElement.removeEventListener('input', handleTyping);
        inputElement.removeEventListener('blur', handleStopTyping);
      };
    }
  }, [conversationId, messageContent, isFocused, uid]);

  useEffect(() => {
    if (!conversationId) return;

    const conversationRef = doc(db, 'conversations', conversationId);
    const unsubscribe = onSnapshot(
      conversationRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const typingStatuses = data.typingStatuses || {};
          const typingUsers = Object.entries(typingStatuses)
            .filter(
              ([uid, isTyping]) => isTyping && uid !== auth.currentUser.uid,
            )
            .map(([uid]) => uid);

          setTypingUsers(typingUsers);

          if (typingUsers.length > 0) {
            const fetchUserAvatars = async () => {
              const avatars = await Promise.all(
                typingUsers.map(async (userId) => {
                  const userDoc = await userService.getUser(userId);
                  return userDoc.success ? userDoc.data.avatarUrl : '';
                }),
              );

              setAvatarUrls((prev) => ({
                ...prev,
                ...Object.fromEntries(
                  typingUsers.map((userId, index) => [userId, avatars[index]]),
                ),
              }));
              dispatch(setTypingStatus(true));
            };
            fetchUserAvatars();
          } else {
            dispatch(setTypingStatus(false));
          }
        }
      },
      (error) => {
        console.error('Error listening to typing status: ', error);
      },
    );

    return () => unsubscribe();
  }, [conversationId, dispatch, uid]);

  return (
    <div className="flex h-screen flex-col">
      <HeadingMessageBar name={selectedUser.name} activeTime="1h ago" />
      <div
        id="chat-screen"
        className="mb-10 h-full flex-1 overflow-y-auto bg-gray-200 p-4 dark:bg-zinc-600 dark:text-white"
      >
        {selectedUser && conversationId && messages.length > 0 && (
          <MessageBox messages={messages} avatarUrls={avatarUrls} />
        )}

        {/* <ReactRecorder /> */}

        <EmojiPickerPortal
          show={showEmojiPicker}
          onEmojiClick={(e) => {
            dispatch(setMessageContent(messageContent + e.emoji));
            dispatch(setShowEmojiPicker(false));
          }}
          position={emojiPickerPosition}
        />

        {typingStatus && (
          <div className="flex items-center gap-2 p-2 dark:bg-zinc-700">
            {typingUsers.map((userId) => (
              <div key={userId} className="flex items-center">
                <img
                  src={avatarUrls[userId] || '/default-avatar.png'}
                  alt="Avatar"
                  className="mr-2 h-8 w-8 rounded-full"
                />
                <TypingDots />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 grid w-[75%] grid-cols-[auto_1fr_auto] items-center gap-2 border-t border-gray-700 bg-white p-2 shadow-2xl dark:bg-zinc-800">
        <div className="flex items-center gap-2 text-blue-400">
          <div>
            <IoMdAddCircle onClick={handleSendFile} className="h-8 w-8" />
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleUploadFile}
              className="hidden"
            />
          </div>

          <div>
            <FaRegImage onClick={handleSendImage} className="h-8 w-8" />
            <Input
              type="file"
              accept="image/*"
              ref={imageInputRef}
              onChange={handleUploadImage}
              className="hidden"
            />
          </div>
          <IoIosCamera className="h-8 w-8" />

          <FaMicrophone className="h-8 w-8" onClick={handleOpenMicro} />
          <div>
            <MdOndemandVideo onClick={handleOpenWidget} className="h-8 w-8" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="">
          {isOpenMicro ? (
            <ReactRecorder />
          ) : (
            <div className="relative flex items-center">
              <Input
                type="text"
                placeholder="Aa"
                className="w-full rounded-full border bg-gray-100 px-10 py-2 text-gray-600 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-zinc-700 dark:text-white"
                value={messageContent}
                onChange={(e) => {
                  dispatch(setMessageContent(e.target.value));
                }}
                onFocus={() => dispatch(setIsFocused(true))}
                onBlur={() => dispatch(setIsFocused(false))}
                ref={inputRef}
              />

              <MdEmojiEmotions
                onClick={(e) => {
                  const rect = e.target.getBoundingClientRect();
                  dispatch(
                    setEmojiPickerPosition({
                      top: rect.top - 320,
                      left: rect.left,
                    }),
                  );
                  dispatch(setShowEmojiPicker(!showEmojiPicker));
                  console.log('nhan emoji');
                }}
                className="absolute bottom-2.5 left-3 h-5 w-5 text-gray-500"
              />
            </div>
          )}
        </form>

        <div className="text-blue-400">
          <AiFillLike className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
};

export default Home;
