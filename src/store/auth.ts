import { defineStore } from "pinia";
import type { User, LoginResponse } from "../types/auth";
import { api } from "../utils/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem("token") || null,
    role: (localStorage.getItem("role") as "admin" | "cashier" | null) || null,
    expiresAt: localStorage.getItem("expiresAt") || null,
  }),

  getters: {
    isTokenValid(state): boolean {
      if (!state.expiresAt) return false;
      const now = new Date().getTime();
      const expires = new Date(state.expiresAt).getTime();
      return now < expires;
    },
  },

  actions: {
    async login(username: string, password: string) {
      try {
        const res = await api.post<LoginResponse>(
          `${import.meta.env.VITE_API_URL}/login`,
          { username, password }
        );

        this.user = res.data.user;
        this.token = res.data.token;
        this.role = res.data.role;

        // Set expiresAt ke 1 hari (24 jam) dari sekarang
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 1);
        this.expiresAt = expiresAt.toISOString();

        localStorage.setItem("token", this.token);
        localStorage.setItem("role", this.role);
        localStorage.setItem("expiresAt", this.expiresAt);
      } catch (err: any) {
        throw err.response?.data?.message || "Login gagal";
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.role = null;
      this.expiresAt = null;
      localStorage.clear();
    },

    isAdmin(): boolean {
      return this.role === "admin" && this.isTokenValid;
    },

    isKasir(): boolean {
      return this.role === "cashier" && this.isTokenValid;
    },

    checkTokenValidity() {
      if (!this.isTokenValid) {
        this.logout();
      }
    },
  },
});
