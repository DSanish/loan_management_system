import { Bell, Search, UserCircle, LogOut } from "lucide-react";
import useAuthStore  from "../../store/authStore";

const Navbar = () => {
  const { user, logout } = useAuthStore();

  return (
    <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6">

      {/* Left Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Loan Management System
        </h1>

        <p className="text-sm text-gray-500">
          Welcome back 👋
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">

        {/* Search */}
        <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">

          <Search size={18} className="text-gray-500" />

          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none ml-2 text-sm"
          />

        </div>

        {/* Notification */}
        <button className="relative">

          <Bell
            size={22}
            className="text-gray-700 hover:text-blue-600 transition"
          />

          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
            3
          </span>

        </button>

        {/* User */}
        <div className="flex items-center gap-3">

          <UserCircle size={38} className="text-blue-600" />

          <div className="hidden md:block">

            <h3 className="font-semibold">
              {user?.name || "Administrator"}
            </h3>

            <p className="text-xs text-gray-500">
              {user?.role || "Admin"}
            </p>

          </div>

        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>

    </header>
  );
};

export default Navbar;