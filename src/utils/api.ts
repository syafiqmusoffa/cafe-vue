import { useAuthStore } from "@/store/auth";
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// ✅ Interceptor untuk inject token otomatis
api.interceptors.request.use((config) => {
  const auth = useAuthStore(); // Pinia store
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});
