import { Link } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";

const NewLoan = () => {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            New Loan
          </h1>

          <p className="text-gray-500">
            Create a new loan application
          </p>
        </div>

        <Link
          to="/loans"
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
        >
          <ArrowLeft size={18} />
          Back
        </Link>

      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-md p-8 text-center">

        <Plus
          size={60}
          className="mx-auto text-blue-600 mb-4"
        />

        <h2 className="text-2xl font-semibold">
          Create New Loan
        </h2>

        <p className="mt-3 text-gray-600">
          Loan application form will be available here.
        </p>

      </div>

    </div>
  );
};

export default NewLoan;