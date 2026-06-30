import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Public Page Content */}
      <Outlet />
    </div>
  );
};

export default PublicLayout;