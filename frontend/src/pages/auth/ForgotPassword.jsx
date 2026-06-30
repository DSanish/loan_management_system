import { Link } from "react-router-dom";

const ForgotPassword = () => {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800">
          Forgot Password
        </h2>

        <p className="mt-2 text-gray-500">
          Enter your email address and we'll send you a password reset link.
        </p>
      </div>

      {/* Form */}
      <form className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block mb-2 font-medium text-gray-700"
          >
            Email Address
          </label>

          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
        >
          Send Reset Link
        </button>
      </form>

      {/* Back to Login */}
      <div className="mt-6 text-center text-sm">
        Remember your password?{" "}
        <Link
          to="/login"
          className="text-blue-600 hover:underline font-medium"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;