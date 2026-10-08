import { Outlet } from "react-router-dom";
import Topbar from "../components/dashboard/Topbar";

function DashboardLayout() {
 
  return (
    <div className="min-h-screen bg-gray-100">
      <Topbar />

      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;