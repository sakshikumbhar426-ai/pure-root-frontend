import { useEffect, useState } from "react";
import api from "../../api/api";
import { FaUsers, FaStore, FaBoxOpen, FaLeaf, FaUserClock } from "react-icons/fa";
import "../../styles/admin.css";

/**
 * AdminDashboard: System stats aur overview dikhane ke liye
 */
export default function AdminDashboard() {
  // State for storing system statistics
  const [stats, setStats] = useState({ 
    users: 0, 
    vendors: 0, 
    orders: 0, 
    ecoScore: 0, 
    pendingVendors: 0 // Naya field approval ke liye
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Backend se stats fetch karna
        const res = await api.get("/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Stats fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="loader">Loading Dashboard Stats...</div>;

  return (
    <div className="dashboard-content">
      <h1 className="page-title">Dashboard Overview</h1>
      
      <div className="stats-grid">
        {/* Total Users Card */}
        <div className="stat-card">
          <div className="stat-icon u-bg"><FaUsers /></div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p>{stats.users}</p>
          </div>
        </div>

        {/* Pending Approvals Card - Yellow for Warning/Attention */}
        <div className="stat-card pending-card" style={{ borderLeft: "5px solid #f39c12" }}>
          <div className="stat-icon p-bg" style={{ backgroundColor: "#f39c12" }}>
            <FaUserClock />
          </div>
          <div className="stat-info">
            <h3>Pending Approvals</h3>
            <p className="highlight-text" style={{ color: "#f39c12", fontWeight: "bold" }}>
              {stats.pendingVendors || 0}
            </p>
          </div>
        </div>

        {/* Total Vendors Card */}
        <div className="stat-card">
          <div className="stat-icon v-bg"><FaStore /></div>
          <div className="stat-info">
            <h3>Total Vendors</h3>
            <p>{stats.vendors}</p>
          </div>
        </div>

        {/* Total Orders Card */}
        <div className="stat-card">
          <div className="stat-icon o-bg"><FaBoxOpen /></div>
          <div className="stat-info">
            <h3>Total Orders</h3>
            <p>{stats.orders}</p>
          </div>
        </div>

        {/* Eco Score Card */}
        <div className="stat-card">
          <div className="stat-icon e-bg"><FaLeaf /></div>
          <div className="stat-info">
            <h3>Eco Score</h3>
            <p className="eco-text">{stats.ecoScore}%</p>
          </div>
        </div>
      </div>

      {/* Optional: Add a quick message if approvals are pending */}
      {stats.pendingVendors > 0 && (
        <div className="approval-alert" style={{ 
          marginTop: "20px", 
          padding: "15px", 
          backgroundColor: "#fff3cd", 
          borderRadius: "8px",
          color: "#856404",
          border: "1px solid #ffeeba"
        }}>
          <strong>Attention:</strong> You have {stats.pendingVendors} vendors waiting for verification. 
          Please go to the Vendors tab to approve them.
        </div>
      )}
    </div>
  );
}