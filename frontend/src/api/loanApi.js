import client from "./client";

/**
 * Get All Loans
 */
export const getLoans = async (params = {}) => {
  const { data } = await client.get("/loans", {
    params,
  });

  return data;
};

/**
 * Get Single Loan
 */
export const getLoanById = async (id) => {
  const { data } = await client.get(`/loans/${id}`);

  return data;
};

/**
 * Create Loan
 */
export const createLoan = async (loanData) => {
  const { data } = await client.post(
    "/loans",
    loanData
  );

  return data;
};

/**
 * Update Loan
 */
export const updateLoan = async (
  id,
  loanData
) => {
  const { data } = await client.patch(
    `/loans/${id}`,
    loanData
  );

  return data;
};

/**
 * Delete Loan
 */
export const deleteLoan = async (id) => {
  const { data } = await client.delete(
    `/loans/${id}`
  );

  return data;
};

/**
 * Export
 */
const loanApi = {
  getLoans,
  getLoanById,
  createLoan,
  updateLoan,
  deleteLoan,
};

export default loanApi;