import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const PaymentList = () => {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Payment List
          </h1>

          <p className="text-gray-500">
            Manage loan payments
          </p>
        </div>

        <Link
          to="/payments/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={18} />
          New Payment
        </Link>

      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-md p-8 text-center">

        <Plus
          size={60}
          className="mx-auto text-blue-600 mb-4"
        />

        <h2 className="text-2xl font-semibold">
          Payment List
        </h2>

        <p className="mt-3 text-gray-600">
          Payment management page is under development.
        </p>

      </div>

    </div>
  );
};

export default PaymentList;