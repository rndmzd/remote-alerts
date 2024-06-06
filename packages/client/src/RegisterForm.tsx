import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useAuth } from "./authContext";

const RegisterForm: React.FC = () => {
  const { register, error } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    await register(username, password);
  };

  return (
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
      <Button type="submit" variant="contained" color="primary">
        Register
      </Button>
    </Box>
  );
};

export default RegisterForm;
