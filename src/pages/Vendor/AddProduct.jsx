import { useState, useEffect } from "react";
import { FaCloudUploadAlt, FaLeaf, FaMapMarkerAlt, FaTag, FaBox, FaRupeeSign, FaExclamationTriangle } from "react-icons/fa";
import api from "../../api/api";
import "../../styles/addProduct.css";

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    category: "", 
    packaging: "", 
    price: "",
    quantity: "",
    location: "",
    description: "",
    latitude: "", // String rakha hai taaki controlled input rahe
    longitude: "" 
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(null); 
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await api.get("/vendors/profile"); 
        setIsVerified(res.data.verified_status);
      } catch (err) {
        console.error("Status check error:", err);
        setIsVerified(false);
      } finally {
        setCheckingStatus(false);
      }
    };
    checkStatus();
  }, []);

  const getGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString()
        }));
        alert("Location captured successfully! 📍");
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isVerified) {
      alert("Verification Pending! You cannot list products yet.");
      return;
    }

    if (!image) {
      alert("Please upload a product image.");
      return;
    }

    setLoading(true);
    const data = new FormData();
    
    // Manual append taaki null values clean ho sakein
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("quantity", formData.quantity);
    data.append("location", formData.location);
    data.append("description", formData.description);
    data.append("packaging", formData.packaging);
    
    // Latitude/Longitude empty string hain toh bhejte hi nahi
    if (formData.latitude) data.append("latitude", formData.latitude);
    if (formData.longitude) data.append("longitude", formData.longitude);
    
    data.append("image", image);

    try {
      await api.post("/products", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      alert("Product Added Successfully! 🌱");
      
      // Form reset with correct initial state
      setFormData({ 
        name: "", category: "", packaging: "", price: "", 
        quantity: "", location: "", description: "", 
        latitude: "", longitude: "" 
      });
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error("Submission Error:", err.response?.data);
      alert(err.response?.data?.error || err.response?.data?.message || "Error adding product");
    } finally {
      setLoading(false);
    }
  };

  if (checkingStatus) return <div className="loader">Verifying Vendor Status...</div>;

  return (
    <div className="add-product-wrapper">
      <div className="add-product-card shadow">
        
        {!isVerified && (
          <div className="verification-banner-eco">
            <FaExclamationTriangle />
            <span>
              <strong>Verification Pending:</strong> Your account is awaiting admin approval.
            </span>
          </div>
        )}

        <div className="card-header-eco">
          <FaLeaf className="eco-icon" />
          <h2>List New Product</h2>
          <p>Add your sustainable products to the PureRoot marketplace</p>
        </div>

        <form onSubmit={handleSubmit} className={`modern-form ${!isVerified ? "form-disabled" : ""}`}>
          <div className="form-grid">
            <div className="form-left">
              <div className="input-group-eco">
                <label><FaTag /> Product Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  placeholder="Organic Cotton Bag" 
                  onChange={handleChange} 
                  disabled={!isVerified} 
                  required 
                />
              </div>

              <div className="row-eco">
                <div className="input-group-eco">
                  <label><FaRupeeSign /> Price</label>
                  <input 
                    type="number" 
                    name="price" 
                    value={formData.price} 
                    placeholder="0.00" 
                    onChange={handleChange} 
                    disabled={!isVerified} 
                    required 
                  />
                </div>
                <div className="input-group-eco">
                  <label><FaBox /> Quantity</label>
                  <input 
                    type="text" 
                    name="quantity" 
                    value={formData.quantity} 
                    placeholder="e.g. 50 g, 100 ml, 10 units" 
                    onChange={handleChange} 
                    disabled={!isVerified} 
                    required 
                  />
                </div>
              </div>

              <div className="input-group-eco">
                <label>Material Type (Eco-Impact)</label>
                <select name="category" value={formData.category} onChange={handleChange} required disabled={!isVerified}>
                  <option value="">Select Material</option>
                  <option value="Organic">Organic</option>
                  <option value="Handmade">Handmade</option>
                  <option value="Recycled">Recycled</option>
                  <option value="Natural">Natural</option>
                  <option value="Synthetic">Synthetic</option>
                </select>
              </div>

               <div className="input-group-eco">
                <label>Packaging Type</label>
                <select name="packaging" value={formData.packaging} onChange={handleChange} required disabled={!isVerified}>
                  <option value="">Select Packaging</option>
                  <option value="Zero-Waste">Zero-Waste (Glass/Cloth)</option>
                  <option value="Biodegradable">Biodegradable</option>
                  <option value="Paper">Paper-based</option>
                  <option value="Recycled Plastic">Recycled Plastic</option>
                  <option value="Standard">Standard Plastic</option>
                </select>
              </div>

              <div className="input-group-eco">
                <label><FaMapMarkerAlt /> Shop/Farm Location</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" name="location" value={formData.location} 
                    placeholder="City, State" onChange={handleChange} required disabled={!isVerified} 
                  />
                  <button 
                    type="button" onClick={getGeoLocation} className="geo-btn"
                    title="Get current coordinates" disabled={!isVerified}
                  >
                    📍
                  </button>
                </div>
                {formData.latitude && <small style={{color: 'green', fontWeight: 'bold'}}>Coordinates Captured!</small>}
              </div>
              
              <div className="input-group-eco">
                <label>Product Description</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  placeholder="Describe your eco-friendly product..." 
                  onChange={handleChange} 
                  disabled={!isVerified} 
                  rows="3"
                ></textarea>
              </div>
            </div>

            <div className="form-right">
              <div className="image-upload-area">
                <label className="upload-label">Product Image</label>
                <div className={`image-dropzone ${!isVerified ? "upload-disabled" : ""}`}>
                  <input 
                    type="file" 
                    id="file-upload" 
                    onChange={handleImageChange} 
                    hidden 
                    disabled={!isVerified} 
                  />
                  <label htmlFor="file-upload" className="dropzone-content">
                    {preview ? (
                      <img src={preview} alt="Preview" className="img-preview-eco" />
                    ) : (
                      <>
                        <FaCloudUploadAlt className="upload-icon" />
                        <span>Upload Product Photo</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <button 
                type="submit" 
                className={`eco-submit-btn ${!isVerified ? "btn-locked" : ""}`} 
                disabled={loading || !isVerified}
              >
                {loading ? "Processing..." : isVerified ? "Add Product to Store" : "Waiting for Approval"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}