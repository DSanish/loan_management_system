// import {
//   Users,
//   BadgeDollarSign,
//   CreditCard,
//   TrendingUp,
// } from "lucide-react";

// const stats = [
//   {
//     title: "Total Customers",
//     value: "1,248",
//     icon: Users,
//     color: "bg-blue-500",
//   },
//   {
//     title: "Active Loans",
//     value: "856",
//     icon: BadgeDollarSign,
//     color: "bg-green-500",
//   },
//   {
//     title: "Monthly Collection",
//     value: "₹12.8 Lakh",
//     icon: CreditCard,
//     color: "bg-orange-500",
//   },
//   {
//     title: "Recovery Rate",
//     value: "98.4%",
//     icon: TrendingUp,
//     color: "bg-purple-500",
//   },
// ];

// const Dashboard = () => {
//   return (
//     <div className="space-y-8">

//       {/* Heading */}
//       <div>
//         <h1 className="text-3xl font-bold text-gray-800">
//           Dashboard
//         </h1>

//         <p className="text-gray-500 mt-1">
//           Welcome to the Loan Management System Dashboard
//         </p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

//         {stats.map((item) => {
//           const Icon = item.icon;

//           return (
//             <div
//               key={item.title}
//               className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between"
//             >
//               <div>
//                 <p className="text-gray-500 text-sm">
//                   {item.title}
//                 </p>

//                 <h2 className="text-3xl font-bold mt-2">
//                   {item.value}
//                 </h2>
//               </div>

//               <div
//                 className={`${item.color} w-14 h-14 rounded-full flex items-center justify-center`}
//               >
//                 <Icon className="text-white" size={28} />
//               </div>
//             </div>
//           );
//         })}

//       </div>

//       {/* Recent Activity */}
//       <div className="bg-white rounded-xl shadow-md p-6">

//         <h2 className="text-xl font-semibold mb-4">
//           Recent Activity
//         </h2>

//         <div className="space-y-4">

//           <div className="flex justify-between border-b pb-3">
//             <span>New Customer Registered</span>
//             <span className="text-gray-500">
//               5 minutes ago
//             </span>
//           </div>

//           <div className="flex justify-between border-b pb-3">
//             <span>Loan Approved</span>
//             <span className="text-gray-500">
//               15 minutes ago
//             </span>
//           </div>

//           <div className="flex justify-between border-b pb-3">
//             <span>EMI Payment Received</span>
//             <span className="text-gray-500">
//               1 hour ago
//             </span>
//           </div>

//           <div className="flex justify-between">
//             <span>Monthly Report Generated</span>
//             <span className="text-gray-500">
//               Today
//             </span>
//           </div>

//         </div>

//       </div>

//       {/* Placeholder */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

//         <div className="bg-white rounded-xl shadow-md p-6 h-80 flex items-center justify-center">
//           <p className="text-gray-400 text-lg">
//             Loan Analytics Chart (Coming Soon)
//           </p>
//         </div>

//         <div className="bg-white rounded-xl shadow-md p-6 h-80 flex items-center justify-center">
//           <p className="text-gray-400 text-lg">
//             Payment Statistics (Coming Soon)
//           </p>
//         </div>

//       </div>

//     </div>
//   );
// };

// export default Dashboard;

import { useEffect } from "react";
import {
  Users,
  BadgeDollarSign,
  CreditCard,
  TrendingUp,
} from "lucide-react";

import useDashboardStore from "../../store/dashboardStore";

const Dashboard = () => {
  const {
    stats,
    loading,
    error,
    fetchDashboardStats,
  } = useDashboardStore();

  useEffect(() => {
    fetchDashboardStats();
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-xl shadow-md p-6">

          <h2 className="text-xl font-semibold mb-4">
            Loan Summary
          </h2>

          <div className="space-y-3">

            <div className="flex justify-between">
              <span>Total Loans</span>
              <span>{stats?.total_loans ?? 0}</span>
            </div>

            <div className="flex justify-between">
              <span>Total Disbursed</span>
              <span>
                ₹{stats?.total_disbursed ?? 0}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Outstanding</span>
              <span>
                ₹{stats?.total_outstanding ?? 0}
              </span>
            </div>

          </div>

        </div>

        <div className="bg-white rounded-xl shadow-md p-6">

          <h2 className="text-xl font-semibold mb-4">
            Recovery Summary
          </h2>

          <div className="space-y-3">

            <div className="flex justify-between">
              <span>Total Collection</span>
              <span>
                ₹{stats?.total_collected ?? 0}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Collection Rate</span>
              <span>
                {stats?.collection_rate ?? 0}%
              </span>
            </div>

            <div className="flex justify-between">
              <span>NPA Rate</span>
              <span className="text-red-600">
                {stats?.npa_rate ?? 0}%
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;