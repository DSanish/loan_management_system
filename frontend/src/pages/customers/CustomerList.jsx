import { Link } from "react-router-dom";
import { Plus, Search, Eye, Pencil, Trash2 } from "lucide-react";
import CustomerTable from "../../components/customers/CustomerTable";

const customers = [
  {
    id: 1,
    name: "Rahul Sharma",
    phone: "9876543210",
    email: "rahul@gmail.com",
    loan: "₹2,50,000",
    status: "Active",
  },
  {
    id: 2,
    name: "Amit Kumar",
    phone: "9123456789",
    email: "amit@gmail.com",
    loan: "₹1,80,000",
    status: "Pending",
  },
  {
    id: 3,
    name: "Priya Singh",
    phone: "9988776655",
    email: "priya@gmail.com",
    loan: "₹3,20,000",
    status: "Closed",
  },
];

const CustomerList = () => {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Customers
          </h1>

          <p className="text-gray-500">
            Manage all registered customers
          </p>
        </div>

        <Link
          to="/customers/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition"
        >
          <Plus size={18} />
          Add Customer
        </Link>

      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow">

        <div className="flex items-center border rounded-lg px-4 py-2">

          <Search size={20} className="text-gray-400" />

          <input
            type="text"
            placeholder="Search customer..."
            className="w-full ml-3 outline-none"
          />

        </div>

      </div>

      {/* Table */}
       <CustomerTable customers={customers} />

    </div>
  );
};

export default CustomerList;