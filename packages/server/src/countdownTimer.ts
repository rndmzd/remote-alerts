// src/countdownTimer.ts
import { Server } from 'socket.io';

export function startCountdown(io: Server, duration: number) {
  let remainingTime = duration;

  const intervalId = setInterval(() => {
    if (remainingTime <= 0) {
      clearInterval(intervalId);
      io.emit('countdown-finished');
    } else {
      remainingTime--;
      io.emit('countdown-update', remainingTime);
    }
  }, 1000);
}
