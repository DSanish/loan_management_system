import { useEffect, useState } from "react";
import useReportStore from "../../store/reportStore";
import {
  FileText,
  Download,
  Search,
  Filter,
  Users,
  Landmark,
  IndianRupee,
  AlertTriangle,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const Reports = () => {
  const {dashboard,loans, monthlyLoans,loading,fetchDashboard,fetchLoans,fetchMonthlyLoans,} = useReportStore();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  useEffect(() => {
  fetchDashboard();
  fetchLoans();
  fetchMonthlyLoans();
  }, [fetchDashboard, fetchLoans,fetchMonthlyLoans]);

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Reports
          </h1>

          <p className="text-gray-500">
            View reports, analytics and export data
          </p>

        </div>

        <button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <Download size={18} />
          Export Report
        </button>

      </div>

      {/* Summary Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-white rounded-xl shadow p-6">

          <div className="flex justify-between">

            <div>

              <p className="text-gray-500">
                Total Customers
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {loading ? "..." : dashboard?.total_customers ?? 0}
              </h2>

            </div>

            <Users
              size={38}
              className="text-blue-600"
            />

          </div>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <div className="flex justify-between">

            <div>

              <p className="text-gray-500">
                Total Loans
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {loading ? "..." : dashboard?.total_loans ?? 0}
              </h2>

            </div>

            <Landmark
              size={38}
              className="text-green-600"
            />

          </div>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <div className="flex justify-between">

            <div>

              <p className="text-gray-500">
                Total Collection
              </p>

              <h2 className="text-3xl font-bold mt-2">
                  ₹{loading
                   ? "..."
                   : Number(dashboard?.total_collection ?? 0).toLocaleString()}
              </h2>

            </div>

            <IndianRupee
              size={38}
              className="text-orange-500"
            />

          </div>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <div className="flex justify-between">

            <div>

              <p className="text-gray-500">
                Overdue Loans
              </p>

              <h2 className="text-3xl font-bold mt-2">
                   ₹{loading
                    ? "..."
                    : Number(dashboard?.overdue ?? 0).toLocaleString()}
                
              </h2>

            </div>

            <AlertTriangle
              size={38}
              className="text-red-600"
            />

          </div>

        </div>

      </div>

      {/* Filters */}

      <div className="bg-white rounded-xl shadow p-5">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="relative">

            <Search
              size={18}
              className="absolute left-3 top-3 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search customer / loan..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full border rounded-lg pl-10 pr-4 py-2"
            />

          </div>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="border rounded-lg px-4 py-2"
          >
            <option value="">
              All Status
            </option>

            <option value="active">
              Active
            </option>

            <option value="closed">
              Closed
            </option>

            <option value="defaulted">
              Defaulted
            </option>

          </select>

          <button
            className="bg-gray-800 text-white rounded-lg flex items-center justify-center gap-2"
          >
            <Filter size={18} />
            Apply Filter
          </button>

        </div>

      </div>

      {/* Report Table */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="px-6 py-4 border-b">

          <h2 className="text-xl font-semibold">
            Loan Reports
          </h2>

        </div>

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-3 text-left">
                Loan No
              </th>

              <th className="p-3 text-left">
                Customer
              </th>

              <th className="p-3 text-left">
                Loan Amount
              </th>

              <th className="p-3 text-left">
                Paid
              </th>

              <th className="p-3 text-left">
                Outstanding
              </th>

              <th className="p-3 text-left">
                Status
              </th>

            </tr>

          </thead>

          <tbody>
              {loans.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-12 text-gray-500"
                  >
                    No report data available.
                  </td>
                </tr>
              ) : (
                loans.map((loan) => (
                  <tr
                    key={loan.id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-3">{loan.loan_number}</td>
            
                    <td className="p-3">{loan.customer}</td>
            
                    <td className="p-3">
                      ₹{Number(loan.loan_amount).toLocaleString()}
                    </td>
            
                    <td className="p-3">
                      ₹{Number(loan.paid).toLocaleString()}
                    </td>
            
                    <td className="p-3">
                      ₹{Number(loan.outstanding).toLocaleString()}
                    </td>
            
                    <td className="p-3">
                      {loan.status.replace("LoanStatus.", "")}
                    </td>
                  </tr>
                ))
              )}
                

          </tbody>

        </table>

        {/* Pagination */}

        <div className="flex items-center justify-between px-6 py-4 border-t">

          <button
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            disabled
          >
            Previous
          </button>

          <span className="text-gray-600">
            Page 1 of 1
          </span>

          <button
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            disabled
          >
            Next
          </button>

        </div>

      </div>

      {/* Analytics Section */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-xl shadow p-6">

          <h3 className="text-lg font-semibold mb-4">
            Monthly Loan Trend
          </h3>

         <div className="h-64">
           <ResponsiveContainer width="100%" height="100%">
             <LineChart data={monthlyLoans}>
               <CartesianGrid strokeDasharray="3 3" />
         
               <XAxis dataKey="month" />
         
               <YAxis />
         
               <Tooltip />
         
               <Line
                 type="monotone"
                 dataKey="loans"
                 stroke="#2563eb"
                 strokeWidth={3}
               />
             </LineChart>
           </ResponsiveContainer>
         </div>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <h3 className="text-lg font-semibold mb-4">
            Collection Analytics
          </h3>

          <div className="h-64 flex items-center justify-center border rounded-lg text-gray-400">
            Chart will be displayed here
          </div>

        </div>

      </div>

      {/* Quick Reports */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-semibold mb-5">
          Quick Reports
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

          <button className="border rounded-lg p-5 hover:bg-gray-50 transition">
            📄 Customer Report
          </button>

          <button className="border rounded-lg p-5 hover:bg-gray-50 transition">
            💰 Loan Report
          </button>

          <button className="border rounded-lg p-5 hover:bg-gray-50 transition">
            💳 Payment Report
          </button>

          <button className="border rounded-lg p-5 hover:bg-gray-50 transition">
            📊 Collection Report
          </button>

        </div>

      </div>

    </div>
  );
};

export default Reports;