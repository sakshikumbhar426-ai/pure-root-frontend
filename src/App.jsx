import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

/* Layouts */
import AdminLayout from "./pages/Admin/AdminLayout";

/* Home */
import Home from "./pages/Home";

/* Admin Pages */
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Users from "./pages/Admin/Users";
import Vendors from "./pages/Admin/Vendors";
import AdminProducts from "./pages/Admin/Products";
import AdminOrders from "./pages/Admin/Orders";

/* User Pages */
import UserProducts from "./pages/User/Products";
import Cart from "./pages/User/Cart";
import UserOrders from "./pages/User/Orders";
import Profile from "./pages/User/Profile";
import ProductDetails from "./pages/User/ProductDetails";

/* Vendor Pages */
import AddProduct from "./pages/Vendor/AddProduct";
import MyProducts from "./pages/Vendor/MyProducts";
import VendorOrders from "./pages/Vendor/Orders";

/* Auth Pages */
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {

  const location = useLocation();

  // Navbar/Footer hide on login & register
  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/register";

  // Hide footer on admin pages
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="d-flex flex-column min-vh-100">

      {!hideLayout && <Navbar />}

      <main className="flex-grow-1">

        <Routes>

          {/* PUBLIC */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<UserProducts />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* USER */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<UserOrders />} />
          <Route path="/profile" element={<Profile />} />

          {/* VENDOR */}
          <Route path="/vendor/add-product" element={<AddProduct />} />
          <Route path="/vendor/my-products" element={<MyProducts />} />
          <Route path="/vendor/orders" element={<VendorOrders />} />

          {/* ADMIN */}
          <Route path="/admin" element={<AdminLayout />}>

            <Route index element={<Navigate to="dashboard" />} />

            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />

          </Route>

          {/* 404 */}
          <Route
            path="*"
            element={
              <div style={{ padding: "5rem", textAlign: "center" }}>
                <h2>404 – Page Not Found</h2>
                <p>The page you are looking for does not exist.</p>
              </div>
            }
          />

        </Routes>

      </main>

      {!hideLayout && !isAdminPage && <Footer />}

    </div>
  );
}

export default App;