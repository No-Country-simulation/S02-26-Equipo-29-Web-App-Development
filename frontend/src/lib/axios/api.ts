import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3002",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const storedToken = localStorage.getItem("userToken");
  if (storedToken) {
    try {
      const { access_token } = JSON.parse(storedToken);
      if (access_token) {
        config.headers.Authorization = `Bearer ${access_token}`;
      }
    } catch (e) {
      console.error("Error parsing userToken", e);
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    throw error;
  },
);
