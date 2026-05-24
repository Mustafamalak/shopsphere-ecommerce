import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShoppingCart, Star, PackageCheck } from "lucide-react";
import api from "../api/axios.js";
import { useCart } from "../context/CartContext.jsx";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.product);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <main className="page">
        <div className="container empty-state card">Loading product...</div>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="container product-detail card">
        <div className="detail-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="detail-info">
          <span className="badge">{product.category}</span>
          <h1>{product.name}</h1>

          <div className="detail-rating">
            <Star size={18} fill="currentColor" />
            <span>{product.rating || 4.5} rating</span>
          </div>

          <p>{product.description}</p>

          <div className="detail-price">₹{product.price}</div>

          <div className="detail-stock">
            <PackageCheck size={19} />
            {product.stock > 0 ? `${product.stock} units available` : "Out of stock"}
          </div>

          <div className="quantity-box">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity((q) => q + 1)}>+</button>
          </div>

          <button
            className="btn btn-primary detail-cart-btn"
            disabled={product.stock <= 0}
            onClick={() => addToCart(product, quantity)}
          >
            <ShoppingCart size={19} />
            Add to Cart
          </button>
        </div>
      </section>
    </main>
  );
};

export default ProductDetails;