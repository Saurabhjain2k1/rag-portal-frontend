// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchMe, login } from "../api/authApi";
import type {LoginRequest, UserInfo} from "../api/authApi"

interface AuthContextValue {
  user: UserInfo | null;
  token: string | null;
  loading: boolean;
  loginUser: (data: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("access_token")
  );
  const [loading, setLoading] = useState<boolean>(!!token);

  // On first load, if token exists, fetch /auth/me
  useEffect(() => {
    const init = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const me = await fetchMe();
        setUser(me);
      } catch (e) {
        console.error("Failed to fetch /auth/me", e);
        localStorage.removeItem("access_token");
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [token]);

  const loginUser = async (data: LoginRequest) => {
    const res = await login(data);
    localStorage.setItem("access_token", res.access_token);
    setToken(res.access_token);
    const me = await fetchMe();
    setUser(me);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
