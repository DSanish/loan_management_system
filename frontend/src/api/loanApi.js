import client from "./client";

// Get all loans
export const getLoans = async (params = {}) => {
  const response = await client.get("/loans", {
    params,
  });
  return response.data;
};

// Get single loan
export const getLoan = async (id) => {
  const response = await client.get(`/loans/${id}`);
  return response.data;
};

// Create loan
export const createLoan = async (loanData) => {
  const response = await client.post("/loans", loanData);
  return response.data;
};

// Update loan
export const updateLoan = async (id, loanData) => {
  const response = await client.put(`/loans/${id}`, loanData);
  return response.data;
};

// Delete loan
export const deleteLoan = async (id) => {
  const response = await client.delete(`/loans/${id}`);
  return response.data;
};