import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar"; // Path check kar lena

export default function AdminLayout() {
  return (
    <div className="admin-container" style={{ display: "flex" }}>
      <Sidebar />
      <div className="admin-content" style={{ flex: 1, padding: "20px" }}>
        
        <Outlet />
      </div>
    </div>
  );
}