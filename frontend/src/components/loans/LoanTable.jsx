import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";

const LoanTable = ({ loans = [], onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full">

        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-4 text-left">Loan No.</th>
            <th className="px-6 py-4 text-left">Customer</th>
            <th className="px-6 py-4 text-left">Type</th>
            <th className="px-6 py-4 text-left">Amount</th>
            <th className="px-6 py-4 text-left">Interest</th>
            <th className="px-6 py-4 text-left">Status</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>

          {loans.length === 0 ? (
            <tr>
              <td
                colSpan="7"
                className="text-center py-8 text-gray-500"
              >
                No Loans Found
              </td>
            </tr>
          ) : (

            loans.map((loan) => (

              <tr
                key={loan.id}
                className="border-t hover:bg-gray-50"
              >

                <td className="px-6 py-4">
                  {loan.loan_number}
                </td>

                <td className="px-6 py-4">
                  {loan.customer_name || "-"}
                </td>

                <td className="px-6 py-4">
                  {loan.loan_type}
                </td>

                <td className="px-6 py-4">
                  ₹{loan.principal_amount}
                </td>

                <td className="px-6 py-4">
                  {loan.interest_rate}%
                </td>

                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                    {loan.status}
                  </span>
                </td>

                <td className="px-6 py-4 flex justify-center gap-3">

                  <Link
                    to={`/loans/${loan.id}`}
                  >
                    <Eye
                      size={18}
                      className="text-blue-600"
                    />
                  </Link>

                  <Link
                    to={`/loans/edit/${loan.id}`}
                  >
                    <Pencil
                      size={18}
                      className="text-green-600"
                    />
                  </Link>

                  <button
                    onClick={() => onDelete?.(loan.id)}
                  >
                    <Trash2
                      size={18}
                      className="text-red-600"
                    />
                  </button>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>
    </div>
  );
};

export default LoanTable;