import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface User {
  id: string;
  phone_number: string;
  role: "admin" | "user" | "vendor" | "rider" | null;
  name?: string;
  email?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
}

interface AuthContextType extends AuthState {
  login: (phoneNumber: string, role: string) => Promise<void>;
  adminLogin: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

import { API_BASE } from "../config/api";
export { API_BASE };

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const saved = localStorage.getItem("shrimart_auth");
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...parsed, isLoggedIn: !!parsed.token };
    }
    return { user: null, token: null, isLoggedIn: false };
  });

  useEffect(() => {
    if (state.token) {
      localStorage.setItem("shrimart_auth", JSON.stringify({ 
        user: state.user, 
        token: state.token 
      }));
    } else {
      localStorage.removeItem("shrimart_auth");
    }
  }, [state]);

  const login = async (phoneNumber: string, role: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: phoneNumber, role }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setState({ user: data.user, token: data.token, isLoggedIn: true });
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  const adminLogin = async (email: string, pass: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setState({ user: data.user, token: data.token, isLoggedIn: true });
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error("Admin Login failed:", err);
      throw err;
    }
  };

  const logout = () => {
    setState({ user: null, token: null, isLoggedIn: false });
  };

  const updateProfile = async (updateData: Partial<User>) => {
    try {
      const res = await fetch(`${API_BASE}/user/update-profile`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${state.token}`
        },
        body: JSON.stringify(updateData),
      });
      const data = await res.json();
      if (data.status === "success") {
        setState(s => ({ ...s, user: data.user }));
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error("Profile update failed:", err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      adminLogin,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
