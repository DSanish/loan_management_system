import dashboardApi from "../api/dashboardApi";

class DashboardService {
  // Dashboard Stats
  async getStats() {
    try {
      return await dashboardApi.getDashboardStats();
    } catch (error) {
      console.error("Dashboard Stats Error:", error);
      throw error;
    }
  }

  // Loan Breakdown
  async getLoanBreakdown() {
    try {
      return await dashboardApi.getLoanBreakdown();
    } catch (error) {
      console.error("Loan Breakdown Error:", error);
      throw error;
    }
  }

  // Monthly Collections
  async getMonthlyCollections(months = 6) {
    try {
      return await dashboardApi.getMonthlyCollections(months);
    } catch (error) {
      console.error("Monthly Collections Error:", error);
      throw error;
    }
  }

  // Loan Type Distribution
  async getLoanTypeDistribution() {
    try {
      return await dashboardApi.getLoanTypeDistribution();
    } catch (error) {
      console.error("Loan Type Distribution Error:", error);
      throw error;
    }
  }

  // Risk Distribution
  async getRiskDistribution() {
    try {
      return await dashboardApi.getRiskDistribution();
    } catch (error) {
      console.error("Risk Distribution Error:", error);
      throw error;
    }
  }
}

const dashboardService = new DashboardService();

export default dashboardService;