


import axios from "axios";
import { navigateTo } from "../utils/navigation";

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
    const method = error?.config?.method || "";
    const isAuthRequest = requestUrl.includes("/users/auth") || requestUrl.includes("users/auth");
    const isVendorRegistration = requestUrl.includes("/vendors") && method === "post";

    console.error("API response error:", {
      status,
      requestUrl,
      method,
      data: error?.response?.data,
      message: error?.message,
    });

    if ((status === 401 || status === 403) && !isAuthRequest && !isVendorRegistration) {
      if (window.location.pathname !== "/notauthorized") {
        navigateTo("/notauthorized", { replace: true });
      }
    }

    return Promise.reject(error);
  }
);

export default API;