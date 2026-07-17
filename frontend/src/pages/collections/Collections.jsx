import { useEffect, useState } from "react";
import {
  Wallet,
  IndianRupee,
  Clock,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

import {
  getRecentCollections,
  getCollectionSummary,
} from "../../api/paymentApi";

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [summary, setSummary] = useState(null);

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadCollections(page);
  }, [page]);

  const loadCollections = async (currentPage = 1) => {
    try {
      setLoading(true);

      const today = new Date();

      const fromDate = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-01`;

      const toDate = today
        .toISOString()
        .split("T")[0];

      const [recentRes, summaryRes] =
        await Promise.all([
          getRecentCollections(currentPage, 10),
          getCollectionSummary(
            fromDate,
            toDate
          ),
        ]);

      setCollections(recentRes.items || []);
      setTotalPages(recentRes.pages || 1);

      setSummary(summaryRes);
    } catch (err) {
      console.error(err);
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
            Collections
          </h1>

          <p className="text-gray-500">
            Monitor loan collections
          </p>

        </div>

        <button
          onClick={() => loadCollections(page)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <RefreshCw size={18} />
          Refresh
        </button>

      </div>

      {/* Summary Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-white rounded-xl shadow p-6">

          <div className="flex justify-between">

            <div>

              <p className="text-gray-500">
                Total Collection
              </p>

              <h2 className="text-3xl font-bold mt-2">
                ₹
                {summary?.total_amount ?? 0}
              </h2>

            </div>

            <IndianRupee
              className="text-green-600"
              size={36}
            />

          </div>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <div className="flex justify-between">

            <div>

              <p className="text-gray-500">
                Payments Received
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {summary?.count ?? 0}
              </h2>

            </div>

            <Wallet
              className="text-blue-600"
              size={36}
            />

          </div>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <div className="flex justify-between">

            <div>

              <p className="text-gray-500">
                Principal
              </p>

              <h2 className="text-3xl font-bold mt-2">
                ₹
                {summary?.principal ?? 0}
              </h2>

            </div>

            <Clock
              className="text-orange-500"
              size={36}
            />

          </div>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <div className="flex justify-between">

            <div>

              <p className="text-gray-500">
                Interest
              </p>

              <h2 className="text-3xl font-bold mt-2">
                ₹
                {summary?.interest ?? 0}
              </h2>

            </div>

            <AlertTriangle
              className="text-red-500"
              size={36}
            />

          </div>

        </div>

      </div>

      {/* Table */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="px-6 py-4 border-b">

          <h2 className="text-xl font-semibold">
            Recent Collections
          </h2>

        </div>

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-3 text-left">
                Payment No
              </th>

              <th className="p-3 text-left">
                Loan ID
              </th>

              <th className="p-3 text-left">
                Amount
              </th>

              <th className="p-3 text-left">
                Due Date
              </th>

              <th className="p-3 text-left">
                Payment Date
              </th>

              <th className="p-3 text-left">
                Status
              </th>

            </tr>

          </thead>

          <tbody>
                        {loading ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-10"
                >
                  Loading collections...
                </td>
              </tr>
            ) : collections.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-10 text-gray-500"
                >
                  No collections found.
                </td>
              </tr>
            ) : (
              collections.map((item) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3 font-medium">
                    {item.payment_number}
                  </td>

                  <td className="p-3">
                    {item.loan_number ?? item.loan_id}
                  </td>

                  <td className="p-3">
                    ₹
                    {Number(item.amount).toLocaleString()}
                  </td>

                  <td className="p-3">
                    {item.due_date}
                  </td>

                  <td className="p-3">
                    {item.payment_date ?? "-"}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : item.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}

        <div className="flex justify-between items-center p-4 border-t">

          <button
            disabled={page === 1}
            onClick={() =>
              setPage((p) => p - 1)
            }
            className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
          >
            Previous
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() =>
              setPage((p) => p + 1)
            }
            className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>

        </div>

      </div>

    </div>
  );
};

export default Collections;