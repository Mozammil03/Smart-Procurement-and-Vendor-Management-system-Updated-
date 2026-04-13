


import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8097",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = error?.config?.url || "";
    const isAuthRequest = requestUrl.includes("/users/auth") || requestUrl.includes("users/auth");
    if ((status === 401 || status === 403) && !isAuthRequest) {
      window.location.href = "/notauthorized";
    }
    return Promise.reject(error);
  }
);

export default API;