import reportApi from "../api/reportApi";

const reportService = {
  // Dashboard Summary
  async getDashboard() {
    try {
      return await reportApi.getDashboard();
    } catch (error) {
      console.error("Error fetching dashboard report:", error);
      throw error;
    }
  },

  // Loan Report
  async getLoans() {
    try {
      return await reportApi.getLoans();
    } catch (error) {
      console.error("Error fetching loan report:", error);
      throw error;
    }
  },

  // Payment Report
  async getPayments() {
    try {
      return await reportApi.getPayments();
    } catch (error) {
      console.error("Error fetching payment report:", error);
      throw error;
    }
  },

  // Collection Report
  async getCollections() {
    try {
      return await reportApi.getCollections();
    } catch (error) {
      console.error("Error fetching collection report:", error);
      throw error;
    }
  },

  // Monthly Loan Trend
  async getMonthlyLoans() {
    try {
      return await reportApi.getMonthlyLoans();
    } catch (error) {
      console.error("Error fetching monthly loan trend:", error);
      throw error;
    }
  },

  // Export Excel
  async exportExcel() {
    try {
      return await reportApi.exportExcel();
    } catch (error) {
      console.error("Error exporting Excel report:", error);
      throw error;
    }
  },

  // Export PDF
  async exportPDF() {
    try {
      return await reportApi.exportPDF();
    } catch (error) {
      console.error("Error exporting PDF report:", error);
      throw error;
    }
  },

  // Export CSV
  async exportCSV() {
    try {
      return await reportApi.exportCSV();
    } catch (error) {
      console.error("Error exporting CSV report:", error);
      throw error;
    }
  },
};

export default reportService;