import { create } from "zustand";
import API from "../api";

const useAuth = create((set) => ({
  user: null,
  error: null,

  login: async (email, password) => {
    try {
      const res = await API.post("/auth/login", { email, password });

      set({ user: res.data.user, error: null });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.error || "Error logging in" });
      return false;
    }
  },

  logout: () => {
    set({ user: null });
  },
}));

export default useAuth;
