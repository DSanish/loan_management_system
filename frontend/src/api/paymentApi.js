import client from "./client";

/* ===========================
   Payment List
=========================== */

export const getPayments = async (params = {}) => {
  const res = await client.get("/payments", {
    params,
  });

  return res.data;
};

/* ===========================
   Payment Details
=========================== */

export const getPaymentById = async (id) => {
  const res = await client.get(`/payments/${id}`);

  return res.data;
};

/* ===========================
   Create Payment
=========================== */

export const createPayment = async (data) => {
  const res = await client.post("/payments", data);

  return res.data;
};

/* ===========================
   Update Payment
=========================== */

export const updatePayment = async (id, data) => {
  const res = await client.patch(
    `/payments/${id}`,
    data
  );

  return res.data;
};

/* ===========================
   Delete Payment
=========================== */

export const deletePayment = async (id) => {
  const res = await client.delete(
    `/payments/${id}`
  );

  return res.data;
};

/* ===========================
   Upcoming Payments
=========================== */

export const getUpcomingPayments = async (days = 7) => {
  const res = await client.get(
    "/payments/upcoming",
    {
      params: { days },
    }
  );

  return res.data;
};

/* ===========================
   Overdue Payments
=========================== */

export const getOverduePayments = async (loanId = null) => {
  const res = await client.get(
    "/payments/overdue",
    {
      params: loanId
        ? { loan_id: loanId }
        : {},
    }
  );

  return res.data;
};

/* ===========================
   Collection Summary
=========================== */

export const getCollectionSummary = async (
  fromDate,
  toDate
) => {
  const res = await client.get(
    "/payments/collection-summary",
    {
      params: {
        from_date: fromDate,
        to_date: toDate,
      },
    }
  );

  return res.data;
};

/* ===========================
   Apply Waiver
=========================== */

export const applyWaiver = async (
  paymentId,
  data
) => {
  const res = await client.post(
    `/payments/${paymentId}/waiver`,
    data
  );

  return res.data;
};