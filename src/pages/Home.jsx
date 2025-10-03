import React, { useEffect, useRef, useState } from 'react';
import { FaRobot } from 'react-icons/fa';
import { Button } from '../components/common';
import { HeadingMessageBar } from '../components/layout';
import { MessageBox } from '../components/chat';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearRecordingState,
  setConversations,
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
import { AI_ASSISTANT_ID, AI_ASSISTANT_PROFILE } from '../constants/ai';
import { setSelectedUser } from '../../features/user/userReducer';
import { aiService } from '../service/firebase/ai.service';
import ChatInput from '../components/chat/ChatInput';

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
    recorderStatus,
    mediaBlobUrl,
  } = useSelector((state) => state.chat);
  const uid = auth.currentUser.uid;
  const inputRef = useRef(null);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [avatarUrls, setAvatarUrls] = useState({});
  const [typingUsers, setTypingUsers] = useState([]);
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  const propsRef = useRef();

  useEffect(() => {
    propsRef.current = {
      selectedUser,
      uid: auth.currentUser?.uid,
    };
  }, [selectedUser]);

  const hasTextContent = messageContent.trim() !== '';
  const hasAudioContent = recorderStatus === 'stopped' && mediaBlobUrl;

  const handleOpenMicro = () => {
    dispatch(setIsOpenMicro(!isOpenMicro));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentMessageText = messageContent;

    if (hasTextContent) {
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

        dispatch(setMessageContent(''));

        if (selectedUser.id === AI_ASSISTANT_ID) {
          const history = messages.map((msg) => ({
            role: msg.senderId === uid ? 'user' : 'model',
            parts: [{ text: msg.messageText }],
          }));
          history.push({ role: 'user', parts: [{ text: currentMessageText }] });

          const aiResponseText = await aiService.generateResponse(history);

          if (aiResponseText) {
            await messageService.createNewMessage({
              senderId: AI_ASSISTANT_ID,
              receiverIds: [uid],
              conversationId: conversationId,
              messageContent: aiResponseText,
              typeContent: 0,
            });
          }
        }

        inputRef.current.value = '';
        dispatch(setMessageContent(''));
        inputRef.current.focus();
      } catch (error) {
        console.error('Error sending message:', error);
      }
    } else if (hasAudioContent) {
      const audioBlob = await fetch(mediaBlobUrl).then((res) => res.blob());

      const { selectedUser: currentUser, uid } = propsRef.current;
      if (!currentUser || !uid) {
        console.error('Dữ liệu không hợp lệ.');
        return;
      }

      const formData = new FormData();
      formData.append('file', audioBlob, 'voice-message.wav');
      formData.append('upload_preset', 'smycavha');
      formData.append('resource_type', 'raw');

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dbwmvrxbd/raw/upload`,
          { method: 'POST', body: formData },
        );
        const data = await response.json();
        const audioUrl = data.secure_url;

        await messageService.createNewMessage({
          senderId: uid,
          receiverIds: Array.isArray(currentUser.id)
            ? currentUser.id
            : [currentUser.id],
          conversationId: currentUser.conversationId,
          audio: audioUrl,
          typeContent: 4,
        });

        dispatch(setIsOpenMicro(false));
        dispatch(clearRecordingState());
      } catch (error) {
        console.error('Upload failed:', error);
      }
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
          if (selectedUser.id == AI_ASSISTANT_ID) {
            dispatch(setReceiverData(AI_ASSISTANT_PROFILE));
          } else {
            const userDoc = await userService.getUser(selectedUser.id);

            if (userDoc.success) {
              dispatch(setReceiverData(userDoc.data));
            } else {
              dispatch(
                setReceiverData({ name: 'Unknown User', avatarUrl: '' }),
              );
            }
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

  const fetchConversations = async () => {
    try {
      const response = await conversationService.fetchConversation(uid);
      dispatch(setConversations(response.data));
    } catch (error) {
      console.error('Error reloading conversations:', error);
    }
  };

  const handleCreateAiChat = async () => {
    try {
      const conversationId = await conversationService.createNewChat(
        uid,
        AI_ASSISTANT_ID,
      );
      dispatch(
        setSelectedUser({
          id: AI_ASSISTANT_ID,
          conversationId: conversationId,
          name: AI_ASSISTANT_PROFILE.name,
          avatarUrl: AI_ASSISTANT_PROFILE.avatarUrl,
        }),
      );
      await fetchConversations();
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const handleSendLikeButton = async () => {
    const receiverIds = Array.isArray(selectedUser.id)
      ? selectedUser.id
      : [selectedUser.id || ''];

    await messageService.createNewMessage({
      senderId: uid,
      receiverIds: receiverIds,
      conversationId: conversationId,
      messageContent: '👍',
      typeContent: 0,
    });
  };

  return (
    <div className="relative flex h-screen flex-col">
      {/* <HeadingMessageBar name={selectedUser.name} activeTime="1h ago" /> */}
      <HeadingMessageBar />
      <div
        id="chat-screen"
        className="chat-screen-background mb-10 h-full flex-1 overflow-y-auto p-4 dark:text-white"
      >
        {selectedUser && conversationId && messages.length > 0 && (
          <MessageBox messages={messages} avatarUrls={avatarUrls} />
        )}

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

      <ChatInput
        handleSubmit={handleSubmit}
        handleSendLikeButton={handleSendLikeButton}
        handleSendFile={handleSendFile}
        handleUploadFile={handleUploadFile}
        handleSendImage={handleSendImage}
        handleUploadImage={handleUploadImage}
        handleOpenMicro={handleOpenMicro}
        handleOpenWidget={handleOpenWidget}
      />

      <Button
        className="absolute right-4 bottom-20 cursor-pointer rounded-full bg-gray-300 p-3 hover:bg-gray-400"
        onClick={handleCreateAiChat}
      >
        <FaRobot className="h-8 w-8" />
      </Button>
    </div>
  );
};

export default Home;
