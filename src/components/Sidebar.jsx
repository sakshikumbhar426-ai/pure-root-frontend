import { Link, useLocation } from "react-router-dom";
import { FaChartBar, FaUsers, FaStore, FaBox, FaClipboardList } from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaChartBar /> },
    { name: "Users", path: "/admin/users", icon: <FaUsers /> },
    { name: "Vendors", path: "/admin/vendors", icon: <FaStore /> },
    { name: "Products", path: "/admin/products", icon: <FaBox /> },
    { name: "Orders", path: "/admin/orders", icon: <FaClipboardList /> },
  ];

  return (
    <aside className="sidebar">
      <h2>Admin Panel</h2>
      <ul>
        {menuItems.map((item) => (
          <li key={item.path} className={location.pathname === item.path ? "active" : ""}>
            <Link to={item.path}>
              {item.icon} <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}