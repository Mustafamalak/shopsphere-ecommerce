import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} className="product-image-wrap">
        <img src={product.image} alt={product.name} className="product-image" />
        <span className="product-category">{product.category}</span>
      </Link>

      <div className="product-content">
        <div className="rating">
          <Star size={16} fill="currentColor" />
          <span>{product.rating || 4.5}</span>
        </div>

        <Link to={`/products/${product._id}`}>
          <h3>{product.name}</h3>
        </Link>

        <p>{product.description}</p>

        <div className="product-footer">
          <div>
            <span className="price">₹{product.price}</span>
            <span className="stock">{product.stock > 0 ? "In stock" : "Out of stock"}</span>
          </div>

          <button
            className="add-btn"
            onClick={() => addToCart(product)}
            disabled={product.stock <= 0}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;