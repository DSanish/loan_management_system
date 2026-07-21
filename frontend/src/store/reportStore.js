import { create } from "zustand";
import reportService from "../services/reportService";

const useReportStore = create((set) => ({
  // State
  dashboard: null,
  loans: [],
  payments: [],
  collections: [],
  monthlyLoans: [],

  loading: false,
  error: null,

  // ================= Dashboard =================
  fetchDashboard: async () => {
    set({ loading: true, error: null });

    try {
      const data = await reportService.getDashboard();

      set({
        dashboard: data,
        loading: false,
      });

      return data;
    } catch (error) {
      console.error(error);

      set({
        loading: false,
        error: error.message || "Failed to load dashboard report",
      });
    }
  },
  

  // ================= Loan Report =================
  fetchLoans: async () => {
    set({ loading: true, error: null });

    try {
      const data = await reportService.getLoans();

      set({
        loans: data,
        loading: false,
      });

      return data;
    } catch (error) {
      console.error(error);

      set({
        loading: false,
        error: error.message || "Failed to load loan report",
      });
    }
  },

  // ================= Payment Report =================
  fetchPayments: async () => {
    set({ loading: true, error: null });

    try {
      const data = await reportService.getPayments();

      set({
        payments: data,
        loading: false,
      });

      return data;
    } catch (error) {
      console.error(error);

      set({
        loading: false,
        error: error.message || "Failed to load payment report",
      });
    }
  },

  // ================= Collection Report =================
  fetchCollections: async () => {
    set({ loading: true, error: null });

    try {
      const data = await reportService.getCollections();

      set({
        collections: data,
        loading: false,
      });

      return data;
    } catch (error) {
      console.error(error);

      set({
        loading: false,
        error: error.message || "Failed to load collection report",
      });
    }
  },

  // ================= Monthly Loan Trend =================
  fetchMonthlyLoans: async () => {
    set({ loading: true, error: null });
  
    try {
      const data = await reportService.getMonthlyLoans();
  
      set({
        monthlyLoans: data,
        loading: false,
      });
  
      return data;
    } catch (error) {
      console.error(error);
  
      set({
        loading: false,
        error: error.message || "Failed to load monthly loan trend",
      });
    }
  },

  // ================= Export =================
  exportExcel: async () => {
    try {
      return await reportService.exportExcel();
    } catch (error) {
      console.error(error);
    }
  },

  exportPDF: async () => {
    try {
      return await reportService.exportPDF();
    } catch (error) {
      console.error(error);
    }
  },

  exportCSV: async () => {
    try {
      return await reportService.exportCSV();
    } catch (error) {
      console.error(error);
    }
  },

  // ================= Reset =================
  resetReports: () => {
    set({
      dashboard: null,
      loans: [],
      payments: [],
      collections: [],
      monthlyLoans: [],
      loading: false,
      error: null,
    });
  },
}));

export default useReportStore;