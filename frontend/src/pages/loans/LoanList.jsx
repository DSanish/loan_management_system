import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";

import LoanTable from "../../components/loans/LoanTable";
import { getLoans } from "../../api/loanApi";

const LoanList = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLoans = async () => {
    try {
      const data = await getLoans();

      if (Array.isArray(data)) {
        setLoans(data);
      } else if (Array.isArray(data.items)) {
        setLoans(data.items);
      } else {
        setLoans([]);
      }
    } catch (error) {
      console.error(error);
      setLoans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLoans();
  }, []);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Loan List
          </h1>

          <p className="text-gray-500">
            Manage all loan applications
          </p>
        </div>

        <Link
          to="/loans/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
        >
          <Plus size={18} />
          New Loan
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
            placeholder="Search loan..."
            className="w-full ml-3 outline-none"
          />

        </div>

      </div>

      {/* Loading */}
      {loading ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          Loading Loans...
        </div>
      ) : (
        <LoanTable loans={loans} />
      )}

    </div>
  );
};

export default LoanList;