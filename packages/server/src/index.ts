import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { startCountdown } from "./countdownTimer";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  },
});

app.use(
  cors({
    origin: "http://localhost:4000",
  })
);

let countdownControl: ReturnType<typeof startCountdown> | null = null;

io.on("connection", (socket) => {
  console.log("User connected.");

  socket.on("start-countdown", (duration: number) => {
    console.log(`Starting countdown for ${duration} seconds.`);
    countdownControl = startCountdown(io, duration);
  });

  socket.on("stop-countdown", () => {
    console.log("Stopping countdown.");
    if (countdownControl) {
      countdownControl.stop();
      countdownControl = null;
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected.");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
