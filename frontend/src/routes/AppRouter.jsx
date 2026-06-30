import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Route Guards
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

// Authentication Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

// Dashboard
import Dashboard from "../pages/dashboard/Dashboard";

// Customers
import CustomerList from "../pages/customers/CustomerList";
import CustomerDetails from "../pages/customers/CustomerDetails";
import AddCustomer from "../pages/customers/AddCustomer";

// Loans
import LoanList from "../pages/loans/LoanList";
import LoanDetails from "../pages/loans/LoanDetails";
import NewLoan from "../pages/loans/NewLoan";

// Payments
import PaymentList from "../pages/payments/PaymentList";

// Collections
import Collections from "../pages/collections/Collections";

// Reports
import Reports from "../pages/reports/Reports";

// Settings
import Settings from "../pages/settings/Settings";

// 404
import NotFound from "../pages/NotFound";

const AppRouter = () => {
  return (
    <Routes>

      {/* Redirect Root */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ========================= */}
      {/* Public Routes */}
      {/* ========================= */}
      <Route
        element={
          <PublicRoute>
            <AuthLayout />
          </PublicRoute>
        }
      >
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* ========================= */}
      {/* Protected Routes */}
      {/* ========================= */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/customers" element={<CustomerList />} />
        <Route path="/customers/new" element={<AddCustomer />} />
        <Route path="/customers/:id" element={<CustomerDetails />} />

        <Route path="/loans" element={<LoanList />} />
        <Route path="/loans/new" element={<NewLoan />} />
        <Route path="/loans/:id" element={<LoanDetails />} />

        <Route path="/payments" element={<PaymentList />} />

        <Route path="/collections" element={<Collections />} />

        <Route path="/reports" element={<Reports />} />

        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* ========================= */}
      {/* 404 */}
      {/* ========================= */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default AppRouter;