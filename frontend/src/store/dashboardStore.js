import { create } from "zustand";
import dashboardService from "../services/dashboardService";

const useDashboardStore = create((set) => ({

  // ==========================
  // State
  // ==========================

  stats: null,
  loading: false,
  error: null,

  // ==========================
  // Fetch Dashboard Stats
  // ==========================

  fetchDashboardStats: async () => {

    try {

      set({
        loading: true,
        error: null,
      });

      const data = await dashboardService.getStats();

      set({
        stats: data,
        loading: false,
      });

    } catch (error) {

      set({
        loading: false,
        error: error.response?.data?.detail || "Unable to load dashboard",
      });

    }

  },

}));

export default useDashboardStore;