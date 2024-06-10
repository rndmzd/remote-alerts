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
      triggerAlert(3);
      alert("Alert triggered!");
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

  const triggerAlert = async (alertDuration: number) => {
    try {
      const username = process.env.NGROK_USERNAME as string;
      const password = process.env.NGROK_PASSWORD as string;

      const params = new URLSearchParams({
        duration: alertDuration.toString(),
      });

      const response = await axios.post(
        (process.env.DEVICE_URL as string) + "/alert",
        params.toString(),
        {
          auth: {
            username: username,
            password: password,
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      console.log("Data:", response.data);
    } catch (error) {
      console.error("Error:", error);
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
