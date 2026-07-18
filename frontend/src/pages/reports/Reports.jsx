import { useState } from "react";
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

const Reports = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

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
                0
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
                0
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
                ₹0
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
                0
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