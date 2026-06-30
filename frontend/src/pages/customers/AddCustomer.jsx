import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CustomerForm from "../../components/customers/CustomerForm";

const AddCustomer = () => {

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Customer Saved");
  };

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">
            Add Customer
          </h1>

          <p className="text-gray-500">
            Register a new customer
          </p>

        </div>

        <Link
          to="/customers"
          className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-lg"
        >
          <ArrowLeft size={18} />
          Back
        </Link>

      </div>

      <div className="bg-white rounded-xl shadow-md p-8">

        <CustomerForm onSubmit={handleSubmit} />

      </div>

    </div>
  );
};

export default AddCustomer;