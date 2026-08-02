import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CustomerForm from "../../components/customers/CustomerForm";
import customerService from "../../services/customerService";
import { useState } from "react";

const AddCustomer = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    console.log("CUSTOMER DATA:", formData);

    try {
      setLoading(true);

      // Create customer
      const response = await customerService.createCustomer({
        first_name: formData.name?.split(" ")[0] || "",
        last_name: formData.name?.split(" ").slice(1).join(" ") || "Customer",
        phone: formData.phone,
        email: formData.email || null,
        date_of_birth: formData.dob || null,
        address_line1: formData.address || null,
        country: "India",
      });

      console.log("CUSTOMER CREATED:", response);

      alert("Customer created successfully!");

      navigate("/customers");

    } catch (error) {
      console.error("CREATE CUSTOMER ERROR:", error);

      alert(
        error?.message ||
        error?.detail ||
        "Unable to create customer."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}

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

      {/* Customer Form */}

      <div className="bg-white rounded-xl shadow-md p-8">

        <CustomerForm
          onSubmit={handleSubmit}
          loading={loading}
        />

      </div>

    </div>
  );
};

export default AddCustomer;