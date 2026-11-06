// authContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  username: string;
  role: string;
}
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  const login = (newToken: string, userInfo: User) => {
    setToken(newToken);
    setUser(userInfo);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userInfo));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
