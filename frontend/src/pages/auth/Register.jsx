import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800">
          Create Account
        </h2>

        <p className="mt-2 text-gray-500">
          Register to access the Loan Management System
        </p>
      </div>

      {/* Register Form */}
      <form className="space-y-5">

        {/* Full Name */}
        <div>
          <label className="block mb-2 font-medium">
            Full Name
          </label>

          <input
            type="text"
            placeholder="Enter your full name"
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2 font-medium">
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block mb-2 font-medium">
            Password
          </label>

          <input
            type="password"
            placeholder="Create a password"
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block mb-2 font-medium">
            Confirm Password
          </label>

          <input
            type="password"
            placeholder="Confirm your password"
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Register Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
        >
          Create Account
        </button>

      </form>

      {/* Login Link */}
      <div className="mt-6 text-center text-sm">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-blue-600 hover:underline"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Register;