import client from "./client";

const reportApi = {
  // Dashboard Summary
  getDashboard: async () => {
    const response = await client.get("/reports/dashboard");
    return response.data;
  },

  // Loan Report
  getLoans: async () => {
    const response = await client.get("/reports/loans");
    return response.data;
  },

  // Payment Report
  getPayments: async () => {
    const response = await client.get("/reports/payments");
    return response.data;
  },

  // Collection Report
  getCollections: async () => {
    const response = await client.get("/reports/collections");
    return response.data;
  },

  // Monthly Loan Trend
  getMonthlyLoans: async () => {
    const response = await client.get("/reports/monthly-loans");
    return response.data;
  },

  // Export Excel
  exportExcel: async () => {
    const response = await client.get("/reports/export/excel", {
      responseType: "blob",
    });
    return response.data;
  },

  // Export PDF
  exportPDF: async () => {
    const response = await client.get("/reports/export/pdf", {
      responseType: "blob",
    });
    return response.data;
  },

  // Export CSV
  exportCSV: async () => {
    const response = await client.get("/reports/export/csv", {
      responseType: "blob",
    });
    return response.data;
  },
};

export default reportApi;