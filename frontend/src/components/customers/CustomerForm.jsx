import { Save } from "lucide-react";

const CustomerForm = ({
  initialValues = {},
  onSubmit,
  loading = false,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-8">

      {/* ================= Personal Information ================= */}

      <div>
        <h2 className="text-xl font-semibold mb-6">
          Personal Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label className="block mb-2 font-medium">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              defaultValue={initialValues.name || ""}
              placeholder="Enter full name"
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              defaultValue={initialValues.phone || ""}
              placeholder="Enter phone number"
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              defaultValue={initialValues.email || ""}
              placeholder="Enter email"
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Date of Birth
            </label>

            <input
              type="date"
              name="dob"
              defaultValue={initialValues.dob || ""}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

        </div>
      </div>

      {/* ================= Address ================= */}

      <div>

        <h2 className="text-xl font-semibold mb-6">
          Address
        </h2>

        <textarea
          rows="4"
          name="address"
          defaultValue={initialValues.address || ""}
          placeholder="Enter complete address"
          className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
        />

      </div>

      {/* ================= Loan Information ================= */}

      <div>

        <h2 className="text-xl font-semibold mb-6">
          Loan Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div>

            <label className="block mb-2 font-medium">
              Loan Type
            </label>

            <select
              name="loanType"
              defaultValue={initialValues.loanType || ""}
              className="w-full border rounded-lg px-4 py-3"
            >
              <option value="">Select Loan Type</option>
              <option value="Personal Loan">Personal Loan</option>
              <option value="Home Loan">Home Loan</option>
              <option value="Business Loan">Business Loan</option>
              <option value="Education Loan">Education Loan</option>
              <option value="Vehicle Loan">Vehicle Loan</option>
            </select>

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Loan Amount
            </label>

            <input
              type="number"
              name="loanAmount"
              defaultValue={initialValues.loanAmount || ""}
              placeholder="Enter amount"
              className="w-full border rounded-lg px-4 py-3"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Loan Tenure (Months)
            </label>

            <input
              type="number"
              name="loanTenure"
              defaultValue={initialValues.loanTenure || ""}
              placeholder="Enter tenure"
              className="w-full border rounded-lg px-4 py-3"
            />

          </div>

        </div>

      </div>

      {/* ================= Buttons ================= */}

      <div className="flex justify-end">

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg disabled:opacity-50"
        >
          <Save size={18} />

          {loading ? "Saving..." : "Save Customer"}

        </button>

      </div>

    </form>
  );
};

export default CustomerForm;