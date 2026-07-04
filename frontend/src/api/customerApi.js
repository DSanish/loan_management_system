import apiClient from "./client";

/**
 * ==========================
 * Customer APIs
 * ==========================
 */

/**
 * Get Customers List
 */
export const getCustomers = async (params = {}) => {
  const { data } = await apiClient.get("/customers", {
    params,
  });

  return data;
};

/**
 * Get Single Customer
 */
export const getCustomerById = async (customerId) => {
  const { data } = await apiClient.get(`/customers/${customerId}`);

  return data;
};

/**
 * Create Customer
 */
export const createCustomer = async (customerData) => {
  const { data } = await apiClient.post(
    "/customers",
    customerData
  );

  return data;
};

/**
 * Update Customer
 */
export const updateCustomer = async (
  customerId,
  customerData
) => {
  const { data } = await apiClient.patch(
    `/customers/${customerId}`,
    customerData
  );

  return data;
};

/**
 * Deactivate Customer
 */
export const deleteCustomer = async (customerId) => {
  const { data } = await apiClient.delete(
    `/customers/${customerId}`
  );

  return data;
};

/**
 * Customer Loans
 */
export const getCustomerLoans = async (customerId) => {
  const { data } = await apiClient.get(
    `/customers/${customerId}/loans`
  );

  return data;
};

/**
 * Export
 */
const customerApi = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerLoans,
};

export default customerApi;