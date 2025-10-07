import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FaRobot } from 'react-icons/fa';
import { Button } from '../components/common';
import MessageInput from '../components/chat/MessageInput';
import { HeadingMessageBar } from '../components/layout';
import { MessageBox } from '../components/chat';
import { useDispatch, useSelector } from 'react-redux';
import { convertFirestoreDocument } from '../service/utils/format-date';
import {
  clearRecordingState,
  setConversations,
  setIsOpenMicro,
  setMessageContent,
  setMessages,
  setReceiverData,
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
import { AI_ASSISTANT_ID, AI_ASSISTANT_PROFILE } from '../constants/ai';
import { setSelectedUser } from '../../features/user/userReducer';
import { aiService } from '../service/firebase/ai.service';

const Home = () => {
  const { selectedUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const conversationId = selectedUser.conversationId;
  const {
    messages,
    messageContent,
    typingStatus,
    isOpenMicro,
    recorderStatus,
    mediaBlobUrl,
  } = useSelector((state) => state.chat);
  const uid = auth.currentUser.uid;
  const [avatarUrls, setAvatarUrls] = useState({});
  const [typingUsers, setTypingUsers] = useState([]);
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  const propsRef = useRef();
  const messageContentRef = useRef('');

  useEffect(() => {
    propsRef.current = {
      selectedUser,
      uid: auth.currentUser?.uid,
    };
  }, [selectedUser]);

  useEffect(() => {
    messageContentRef.current = messageContent;
  }, [messageContent]);

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

        dispatch(setMessageContent(''));
        stopTyping();
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
    } catch (error) {
      console.error('Error sending message:', error);
    }
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
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    if (!window?.cloudinary) return;

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
            messageContent: messageContentRef.current || '',
            video: videoUrl,
            typeContent: 3,
          });
        }
      },
    );

    return () => {
      widgetRef.current = null;
    };
  }, [conversationId, selectedUser.id, uid]);

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
              // Convert Firestore Timestamps to JavaScript dates for Redux compatibility
              const convertedUserData = convertFirestoreDocument(userDoc.data);
              dispatch(setReceiverData(convertedUserData));
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
        const messagesData = snapshot.docs.map((doc) => {
          const messageData = {
            id: doc.id,
            ...doc.data(),
          };
          // Convert Firestore Timestamps to JavaScript dates for Redux compatibility
          return convertFirestoreDocument(messageData);
        });

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
  const typingTimeoutRef = useRef(null);

  const updateTypingStatus = useCallback(
    async (isTyping) => {
      if (!conversationId) return;
      const conversationRef = doc(db, 'conversations', conversationId);
      await updateDoc(conversationRef, {
        [`typingStatuses.${uid}`]: isTyping,
      });
    },
    [conversationId, uid],
  );

  const startTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    updateTypingStatus(true);
    typingTimeoutRef.current = setTimeout(
      () => updateTypingStatus(false),
      3000,
    );
  }, [updateTypingStatus]);

  const stopTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    updateTypingStatus(false);
  }, [updateTypingStatus]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      stopTyping();
    };
  }, [stopTyping]);

  // handleInputChange no longer needed in Home as it's handled locally in MessageInput

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
                  return userDoc.success
                    ? convertFirestoreDocument(userDoc.data).avatarUrl
                    : '';
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

  const hasActiveConversation =
    selectedUser && conversationId && messages.length > 0;

  return (
    <section
      className="relative flex h-full min-h-0 flex-1 flex-col gap-6 p-6 text-slate-800 dark:text-slate-100"
      role="main"
      aria-label="Chat interface"
      tabIndex="-1"
    >
      <HeadingMessageBar />

      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-md transition-all duration-200 dark:border-zinc-700 dark:bg-zinc-900">
        <div
          id="chat-screen"
          className="relative flex-1 space-y-6 overflow-y-auto pr-2"
          role="log"
          aria-live="polite"
          aria-label="Chat messages"
          aria-relevant="additions"
        >
          {hasActiveConversation ? (
            <MessageBox messages={messages} avatarUrls={avatarUrls} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="bg-brand-500 flex h-20 w-20 items-center justify-center rounded-full text-white shadow-md">
                <FaRobot className="h-8 w-8" />
              </div>
              <div className="max-w-md space-y-2">
                <h3 className="text-2xl font-semibold">
                  Select a conversation
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Choose a person or group from the left to start messaging, or
                  spark a new idea with our AI copilot.
                </p>
              </div>
            </div>
          )}

          {typingStatus && (
            <div
              className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-600 shadow-sm dark:border-zinc-700 dark:bg-zinc-800/70"
              aria-live="polite"
              aria-label="Users typing"
            >
              {typingUsers.map((userId) => (
                <div key={userId} className="flex items-center" role="status">
                  <img
                    src={avatarUrls[userId] || '/default-avatar.png'}
                    alt={`Avatar of user typing`}
                    className="mr-2 h-8 w-8 rounded-full border border-slate-200 shadow-sm dark:border-zinc-700"
                    aria-hidden="true"
                  />
                  <TypingDots
                    aria-label={`${avatarUrls[userId] ? 'User is typing' : 'Someone is typing'}`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative mt-6">
          <MessageInput
            conversationId={conversationId}
            selectedUser={selectedUser}
            messages={messages}
            isOpenMicro={isOpenMicro}
            recorderStatus={recorderStatus}
            mediaBlobUrl={mediaBlobUrl}
            onSubmit={handleSubmit}
            onUploadFile={handleUploadFile}
            onUploadImage={handleUploadImage}
            onOpenMicro={handleOpenMicro}
            onSendLike={handleSendLikeButton}
            onOpenWidget={handleOpenWidget}
            onStartTyping={startTyping}
            onStopTyping={stopTyping}
          />
        </div>
      </div>

      <Button
        variant="ghost"
        size="lg"
        className="from-brand-300 via-brand-400 to-brand-500 focus-visible:ring-brand-200 fixed right-16 bottom-28 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br text-slate-900 shadow-[0_24px_80px_-55px_rgba(6,182,212,0.4)] transition-transform duration-200 hover:-translate-y-1 focus-visible:ring-2 focus-visible:outline-none sm:bottom-24 lg:bottom-28 dark:text-white"
        onClick={handleCreateAiChat}
        aria-label="Start chat with AI assistant"
      >
        <FaRobot className="h-6 w-6" />
      </Button>
    </section>
  );
};

export default Home;
