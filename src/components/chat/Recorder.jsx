import React, { useEffect, useState } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { useDispatch } from 'react-redux';
import {
  setIsOpenMicro,
  setMediaBlobUrl,
  setRecorderStatus,
} from '../../../features/chat/chatReducer';
import { IoPlay } from 'react-icons/io5';
import { FaStopCircle } from 'react-icons/fa';
import { TiDelete } from 'react-icons/ti';
import AudioVisualizer from './AudioVisualizer';

const ReactRecorder = () => {
  const dispatch = useDispatch();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [mediaStream, setMediaStream] = useState(null);

  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true, customMediaStream: mediaStream });

  useEffect(() => {
    dispatch(setRecorderStatus(status));
  }, [status, dispatch]);

  useEffect(() => {
    dispatch(setMediaBlobUrl(mediaBlobUrl));
  }, [mediaBlobUrl, dispatch]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60).toString();
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    let interval;
    if (status === 'recording') {
      interval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const startHandle = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMediaStream(stream);
      startRecording();
    } catch (err) {
      console.error('Lỗi truy cập microphone:', err);
    }
  };
  const stopHandle = () => {
    stopRecording();
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
  };

  const clearHandle = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
    dispatch(setIsOpenMicro(false));
  };

  return (
    <div className="flex h-10 w-full items-center rounded-full bg-gray-200 px-3 dark:bg-zinc-700">
      <button
        onClick={clearHandle}
        className="text-gray-600 dark:text-gray-300"
      >
        <TiDelete size={28} />
      </button>

      <>
        <button onClick={status === 'recording' ? stopHandle : startHandle}>
          {status === 'recording' ? (
            <FaStopCircle size={24} className="text-red-500" />
          ) : (
            <IoPlay size={24} className="text-blue-500" />
          )}
        </button>
        <div className="flex-1">
          <AudioVisualizer stream={mediaStream} />
        </div>
        <div className="rounded-2xl bg-amber-50 px-2 text-center font-semibold text-gray-700 dark:text-gray-200">
          {formatTime(elapsedTime)}
        </div>
      </>
    </div>
  );
};

export default ReactRecorder;
