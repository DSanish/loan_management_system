import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";

import CustomerTable from "../../components/customers/CustomerTable";
import { getCustomers } from "../../api/customerApi";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCustomers = async () => {
    try {
      const data = await getCustomers();

      if (Array.isArray(data)) {
        setCustomers(data);
      } else if (Array.isArray(data.items)) {
        setCustomers(data.items);
      } else {
        setCustomers([]);
      }
    } catch (err) {
      console.error(err);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  return (
    <div className="space-y-6">

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
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
        >
          <Plus size={18} />
          Add Customer
        </Link>

      </div>

      <div className="bg-white p-4 rounded-xl shadow">

        <div className="flex items-center border rounded-lg px-4 py-2">

          <Search
            size={20}
            className="text-gray-400"
          />

          <input
            type="text"
            placeholder="Search customer..."
            className="w-full ml-3 outline-none"
          />

        </div>

      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          Loading Customers...
        </div>
      ) : (
        <CustomerTable customers={customers} />
      )}

    </div>
  );
};

export default CustomerList;