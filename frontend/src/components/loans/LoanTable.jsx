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
                  {loan.customer
                    ? `${loan.customer.first_name} ${loan.customer.last_name}`
                    : "-"}
               </td>

                <td className="px-6 py-4">
                  {loan.loan_type}
                </td>

                <td className="px-6 py-4">
                  ₹{Number(loan.principal_amount).toLocaleString()}
                </td>

                <td className="px-6 py-4">
                  {Number(loan.interest_rate).toFixed(2)}%
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      loan.status === "active"
                        ? "bg-green-100 text-green-700"
                        : loan.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                 }`}
                >
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