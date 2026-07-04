import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";

import CustomerTable from "../../components/customers/CustomerTable";
import useCustomerStore from "../../store/customerStore";

const CustomerList = () => {
  const {
    customers,
    loading,
    error,
    search,
    setSearch,
    fetchCustomers,
    deleteCustomer,
  } = useCustomerStore();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = () => {
    fetchCustomers({
      q: search,
      page: 1,
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to deactivate this customer?"
    );

    if (!confirmDelete) return;

    await deleteCustomer(id);
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-xl">
        Loading Customers...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600">
        {error}
      </div>
    );
  }

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
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
        >
          <Plus size={18} />
          Add Customer
        </Link>

      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow">

        <div className="flex items-center border rounded-lg px-4 py-2">

          <Search
            size={20}
            className="text-gray-400"
          />

          <input
            type="text"
            placeholder="Search customer..."
            value={search}
            onChange={handleSearch}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchSubmit();
              }
            }}
            className="w-full ml-3 outline-none"
          />

        </div>

      </div>

      {/* Table */}

      <CustomerTable
        customers={customers}
        onDelete={handleDelete}
      />

      {/* Footer */}

      <div className="text-gray-500 text-sm">

        Total Customers : {customers.length}

      </div>

    </div>
  );
};

export default CustomerList;