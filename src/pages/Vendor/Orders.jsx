import { useEffect, useState } from "react";
import api from "../../api/api";
import "../../styles/orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/vendor/orders");

        const data = res.data?.orders || res.data || [];

        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setOrders([]);
        }

      } catch (err) {
        console.error("Fetch failed:", err);
        setError("Could not load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="loader">🌿 Fetching your eco-orders...</div>;
  if (error) return <div className="error-msg">{error}</div>;

  return (
    <div className="orders-container">
      <h2>My Orders 📦</h2>

      <div className="orders-list">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id || order.order_id} className="order-card">

              <div className="order-header">
                <span className="order-id">
                  ID: #{order.id || order.order_id}
                </span>

                <span className={`status-badge ${(order.status || "").toLowerCase()}`}>
                  {order.status || "Pending"}
                </span>
              </div>

              <div className="order-body">
                <h4>{order.productName || "Product Details"}</h4>

                <p className="order-info">
                  Quantity: {order.quantity || 1}
                </p>

                <p className="order-price">
                  Total: <strong>₹{order.total || order.total_amount}</strong>
                </p>

                <p className="order-date">
                  Date: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}
                </p>
              </div>

            </div>
          ))
        ) : (
          <div className="no-data">
            <p>No orders found 🌱</p>
          </div>
        )}
      </div>
    </div>
  );
}