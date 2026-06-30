import {
  Users,
  BadgeDollarSign,
  CreditCard,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    title: "Total Customers",
    value: "1,248",
    icon: Users,
    color: "bg-blue-500",
  },
  {
    title: "Active Loans",
    value: "856",
    icon: BadgeDollarSign,
    color: "bg-green-500",
  },
  {
    title: "Monthly Collection",
    value: "₹12.8 Lakh",
    icon: CreditCard,
    color: "bg-orange-500",
  },
  {
    title: "Recovery Rate",
    value: "98.4%",
    icon: TrendingUp,
    color: "bg-purple-500",
  },
];

const Dashboard = () => {
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

        {stats.map((item) => {
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
                <Icon className="text-white" size={28} />
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
            <span>New Customer Registered</span>
            <span className="text-gray-500">
              5 minutes ago
            </span>
          </div>

          <div className="flex justify-between border-b pb-3">
            <span>Loan Approved</span>
            <span className="text-gray-500">
              15 minutes ago
            </span>
          </div>

          <div className="flex justify-between border-b pb-3">
            <span>EMI Payment Received</span>
            <span className="text-gray-500">
              1 hour ago
            </span>
          </div>

          <div className="flex justify-between">
            <span>Monthly Report Generated</span>
            <span className="text-gray-500">
              Today
            </span>
          </div>

        </div>

      </div>

      {/* Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-xl shadow-md p-6 h-80 flex items-center justify-center">
          <p className="text-gray-400 text-lg">
            Loan Analytics Chart (Coming Soon)
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 h-80 flex items-center justify-center">
          <p className="text-gray-400 text-lg">
            Payment Statistics (Coming Soon)
          </p>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;