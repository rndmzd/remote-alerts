import React, { createContext, useState, useContext, ReactNode } from "react";
import axios from "axios";

interface AuthContextType {
  user: string | null;
  token: string | null;
  error: string | null;
  successMessage: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, password: string) => Promise<void>;
  clearMessages: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(
        process.env.SOCKETIO_HOST + "/api/login",
        {
          username,
          password,
        }
      );
      setUser(username);
      setToken(response.data.token);
      setError(null); // Clear any previous errors on successful login
      setSuccessMessage(null); // Clear success message on successful login
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const register = async (username: string, password: string) => {
    try {
      await axios.post(process.env.SOCKETIO_HOST + "/api/register", {
        username,
        password,
      });
      setError(null); // Clear any previous errors on successful registration
      setSuccessMessage("User registered successfully. Please log in.");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        error,
        successMessage,
        login,
        logout,
        register,
        clearMessages,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
