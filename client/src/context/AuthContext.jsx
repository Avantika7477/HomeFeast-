import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, getToken } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setReady(true);
      return;
    }
    api("/api/auth/me")
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem("hf_token"))
      .finally(() => setReady(true));
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      async login(email, password) {
        const data = await api("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        localStorage.setItem("hf_token", data.token);
        setUser(data.user);
        return data.user;
      },
      async register(payload) {
        const data = await api("/api/auth/register", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        localStorage.setItem("hf_token", data.token);
        setUser(data.user);
        return data.user;
      },
      logout() {
        localStorage.removeItem("hf_token");
        setUser(null);
      },
    }),
    [user, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export function homeFor(role) {
  if (role === "admin") return "/admin";
  if (role === "cook") return "/cook";
  return "/browse";
}
