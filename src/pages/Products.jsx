import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { FaShoppingBasket, FaLeaf, FaMapMarkerAlt, FaLocationArrow } from 'react-icons/fa'; 
import api from "../api/api";
import "../styles/ProductCard.css"; 

export default function Products() {
  const [products, setProducts] = useState([]);
  const [userCoords, setUserCoords] = useState(null); // User location state
  const navigate = useNavigate();
  const API_BASE_URL = "http://localhost:5000";

  // 1. Browser se User ki Location lene ka logic
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
          setUserCoords(coords);
          fetchProducts(coords); // Location milte hi products fetch karein
        },
        (err) => {
          console.error("Location error:", err);
          fetchProducts(); // Agar location na mile toh default fetch
        }
      );
    } else {
      fetchProducts();
    }
  }, []);

  // 2. Fetch Products with or without Location
  const fetchProducts = (coords = null) => {
    let url = "/products";
    if (coords) {
      url += `?userLat=${coords.lat}&userLon=${coords.lon}&maxDist=20`; // 20km radius
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

  // 🌿 NEW: Eco-Score color logic
  const getEcoColor = (score) => {
    if (score >= 80) return "#2d6a4f"; // Dark Green
    if (score >= 50) return "#74c69d"; // Light Green
    return "#ffb703"; // Yellow/Gold
  };

  return (
    <div className="products-page" style={{ padding: '80px 5%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: '#1b4332', margin: 0 }}>🌱 Eco-Friendly Products Near You</h2>
        {userCoords && (
          <span style={{ fontSize: '0.9rem', color: '#666' }}>
            <FaLocationArrow /> Showing products near you
          </span>
        )}
      </div>

      <div className="products-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
        gap: '25px' 
      }}>
        {products.map(p => (
          <div key={p.product_id || p.id} className="product-card-container">
            {/* Image Section */}
            <div className="product-image-wrapper" onClick={() => navigate(`/product/${p.product_id}`)}>
              <img 
                src={getImagePath(p.image)} 
                alt={p.product_name || p.name} 
                className="product-main-img"
                onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
              />
              
              {/* Dynamic Eco Badge */}
              {p.eco_score && (
                <div className="eco-score-badge" style={{ backgroundColor: getEcoColor(p.eco_score) }}>
                  <FaLeaf /> Score: {p.eco_score}
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="product-details-content">
              <h3 className="product-title-text" onClick={() => navigate(`/product/${p.product_id}`)}>
                {p.product_name || p.name}
              </h3>
              
              {/* Dynamic Location/Distance Display */}
              <p className="product-loc-text">
                <FaMapMarkerAlt /> {p.location_address || p.location || "Local Vendor"}
              </p>
              
              <div className="product-pricing-area">
                 <span className="product-main-price">₹{p.price}</span>
                 {/* Sustainability Tag */}
                 <span style={{ fontSize: '0.7rem', background: '#e8f5e9', color: '#2e7d32', padding: '2px 6px', borderRadius: '4px', marginLeft: '10px' }}>
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