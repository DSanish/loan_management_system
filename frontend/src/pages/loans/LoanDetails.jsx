import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { getLoanById } from "../../api/loanApi";

const LoanDetails = () => {
  const { id } = useParams();

  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLoan();
  }, [id]);

  const loadLoan = async () => {
    try {
      const data = await getLoanById(id);
      setLoan(data);
    } catch (error) {
      console.error("Failed to load loan:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-lg">
        Loading Loan Details...
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="p-6 text-center text-red-600 text-lg">
        Loan Not Found
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Loan Details
          </h1>

          <p className="text-gray-500">
            Complete loan information
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

      {/* Details Card */}
      <div className="bg-white rounded-xl shadow p-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <h4 className="font-semibold text-gray-600">
              Loan Number
            </h4>
            <p>{loan.loan_number}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-600">
              Customer
            </h4>
            <p>
              {loan.customer
                ? `${loan.customer.first_name} ${loan.customer.last_name}`
                : "-"}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-600">
              Phone
            </h4>
            <p>{loan.customer?.phone || "-"}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-600">
              Email
            </h4>
            <p>{loan.customer?.email || "-"}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-600">
              Loan Type
            </h4>
            <p>{loan.loan_type}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-600">
              Status
            </h4>

            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700">
              {loan.status}
            </span>
          </div>

          <div>
            <h4 className="font-semibold text-gray-600">
              Principal Amount
            </h4>

            <p>
              ₹ {Number(loan.principal_amount).toLocaleString()}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-600">
              Interest Rate
            </h4>

            <p>{loan.interest_rate}%</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-600">
              EMI
            </h4>

            <p>
              ₹{" "}
              {loan.emi_amount
                ? Number(loan.emi_amount).toLocaleString()
                : "-"}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-600">
              Tenure
            </h4>

            <p>{loan.tenure_months} Months</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-600">
              Outstanding
            </h4>

            <p>
              ₹{" "}
              {loan.outstanding_principal
                ? Number(
                    loan.outstanding_principal
                  ).toLocaleString()
                : "-"}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-600">
              Total Interest
            </h4>

            <p>
              ₹{" "}
              {loan.total_interest
                ? Number(loan.total_interest).toLocaleString()
                : "-"}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-600">
              Purpose
            </h4>

            <p>{loan.purpose || "-"}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-600">
              Collateral
            </h4>

            <p>{loan.collateral_type || "-"}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-600">
              Risk Grade
            </h4>

            <p>{loan.risk_grade || "-"}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-600">
              Risk Score
            </h4>

            <p>{loan.risk_score || "-"}</p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default LoanDetails;