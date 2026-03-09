import { useEffect, useState } from "react";
import api from "../../api/api";
import "../../styles/user.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
  const token = localStorage.getItem("token"); // Or wherever you store it
  
  api.get("/orders/my", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(res => setOrders(res.data))
  .catch(err => console.error("Fetch failed:", err));
}, []);

  return (
    <div className="user-page">
      <h2>My Orders 📦</h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map(o => (
              <tr key={o.id || o.order_id}>
                <td>{o.productName}</td>
                <td>{o.quantity}</td>
                <td>₹{o.total}</td>
                <td>{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
