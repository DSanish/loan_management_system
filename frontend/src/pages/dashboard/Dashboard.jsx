import { useEffect } from "react";
import {
  Users,
  BadgeDollarSign,
  CreditCard,
  TrendingUp,
} from "lucide-react";

import useDashboardStore from "../../store/dashboardStore";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const Dashboard = () => {
  const {
    stats,
  
    loanBreakdown,
    monthlyCollections,
    loanTypeDistribution,
    riskDistribution,
  
    loading,
    error,
  
    fetchDashboardStats,
    fetchLoanBreakdown,
    fetchMonthlyCollections,
    fetchLoanTypeDistribution,
    fetchRiskDistribution,
  
  } = useDashboardStore();

  useEffect(() => {
  
    fetchDashboardStats();
  
    fetchLoanBreakdown();
  
    fetchMonthlyCollections();
  
    fetchLoanTypeDistribution();
  
    fetchRiskDistribution();
  
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <h1 className="text-2xl font-semibold">
          Loading Dashboard...
        </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <h1 className="text-2xl text-red-600">
          {error}
        </h1>
      </div>
    );
  }

  const dashboardCards = [
    {
      title: "Total Customers",
      value: stats?.total_customers ?? 0,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Active Loans",
      value: stats?.active_loans ?? 0,
      icon: BadgeDollarSign,
      color: "bg-green-500",
    },
    {
      title: "Total Collection",
      value: `₹${stats?.total_collected ?? 0}`,
      icon: CreditCard,
      color: "bg-orange-500",
    },
    {
      title: "Collection Rate",
      value: `${stats?.collection_rate ?? 0}%`,
      icon: TrendingUp,
      color: "bg-purple-500",
    },
  ];

  const COLORS = [
  "#2563eb",
  "#16a34a",
  "#ea580c",
  "#9333ea",
  "#dc2626",
  "#0891b2",
];

  return (
    <div className="space-y-8">

      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Welcome to the Loan Management System Dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        {dashboardCards.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between"
            >
              <div>

                <p className="text-gray-500 text-sm">
                  {item.title}
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {item.value}
                </h2>

              </div>

              <div
                className={`${item.color} w-14 h-14 rounded-full flex items-center justify-center`}
              >
                <Icon
                  className="text-white"
                  size={28}
                />
              </div>

            </div>
          );
        })}

      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md p-6">

        <h2 className="text-xl font-semibold mb-4">
          Recent Activity
        </h2>

        <div className="space-y-4">

          <div className="flex justify-between border-b pb-3">
            <span>
              New Applications
            </span>

            <span className="font-semibold">
              {stats?.new_applications ?? 0}
            </span>
          </div>

          <div className="flex justify-between border-b pb-3">
            <span>
              Approvals Today
            </span>

            <span className="font-semibold">
              {stats?.approvals_today ?? 0}
            </span>
          </div>

          <div className="flex justify-between border-b pb-3">
            <span>
              Overdue Loans
            </span>

            <span className="font-semibold text-red-600">
              {stats?.overdue_loans ?? 0}
            </span>
          </div>

          <div className="flex justify-between">
            <span>
              New Customers This Month
            </span>

            <span className="font-semibold">
              {stats?.new_customers_this_month ?? 0}
            </span>
          </div>

        </div>

      </div>

    {/* Analytics */}

<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

  {/* Monthly Collections */}

  <div className="bg-white rounded-xl shadow-md p-6">

    <h2 className="text-xl font-semibold mb-4">
      Monthly Collections
    </h2>

    <ResponsiveContainer
      width="100%"
      height={300}
    >

      <LineChart
        data={monthlyCollections}
      >

        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey="month"
        />

        <YAxis />

        <Tooltip />

        <Legend />

        <Line
          type="monotone"
          dataKey="late_fees"
          stroke="#2563eb"
          strokeWidth={3}
        />

      </LineChart>

    </ResponsiveContainer>

  </div>

  {/* Loan Breakdown */}

  <div className="bg-white rounded-xl shadow-md p-6">

    <h2 className="text-xl font-semibold mb-4">
      Loan Status Distribution
    </h2>

    <ResponsiveContainer
      width="100%"
      height={300}
    >

      <PieChart>

        <Pie
          data={loanBreakdown}
          dataKey="count"
          nameKey="status"
          outerRadius={100}
          label
        >

          {loanBreakdown.map(
            (entry, index) => (

              <Cell
                key={index}
                fill={
                  COLORS[
                    index % COLORS.length
                  ]
                }
              />

            )
          )}

        </Pie>

        <Tooltip />

        <Legend />

      </PieChart>

    </ResponsiveContainer>

  </div>

  {/* Loan Type */}

  <div className="bg-white rounded-xl shadow-md p-6">

    <h2 className="text-xl font-semibold mb-4">
      Loan Type Distribution
    </h2>

    <ResponsiveContainer
      width="100%"
      height={300}
    >

      <PieChart>

        <Pie
          data={loanTypeDistribution}
          dataKey="count"
          nameKey="type"
          outerRadius={100}
          label
        >

          {loanTypeDistribution.map(
            (entry, index) => (

              <Cell
                key={index}
                fill={
                  COLORS[
                    index % COLORS.length
                  ]
                }
              />

            )
          )}

        </Pie>

        <Tooltip />

        <Legend />

      </PieChart>

    </ResponsiveContainer>

  </div>

  {/* Risk Distribution */}

  <div className="bg-white rounded-xl shadow-md p-6">

    <h2 className="text-xl font-semibold mb-4">
      Risk Distribution
    </h2>

    <ResponsiveContainer
      width="100%"
      height={300}
    >

      <PieChart>

        <Pie
          data={riskDistribution}
          dataKey="count"
          nameKey="grade"
          outerRadius={100}
          label
        >

          {riskDistribution.map(
            (entry, index) => (

              <Cell
                key={index}
                fill={
                  COLORS[
                    index % COLORS.length
                  ]
                }
              />

            )
          )}

        </Pie>

        <Tooltip />

        <Legend />

      </PieChart>

    </ResponsiveContainer>

  </div>

</div>

    </div>
  );
};

export default Dashboard;