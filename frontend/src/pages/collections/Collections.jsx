import {
  Wallet,
  IndianRupee,
  Clock,
  AlertTriangle,
} from "lucide-react";

const Collections = () => {
  return (
    <div className="space-y-6">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold">
          Collections
        </h1>

        <p className="text-gray-500 mt-1">
          Monitor all loan collections and overdue payments.
        </p>
      </div>

      {/* Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-white rounded-xl shadow p-6">

          <div className="flex justify-between">

            <div>

              <p className="text-gray-500">
                Today's Collection
              </p>

              <h2 className="text-3xl font-bold mt-2">
                ₹0
              </h2>

            </div>

            <IndianRupee
              className="text-green-600"
              size={38}
            />

          </div>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <div className="flex justify-between">

            <div>

              <p className="text-gray-500">
                Monthly Collection
              </p>

              <h2 className="text-3xl font-bold mt-2">
                ₹0
              </h2>

            </div>

            <Wallet
              className="text-blue-600"
              size={38}
            />

          </div>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <div className="flex justify-between">

            <div>

              <p className="text-gray-500">
                Pending Collection
              </p>

              <h2 className="text-3xl font-bold mt-2">
                ₹0
              </h2>

            </div>

            <Clock
              className="text-orange-500"
              size={38}
            />

          </div>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <div className="flex justify-between">

            <div>

              <p className="text-gray-500">
                Overdue Amount
              </p>

              <h2 className="text-3xl font-bold mt-2">
                ₹0
              </h2>

            </div>

            <AlertTriangle
              className="text-red-600"
              size={38}
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
                Loan No
              </th>

              <th className="p-3 text-left">
                Customer
              </th>

              <th className="p-3 text-left">
                Amount
              </th>

              <th className="p-3 text-left">
                Due Date
              </th>

              <th className="p-3 text-left">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            <tr>

              <td
                colSpan="6"
                className="text-center py-10 text-gray-500"
              >
                No Collection Data Available
              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Collections;