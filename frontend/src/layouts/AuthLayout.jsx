import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex">

      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 bg-blue-700 text-white items-center justify-center p-10">
        <div className="max-w-md">

          <h1 className="text-5xl font-bold mb-6">
            Loan Management System
          </h1>

          <p className="text-lg leading-8 text-blue-100">
            Secure, fast and scalable loan management platform
            for banks, NBFCs and financial institutions.
          </p>

          <div className="mt-10 space-y-4">

            <div className="flex items-center gap-3">
              <span className="text-green-300 text-xl">✔</span>
              <span>Customer Management</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-green-300 text-xl">✔</span>
              <span>Loan Processing</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-green-300 text-xl">✔</span>
              <span>EMI Tracking</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-green-300 text-xl">✔</span>
              <span>Reports & Analytics</span>
            </div>

          </div>

        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center bg-gray-100 p-6">

        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

          <Outlet />

        </div>

      </div>

    </div>
  );
};

export default AuthLayout;