import dashboardApi from "../api/dashboardApi";

class DashboardService {
  async getStats() {
    try {
      return await dashboardApi.getDashboardStats();
    } catch (error) {
      console.error("Dashboard Error:", error);
      throw error;
    }
  }
}

const dashboardService = new DashboardService();

export default dashboardService;