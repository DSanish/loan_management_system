import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BadgeDollarSign,
  CreditCard,
  Wallet,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

import  useAuthStore  from "../../store/authStore";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "Customers",
    icon: Users,
    path: "/customers",
  },
  {
    title: "Loans",
    icon: BadgeDollarSign,
    path: "/loans",
  },
  {
    title: "Payments",
    icon: CreditCard,
    path: "/payments",
  },
  {
    title: "Collections",
    icon: Wallet,
    path: "/collections",
  },
  {
    title: "Reports",
    icon: BarChart3,
    path: "/reports",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

const Sidebar = () => {
  const logout = useAuthStore((state) => state.logout);

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">

      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-slate-700">

        <h1 className="text-2xl font-bold text-blue-400">
          LMS
        </h1>

      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-5">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-slate-800 text-slate-300"
                }`
              }
            >
              <Icon size={20} />

              <span>{item.title}</span>
            </NavLink>
          );
        })}

      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-700">

        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition"
        >
          <LogOut size={20} />

          Logout
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;