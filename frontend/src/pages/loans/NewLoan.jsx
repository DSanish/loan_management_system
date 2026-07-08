import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { createLoan } from "../../api/loanApi";
import { getCustomers } from "../../api/customerApi";

const NewLoan = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);

  const [form, setForm] = useState({
    customer_id: "",
    loan_type: "personal",
    principal_amount: "",
    interest_rate: "",
    tenure_months: "",
    purpose: "",
    collateral_type: "",
    collateral_value: "",
    collateral_description: "",
    processing_fee: 0,
    insurance_amount: 0,
    assigned_officer_id: "",
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await getCustomers();

      if (Array.isArray(data.items)) {
        setCustomers(data.items);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createLoan({
        ...form,
        customer_id: Number(form.customer_id),
        principal_amount: Number(form.principal_amount),
        interest_rate: Number(form.interest_rate),
        tenure_months: Number(form.tenure_months),
        collateral_value: Number(form.collateral_value || 0),
        processing_fee: Number(form.processing_fee || 0),
        insurance_amount: Number(form.insurance_amount || 0),
        assigned_officer_id: form.assigned_officer_id
          ? Number(form.assigned_officer_id)
          : null,
      });

      alert("Loan Created Successfully");

      navigate("/loans");
    } catch (err) {
      console.error(err);
      alert("Unable to create loan");
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold">
            New Loan
          </h1>

          <p className="text-gray-500">
            Create New Loan Application
          </p>
        </div>

        <Link
          to="/loans"
          className="bg-gray-200 px-4 py-2 rounded-lg"
        >
          <ArrowLeft size={18} />
        </Link>

      </div>

      {/* Form */}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-8 space-y-5"
      >

        {/* Customer */}

        <div>

          <label className="font-medium">
            Customer
          </label>

          <select
            name="customer_id"
            value={form.customer_id}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 mt-2"
            required
          >

            <option value="">
              Select Customer
            </option>

            {customers.map((customer) => (

              <option
                key={customer.id}
                value={customer.id}
              >
                {customer.first_name} {customer.last_name}
              </option>

            ))}

          </select>

        </div>

        {/* Loan Type */}

        <div>

          <label>
            Loan Type
          </label>

          <select
            name="loan_type"
            value={form.loan_type}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 mt-2"
          >

            <option value="personal">
              Personal
            </option>

            <option value="home">
              Home
            </option>

            <option value="business">
              Business
            </option>

            <option value="education">
              Education
            </option>

          </select>

        </div>

        {/* Amount */}

        <div>

          <label>
            Principal Amount
          </label>

          <input
            type="number"
            name="principal_amount"
            value={form.principal_amount}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 mt-2"
            required
          />

        </div>

        {/* Interest */}

        <div>

          <label>
            Interest Rate
          </label>

          <input
            type="number"
            step="0.01"
            name="interest_rate"
            value={form.interest_rate}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 mt-2"
            required
          />

        </div>

        {/* Tenure */}

        <div>

          <label>
            Tenure (Months)
          </label>

          <input
            type="number"
            name="tenure_months"
            value={form.tenure_months}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 mt-2"
            required
          />

        </div>

        {/* Purpose */}

        <div>

          <label>
            Purpose
          </label>

          <textarea
            name="purpose"
            value={form.purpose}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 mt-2"
          />

        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          Create Loan
        </button>

      </form>

    </div>
  );
};

export default NewLoan;