import apiClient from "./client";

/**
 * Dashboard Statistics
 */
export const getDashboardStats = async () => {
  const { data } = await apiClient.get("/dashboard/stats");
  return data;
};

/**
 * Loan Breakdown
 */
export const getLoanBreakdown = async () => {
  const { data } = await apiClient.get("/dashboard/loan-breakdown");
  return data;
};

/**
 * Monthly Collections
 */
export const getMonthlyCollections = async (months = 6) => {
  const { data } = await apiClient.get("/dashboard/monthly-collections", {
    params: { months },
  });
  return data;
};

/**
 * Loan Type Distribution
 */
export const getLoanTypeDistribution = async () => {
  const { data } = await apiClient.get("/dashboard/loan-type-distribution");
  return data;
};

/**
 * Risk Distribution
 */
export const getRiskDistribution = async () => {
  const { data } = await apiClient.get("/dashboard/risk-distribution");
  return data;
};

const dashboardApi = {
  getDashboardStats,
  getLoanBreakdown,
  getMonthlyCollections,
  getLoanTypeDistribution,
  getRiskDistribution,
};

export default dashboardApi;