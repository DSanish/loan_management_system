import apiClient from "./client";

/**
 * Dashboard Statistics
 */
export const getDashboardStats = async () => {
  const { data } = await apiClient.get("/dashboard/stats");
  return data;
};

const dashboardApi = {
  getDashboardStats,
};

export default dashboardApi;