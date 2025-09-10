import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ReactMic } from 'react-mic';
import AudioTimer from './AudioTimer';
import { useDispatch, useSelector } from 'react-redux';
import { messageService } from '../../service';
import { auth } from '../../firebase';
import { IoPlay } from 'react-icons/io5';
import { FaStopCircle } from 'react-icons/fa';
import { setIsOpenMicro } from '../../../features/chat/chatReducer';
import { TiDelete } from 'react-icons/ti';

const ReactRecorder = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [voice, setVoice] = useState(false);
  const [recordBlobLink, setRecordBlobLink] = useState(null);

  const { messageContent } = useSelector((state) => state.chat);
  const { selectedUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // === BƯỚC 1: TẠO REF ĐỂ LƯU GIÁ TRỊ ===
  // Ref này sẽ hoạt động như một "chiếc hộp" chứa dữ liệu mới nhất
  const propsRef = useRef();

  // === BƯỚC 2: CẬP NHẬT REF KHI PROPS/STATE THAY ĐỔI ===
  useEffect(() => {
    propsRef.current = {
      selectedUser,
      messageContent,
      uid: auth.currentUser?.uid,
    };
  }, [selectedUser, messageContent]);

  // propsRef.current = {
  // selectedUser:   { conversationId: 'abc-123', id: 'xyz-456', name: 'John Doe' },
  // messageContent: "Đây là nội dung tin nhắn",
  // uid:            "fYbJybbYCPdYb9tijlqsW6PNgp22"
  // }

  const onStop = useCallback(
    async (recordedBlob) => {
      // === BƯỚC 3: ĐỌC DỮ LIỆU TỪ REF ===
      // Luôn lấy dữ liệu MỚI NHẤT từ .current của ref
      const {
        selectedUser: currentUser,
        uid,
        messageContent: currentMessageContent,
      } = propsRef.current;

      if (!currentUser || !uid) {
        console.error(
          'Dữ liệu người dùng không hợp lệ, không thể gửi tin nhắn.',
        );
        setIsRunning(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', recordedBlob.blob);
      formData.append('upload_preset', 'smycavha');
      formData.append('resource_type', 'raw');

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dbwmvrxbd/raw/upload`,
          { method: 'POST', body: formData },
        );
        const data = await response.json();
        const audioUrl = data.secure_url;

        const conversationId = currentUser.conversationId;
        const receiverIds = Array.isArray(currentUser.id)
          ? currentUser.id
          : [currentUser.id];

        if (!conversationId) {
          console.error('LỖI: conversationId là undefined!');
          return;
        }

        await messageService.createNewMessage({
          senderId: uid,
          receiverIds,
          conversationId,
          messageContent: currentMessageContent || '',
          audio: audioUrl,
          typeContent: 4,
        });

        dispatch(setRecordBlobLink(audioUrl));
      } catch (error) {
        console.error('Upload failed:', error);
      } finally {
        setIsRunning(false);
      }
    },
    [dispatch], // === BƯỚC 4: MẢNG PHỤ THUỘC RỖNG ===
    // Hàm onStop bây giờ chỉ cần được tạo một lần duy nhất.
  );

  const startHandle = () => {
    setElapsedTime(0);
    setIsRunning(true);
    setVoice(true);
  };

  const stopHandle = () => {
    if (elapsedTime < 100) {
      alert('Please record for at least 1 second.');
      return;
    }
    setIsRunning(false);
    setVoice(false);
  };

  const clearHandle = () => {
    setIsRunning(false);
    setVoice(false);
    setRecordBlobLink(null);
    setElapsedTime(0);
    dispatch(setIsOpenMicro(false));
  };
  // absolute bottom-2.5 left-3 h-5 w-5 text-gray-500
  return (
    <div>
      <div className="mx-auto flex items-center gap-3">
        <div className="">
          {isRunning || (!isRunning && recordBlobLink) ? (
            <TiDelete
              onClick={clearHandle}
              className="h-8 w-8 cursor-pointer text-[#111]"
            />
          ) : (
            ''
          )}
        </div>

        <AudioTimer
          isRunning={isRunning}
          elapsedTime={elapsedTime}
          setElapsedTime={setElapsedTime}
        />
        <ReactMic
          record={voice}
          className="sound-wave h-[46px] w-full rounded-2xl"
          onStop={onStop}
          strokeColor="#000000"
        />

        <div className="mt-2">
          {!voice ? (
            <button
              onClick={startHandle}
              className={`rounded-md bg-[#fff] px-3 py-1 text-[16px] font-semibold text-[#111] ${!isRunning && recordBlobLink ? 'hidden' : ''}`}
            >
              <IoPlay />
            </button>
          ) : (
            <button
              onClick={stopHandle}
              className="rounded-md bg-[#fff] px-3 py-1 text-[16px] font-semibold text-[#111]"
            >
              <FaStopCircle />
            </button>
          )}
        </div>

        {/* <div className="">
          {recordBlobLink ? (
            <audio controls className="">
              <source src={recordBlobLink} type="audio/mpeg" />
              <track kind="captions" />
              Your browser does not support the audio element.
            </audio>
          ) : (
            ''
          )}
        </div> */}
      </div>
    </div>
  );
};

export default ReactRecorder;
