import { useEffect, useState } from "react";
import api from "../../api/api";

export default function Products() {
  const [products, setProducts] = useState([]);

  const fetchProducts = () => {
    api.get("/admin/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  
const handleRemove = async (id) => {
  if (!window.confirm("Kyan aap ise delete karna chahte hain?")) return;
  try {
    const res = await api.delete(`/admin/products/${id}`);
    if (res.status === 200) {
      alert("Product removed!");
      // UI se turant hatane ke liye
      setProducts(prev => prev.filter(p => p.product_id !== id));
    }
  } catch (err) {
    console.error("Remove Error:", err.response?.data || err.message);
    alert("Backend Error: Check terminal for details");
  }
};
  return (
    <div className="admin-page">
      <h2>All Marketplace Products</h2>
      <div className="products-list">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.product_id}>
                <td>
                  <img src={`http://localhost:5000/${p.image}`} alt="product" width="50" />
                </td>
                {/* shop_name check karein kyunki controller mein wahi mapping hai */}
                <td>{p.shop_name || p.product_name || "N/A"}</td> 
                <td>₹{p.price}</td>
                <td>{p.quantity}</td>
                <td>
                  <button 
                    className="remove-btn" 
                    onClick={() => handleRemove(p.product_id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}