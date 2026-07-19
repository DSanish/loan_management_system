import { create } from "zustand";
import dashboardService from "../services/dashboardService";

const useDashboardStore = create((set) => ({

  // ==========================
  // State
  // ==========================

  stats: null,

  loanBreakdown: [],

  monthlyCollections: [],

  loanTypeDistribution: [],

  riskDistribution: [],

  loading: false,

  error: null,

  // ==========================
  // Dashboard Stats
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
        error:
          error.response?.data?.detail ||
          "Unable to load dashboard",
      });

    }

  },

  // ==========================
  // Loan Breakdown
  // ==========================

  fetchLoanBreakdown: async () => {

    try {

      const data =
        await dashboardService.getLoanBreakdown();

      set({
        loanBreakdown: data,
      });

    } catch (error) {

      console.error(error);

    }

  },

  // ==========================
  // Monthly Collections
  // ==========================

  fetchMonthlyCollections: async () => {

    try {

      const data =
        await dashboardService.getMonthlyCollections();

      set({
        monthlyCollections: data,
      });

    } catch (error) {

      console.error(error);

    }

  },

  // ==========================
  // Loan Type Distribution
  // ==========================

  fetchLoanTypeDistribution: async () => {

    try {

      const data =
        await dashboardService.getLoanTypeDistribution();

      set({
        loanTypeDistribution: data,
      });

    } catch (error) {

      console.error(error);

    }

  },

  // ==========================
  // Risk Distribution
  // ==========================

  fetchRiskDistribution: async () => {

    try {

      const data =
        await dashboardService.getRiskDistribution();

      set({
        riskDistribution: data,
      });

    } catch (error) {

      console.error(error);

    }

  },

}));

export default useDashboardStore;