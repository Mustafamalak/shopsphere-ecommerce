import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("shopsphereUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(false);

  const saveSession = (data) => {
    localStorage.setItem("shopsphereToken", data.token);
    localStorage.setItem("shopsphereUser", JSON.stringify(data.user));
    setUser(data.user);
  };

  const signup = async (formData) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", formData);
      saveSession(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const login = async (formData) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", formData);
      saveSession(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("shopsphereToken");
    localStorage.removeItem("shopsphereUser");
    setUser(null);
  };

  useEffect(() => {
    const syncUser = () => {
      const storedUser = localStorage.getItem("shopsphereUser");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);