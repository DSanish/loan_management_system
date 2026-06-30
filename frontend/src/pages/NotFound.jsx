import { Link } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-lg w-full text-center">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <AlertTriangle
            size={80}
            className="text-yellow-500"
          />
        </div>

        {/* Error Code */}
        <h1 className="text-6xl font-bold text-gray-800">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-4 text-2xl font-semibold text-gray-700">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="mt-3 text-gray-500">
          Sorry, the page you are looking for does not exist
          or has been moved.
        </p>

        {/* Button */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
        >
          <Home size={20} />
          Back to Dashboard
        </Link>

      </div>
    </div>
  );
};

export default NotFound;