import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, ShieldCheck, Truck, CreditCard } from "lucide-react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import "./Home.css";
import { useAuth } from "../context/AuthContext.jsx";

const Home = () => {
  const { user } = useAuth();
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get("/products/featured");
        setFeatured(data.products || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <main className="page">
      <section className="container hero">
        <div className="hero-content">
          <span className="badge">
            <Sparkles size={16} />
            Premium shopping experience
          </span>

          <h1>Upgrade your everyday shopping with ShopSphere.</h1>

          <p>
            Discover curated products, smooth checkout, smart cart handling and
            a clean admin-powered shopping experience.
          </p>

          <div className="hero-actions">
  <Link to="/products" className="btn btn-primary">
    Explore Products <ArrowRight size={18} />
  </Link>

  {user ? (
    <Link to="/cart" className="btn btn-secondary">
      View Cart
    </Link>
  ) : (
    <Link to="/signup" className="btn btn-secondary">
      Create Account
    </Link>
  )}
</div>

          <div className="hero-stats">
  <div>
    <strong>{featured.length}+</strong>
    <span>Featured Items</span>
  </div>
  <div>
    <strong>
      {featured.length
        ? (
            featured.reduce((sum, product) => sum + Number(product.rating || 0), 0) /
            featured.length
          ).toFixed(1)
        : "4.5"}
    </strong>
    <span>Avg Rating</span>
  </div>
  <div>
    <strong>COD</strong>
    <span>Payment</span>
  </div>
</div>
        </div>

        <div className="hero-visual card">
          <div className="floating-card card card-one">
            <Truck size={22} />
            <span>Fast Delivery</span>
          </div>

          <div className="hero-product">
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30"
              alt="Smart watch"
            />
          </div>

          <div className="floating-card card card-two">
            <CreditCard size={22} />
            <span>Secure Checkout</span>
          </div>
        </div>
      </section>

      <section className="container feature-strip">
        <div>
          <ShieldCheck size={24} />
          <h3>Trusted quality</h3>
          <p>Clean product catalog with reliable stock and pricing.</p>
        </div>
        <div>
          <Truck size={24} />
          <h3>Simple ordering</h3>
          <p>Cart, shipping details and cash-on-delivery order flow.</p>
        </div>
        <div>
          <Sparkles size={24} />
          <h3>Admin powered</h3>
          <p>Admin can manage products and track customer orders.</p>
        </div>
      </section>

      <section className="container section-head">
        <div>
          <span className="badge">Featured Collection</span>
          <h2>Popular picks for you</h2>
        </div>
        <Link to="/products" className="view-all">
          View all <ArrowRight size={18} />
        </Link>
      </section>

      <section className="container products-grid">
        {featured.length > 0 ? (
          featured.map((product) => <ProductCard key={product._id} product={product} />)
        ) : (
          <div className="empty-state card">
            <h3>No featured products yet</h3>
            <p>Add products from your backend/admin panel with isFeatured set to true.</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;