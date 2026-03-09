import { useEffect, useState } from "react";
import api from "../../api/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/admin/orders");

        // backend se orders object aata hai
        const data = res.data?.orders || [];

        setOrders(Array.isArray(data) ? data : []);

      } catch (err) {
        console.error("Orders fetch error:", err);
        setOrders([]);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="admin-page">
      <h2>All Orders</h2>

      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total Amount</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {orders.length > 0 ? (
            orders.map((o) => (
              <tr key={o.order_id}>
                <td>#{o.order_id}</td>

                <td>{o.customer_name || "Unknown Customer"}</td>

                <td>₹{o.total_amount || o.total_price}</td>

                <td>{o.order_status || o.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No Orders Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}