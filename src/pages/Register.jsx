import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaStore } from "react-icons/fa";
import api from "../api/api";
import "../styles/auth.css";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
    shop_name: "", // New field for Vendor validation
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Backend ko poora form object bhej rahe hain
      const res = await api.post("/auth/register", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Registration successful!");
      
      // Role-based navigation
      if (res.data.user.role === "vendor") {
        navigate("/vendor/my-products");
      } else {
        navigate("/");
      }
      window.location.reload();
    } catch (err) {
      console.error("Registration Error:", err);
      alert(err.response?.data?.message || "Registration failed. Please check your details.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="icon-box"><FaUserPlus /></div>
          <h2>Create Account</h2>
          <p>Join our eco-community</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="input-group-custom">
            <FaUser className="input-icon" />
            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="input-group-custom">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="input-group-custom">
            <FaLock className="input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </div>

          {/* Role Selection */}
          <div className="input-group-custom">
            <select name="role" value={form.role} onChange={handleChange} required>
              <option value="customer">I am a Customer</option>
              <option value="vendor">I am a Vendor (Seller)</option>
            </select>
          </div>

          {/* Dynamic Shop Name Field (Sirf Vendor ke liye dikhega) */}
          {form.role === "vendor" && (
            <div className="input-group-custom animate-fade-in">
              <FaStore className="input-icon" />
              <input
                name="shop_name"
                placeholder="Business / Shop Name"
                onChange={handleChange}
                required={form.role === "vendor"} // Vendor hone par mandatory
              />
            </div>
          )}

          <button type="submit" className="auth-btn">GET STARTED</button>
        </form>

        <div className="auth-footer">
          <span>Already have an account? </span>
          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}