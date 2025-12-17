import { BASE_URL } from "@/constant/base-url";
import axios, { isAxiosError } from "axios";
import toast from "react-hot-toast";

export interface ApiResponse {
  code: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  message: string;
}

export const Axios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

Axios.interceptors.request.use(async (config) => {
  const token = localStorage?.getItem("access_token");
  // Check if the token is available and not expired
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

Axios.interceptors.response.use(undefined, (error) => {
  if (isAxiosError(error)) {
    if (error.response?.data.message) {
      const msg = error.response?.data.message;
      toast.error("Api Error: " + msg);
    }
  }
  return Promise.reject(error);
});

// Add response interceptor to handle token refresh if needed
