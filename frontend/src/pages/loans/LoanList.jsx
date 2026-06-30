import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const LoanList = () => {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Loan List
          </h1>

          <p className="text-gray-500">
            Manage all loan applications
          </p>
        </div>

        <Link
          to="/loans/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={18} />
          New Loan
        </Link>

      </div>

      {/* Temporary Content */}
      <div className="bg-white rounded-xl shadow-md p-8 text-center">

        <h2 className="text-2xl font-semibold">
          Loan List
        </h2>

        <p className="mt-3 text-gray-600">
          Loan Management page is under development.
        </p>

      </div>

    </div>
  );
};

export default LoanList;