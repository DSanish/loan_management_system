// import { create } from "zustand";

// const getStoredUser = () => {
//   try {
//     const user = localStorage.getItem("user");
//     return user ? JSON.parse(user) : null;
//   } catch (error) {
//     return null;
//   }
// };

// export const useAuthStore = create((set) => ({
//   // ==========================
//   // Initial State
//   // ==========================
//   user: getStoredUser(),
//   token: localStorage.getItem("token") || null,
//   isAuthenticated: !!localStorage.getItem("token"),

//   // ==========================
//   // Login
//   // ==========================
//   login: (user, token) => {
//     localStorage.setItem("user", JSON.stringify(user));
//     localStorage.setItem("token", token);

//     set({
//       user,
//       token,
//       isAuthenticated: true,
//     });
//   },

//   // ==========================
//   // Logout
//   // ==========================
//   logout: () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");

//     set({
//       user: null,
//       token: null,
//       isAuthenticated: false,
//     });
//   },

//   // ==========================
//   // Update User
//   // ==========================
//   setUser: (user) => {
//     localStorage.setItem("user", JSON.stringify(user));

//     set({
//       user,
//     });
//   },

//   // ==========================
//   // Update Token
//   // ==========================
//   setToken: (token) => {
//     localStorage.setItem("token", token);

//     set({
//       token,
//       isAuthenticated: true,
//     });
//   },
// }));


import { create } from "zustand";
import authService from "../services/authService";

const useAuthStore = create((set, get) => ({

  // ==========================
  // State
  // ==========================

  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,

  // ==========================
  // Login
  // ==========================

  login: async (credentials) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const data = await authService.login(credentials);

      set({
        user: data.user || null,
        token: data.access_token,
        isAuthenticated: true,
        loading: false,
      });

      return data;

    } catch (error) {

      set({
        loading: false,
        error: error.message || "Login Failed",
      });

      throw error;
    }
  },

  // ==========================
  // Logout
  // ==========================

  logout: async () => {

    await authService.logout();

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });

  },

  // ==========================
  // Get Logged User
  // ==========================

  fetchCurrentUser: async () => {

    try {

      const user = await authService.getCurrentUser();

      set({
        user,
        isAuthenticated: true,
      });

    } catch (error) {

      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });

    }

  },

  // ==========================
  // Clear Error
  // ==========================

  clearError: () => {

    set({
      error: null,
    });

  },

}));

export default useAuthStore;