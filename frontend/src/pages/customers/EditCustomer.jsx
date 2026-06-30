import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CustomerForm from "../../components/customers/CustomerForm";

const EditCustomer = () => {
  const { id } = useParams();

  // Temporary Dummy Data
  // Later replace with API call
  const customer = {
    id,
    name: "Rahul Sharma",
    phone: "9876543210",
    email: "rahul@gmail.com",
    dob: "1998-05-15",
    address: "Patna, Bihar",
    loanType: "Personal Loan",
    loanAmount: 250000,
    loanTenure: 36,
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    // Later connect to FastAPI
    console.log("Customer Updated");
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Edit Customer
          </h1>

          <p className="text-gray-500">
            Update customer information
          </p>
        </div>

        <Link
          to="/customers"
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
        >
          <ArrowLeft size={18} />
          Back
        </Link>

      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-md p-8">

        <CustomerForm
          initialValues={customer}
          onSubmit={handleUpdate}
        />

      </div>

    </div>
  );
};

export default EditCustomer;