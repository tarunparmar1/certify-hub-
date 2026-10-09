
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Automatically add JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
  // console.log("Token:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

