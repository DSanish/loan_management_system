import axios from "axios";

// Base URL from .env
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

// Create Axios Instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// =========================
// Request Interceptor
// =========================
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =========================
// Response Interceptor
// =========================
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error("Unauthorized");

          localStorage.removeItem("token");
          localStorage.removeItem("user");

          window.location.href = "/login";
          break;

        case 403:
          console.error("Forbidden");
          break;

        case 404:
          console.error("API Not Found");
          break;

        case 500:
          console.error("Internal Server Error");
          break;

        default:
          console.error(error.response.data);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;