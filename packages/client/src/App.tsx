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
  const {
    user,
    token,
    login,
    logout,
    error,
    successMessage,
    register,
    clearMessages,
  } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

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

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    await login(username, password);
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    await register(username, password);
    setIsRegistering(false);
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
          <>
            {isRegistering ? (
              <Box component="form" onSubmit={handleRegister}>
                <TextField
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  fullWidth
                  margin="normal"
                  autoComplete="username"
                />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  margin="normal"
                  autoComplete="new-password"
                />
                {error && (
                  <Typography color="error" variant="body2">
                    {error}
                  </Typography>
                )}
                <Grid
                  container
                  spacing={2}
                  direction="column"
                  alignItems="center"
                >
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary">
                      Register
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      onClick={() => {
                        setIsRegistering(false);
                        clearMessages();
                      }}
                    >
                      Already have an account? Login
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleLogin}>
                <TextField
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  fullWidth
                  margin="normal"
                  autoComplete="username"
                />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  margin="normal"
                  autoComplete="current-password"
                />
                {error && (
                  <Typography color="error" variant="body2">
                    {error}
                  </Typography>
                )}
                {successMessage && (
                  <Typography color="primary" variant="body2">
                    {successMessage}
                  </Typography>
                )}
                <Grid
                  container
                  spacing={2}
                  direction="column"
                  alignItems="center"
                >
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary">
                      Login
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button onClick={() => setIsRegistering(true)}>
                      Don't have an account? Register
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}
          </>
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
