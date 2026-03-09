import { useEffect, useState } from "react";
import api from "../../api/api";

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVendors = async () => {
    try {
      const res = await api.get("/admin/vendors");
      setVendors(res.data);
    } catch (err) {
      console.error("Vendors fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // Vendor ko verify karne ka function
  const verifyVendor = async (id) => {
    try {
      await api.put(`/admin/vendors/verify/${id}`); // Backend route check karein
      alert("Vendor approved successfully!");
      fetchVendors(); // List refresh karein
    } catch (err) {
      alert("Error verifying vendor");
    }
  };

  const deleteVendor = async (id) => {
    if (!window.confirm("Delete this vendor?")) return;
    try {
      await api.delete(`/admin/vendors/${id}`);
      setVendors(vendors.filter((v) => v.vendor_id !== id));
      alert("Vendor deleted successfully");
    } catch (err) {
      alert("Error deleting vendor");
    }
  };

  if (loading) return <div className="loading">Loading Vendors...</div>;

  return (
    <div className="admin-page">
      <h2>Vendor Management</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Store Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendors.length > 0 ? (
            vendors.map((v) => (
              <tr key={v.vendor_id}>
                <td>{v.shop_name || "N/A"}</td>
                <td>{v.email}</td> 
                  <td>
                 <span className={`status-badge ${v.verified_status ? "verified" : "pending"}`}>
                  {v.verified_status ? "Verified" : "Pending"}
                 </span>
                    </td>
                <td>
                  {!v.verified_status && (
                    <button 
                      className="verify-btn" 
                      onClick={() => verifyVendor(v.vendor_id)}
                      style={{ marginRight: "10px", backgroundColor: "#27ae60", color: "white" }}
                    >
                      Approve
                    </button>
                  )}
                  <button 
                    className="delete-btn" 
                    onClick={() => deleteVendor(v.vendor_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="4">No vendors found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}