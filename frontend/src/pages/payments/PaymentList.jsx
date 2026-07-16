import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  Search,
  RotateCcw,
} from "lucide-react";

import {
  getPayments,
  deletePayment,
} from "../../api/paymentApi";

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadPayments(search,status,currentPage);
  }, [currentPage, search, status]);

const loadPayments = async (
  searchValue = search,
  statusValue = status,
  page = currentPage
) => {
  try {
    setLoading(true);

const res = await getPayments(
  page,
  20,
  searchValue,
  statusValue
);

    setPayments(res.items || []);
    setTotalPages(res.pages || 1);

  } catch (err) {
    console.error(err);
    alert("Failed to load payments");
  } finally {
    setLoading(false);
  }
};

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearch("");
    setStatus("");
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this payment?"
    );

    if (!confirmDelete) return;

    try {
      await deletePayment(id);

      alert("Payment deleted successfully");

      loadPayments(search, status, currentPage);
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

      {/* Search Section */}

      <div className="bg-white rounded-xl shadow p-5">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <input
            type="text"
            placeholder="Search Payment / Loan Number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg p-3"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded-lg p-3"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="waived">Waived</option>
          </select>

          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2"
          >
            <Search size={18} />
            Search
          </button>

          <button
            onClick={handleClear}
            className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} />
            Clear
          </button>

        </div>

      </div>

      {/* Table */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Payment No.</th>
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
                  colSpan={7}
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
                    {payment.payment_number}
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

                      <Link
                        to={`/payments/${payment.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye size={18} />
                      </Link>

                      <Link
                        to={`/payments/edit/${payment.id}`}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Pencil size={18} />
                      </Link>

                      <button
                        onClick={() => handleDelete(payment.id)}
                        className="text-red-600 hover:text-red-800"
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
      {/* Pagination */}

<div className="flex justify-between items-center bg-white rounded-xl shadow p-4">

  <button
    onClick={() => setCurrentPage(currentPage - 1)}
    disabled={currentPage === 1}
    className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
  >
    Previous
  </button>

  <span className="font-medium">
    Page {currentPage} of {totalPages}
  </span>

  <button
    onClick={() => setCurrentPage(currentPage + 1)}
    disabled={currentPage === totalPages}
    className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
  >
    Next
  </button>

</div>

    </div>
    
  );
};

export default PaymentList;