import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import {
  getPaymentById,
  updatePayment,
} from "../../api/paymentApi";

const EditPayment = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    payment_method: "",
    transaction_reference: "",
    notes: "",
  });

  useEffect(() => {
    loadPayment();
  }, []);

  const loadPayment = async () => {
    try {
      const payment = await getPaymentById(id);

      setFormData({
        payment_method: payment.payment_method ?? "",
        transaction_reference:
          payment.transaction_reference ?? "",
        notes: payment.notes ?? "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to load payment.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await updatePayment(id, {
        payment_method: formData.payment_method,
        transaction_reference:
          formData.transaction_reference,
        notes: formData.notes,
      });

      alert("Payment Updated Successfully");

      navigate("/payments");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.detail ||
          "Payment update failed."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center">
        Loading Payment...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">
            Edit Payment
          </h1>

          <p className="text-gray-500">
            Update Payment Details
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
              Payment Method
            </label>

            <select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="bank_transfer">
                Bank Transfer
              </option>
              <option value="cheque">
                Cheque
              </option>
              <option value="card">
                Card
              </option>
            </select>

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Transaction Reference
            </label>

            <input
              type="text"
              name="transaction_reference"
              value={formData.transaction_reference}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

          </div>

          <div className="col-span-2">

            <label className="block mb-2 font-medium">
              Notes
            </label>

            <textarea
              rows={5}
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

          </div>

        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
        >
          <Save size={18} />

          {saving
            ? "Updating..."
            : "Update Payment"}
        </button>

      </form>

    </div>
  );
};

export default EditPayment;