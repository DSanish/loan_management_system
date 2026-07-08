import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import {
  getLoanById,
  updateLoan,
} from "../../api/loanApi";

const EditLoan = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    interest_rate: "",
    tenure_months: "",
    purpose: "",
    collateral_type: "",
    collateral_value: "",
    processing_fee: "",
    insurance_amount: "",
    assigned_officer_id: "",
  });

  useEffect(() => {
    loadLoan();
  }, []);

  const loadLoan = async () => {
    try {
      const loan = await getLoanById(id);

      setFormData({
        interest_rate: loan.interest_rate ?? "",
        tenure_months: loan.tenure_months ?? "",
        purpose: loan.purpose ?? "",
        collateral_type: loan.collateral_type ?? "",
        collateral_value: loan.collateral_value ?? "",
        processing_fee: loan.processing_fee ?? "",
        insurance_amount: loan.insurance_amount ?? "",
        assigned_officer_id: loan.assigned_officer_id ?? "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to load loan.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await updateLoan(id, {
        interest_rate: Number(formData.interest_rate),
        tenure_months: Number(formData.tenure_months),
        purpose: formData.purpose,
        collateral_type: formData.collateral_type,
        collateral_value: Number(formData.collateral_value),
        processing_fee: Number(formData.processing_fee),
        insurance_amount: Number(formData.insurance_amount),
        assigned_officer_id: Number(formData.assigned_officer_id),
      });

      alert("Loan Updated Successfully");

      navigate("/loans");
    } catch (err) {
      console.error(err);
      alert("Update Failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center">
        Loading Loan...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">
            Edit Loan
          </h1>

          <p className="text-gray-500">
            Update Loan Information
          </p>

        </div>

        <Link
          to="/loans"
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
        >
          <ArrowLeft size={18} />
          Back
        </Link>

      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-8 space-y-6"
      >

        <div className="grid grid-cols-2 gap-6">

          <div>

            <label className="block mb-2 font-medium">
              Interest Rate
            </label>

            <input
              type="number"
              step="0.01"
              name="interest_rate"
              value={formData.interest_rate}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Tenure (Months)
            </label>

            <input
              type="number"
              name="tenure_months"
              value={formData.tenure_months}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

          </div>

          <div className="col-span-2">

            <label className="block mb-2 font-medium">
              Purpose
            </label>

            <input
              type="text"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Collateral Type
            </label>

            <input
              type="text"
              name="collateral_type"
              value={formData.collateral_type}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Collateral Value
            </label>

            <input
              type="number"
              name="collateral_value"
              value={formData.collateral_value}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Processing Fee
            </label>

            <input
              type="number"
              name="processing_fee"
              value={formData.processing_fee}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Insurance Amount
            </label>

            <input
              type="number"
              name="insurance_amount"
              value={formData.insurance_amount}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Assigned Officer ID
            </label>

            <input
              type="number"
              name="assigned_officer_id"
              value={formData.assigned_officer_id}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

          </div>

        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
        >
          <Save size={18} />

          {saving
            ? "Updating..."
            : "Update Loan"}
        </button>

      </form>

    </div>
  );
};

export default EditLoan;