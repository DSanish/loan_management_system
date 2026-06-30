import LoginForm from "../../components/auth/LoginForm";

const Login = () => {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800">
          Welcome Back
        </h2>

        <p className="mt-2 text-gray-500">
          Sign in to continue to your Loan Management System
        </p>
      </div>

      {/* Login Form */}
      <LoginForm />

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Loan Management System.
        All rights reserved.
      </div>
    </div>
  );
};

export default Login;