import authApi from "../api/authApi";

/**
 * ==========================
 * Authentication Service
 * ==========================
 */

class AuthService {
  /**
   * Login User
   */
  async login(credentials) {
    try {
      const data = await authApi.loginUser(credentials);

      // Save JWT Token
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
      }

      return data;
    } catch (error) {
      console.error("Login Error:", error);

      throw (
        error.response?.data || {
          message: "Unable to login. Please try again.",
        }
      );
    }
  }

  /**
   * Refresh Token
   */
  async refreshToken() {
    try {
      const data = await authApi.refreshToken();

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
      }

      return data;
    } catch (error) {
      console.error("Refresh Token Error:", error);
      throw error;
    }
  }

  /**
   * Get Logged In User
   */
  async getCurrentUser() {
    try {
      return await authApi.getCurrentUser();
    } catch (error) {
      console.error("Get Current User Error:", error);
      throw error;
    }
  }

  /**
   * Logout User
   */
  async logout() {
    try {
      await authApi.logoutUser();
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      localStorage.removeItem("token");
    }
  }

  /**
   * Check Login Status
   */
  isAuthenticated() {
    return !!localStorage.getItem("token");
  }

  /**
   * Get Stored Token
   */
  getToken() {
    return localStorage.getItem("token");
  }
}

const authService = new AuthService();

export default authService;