import client from "./client";

// Get all loans
export const getLoans = async (params = {}) => {
  const response = await client.get("/api/v1/loans", {
    params,
  });
  return response.data;
};

// Get single loan
export const getLoan = async (id) => {
  const response = await client.get(`/api/v1/loans/${id}`);
  return response.data;
};

// Create loan
export const createLoan = async (loanData) => {
  const response = await client.post("/api/v1/loans", loanData);
  return response.data;
};

// Update loan
export const updateLoan = async (id, loanData) => {
  const response = await client.put(`/api/v1/loans/${id}`, loanData);
  return response.data;
};

// Delete loan
export const deleteLoan = async (id) => {
  const response = await client.delete(`/api/v1/loans/${id}`);
  return response.data;
};