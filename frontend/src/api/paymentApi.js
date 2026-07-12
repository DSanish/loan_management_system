import client from "./client";

// Payment List
export const getPayments = async (params = {}) => {
  const res = await client.get("/payments", {
    params,
  });

  return res.data;
};

// Payment Details
export const getPaymentById = async (id) => {
  const res = await client.get(`/payments/${id}`);

  return res.data;
};

// Record Payment
export const createPayment = async (data) => {
  const res = await client.post("/payments", data);

  return res.data;
};

// Upcoming Payments
export const getUpcomingPayments = async () => {
  const res = await client.get("/payments/upcoming");

  return res.data;
};

// Overdue Payments
export const getOverduePayments = async () => {
  const res = await client.get("/payments/overdue");

  return res.data;
};

// Collection Summary
export const getCollectionSummary = async () => {
  const res = await client.get("/payments/collection-summary");

  return res.data;
};

// Apply Waiver
export const applyWaiver = async (paymentId, data) => {
  const res = await client.post(
    `/payments/${paymentId}/waiver`,
    data
  );

  return res.data;
};