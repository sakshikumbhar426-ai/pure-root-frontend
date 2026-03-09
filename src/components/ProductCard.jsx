import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingBasket, FaEye, FaLeaf, FaMapMarkerAlt } from 'react-icons/fa';
import '../../styles/ProductCard.css'; 

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const API_BASE_URL = "http://localhost:5000";

  // 🌿 NEW: Dynamic color and label based on Eco-Score
  const getEcoDetails = (score) => {
    if (score >= 80) return { color: "#2d6a4f", label: "Eco-Warrior", icon: <FaLeaf /> };
    if (score >= 50) return { color: "#74c69d", label: "Sustainable", icon: <FaLeaf /> };
    return { color: "#ffb703", label: "Neutral", icon: <FaLeaf /> };
  };

  const eco = getEcoDetails(product.eco_score);

  const getImagePath = (path) => {
    if (!path) return "https://via.placeholder.com/150"; 
    if (path.startsWith('http')) return path; 

    let cleanPath = path;
    if (!cleanPath.startsWith('uploads/')) {
      cleanPath = `uploads/products/${cleanPath}`;
    } else if (!cleanPath.startsWith('uploads/products/')) {
      cleanPath = cleanPath.replace('uploads/', 'uploads/products/');
    }
    return `${API_BASE_URL}/${cleanPath}`; 
  };

  const handleViewDetails = () => {
    navigate(`/product/${product.product_id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    alert(`Added ${product.product_name} to cart!`);
  };

  return (
    <div className="product-card-container">
      {/* Image Section */}
      <div className="product-image-wrapper" onClick={handleViewDetails}>
        <img 
          src={getImagePath(product.image)} 
          alt={product.product_name || "Eco Product"} 
          className="product-main-img"
          onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
        />
        
        {/* Updated Eco Badge with Dynamic Colors */}
        {product.eco_score && (
          <div className="eco-score-badge" style={{ backgroundColor: eco.color }}>
            {eco.icon} {eco.label}: {product.eco_score}
          </div>
        )}
      </div>

      {/* Product Content Section */}
      <div className="product-details-content">
        {/* Dynamic Category/Material Label */}
        <p className="product-cat-label" style={{ color: eco.color, fontWeight: 'bold' }}>
            {product.material_type || "Sustainable"}
        </p>
        
        <h3 className="product-title-text" onClick={handleViewDetails}>
          {product.product_name || "Untitled Product"}
        </h3>
        
        <p className="product-loc-text">
          <FaMapMarkerAlt /> {product.location_address || product.location || "Local Source"}
        </p>
        
        <div className="product-pricing-area">
           <span className="product-main-price">₹{product.price}</span>
           {/* Visual check for packaging */}
           <span style={{ fontSize: '0.7rem', marginLeft: '10px', color: '#666 italic' }}>
             ({product.packaging_type || "Standard"})
           </span>
        </div>

        {/* Action Buttons */}
        <div className="product-card-buttons">
          <button className="btn-view-details" onClick={handleViewDetails}>
            <FaEye /> Details
          </button>
          
          <button className="btn-add-cart" onClick={handleAddToCart}>
            <FaShoppingBasket /> Buy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;