import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaLeaf, FaSearch, FaShoppingCart, FaUserCircle, 
  FaSignOutAlt, FaBoxOpen, FaThLarge 
} from "react-icons/fa";
import "../styles/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  // LocalStorage se user data nikalna
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;

  const logout = () => {
    localStorage.clear();
    navigate("/login");
    // State ko instant reset karne ke liye reload zaroori hai
    window.location.reload(); 
  };

  return (
    <nav className="pureroot-navbar">
      {/* 1. Logo Section */}
      <div className="nav-brand">
        <Link to="/" className="logo-link">
          <FaLeaf className="leaf-icon" />
          <span>PureRoot</span>
        </Link>
      </div>

      {/* 2. Search Bar Section */}
      <div className="search-container">
        <input type="text" placeholder="Search eco-friendly products..." />
        <button className="search-btn"><FaSearch /></button>
      </div>

      {/* 3. Navigation Links */}
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>

        {/* CUSTOMER/USER LINKS - Dono roles ke liye Cart/Orders dikhao */}
        {user && (user.role === "customer" || user.role === "user") && (
          <>
            <li><Link to="/products">Shop</Link></li>
            <li>
              <Link to="/cart" className="icon-link">
                <FaShoppingCart /> <span className="icon-text">Cart</span>
              </Link>
            </li>
            <li>
              <Link to="/orders" className="icon-link">
                <FaBoxOpen /> <span className="icon-text">Orders</span>
              </Link>
            </li>
          </>
        )}

        {/* VENDOR LINKS */}
        {user?.role === "vendor" && (
          <>
            <li><Link to="/vendor/my-products">My Products</Link></li>
            <li><Link to="/vendor/add-product">Add Product</Link></li>
            <li><Link to="/vendor/orders">Orders</Link></li>
          </>
        )}

        {/* ADMIN LINKS */}
        {user?.role === "admin" && (
          <li><Link to="/admin/dashboard"><FaThLarge /> Dashboard</Link></li>
        )}
      </ul>

      {/* 4. User Actions Section */}
      <div className="user-actions">
        {user ? (
          <div className="user-profile-nav">
            <Link to="/profile" className="profile-link">
              <FaUserCircle size={22} />
              <span className="user-name">
                {/* Agar name na ho toh username dikhao, aur sirf first name split karo */}
                {(user.name || user.username || "User").split(' ')[0]}
              </span>
            </Link>
            <button className="logout-icon-btn" title="Logout" onClick={logout}>
              <FaSignOutAlt />
            </button>
          </div>
        ) : (
          <div className="auth-btns">
            <Link to="/login" className="login-link-btn">Login</Link>
          </div>
        )}
      </div>
    </nav>
  );
}