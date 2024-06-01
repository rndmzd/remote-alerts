import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { Button, Typography, Box } from "@mui/material";

const socket = io("http://localhost:3000");

const Countdown: React.FC = () => {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    socket.on("countdown-update", (time: number) => {
      setTimeRemaining(time);
    });

    socket.on("countdown-finished", () => {
      setTimeRemaining(null);
      alert("Countdown finished!");
    });

    socket.on("countdown-reset", () => {
      setTimeRemaining(null);
    });

    return () => {
      socket.off("countdown-update");
      socket.off("countdown-finished");
      socket.off("countdown-reset");
    };
  }, []);

  const startCountdown = () => {
    const duration = 10; // Example duration in seconds
    socket.emit("start-countdown", duration);
  };

  const stopCountdown = () => {
    socket.emit("stop-countdown");
  };

  return (
    <Box textAlign="center">
      {timeRemaining !== null ? (
        <>
          <Typography variant="h5" gutterBottom>
            Time Remaining: {timeRemaining} seconds
          </Typography>
          <Button variant="contained" color="secondary" onClick={stopCountdown}>
            Stop Countdown
          </Button>
        </>
      ) : (
        <Button variant="contained" color="primary" onClick={startCountdown}>
          Start Countdown
        </Button>
      )}
    </Box>
  );
};

export default Countdown;
