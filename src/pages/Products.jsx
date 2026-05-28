import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { FaShoppingBasket, FaLeaf, FaMapMarkerAlt, FaLocationArrow } from 'react-icons/fa'; 
import api from "../api/api";
import "../styles/ProductCard.css"; // Make sure path is correct

export default function Products() {
  const [products, setProducts] = useState([]);
  const [userCoords, setUserCoords] = useState(null);
  const navigate = useNavigate();
  const API_BASE_URL = "https://pure-root-backend.onrender.com";

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
          setUserCoords(coords);
          fetchProducts(coords);
        },
        (err) => {
          console.error("Location error:", err);
          fetchProducts();
        }
      );
    } else {
      fetchProducts();
    }
  }, []);

  const fetchProducts = (coords = null) => {
    let url = "/products";
    if (coords) {
      url += `?userLat=${coords.lat}&userLon=${coords.lon}&maxDist=20`;
    }
    api.get(url)
      .then(res => setProducts(res.data))
      .catch(err => console.error("Error fetching products:", err));
  };

  const getImagePath = (path) => {
    if (!path) return "https://via.placeholder.com/150";
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('uploads') ? path : `uploads/${path}`;
    return `${API_BASE_URL}/${cleanPath}`;
  };

  const getEcoColor = (score) => {
    if (score >= 80) return "#2d6a4f"; 
    if (score >= 50) return "#74c69d"; 
    return "#ffb703"; 
  };

  return (
    <div className="products-page">
      <div className="products-header-container">
        <h2 className="main-title">🌱 Eco-Friendly Products Near You</h2>
        {userCoords && (
          <span className="location-badge">
            <FaLocationArrow /> Showing products near you
          </span>
        )}
      </div>

      {/* Grid container with corrected class name */}
      <div className="product-main-grid">
        {products.map((p, index) => (
          <div 
            key={p.product_id || p.id} 
            className="product-card-container"
            style={{ animationDelay: `${index * 0.1}s` }} // Staggered entry effect
          >
            <div className="product-image-wrapper" onClick={() => navigate(`/product/${p.product_id}`)}>
              <img 
                src={getImagePath(p.image)} 
                alt={p.product_name} 
                className="product-main-img"
                onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
              />
              {p.eco_score && (
                <div className="eco-score-badge" style={{ backgroundColor: getEcoColor(p.eco_score) }}>
                  <FaLeaf /> Score: {p.eco_score}
                </div>
              )}
            </div>

            <div className="product-details-content">
              <h3 className="product-title-text" onClick={() => navigate(`/product/${p.product_id}`)}>
                {p.product_name}
              </h3>
              
              <p className="product-loc-text">
                <FaMapMarkerAlt /> {p.location_address || "Local Vendor"}
              </p>
              
              <div className="product-pricing-area">
                 <span className="product-main-price">₹{p.price}</span>
                 <span className="sustainability-tag">
                    {p.material_type || 'Eco-Friendly'}
                 </span>
              </div>

              <div className="product-card-buttons">
                <button className="btn-view-details" onClick={() => navigate(`/product/${p.product_id}`)}>
                    Details
                </button>
                <button className="btn-add-cart" onClick={(e) => {
                  e.stopPropagation();
                  alert("Added to cart!");
                }}>
                  <FaShoppingBasket /> Buy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}