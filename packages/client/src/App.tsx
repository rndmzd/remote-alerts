import React, { useState } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import Countdown from './Countdown';
import { io, Socket } from 'socket.io-client';

const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  const handleConnect = () => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    setIsConnected(false);
  };

  return (
    <Container maxWidth="sm">
      <Box
        textAlign="center"
        mt={5}
        p={3}
        sx={{
          border: '2px solid black',
          borderRadius: '8px',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Alert Panel
        </Typography>
        {isConnected ? (
          <>
            <Countdown socket={socket} />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDisconnect}
              sx={{ marginTop: '10px', border: '2px solid black' }}
            >
              Disarm
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleConnect}
            sx={{ border: '2px solid black' }}
          >
            Arm
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default App;
