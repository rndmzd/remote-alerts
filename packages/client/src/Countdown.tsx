import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const Countdown: React.FC = () => {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    socket.on('countdown-update', (time: number) => {
      setTimeRemaining(time);
    });

    socket.on('countdown-finished', () => {
      setTimeRemaining(null);
      alert('Countdown finished!');
    });

    socket.on('countdown-reset', () => {
      setTimeRemaining(null);
    });

    return () => {
      socket.off('countdown-update');
      socket.off('countdown-finished');
      socket.off('countdown-reset');
    };
  }, []);

  const startCountdown = () => {
    const duration = 10; // Example duration in seconds
    socket.emit('start-countdown', duration);
  };

  const stopCountdown = () => {
    socket.emit('stop-countdown');
  };

  return (
    <div className="Countdown">
      {timeRemaining !== null ? (
        <>
          <div>Time Remaining: {timeRemaining} seconds</div>
          <button onClick={stopCountdown}>Stop Countdown</button>
        </>
      ) : (
        <button onClick={startCountdown}>Start Countdown</button>
      )}
    </div>
  );
};

export default Countdown;
