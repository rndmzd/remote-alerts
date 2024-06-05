import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  TextField,
} from "@mui/material";
import Countdown from "./Countdown";
import { io, Socket } from "socket.io-client";
import { useAuth, AuthProvider } from "./authContext";

const App: React.FC = () => {
  const { user, token, login, logout } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleConnect = () => {
    if (!token) return;
    const newSocket = io("http://localhost:3000", {
      auth: { token },
    });
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

  const handleLogin = async () => {
    try {
      await login(username, password);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        textAlign="center"
        mt={5}
        p={3}
        sx={{ border: "2px solid black", borderRadius: "8px" }}
      >
        <Typography variant="h4" gutterBottom>
          Alert Panel
        </Typography>
        {user ? (
          <>
            {isConnected ? (
              <>
                <Countdown socket={socket} />
                <Grid container spacing={1} justifyContent="center">
                  <Grid item xs={12} sx={{ m: 0.5 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      onClick={handleDisconnect}
                      sx={{ border: "2px solid black" }}
                    >
                      Disarm
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
                    onClick={handleConnect}
                    sx={{ border: "2px solid black" }}
                  >
                    Arm
                  </Button>
                </Grid>
              </Grid>
            )}
            <Button onClick={logout}>Logout</Button>
          </>
        ) : (
          <Box>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button onClick={handleLogin} variant="contained" color="primary">
              Login
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

const AppWrapper: React.FC = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWrapper;
