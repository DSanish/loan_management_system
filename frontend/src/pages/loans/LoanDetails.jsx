import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getLoan } from "../../api/loanApi";
import { ArrowLeft } from "lucide-react";

const LoanDetails = () => {
  const { id } = useParams();

  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLoan();
  }, []);

  const loadLoan = async () => {
    try {
      const data = await getLoan(id);
      setLoan(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="p-6">
        Loan Not Found
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">

      <div className="flex justify-between">

        <h1 className="text-3xl font-bold">
          Loan Details
        </h1>

        <Link
          to="/loans"
          className="bg-gray-200 px-4 py-2 rounded-lg"
        >
          <ArrowLeft size={18}/>
        </Link>

      </div>

      <div className="bg-white shadow rounded-xl p-6">

        <div className="grid grid-cols-2 gap-6">

          <div>
            <strong>Loan Number</strong>
            <p>{loan.loan_number}</p>
          </div>

          <div>
            <strong>Customer</strong>
            <p>
              {loan.customer?.first_name} {loan.customer?.last_name}
            </p>
          </div>

          <div>
            <strong>Phone</strong>
            <p>{loan.customer?.phone}</p>
          </div>

          <div>
            <strong>Email</strong>
            <p>{loan.customer?.email}</p>
          </div>

          <div>
            <strong>Loan Type</strong>
            <p>{loan.loan_type}</p>
          </div>

          <div>
            <strong>Status</strong>
            <p>{loan.status}</p>
          </div>

          <div>
            <strong>Principal Amount</strong>
            <p>₹ {Number(loan.principal_amount).toLocaleString()}</p>
          </div>

          <div>
            <strong>Interest</strong>
            <p>{loan.interest_rate}%</p>
          </div>

          <div>
            <strong>EMI</strong>
            <p>₹ {loan.emi_amount}</p>
          </div>

          <div>
            <strong>Tenure</strong>
            <p>{loan.tenure_months} Months</p>
          </div>

          <div>
            <strong>Outstanding</strong>
            <p>₹ {loan.outstanding_principal}</p>
          </div>

          <div>
            <strong>Total Interest</strong>
            <p>₹ {loan.total_interest}</p>
          </div>

          <div>
            <strong>Purpose</strong>
            <p>{loan.purpose}</p>
          </div>

          <div>
            <strong>Collateral</strong>
            <p>{loan.collateral_type}</p>
          </div>

          <div>
            <strong>Risk Grade</strong>
            <p>{loan.risk_grade}</p>
          </div>

          <div>
            <strong>Risk Score</strong>
            <p>{loan.risk_score}</p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default LoanDetails;