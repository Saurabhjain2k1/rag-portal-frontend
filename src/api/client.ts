// src/api/client.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // backend URL in dev
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// // Handle token expiration (401 responses)
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Token expired or invalid
//       localStorage.removeItem("access_token");
//       window.location.href = "/login"; // Force redirect to login
//     }
//     return Promise.reject(error);
//   }
// );

export default api;
