import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import "../../styles/user.css";

export default function Cart() {

  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  /* =========================
     1 LOAD CART FROM STORAGE
  ========================= */
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  /* =========================
     2 REMOVE ITEM
  ========================= */
  const removeItem = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  /* =========================
     3 PLACE ORDER
  ========================= */
  const handleCheckout = async () => {

    try {

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first!");
        navigate("/login");
        return;
      }

      if (cart.length === 0) {
        alert("Cart is empty!");
        return;
      }

      const orderItems = cart.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }));

      const res = await api.post(
        "/orders/create",
        { items: orderItems },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.status === 200 || res.status === 201) {

        alert("Order placed successfully 🌱");

        localStorage.removeItem("cart");
        setCart([]);

        navigate("/orders");

      }

    } catch (err) {

      console.error("Checkout Error:", err.response?.data || err.message);

      alert(
        err.response?.data?.message ||
        "Failed to place order. Please try again."
      );

    }

  };

  const totalAmount = cart.reduce(
    (acc, item) => acc + (item.price * item.quantity),
    0
  );

  return (
    <div className="user-page">

      <h2>My Cart 🛒</h2>

      {cart.length === 0 ? (

        <div className="empty-cart-msg">
          <p>Your cart is empty. Start shopping!</p>
          <button onClick={() => navigate("/products")}>
            View Products
          </button>
        </div>

      ) : (

        <>
          <table className="cart-table">

            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {cart.map(item => (
                <tr key={item.id}>

                  <td>{item.name}</td>

                  <td>₹{item.price}</td>

                  <td>{item.quantity}</td>

                  <td>₹{item.price * item.quantity}</td>

                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

          <div className="cart-summary">

            <h3>Grand Total: ₹{totalAmount}</h3>

            <button
              className="checkout-btn"
              onClick={handleCheckout}
            >
              Place Order Now
            </button>

          </div>
        </>
      )}

    </div>
  );
}