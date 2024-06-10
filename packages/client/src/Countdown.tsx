import React, { useEffect, useState } from "react";
import { Button, Typography, Box, Grid } from "@mui/material";
import { Socket } from "socket.io-client";
import axios from "axios";

interface CountdownProps {
  socket: Socket | null;
}

const Countdown: React.FC<CountdownProps> = ({ socket }) => {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.on("countdown-update", (time: number) => {
      setTimeRemaining(time);
    });

    socket.on("countdown-finished", () => {
      setTimeRemaining(null);
      alert("Alert triggered!");

      axios
        .get(process.env.DEVICE_URL as string + "/alert", {
          auth: {
            username: process.env.NGROK_USERNAME as string,
            password: process.env.NGROK_PASSWORD as string,
          },
        })
        .then((response) => {
          console.log("Data:", response.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });

    socket.on("countdown-reset", () => {
      setTimeRemaining(null);
    });

    return () => {
      socket.off("countdown-update");
      socket.off("countdown-finished");
      socket.off("countdown-reset");
    };
  }, [socket]);

  const startCountdown = () => {
    if (socket) {
      const duration = 10; // Alert delay countdown in seconds
      socket.emit("start-countdown", duration);
    }
  };

  const stopCountdown = () => {
    if (socket) {
      socket.emit("stop-countdown");
    }
  };

  return (
    <Box textAlign="center">
      {timeRemaining !== null ? (
        <>
          <Typography variant="h5" gutterBottom>
            Time Remaining: {timeRemaining} seconds
          </Typography>
          <Grid container spacing={1} justifyContent="center">
            <Grid item xs={12} sx={{ m: 0.5 }}>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={stopCountdown}
                sx={{ border: "2px solid black" }}
              >
                Stop Countdown
              </Button>
            </Grid>
          </Grid>
        </>
      ) : (
        <Grid container spacing={1} justifyContent="center">
          <Grid item xs={12} sx={{ m: 0.5 }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={startCountdown}
              sx={{ border: "2px solid black" }}
            >
              Start Countdown
            </Button>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Countdown;
