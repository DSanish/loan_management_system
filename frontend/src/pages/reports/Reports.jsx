import { FileText, Download } from "lucide-react";

const Reports = () => {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Reports
          </h1>

          <p className="text-gray-500">
            View and export loan reports
          </p>
        </div>

        <button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <Download size={18} />
          Export Report
        </button>

      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-md p-10 text-center">

        <FileText
          size={60}
          className="mx-auto text-blue-600 mb-4"
        />

        <h2 className="text-2xl font-semibold">
          Reports Dashboard
        </h2>

        <p className="mt-3 text-gray-600">
          Loan reports and analytics will appear here.
        </p>

      </div>

    </div>
  );
};

export default Reports;