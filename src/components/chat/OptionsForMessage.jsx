import React, { useEffect, useState } from 'react';
import { SlOptionsVertical } from 'react-icons/sl';
import { FaShare } from 'react-icons/fa';
import { MdEmojiEmotions } from 'react-icons/md';
import { Button } from '../common';
import { useDispatch, useSelector } from 'react-redux';
import {
  setEditedMessage,
  setMessages,
  setSelectedMessageId,
  setSelectedMessageToReactEmoji,
  setUpdatedMessageText,
} from '../../../features/chat/chatReducer';
import { messageService } from '../../service';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

const OptionsForMessage = ({ msg, isYourMessage }) => {
  const { selectedMessageId, editedMessage, selectedMessageToReactEmoji } =
    useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const [optionsOpen, setOptionsOpen] = useState({});
  const uid = auth.currentUser.uid;
  const [senderId, setSenderId] = useState('');

  const handleOptionsClick = (id) => {
    setOptionsOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

    const newSelectedMessageId = selectedMessageId === id ? null : id;
    dispatch(setSelectedMessageId(newSelectedMessageId));
  };

  const handleDeleteMessage = async (id) => {
    try {
      const updatedMessage = await messageService.updateFieldWhenDeleteMessage(
        id,
        uid,
      );

      dispatch(
        setMessages((prevMessages) => {
          const messagesArray = Array.isArray(prevMessages) ? prevMessages : [];
          const newMessages = messagesArray.map((msgItem) =>
            msgItem.messageId === id
              ? { ...msgItem, deletedBy: updatedMessage.deletedBy }
              : msgItem,
          );
          return newMessages;
        }),
      );

      setOptionsOpen((prev) => ({ ...prev, [id]: false }));
      dispatch(setSelectedMessageId(null));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleRecallMessage = async (id) => {
    try {
      const updatedMessage = await messageService.recallMessage(id);

      dispatch(
        setMessages((prevMessages) => {
          const messagesArray = Array.isArray(prevMessages) ? prevMessages : [];
          const newMessages = messagesArray.map((msgItem) =>
            msgItem.messageId === id
              ? {
                  ...msgItem,
                  messageText: updatedMessage.messageText,
                  imageUrl: '',
                  fileName: '',
                  file: '',
                  sentTime: msgItem.sentTime?.toDate
                    ? msgItem.sentTime.toDate().toISOString()
                    : msgItem.sentTime,
                  updatedAt: msgItem.updatedAt?.toDate
                    ? msgItem.updatedAt.toDate().toISOString()
                    : msgItem.updatedAt,
                }
              : msgItem,
          );
          return newMessages;
        }),
      );

      setOptionsOpen((prev) => ({ ...prev, [id]: false }));
      dispatch(setSelectedMessageId(null));
    } catch (error) {
      console.error('Error recalling message:', error);
    }
  };

  const handleEditMessage = (id) => {
    if (selectedMessageId === id && editedMessage === id) {
      dispatch(setEditedMessage(''));
      dispatch(setUpdatedMessageText(''));
      dispatch(setSelectedMessageId(null));
      setOptionsOpen((prev) => ({ ...prev, [id]: false }));
    } else {
      dispatch(setSelectedMessageId(id));
      dispatch(setEditedMessage(id));
      dispatch(setUpdatedMessageText(msg.messageText));
      setOptionsOpen((prev) => ({ ...prev, [id]: true }));
    }
  };

  useEffect(() => {
    const fetchSenderInformation = async () => {
      if (!selectedMessageId) {
        setSenderId('');
        return;
      }

      try {
        const messageRef = doc(db, 'messages', selectedMessageId);
        const messageDoc = await getDoc(messageRef);

        if (messageDoc.exists()) {
          const messageData = messageDoc.data();
          const isParticipant =
            messageData.senderId === uid ||
            messageData.receiversIds?.includes(uid);

          if (isParticipant) {
            setSenderId(messageData.senderId);
          } else {
            setSenderId('');
            console.log('You are not authorized to view this message.');
          }
        } else {
          setSenderId('');
          console.log('Message not found.');
        }
      } catch (error) {
        console.error('Error fetching sender information:', error);
        setSenderId('');
      }
    };

    fetchSenderInformation();
  }, [selectedMessageId, uid]);

  const handleReactEmojiForEachMessage = (id) => {
    const updatedEmojiMessage = selectedMessageToReactEmoji === id ? null : id;
    dispatch(setSelectedMessageToReactEmoji(updatedEmojiMessage));
  };

  return (
    <div className="relative flex items-center gap-1">
      {isYourMessage ? (
        <>
          <span>
            {msg?.sentTime
              ? typeof msg.sentTime.toDate === 'function'
                ? msg.sentTime.toDate().toLocaleString()
                : new Date(msg.sentTime).toLocaleString()
              : 'N/A'}
          </span>{' '}
          <Button
            className="cursor-pointer rounded-full p-1"
            onClick={() => handleReactEmojiForEachMessage(msg.messageId)}
          >
            <MdEmojiEmotions className="h-4 w-4" />
          </Button>
          <Button
            className="cursor-pointer rounded-full p-1"
            onClick={() => console.log('share clicked')}
          >
            <FaShare className="h-4 w-4" />
          </Button>
          <Button
            className="cursor-pointer rounded-full p-1"
            onClick={() => handleOptionsClick(msg.messageId)}
          >
            <SlOptionsVertical className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <>
          <Button
            className="cursor-pointer rounded-full p-1"
            onClick={() => handleOptionsClick(msg.messageId)}
          >
            <SlOptionsVertical className="h-4 w-4" />
          </Button>
          <Button
            className="cursor-pointer rounded-full p-1"
            onClick={() => console.log('share clicked')}
          >
            <FaShare className="h-4 w-4" />
          </Button>
          <Button
            className="cursor-pointer rounded-full p-1"
            onClick={() => handleReactEmojiForEachMessage(msg.messageId)}
          >
            <MdEmojiEmotions className="h-4 w-4" />
          </Button>
          <span>
            {msg?.sentTime
              ? typeof msg.sentTime.toDate === 'function'
                ? msg.sentTime.toDate().toLocaleString()
                : new Date(msg.sentTime).toLocaleString()
              : 'N/A'}
          </span>
        </>
      )}

      {optionsOpen[msg.messageId] && selectedMessageId === msg.messageId && (
        <div className="absolute top-5 left-0 z-[1000] mt-2 w-32 rounded border bg-white shadow-lg">
          {senderId === uid ? (
            msg.type == 0 && msg.messageText != 'Tin nhắn đã được thu hồi' ? (
              <button
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
                onClick={() => handleEditMessage(selectedMessageId)}
              >
                Sửa
              </button>
            ) : null
          ) : null}

          <button
            className="w-full px-4 py-2 text-left hover:bg-gray-100"
            onClick={() => handleDeleteMessage(selectedMessageId)}
          >
            Xóa
          </button>

          {senderId === uid ? (
            msg.messageText !== 'Tin nhắn đã được thu hồi' ? (
              <button
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
                onClick={() => handleRecallMessage(selectedMessageId)}
              >
                Thu hồi
              </button>
            ) : null
          ) : null}
        </div>
      )}
    </div>
  );
};

export default OptionsForMessage;
