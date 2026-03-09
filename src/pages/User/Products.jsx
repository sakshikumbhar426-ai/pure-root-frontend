import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingBasket, FaStar, FaSearch, FaLeaf, FaEye, FaMapMarkerAlt } from "react-icons/fa";
import api from "../../api/api";
import "../../styles/products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [userCoords, setUserCoords] = useState(null); // 🌿 Location state

  const navigate = useNavigate();
  const API_BASE_URL = "http://localhost:5000";
  const DEFAULT_IMAGE = "/no-image-found.png";

  const categories = ["All", "Organic", "Handmade", "Eco-friendly", "Recycled", "Natural"];

  // 📍 User ki location fetch karna
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        (err) => console.log("Location access denied or error:", err)
      );
    }
  }, []);

  // 🔍 Products fetch logic (Updated with Location Support)
  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const params = {
          category: selectedCategory === "All" ? "" : selectedCategory,
          search: searchTerm
        };

        // Agar user coordinates hain toh backend filter ke liye bhejein
        if (userCoords) {
          params.userLat = userCoords.lat;
          params.userLon = userCoords.lon;
          params.maxDist = 50; // 50km default radius
        }

        const res = await api.get(`/products`, { params });
        const data = Array.isArray(res.data) ? res.data : (res.data.products || []);
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      getProducts();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [selectedCategory, searchTerm, userCoords]);

  // 🛒 Add to Cart Logic
  const handleAddToCart = (product) => {
    try {
      const existingCart = localStorage.getItem("cart");
      const cart = existingCart ? JSON.parse(existingCart) : [];
      const pId = product.product_id || product.id;
      const isExist = cart.find(item => item.id === pId);

      if (isExist) {
        alert("This item is already in the cart!");
      } else {
        const newItem = {
          id: pId,
          name: product.product_name,
          price: product.price,
          image: product.image,
          quantity: 1,
          vendorId: product.vendorId
        };
        cart.push(newItem);
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Product added to cart! 🌱");
      }
    } catch (error) {
      console.error("Cart error:", error);
    }
  };

  const getImagePath = (img) => {
    if (!img) return DEFAULT_IMAGE;
    const fileName = img.split('/').pop().split('\\').pop();
    return `${API_BASE_URL}/uploads/products/${fileName}`;
  };

  // 🌿 Dynamic color for Eco Score
  const getEcoColor = (score) => {
    if (score >= 80) return "#2d6a4f"; 
    if (score >= 50) return "#74c69d"; 
    return "#ffb703"; 
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Sustainable Marketplace</h1>
        
        <div className="search-container">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search organic products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="category-bar">
          {categories.map((cat) => (
            <button 
              key={cat} 
              className={`cat-pill ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="stats-bar">
          <p>
            <FaLeaf className="text-success" /> {products.length} Eco-Items Found
            {userCoords && <span className="location-info"> | <FaMapMarkerAlt /> Near You</span>}
          </p>
        </div>
      </div>

      <div className="product-main-grid">
        {loading ? (
          <div className="loader">🌿 Filtering Green Products...</div>
        ) : products.length > 0 ? (
          products.map((p) => (
            <div key={p.product_id || p.id} className="product-card">
              <div className="image-container">
                <img 
                  src={getImagePath(p.image)} 
                  alt={p.product_name} 
                  onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
                />
                <span 
                  className="eco-badge" 
                  style={{ backgroundColor: getEcoColor(p.eco_score || 85) }}
                >
                  🌿 Score: {p.eco_score || '85'}
                </span>
              </div>
              
              <div className="content">
                <span className="cat-label">{p.material_type || "Eco-Friendly"}</span>
                <h3>{p.product_name}</h3>
                <div className="rating">
                  {[...Array(4)].map((_, i) => <FaStar key={i} className="text-warning" />)}
                  <span>(4.5)</span>
                </div>

                <p className="loc-text-small">
                  <FaMapMarkerAlt /> {p.location_address || p.location || "Local Vendor"}
                </p>
                
                <div className="card-actions">
                  <button className="details-btn" onClick={() => navigate(`/product/${p.product_id || p.id}`)}>
                    <FaEye /> Details
                  </button>
                  <button className="add-to-cart-btn" onClick={() => handleAddToCart(p)}>
                    <FaShoppingBasket /> Buy
                  </button>
                </div>

                <div className="price-row">
                  <span className="price">₹{p.price}</span>
                  <span className="packaging-tag">{p.packaging_type}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-products-found">
             <h3>No matching products found.</h3>
          </div>
        )}
      </div>
    </div>
  );
}