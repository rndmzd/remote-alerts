import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { startCountdown } from "./countdownTimer";
import { register, login } from "./authController"; // Ensure you have this import
import jwt from "jsonwebtoken";
import sequelize from './db';
import User from './models/user';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

app.use(
  cors({
    origin: "http://localhost:4000",
  })
);
app.use(express.json());

app.post("/api/register", register);
app.post("/api/login", login);

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  try {
    const decoded = jwt.verify(token, "your_jwt_secret");
    (socket as any).user = decoded;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});

let countdownControl: ReturnType<typeof startCountdown> | null = null;

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("start-countdown", (duration: number) => {
    console.log(`Starting countdown for ${duration} seconds`);
    startCountdown(io, duration);
  });

  socket.on("stop-countdown", () => {
    console.log("Stopping countdown");
    if (countdownControl) {
      countdownControl.stop();
      countdownControl = null;
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

sequelize.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});