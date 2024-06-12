import { Server, Socket } from 'socket.io';

interface CountdownControl {
  stop: () => void;
}

export function startCountdown(io: Server, duration: number): CountdownControl {
  let remainingTime = duration;
  let intervalId: NodeJS.Timeout;

  const stop = () => {
    clearInterval(intervalId);
    io.emit('countdown-reset');
  };

  intervalId = setInterval(() => {
    if (remainingTime <= 0) {
      clearInterval(intervalId);
      io.emit('countdown-finished');
    } else {
      remainingTime--;
      io.emit('countdown-update', remainingTime);
    }
  }, 1000);

  return { stop };
}
