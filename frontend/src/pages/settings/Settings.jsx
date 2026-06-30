import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Database,
  Palette,
} from "lucide-react";

const Settings = () => {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Settings
        </h1>

        <p className="text-gray-500">
          Manage application settings and preferences
        </p>
      </div>

      {/* Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Profile */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <User size={40} className="text-blue-600 mb-4" />

          <h2 className="text-xl font-semibold">
            Profile
          </h2>

          <p className="text-gray-500 mt-2">
            Update your profile information.
          </p>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <Bell size={40} className="text-green-600 mb-4" />

          <h2 className="text-xl font-semibold">
            Notifications
          </h2>

          <p className="text-gray-500 mt-2">
            Manage notification preferences.
          </p>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <Shield size={40} className="text-red-600 mb-4" />

          <h2 className="text-xl font-semibold">
            Security
          </h2>

          <p className="text-gray-500 mt-2">
            Change password and security settings.
          </p>
        </div>

        {/* Database */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <Database size={40} className="text-purple-600 mb-4" />

          <h2 className="text-xl font-semibold">
            Database
          </h2>

          <p className="text-gray-500 mt-2">
            Database configuration and backups.
          </p>
        </div>

        {/* Theme */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <Palette size={40} className="text-orange-600 mb-4" />

          <h2 className="text-xl font-semibold">
            Theme
          </h2>

          <p className="text-gray-500 mt-2">
            Customize the application appearance.
          </p>
        </div>

        {/* General */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <SettingsIcon size={40} className="text-gray-600 mb-4" />

          <h2 className="text-xl font-semibold">
            General
          </h2>

          <p className="text-gray-500 mt-2">
            Configure general application settings.
          </p>
        </div>

      </div>

    </div>
  );
};

export default Settings;