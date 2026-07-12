import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Eye, pencil, trash2 } from "lucide-react";

import { getPayments } from "../../api/paymentApi";

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const res = await getPayments();

      // Backend may return {items:[...]} or [...]
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

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-8">
        Loading Payments...
      </div>
    );
  }

  return (
    <div className="space-y-6">

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
          <Plus size={18}/>
          New Payment
        </Link>

      </div>

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
                  colSpan="6"
                  className="text-center py-10"
                >
                  No Payments Found
                </td>
              </tr>

            ) : (

              payments.map((payment) => (

                <tr
                  key={payment.id}
                  className="border-t"
                >

                  <td className="p-3">
                    {payment.id}
                  </td>

                  <td className="p-3">
                    {payment.loan?.loan_number}
                  </td>

                  <td className="p-3">
                    ₹ {payment.amount}
                  </td>

                  <td className="p-3">
                    {payment.status}
                  </td>

                  <td className="p-3">
                    {payment.due_date}
                  </td>

                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-3">

                      <Link
                        to={`/payments/${payment.id}`}
                        className="text-blue-600"
                      >
                        <Eye size={18}/>
                      </Link>

                      <Link
                          to={`/payments/edit/${payment.id}`}
                          className="text-green-600"
                      >
                        <Pencil size={18}/>

                      </Link>
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