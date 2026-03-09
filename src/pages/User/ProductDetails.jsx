import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from "../../api/api";
import { FaLeaf, FaShoppingBasket, FaTruck, FaBoxOpen, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import "../../styles/ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const API_BASE_URL = "http://localhost:5000";

  // 1. Helper: Correct Image Path Logic
  const getFullImagePath = (path) => {
    if (!path) return "https://placehold.co/600x600?text=No+Product+Image";
    if (path.startsWith('http')) return path;

    let cleanPath = path;
    if (!cleanPath.startsWith('uploads/')) {
      cleanPath = `uploads/products/${cleanPath}`;
    } else if (!cleanPath.startsWith('uploads/products/')) {
      cleanPath = cleanPath.replace('uploads/', 'uploads/products/');
    }
    return `${API_BASE_URL}/${cleanPath}`;
  };

  // 2. Helper: Dynamic Sustainability Insight
  const getSustainabilityInsight = (score, material, packaging) => {
    if (score >= 80) return `Badiya Choice! Ye product ${material} hai aur iski packaging ${packaging} hai, jo environment ke liye best hai.`;
    if (score >= 50) return `Ye product sustainable hai kyunki isme ${material} materials aur ${packaging} ka use hua hai.`;
    return "Ye product standard quality ka hai. Hum iska carbon footprint kam karne par kaam kar rahe hain.";
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Fetch Error:", err.response?.data); 
        setError(err.response?.data?.message || "Product fetch failed");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="details-loader"><span></span> Loading Product...</div>;
  if (error) return <div className="details-error">⚠️ {error}</div>;
  if (!product) return <div className="details-error">Product not found!</div>;

  const ecoInsight = getSustainabilityInsight(product.eco_score, product.material_type, product.packaging_type);
  const ecoColor = product.eco_score >= 80 ? '#2d6a4f' : (product.eco_score >= 50 ? '#74c69d' : '#ffb703');

  return (
    <div className="product-details-container">
      <div className="details-wrapper">
        
        {/* Left Side: Image Section */}
        <div className="details-image-section">
          <div className="image-card-eco">
            {/* Eco Score Ribbon - Ab ye image ko cover nahi karega */}
            {product.eco_score && (
              <div className="eco-side-ribbon" style={{ backgroundColor: ecoColor }}>
                <FaLeaf className="ribbon-icon" />
                <span className="ribbon-text">Eco Score: {product.eco_score}</span>
              </div>
            )}
            
            <img 
              src={getFullImagePath(product.image)} 
              alt={product.product_name} 
              className="main-product-image-eco"
              onError={(e) => { 
                e.target.onerror = null; 
                e.target.src = "https://placehold.co/600x600?text=Image+Not+Found"; 
              }}
            />
          </div>
        </div>

        {/* Right Side: Information Section */}
        <div className="details-info-section">
          <span className="details-cat-tag">{product.material_type || "Eco-Friendly"}</span>
          <h1 className="details-title">{product.product_name}</h1>
          
          <div className="details-price-tag">₹{product.price}</div>

          {/* 🌿 Sustainability Dashboard */}
          <div className="sustainability-box" style={{ 
            background: '#f0fdf4', 
            padding: '20px', 
            borderRadius: '12px', 
            margin: '25px 0', 
            border: `1px solid ${ecoColor}44` 
          }}>
            <h4 style={{ color: '#166534', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaLeaf /> Eco-Impact Analysis
            </h4>
            <div className="progress-bar-bg" style={{ background: '#e2e8f0', height: '10px', borderRadius: '5px', overflow: 'hidden', marginBottom: '12px' }}>
              <div className="progress-bar-fill" style={{ 
                width: `${product.eco_score}%`, 
                background: ecoColor, 
                height: '100%',
                transition: 'width 1s ease-in-out'
              }}></div>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#1b4332', lineHeight: '1.5', margin: 0 }}>
              <strong>Insight:</strong> {ecoInsight}
            </p>
          </div>
          
          <div className="details-highlights">
            <div className="highlight-item">
              <FaBoxOpen /> 
              <span><strong>Packaging:</strong> {product.packaging_type || "Biodegradable"}</span>
            </div>
            <div className="highlight-item">
              <FaTruck /> 
              <span><strong>Vendor Location:</strong> {product.location_address || product.location || "Local Source"}</span>
            </div>
            <div className="highlight-item">
              <FaCheckCircle /> 
              <span><strong>Material Quality:</strong> 100% {product.material_type} Certified</span>
            </div>
          </div>

          <div className="details-description">
            <h3>Product Story & Details</h3>
            <p>{product.description || "Ye product local artisans dwara sustainabilty ko dhyan mein rakh kar banaya gaya hai."}</p>
          </div>

          <div className="details-actions">
            <button className="buy-now-btn">Buy It Now</button>
            <button className="add-to-cart-secondary" onClick={() => alert(`${product.product_name} added to cart! 🌱`)}>
              <FaShoppingBasket /> Add to Cart
            </button>
          </div>

          <div className="trust-badges" style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2d6a4f', fontSize: '0.9rem' }}>
              <FaCheckCircle /> Verified Sustainable Merchant
            </p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2d6a4f', fontSize: '0.9rem' }}>
              <FaCheckCircle /> Plastic-Free Shipping Guaranteed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;