import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate add kiya
import { 
  FaLeaf, FaRecycle, FaHandHoldingHeart, FaArrowRight, 
  FaStore, FaSeedling, FaGlobeAmericas, FaShoppingBasket 
} from "react-icons/fa";
import api from "../api/api";

// Swiper Components aur Styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

// Animation Library
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/home.css";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const navigate = useNavigate(); // Navigation ke liye
  const API_BASE_URL = "http://localhost:5000";

  // Banner images remains the same
  const bannerImages = [
    { 
      id: 1, 
      img: "/food-banner.jpg", 
      title: "Healthy Organic Food", 
      text: "Straight from local farms to your kitchen." 
    },
    { 
      id: 2, 
      img: "/handcraft-banner.jpg", 
      title: "Artistry in Every Stitch", 
      text: "Every piece is a masterpiece, handcrafted with love by local artisans." 
    },
    { 
      id: 3, 
      img: "/skin-care-banner.jpg", 
      title: "Organic Cosmetic Brands", 
      text: "Pure beauty powered by nature's essence." 
    }
  ];

  const categories = [
    { id: 'cat-food', name: "Organic Food", icon: <FaSeedling />, class: "cat-1" },
    { id: 'cat-crafts', name: "Handmade Crafts", icon: <FaHandHoldingHeart />, class: "cat-2" },
    { id: 'cat-waste', name: "Zero-Waste", icon: <FaRecycle />, class: "cat-3" },
    { id: 'cat-gadgets', name: "Eco-Gadgets", icon: <FaLeaf />, class: "cat-4" }
  ];

  // 🌿 Helper: Eco-Score Color Logic
  const getEcoColor = (score) => {
    if (score >= 80) return "#2d6a4f"; 
    if (score >= 50) return "#74c69d"; 
    return "#ffb703"; 
  };

  // Image path helper for featured products
  const getProductImg = (img) => {
    if (!img) return "https://placehold.co/400x400?text=Eco+Product";
    if (img.startsWith('http')) return img;
    const fileName = img.split('/').pop().split('\\').pop();
    return `${API_BASE_URL}/uploads/products/${fileName}`;
  };

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        const data = Array.isArray(res.data) ? res.data : (res.data.products || []);
        // Latest 4 products as featured
        setFeaturedProducts(data.slice(0, 4));
      } catch (err) {
        console.error("Product fetch failed:", err.message);
        setFeaturedProducts([
          { id: 1, product_name: "Smiley Doll Planter", price: "230", material_type: "Handmade", image: "", eco_score: 95 },
          { id: 2, product_name: "Handmade Clay Pot", price: "850", material_type: "Crafts", image: "", eco_score: 88 },
        ]);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="home-wrapper">
      
      {/* 1. SCROLLING HERO SECTION */}
      <section className="hero-slider-container">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="hero-swiper"
        >
          {bannerImages.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div 
                className="hero-slide" 
                style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${slide.img})` }}
              >
                <div className="hero-content" data-aos="zoom-out">
                  <span className="hero-badge">🌿 100% Eco-Friendly</span>
                  <h1>{slide.title}</h1>
                  <p>{slide.text}</p>
                  <div className="hero-actions">
                    <Link to="/products" className="btn-main">Explore Now</Link>
                    <button className="btn-sub">Learn More</button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* 2. CATEGORY SHOWCASE */}
      <section className="home-section">
        <h2 className="section-heading" data-aos="fade-up">Shop by Category</h2>
        <div className="category-container">
          {categories.map((cat, index) => (
            <div 
              key={cat.id} 
              className={`category-card ${cat.class}`} 
              data-aos="zoom-in" 
              data-aos-delay={index * 100}
            >
              <div className="cat-icon">{cat.icon}</div>
              <h3>{cat.name}</h3>
              <Link to={`/products?cat=${cat.name}`} className="cat-link">View More</Link>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS (Updated with Eco Logic) */}
      <section className="home-section bg-light">
        <div className="section-flex" data-aos="fade-up">
          <h2 className="section-heading">Trending Sustainable Products</h2>
          <Link to="/products" className="text-link">View All <FaArrowRight /></Link>
        </div>
        
        <div className="featured-grid">
          {featuredProducts.map((p, index) => (
            <div 
              key={p.product_id || p.id || index} 
              className="modern-p-card" 
              data-aos="fade-up" 
              data-aos-delay={index * 100}
              onClick={() => navigate(`/product/${p.product_id || p.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="p-img-box">
                <img 
                  src={getProductImg(p.image)} 
                  alt={p.product_name} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/400x400?text=Image+Error";
                  }}
                />
                {/* Dynamic Eco-Score Badge */}
                <span className="eco-tag" style={{ backgroundColor: getEcoColor(p.eco_score || 85) }}>
                  <FaLeaf /> Score: {p.eco_score || '85'}
                </span>
              </div>
              <div className="p-info">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <small className="product-cat-tag">{p.material_type || "Sustainable"}</small>
                    <small style={{ fontSize: '0.65rem', color: '#2d6a4f', fontWeight: 'bold' }}>
                        {p.packaging_type ? `📦 ${p.packaging_type}` : ""}
                    </small>
                </div>
                
                <h4>{p.product_name}</h4>
                
                <div className="p-price-row">
                  <span className="price">₹{p.price}</span>
                  <div className="card-actions">
                    <button 
                      className="add-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`${p.product_name} added to cart! 🌱`);
                      }}
                    >
                      <FaShoppingBasket />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. IMPACT STATS */}
      <section className="impact-stats" data-aos="zoom-in">
        <div className="impact-overlay">
          <h2 className="section-heading white">Our Impact</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <FaLeaf />
              <h3>5,000+</h3>
              <p>Trees Saved</p>
            </div>
            <div className="stat-card">
              <FaGlobeAmericas />
              <h3>12k kg</h3>
              <p>Plastic Reduced</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}