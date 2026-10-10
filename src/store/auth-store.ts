import { create } from "zustand";
import Cookies from "js-cookie";
import { User, Role } from "@/types";
import { api } from "@/lib/api-client";
import { DEMO_CREDENTIALS } from "@/lib/constants";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  loginWithCredentials: (email: string, password: string) => Promise<User>;
  loginWithDemoRole: (role: "admin" | "faculty" | "student") => Promise<User>;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user: User, token: string) => {
    Cookies.set("ums_token", token, { expires: 7, sameSite: "lax" });
    Cookies.set("ums_role", user.role, { expires: 7, sameSite: "lax" });
    if (typeof window !== "undefined") {
      localStorage.setItem("ums_token", token);
      localStorage.setItem("ums_user", JSON.stringify(user));
    }
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    Cookies.remove("ums_token");
    Cookies.remove("ums_role");
    if (typeof window !== "undefined") {
      localStorage.removeItem("ums_token");
      localStorage.removeItem("ums_user");
    }
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  loginWithCredentials: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await api.post<{ accessToken: string; user: User }>("/auth/login", {
        email,
        password,
      });
      const { user, accessToken } = response.data;
      Cookies.set("ums_token", accessToken, { expires: 7, sameSite: "lax" });
      Cookies.set("ums_role", user.role, { expires: 7, sameSite: "lax" });
      if (typeof window !== "undefined") {
        localStorage.setItem("ums_token", accessToken);
        localStorage.setItem("ums_user", JSON.stringify(user));
      }
      set({ user, token: accessToken, isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  loginWithDemoRole: async (role: "admin" | "faculty" | "student") => {
    const creds = DEMO_CREDENTIALS[role];
    set({ isLoading: true });
    try {
      const response = await api.post<{ accessToken: string; user: User }>("/auth/login", {
        email: creds.email,
        password: creds.password,
      });
      const { user, accessToken } = response.data;
      Cookies.set("ums_token", accessToken, { expires: 7, sameSite: "lax" });
      Cookies.set("ums_role", user.role, { expires: 7, sameSite: "lax" });
      if (typeof window !== "undefined") {
        localStorage.setItem("ums_token", accessToken);
        localStorage.setItem("ums_user", JSON.stringify(user));
      }
      set({ user, token: accessToken, isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  initAuth: () => {
    if (typeof window === "undefined") return;
    const token = Cookies.get("ums_token") || localStorage.getItem("ums_token");
    const userStr = localStorage.getItem("ums_user");
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        set({ user, token, isAuthenticated: true, isLoading: false });
        return;
      } catch {
        // failed parse
      }
    }
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },
}));
