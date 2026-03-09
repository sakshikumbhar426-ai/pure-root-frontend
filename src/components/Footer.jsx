import React from "react";
import { Link } from "react-router-dom";
import { FaLeaf, FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="pureroot-footer">
      <div className="footer-top">
        <div className="footer-container">
          {/* 1. Brand & About */}
          <div className="footer-box brand-info">
            <h3 className="footer-logo">
              <FaLeaf className="footer-leaf" /> PureRoot
            </h3>
            <p className="footer-desc">
              Your neighborhood marketplace for 100% sustainable and ethical products. 
              Together, we make the planet greener one purchase at a time.
            </p>
            <div className="social-links">
              <a href="#"><FaFacebook /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaLinkedin /></a>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div className="footer-box">
            <h4>Explore</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Organic Shop</Link></li>
              <li><Link to="/vendors">Our Artisans</Link></li>
              <li><Link to="/register">Become a Vendor</Link></li>
            </ul>
          </div>

          {/* 3. Contact Details */}
          <div className="footer-box contact-box">
            <h4>Get in Touch</h4>
            <p><FaEnvelope className="me-2" /> support@pureroot.com</p>
            <p><FaPhoneAlt className="me-2" /> +91 98765 43210</p>
            <p><FaMapMarkerAlt className="me-2" /> Mumbai, Maharashtra, India</p>
          </div>

          {/* 4. Newsletter */}
          <div className="footer-box newsletter">
            <h4>Join the Green Side</h4>
            <p>Get tips on sustainable living and exclusive offers.</p>
            <form className="subscribe-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Email Address" />
              <button type="submit">Join</button>
            </form>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-container bottom-flex">
          <p>&copy; {new Date().getFullYear()} PureRoot. Crafted with ❤️ for Nature.</p>
          <div className="legal-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}