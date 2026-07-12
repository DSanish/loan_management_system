import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";

import { getPaymentById } from "../../api/paymentApi";

const PaymentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayment();
  }, []);

  const loadPayment = async () => {
    try {
      const data = await getPaymentById(id);
      setPayment(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load payment.");
      navigate("/payments");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center">
        Loading Payment...
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center">
        Payment Not Found
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">
            Payment Details
          </h1>

          <p className="text-gray-500">
            View Payment Information
          </p>

        </div>

        <div className="flex gap-3">

          <Link
            to="/payments"
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Back
          </Link>

          <Link
            to={`/payments/edit/${payment.id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Pencil size={18} />
            Edit
          </Link>

        </div>

      </div>

      {/* Details Card */}

      <div className="bg-white rounded-xl shadow p-8">

        <div className="grid grid-cols-2 gap-6">

          <div>
            <p className="text-gray-500">Payment ID</p>
            <h3 className="text-xl font-semibold">
              {payment.id}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">Payment Number</p>
            <h3 className="text-xl font-semibold">
              {payment.payment_number}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">Loan ID</p>
            <h3 className="text-xl font-semibold">
              {payment.loan_id}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">Installment</p>
            <h3 className="text-xl font-semibold">
              {payment.installment_number}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">Amount</p>
            <h3 className="text-xl font-semibold">
              ₹ {payment.amount}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">Principal Paid</p>
            <h3 className="text-xl font-semibold">
              ₹ {payment.principal_paid}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">Interest Paid</p>
            <h3 className="text-xl font-semibold">
              ₹ {payment.interest_paid}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">Late Fee</p>
            <h3 className="text-xl font-semibold">
              ₹ {payment.late_fee}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">Due Date</p>
            <h3 className="text-xl font-semibold">
              {payment.due_date}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">Payment Date</p>
            <h3 className="text-xl font-semibold">
              {payment.payment_date || "-"}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">Status</p>
            <h3 className="text-xl font-semibold capitalize">
              {payment.status}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">Payment Method</p>
            <h3 className="text-xl font-semibold">
              {payment.payment_method || "-"}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">Transaction Reference</p>
            <h3 className="text-xl font-semibold break-all">
              {payment.transaction_reference || "-"}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">Days Overdue</p>
            <h3 className="text-xl font-semibold">
              {payment.days_overdue}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">Waiver Amount</p>
            <h3 className="text-xl font-semibold">
              ₹ {payment.waiver_amount}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">Created At</p>
            <h3 className="text-xl font-semibold">
              {payment.created_at}
            </h3>
          </div>

        </div>

      </div>

    </div>
  );
};

export default PaymentDetails;