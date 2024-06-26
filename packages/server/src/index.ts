import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { startCountdown } from './countdownTimer';
import { register, login } from './authController';
import jwt from 'jsonwebtoken';
import sequelize from './db';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN as string,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN as string,
  })
);
app.use(express.json());

app.post('/api/register', register);
app.post('/api/login', login);

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (socket as any).user = decoded;
    next();
  } catch (err) {
    next(new Error('Authentication error.'));
  }
});

let countdownControl: ReturnType<typeof startCountdown> | null = null;

io.on('connection', (socket) => {
  console.log('User connected.');

  socket.on('start-countdown', (duration: number) => {
    console.log(`Starting countdown for ${duration} seconds.`);
    countdownControl = startCountdown(io, duration);
  });

  socket.on('stop-countdown', () => {
    console.log('Stopping countdown.');
    if (countdownControl) {
      countdownControl.stop();
      countdownControl = null;
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected.');
  });
});

const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
