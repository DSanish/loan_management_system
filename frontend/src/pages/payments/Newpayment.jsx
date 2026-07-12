import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { createPayment } from "../../api/paymentApi";

const NewPayment = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    loan_id: "",
    amount: "",
    payment_date: "",
    payment_method: "cash",
    transaction_reference: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createPayment({
        loan_id: Number(form.loan_id),
        amount: Number(form.amount),
        payment_date: form.payment_date,
        payment_method: form.payment_method,
        transaction_reference: form.transaction_reference,
        notes: form.notes,
      });

      alert("Payment Recorded Successfully");

      navigate("/payments");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.detail ||
          "Unable to record payment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">
            New Payment
          </h1>

          <p className="text-gray-500">
            Record Loan Payment
          </p>

        </div>

        <Link
          to="/payments"
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
        >
          <ArrowLeft size={18} />
          Back
        </Link>

      </div>

      {/* Form */}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-8 space-y-6"
      >

        <div className="grid grid-cols-2 gap-6">

          <div>

            <label className="block mb-2 font-medium">
              Loan ID
            </label>

            <input
              type="number"
              name="loan_id"
              value={form.loan_id}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Amount
            </label>

            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Payment Date
            </label>

            <input
              type="date"
              name="payment_date"
              value={form.payment_date}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Payment Method
            </label>

            <select
              name="payment_method"
              value={form.payment_method}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cheque">Cheque</option>
              <option value="card">Card</option>
            </select>

          </div>

          <div className="col-span-2">

            <label className="block mb-2 font-medium">
              Transaction Reference
            </label>

            <input
              type="text"
              name="transaction_reference"
              value={form.transaction_reference}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

          </div>

          <div className="col-span-2">

            <label className="block mb-2 font-medium">
              Notes
            </label>

            <textarea
              rows={4}
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

          </div>

        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          {loading ? "Saving..." : "Record Payment"}
        </button>

      </form>

    </div>
  );
};

export default NewPayment;