import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaUserCircle, 
  FaShoppingBag, 
  FaSignOutAlt, 
  FaUserEdit, 
  FaShieldAlt 
} from "react-icons/fa";
import api from "../../api/api";
import "../../styles/profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/user/profile"); 
        setUser(res.data);
      } catch (err) {
        console.error("Profile fetch error", err);
        // Agar token expired hai toh login pe bhejein
        if (err.response?.status === 401) navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Agar aapne user data save kiya ho
    navigate("/login");
  };

  if (loading) return <div className="loader">🌿 Loading your eco-profile...</div>;
  if (!user) return <div className="error-msg">User not found. Please <Link to="/login">Login</Link></div>;

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        {/* Header Section */}
        <div className="profile-header">
          <div className="avatar-section">
            <FaUserCircle className="default-avatar" />
            <span className={`status-dot ${user.role === 'vendor' ? 'gold' : 'green'}`}></span>
          </div>
          <h1>{user.username}</h1>
          <p className="user-role">{user.role.toUpperCase()}</p>
        </div>

        {/* Info Grid */}
        <div className="profile-body">
          <div className="info-section">
            <h3><FaShieldAlt /> Account Information</h3>
            <div className="info-item">
              <label>Email Address</label>
              <span>{user.email}</span>
            </div>
            <div className="info-item">
              <label>Member Since</label>
              <span>{new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          <div className="actions-section">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <Link to="/orders" className="p-action-btn">
                <FaShoppingBag /> My Orders
              </Link>
              <button className="p-action-btn edit">
                <FaUserEdit /> Edit Profile
              </button>
              <button className="p-action-btn logout" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}