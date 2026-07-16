import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  getPayments,
  deletePayment,
} from "../../api/paymentApi";

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);

      const res = await getPayments();

      if (Array.isArray(res)) {
        setPayments(res);
      } else {
        setPayments(res.items || []);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this payment?"
    );

    if (!confirmDelete) return;

    try {
      await deletePayment(id);

      alert("Payment deleted successfully");

      await loadPayments();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.detail ||
        "Unable to delete payment."
      );
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center">
        Loading Payments...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold">
            Payments
          </h1>

          <p className="text-gray-500">
            Manage Loan Payments
          </p>
        </div>

        <Link
          to="/payments/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={18} />
          New Payment
        </Link>

      </div>

      {/* Table */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Loan</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Due Date</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>

            {payments.length === 0 ? (

              <tr>
                <td
                  colSpan={6}
                  className="text-center py-10"
                >
                  No Payments Found
                </td>
              </tr>

            ) : (

              payments.map((payment) => (

                <tr
                  key={payment.id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="p-3">
                    {payment.id}
                  </td>

                  <td className="p-3">
                    {payment.loan?.loan_number || payment.loan_id}
                  </td>

                  <td className="p-3">
                    ₹ {payment.amount}
                  </td>

                  <td className="p-3 capitalize">
                    {payment.status}
                  </td>

                  <td className="p-3">
                    {payment.due_date}
                  </td>

                  <td className="p-3">
                    <div className="flex justify-center gap-4">

                      {/* View */}

                      <Link
                        to={`/payments/${payment.id}`}
                        className="text-blue-600 hover:text-blue-800"
                        title="View"
                      >
                        <Eye size={18} />
                      </Link>

                      {/* Edit */}

                      <Link
                        to={`/payments/edit/${payment.id}`}
                        className="text-green-600 hover:text-green-800"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </Link>

                      {/* Delete */}

                      <button
                        onClick={() => handleDelete(payment.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default PaymentList;