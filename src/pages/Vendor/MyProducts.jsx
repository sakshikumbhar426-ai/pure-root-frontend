import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaLeaf, FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";
import "../../styles/vendor.css";

export default function MyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_BASE_URL = "http://localhost:5000";
  const OFFLINE_IMAGE = "/no-image-found.png"; 

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      /**
       * FIX: Aapke screenshot mein /api/products/vendor/my par 404 tha.
       * Agar aapka backend router '/products' par mount hai, toh 
       * yeh endpoint '/products/my' ya '/products/vendor/my' hona chahiye.
       */
// MyProducts.jsx (Line 22 approx)
    const res = await api.get("/products/my-products");
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        navigate("/login"); 
      }
      setProducts([]); 
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        // ID based deletion
        await api.delete(`/products/${id}`); 
        setProducts(products.filter((p) => (p.product_id || p.id) !== id));
        alert("Product deleted successfully!");
      } catch (err) {
        alert("Error deleting product");
      }
    }
  };

  /**
   * CORRECTED IMAGE LOGIC
   * Backend se 'image_123.jpg' aayega, hum use full URL banayenge.
   */
 const getImagePath = (img) => {
  if (!img) return OFFLINE_IMAGE;
  
  // Filename extract logic
  const fileName = img.split('/').pop().split('\\').pop(); 
  
  // PureRoot backend static path
  return `${API_BASE_URL}/uploads/products/${fileName}`;
};

  return (
    <div className="vendor-dashboard-wrapper">
      <div className="vendor-header animate-fade">
        <div>
          <h2><FaLeaf className="text-success" /> My Inventory</h2>
          <p className="text-muted">Manage your listed eco-friendly products</p>
        </div>
        <Link to="/vendor/add-product" className="add-new-link">
          <FaPlus /> Add New Product
        </Link>
      </div>

      <div className="table-container shadow-sm animate-up">
        {loading ? (
          <div className="loader-box">Loading your eco-inventory...</div>
        ) : (
          <table className="vendor-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Eco Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((p) => {
                  // Sequelize 'product_id' use karta hai
                  const pId = p.product_id || p.id;
                  // Backend model mein 'eco_score' hai
                  const pEco = p.eco_score !== undefined ? p.eco_score : 0;

                  return (
                    <tr key={pId}>
                      <td className="product-cell">
                        <img 
                          src={getImagePath(p.image)} 
                          alt={p.product_name} 
                          className="table-img" 
                          onError={(e) => { 
                            e.target.onerror = null; 
                            e.target.src = OFFLINE_IMAGE; 
                          }}
                        />
                        <span className="p-name">{p.product_name}</span>
                      </td>
                      <td>
                        <span className="badge-category">
                          {p.material_type || "Eco-Friendly"}
                        </span>
                      </td>
                      <td className="fw-bold">₹{p.price}</td>
                      <td>
                        <span className={`stock-status ${p.quantity < 5 ? 'low' : 'ok'}`}>
                          {p.quantity} units
                        </span>
                      </td>
                      <td className="eco-score-cell">🌿 {pEco}</td>
                      <td className="action-btns">
                        <button className="btn-icon edit"><FaEdit /></button>
                        <button 
                          className="btn-icon delete" 
                          onClick={() => deleteProduct(pId)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="empty-msg">
                    No products found. Start your green journey!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}