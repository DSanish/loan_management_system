import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  BadgeDollarSign,
  Calendar,
  FileText,
} from "lucide-react";

const CustomerDetails = () => {
  const { id } = useParams();

  // Temporary Dummy Data
  const customer = {
    id,
    name: "Rahul Sharma",
    phone: "9876543210",
    email: "rahul@gmail.com",
    address: "Patna, Bihar",
    loanAmount: "₹2,50,000",
    loanType: "Personal Loan",
    status: "Active",
    joinDate: "12 Jan 2026",
    emi: "₹8,450",
    tenure: "36 Months",
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Customer Details
          </h1>

          <p className="text-gray-500">
            View complete customer information
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

      {/* Customer Card */}
      <div className="bg-white rounded-xl shadow-md p-6">

        <div className="flex items-center gap-4 mb-8">

          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
            <User size={40} className="text-blue-600" />
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              {customer.name}
            </h2>

            <p className="text-gray-500">
              Customer ID : #{customer.id}
            </p>
          </div>

        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="flex items-center gap-3">
            <Phone className="text-blue-600" />
            <div>
              <p className="text-gray-500 text-sm">
                Phone
              </p>
              <p>{customer.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="text-blue-600" />
            <div>
              <p className="text-gray-500 text-sm">
                Email
              </p>
              <p>{customer.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="text-blue-600" />
            <div>
              <p className="text-gray-500 text-sm">
                Address
              </p>
              <p>{customer.address}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <BadgeDollarSign className="text-green-600" />
            <div>
              <p className="text-gray-500 text-sm">
                Loan Amount
              </p>
              <p>{customer.loanAmount}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FileText className="text-purple-600" />
            <div>
              <p className="text-gray-500 text-sm">
                Loan Type
              </p>
              <p>{customer.loanType}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="text-orange-600" />
            <div>
              <p className="text-gray-500 text-sm">
                Joined
              </p>
              <p>{customer.joinDate}</p>
            </div>
          </div>

        </div>

      </div>

      {/* Loan Information */}
      <div className="bg-white rounded-xl shadow-md p-6">

        <h2 className="text-xl font-semibold mb-6">
          Loan Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-gray-500 text-sm">
              EMI Amount
            </p>

            <h3 className="text-2xl font-bold text-blue-700 mt-2">
              {customer.emi}
            </h3>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-gray-500 text-sm">
              Loan Status
            </p>

            <h3 className="text-2xl font-bold text-green-700 mt-2">
              {customer.status}
            </h3>
          </div>

          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-gray-500 text-sm">
              Tenure
            </p>

            <h3 className="text-2xl font-bold text-orange-700 mt-2">
              {customer.tenure}
            </h3>
          </div>

        </div>

      </div>

    </div>
  );
};

export default CustomerDetails;