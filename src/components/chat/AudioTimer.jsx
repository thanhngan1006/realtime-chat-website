import React, { useEffect } from 'react';

const AudioTimer = ({ isRunning, elapsedTime, setElapsedTime }) => {
  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => setElapsedTime(elapsedTime + 1), 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, elapsedTime, setElapsedTime]);

  const hours = Math.floor(elapsedTime / 360000);
  const minutes = Math.floor((elapsedTime % 360000) / 6000);
  const seconds = Math.floor((elapsedTime % 6000) / 100);
  const milliseconds = elapsedTime % 100;

  return (
    <div className="font-semibold">
      <div className="time font-mono">
        {hours.toString().padStart(2, '0')}:
        {minutes.toString().padStart(2, '0')}:
        {seconds.toString().padStart(2, '0')}:
        {milliseconds.toString().padStart(2, '0')}
      </div>
    </div>
  );
};

export default AudioTimer;
