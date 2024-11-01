import React, { useEffect, useState } from 'react';
import { Button, Typography, Box, Grid, Switch, FormControlLabel } from '@mui/material';
import { Socket } from 'socket.io-client';
import axios from 'axios';

interface CountdownProps {
  socket: Socket | null;
}

const Countdown: React.FC<CountdownProps> = ({ socket }) => {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [buttonCountdown, setButtonCountdown] = useState(0);
  const [isSprayMode, setIsSprayMode] = useState(false); // Toggle switch state

  useEffect(() => {
    if (!socket) return;

    socket.on('countdown-update', (time: number) => {
      setTimeRemaining(time);
    });

    socket.on('countdown-finished', () => {
      setTimeRemaining(null);
      if (isSprayMode) {
        triggerSpray(true);
      } else {
        triggerAlert(3);
      }
      startButtonDelay();
    });

    socket.on('countdown-reset', () => {
      setTimeRemaining(null);
      startButtonDelay();
    });

    return () => {
      socket.off('countdown-update');
      socket.off('countdown-finished');
      socket.off('countdown-reset');
    };
  }, [socket, isSprayMode]);

  useEffect(() => {
    if (buttonCountdown > 0) {
      const timer = setTimeout(() => {
        setButtonCountdown(buttonCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [buttonCountdown]);

  const startCountdown = () => {
    if (socket) {
      const duration = 10; // Countdown duration in seconds
      socket.emit('start-countdown', duration);
    }
  };

  const stopCountdown = () => {
    if (socket) {
      socket.emit('stop-countdown');
    }
  };

  const startButtonDelay = () => {
    setIsButtonDisabled(true);
    setButtonCountdown(10);
    setTimeout(() => {
      setIsButtonDisabled(false);
      setButtonCountdown(0);
    }, 10000); // 10 second delay
  };

  const triggerAlert = async (alertDuration: number) => {
    try {
      const credentials = btoa(
        `${process.env.NGROK_USERNAME as string}:${process.env.NGROK_PASSWORD as string}`
      );

      const params = new URLSearchParams({
        auth: credentials,
        duration: alertDuration.toString(),
      });

      const response = await axios.post(
        `${process.env.DEVICE_URL as string}/alert`,
        params.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      console.log('Alert Data:', response.data);
    } catch (error) {
      console.error('Alert Error:', error);
    }
  };

  const triggerSpray = async (sprayAction: boolean) => {
    try {
      const credentials = btoa(`${process.env.NGROK_USERNAME as string}:${process.env.NGROK_PASSWORD as string}`);
  
      const params = new URLSearchParams({
        auth: credentials,
        sprayAction: sprayAction.toString(),
      });
  
      const response = await axios.get(`${process.env.SPRAY_DEVICE_URL as string}/spray`, {
        params: {
          auth: credentials,
          sprayAction: sprayAction.toString(),
        },
      });
  
      console.log('Spray Data:', response.data);
    } catch (error) {
      console.error('Spray Error:', error);
    }
  };
  

  return (
    <Box textAlign="center">
      <FormControlLabel
        control={
          <Switch
            checked={isSprayMode}
            onChange={(e) => setIsSprayMode(e.target.checked)}
            color="primary"
          />
        }
        label={isSprayMode ? "Spray Mode" : "Alert Mode"}
      />

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
                sx={{ border: '2px solid black' }}
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
              disabled={isButtonDisabled}
              sx={{ border: '2px solid black' }}
            >
              {isButtonDisabled
                ? `Wait ${buttonCountdown} seconds`
                : 'Start Countdown'}
            </Button>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Countdown;
