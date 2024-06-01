import React, { useState } from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import Countdown from "./Countdown";

const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    setIsConnected(true);
  };

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={5}>
        <Typography variant="h4" gutterBottom>
          Countdown Timer
        </Typography>
        {isConnected ? (
          <Countdown />
        ) : (
          <Button variant="contained" color="primary" onClick={handleConnect}>
            Connect to Server
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default App;
