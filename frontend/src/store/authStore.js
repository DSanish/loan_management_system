import { create } from "zustand";

const getStoredUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
};

export const useAuthStore = create((set) => ({
  // ==========================
  // Initial State
  // ==========================
  user: getStoredUser(),
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),

  // ==========================
  // Login
  // ==========================
  login: (user, token) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);

    set({
      user,
      token,
      isAuthenticated: true,
    });
  },

  // ==========================
  // Logout
  // ==========================
  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  // ==========================
  // Update User
  // ==========================
  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));

    set({
      user,
    });
  },

  // ==========================
  // Update Token
  // ==========================
  setToken: (token) => {
    localStorage.setItem("token", token);

    set({
      token,
      isAuthenticated: true,
    });
  },
}));