import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";

const CustomerTable = ({
  customers = [],
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">

      <table className="w-full">

        <thead className="bg-gray-100">

          <tr>

            <th className="text-left px-6 py-4">
              Customer No.
            </th>

            <th className="text-left px-6 py-4">
              Name
            </th>

            <th className="text-left px-6 py-4">
              Phone
            </th>

            <th className="text-left px-6 py-4">
              Email
            </th>

            <th className="text-left px-6 py-4">
              Status
            </th>

            <th className="text-center px-6 py-4">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {customers.length === 0 ? (

            <tr>

              <td
                colSpan="6"
                className="text-center py-8 text-gray-500"
              >
                No Customers Found
              </td>

            </tr>

          ) : (

            customers.map((customer) => (

              <tr
                key={customer.id}
                className="border-t hover:bg-gray-50"
              >

                <td className="px-6 py-4">
                  {customer.customer_number}
                </td>

               <td className="px-6 py-4 font-medium">
                  {[customer.first_name, customer.last_name]
                  .filter(Boolean)
                  .join(" ")}
               </td>

                <td className="px-6 py-4">
                  {customer.phone}
                </td>

                <td className="px-6 py-4">
                  {customer.email}
                </td>

                <td className="px-6 py-4">

                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      customer.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {customer.is_active
                      ? "Active"
                      : "Inactive"}
                  </span>

                </td>

                <td className="px-6 py-4">

                  <div className="flex justify-center gap-3">

                    <Link
                      to={`/customers/${customer.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye size={18} />
                    </Link>

                    <Link
                      to={`/customers/${customer.id}/edit`}
                      className="text-green-600 hover:text-green-800"
                    >
                      <Pencil size={18} />
                    </Link>

                    <button
                      onClick={() =>
                        onDelete?.(customer.id)
                      }
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
  );
};

export default CustomerTable;