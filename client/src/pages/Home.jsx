import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  CreditCard,
  ShoppingCart,
} from "lucide-react";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import "./Home.css";

const Home = () => {
  const { user } = useAuth();
  const [featured, setFeatured] = useState([]);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [featuredRes, productsRes] = await Promise.all([
          api.get("/products/featured"),
          api.get("/products"),
        ]);

        setFeatured(featuredRes.data.products || []);
        setProductCount(productsRes.data.count || 0);
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      }
    };

    fetchHomeData();
  }, []);

  const avgRating =
    featured.length > 0
      ? (
          featured.reduce(
            (sum, product) => sum + Number(product.rating || 0),
            0
          ) / featured.length
        ).toFixed(1)
      : "4.5";

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
            an admin-powered shopping experience built with a full-stack MERN
            workflow.
          </p>

          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary">
              Explore Products <ArrowRight size={18} />
            </Link>

            {user ? (
              <Link to="/cart" className="btn btn-secondary">
                <ShoppingCart size={18} />
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
              <strong>{productCount}</strong>
              <span>Total Products</span>
            </div>
            <div>
              <strong>{avgRating}</strong>
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
              src={
                featured[0]?.image ||
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
              }
              alt={featured[0]?.name || "Featured product"}
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
          <p>Products are managed from the admin dashboard and stored in MongoDB.</p>
        </div>

        <div>
          <Truck size={24} />
          <h3>Simple ordering</h3>
          <p>Cart, shipping details and cash-on-delivery checkout are included.</p>
        </div>

        <div>
          <Sparkles size={24} />
          <h3>Full-stack control</h3>
          <p>Admin can add products, delete products and update order status.</p>
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
          featured.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <div className="empty-state card">
            <h3>No featured products yet</h3>
            <p>Add featured products from the admin dashboard or seed script.</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;