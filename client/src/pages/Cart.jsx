import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingCart, PackageCheck } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import "./Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalAmount,
  } = useCart();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  const handleAddressChange = (e) => {
    setShippingAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (!user) {
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      setError("Cart is empty");
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
const pincodeRegex = /^[1-9][0-9]{5}$/;

if (!phoneRegex.test(shippingAddress.phone)) {
  setError("Enter a valid 10-digit Indian phone number");
  return;
}

if (shippingAddress.address.trim().length < 8) {
  setError("Address must be at least 8 characters long");
  return;
}

if (shippingAddress.city.trim().length < 2) {
  setError("Enter a valid city name");
  return;
}

if (!pincodeRegex.test(shippingAddress.pincode)) {
  setError("Enter a valid 6-digit Indian pincode");
  return;
}

    try {
      setPlacing(true);

      await api.post("/orders", {
        items: cartItems.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
        shippingAddress,
        paymentMethod: "Cash on Delivery",
      });

      clearCart();
      navigate("/my-orders");
    } catch (error) {
      setError(error.response?.data?.message || "Order failed");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <main className="page">
      <section className="container cart-head">
        <span className="badge">
          <ShoppingCart size={16} />
          Shopping Cart
        </span>
        <h1>Your cart and checkout</h1>
      </section>

      {cartItems.length === 0 ? (
        <section className="container empty-cart card">
          <h2>Your cart is empty</h2>
          <p>Add products from catalog to place an order.</p>
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </section>
      ) : (
        <section className="container cart-layout">
          <div className="cart-items card">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.product}>
                <img src={item.image} alt={item.name} />

                <div className="cart-info">
                  <h3>{item.name}</h3>
                  <p>₹{item.price}</p>
                </div>

                <div className="cart-qty">
                  <button onClick={() => updateQuantity(item.product, item.quantity - 1)}>
                    <Minus size={15} />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product, item.quantity + 1)}>
                    <Plus size={15} />
                  </button>
                </div>

                <strong>₹{item.price * item.quantity}</strong>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.product)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <form className="checkout-card card" onSubmit={placeOrder}>
            <h2>Checkout</h2>
            <p>Payment method: Cash on Delivery</p>

            {error && <div className="form-error">{error}</div>}

            <div className="checkout-grid">
              <input
                className="input"
                name="fullName"
                placeholder="Full name"
                value={shippingAddress.fullName}
                onChange={handleAddressChange}
                required
              />
              <input
                className="input"
                name="phone"
                placeholder="Phone number"
                value={shippingAddress.phone}
                onChange={handleAddressChange}
                required
                pattern="[6-9][0-9]{9}"
              />
              <input
                className="input full"
                name="address"
                placeholder="Address"
                value={shippingAddress.address}
                onChange={handleAddressChange}
                required
              />
              <input
                className="input"
                name="city"
                placeholder="City"
                value={shippingAddress.city}
                onChange={handleAddressChange}
                required
              />
              <input
                className="input"
                name="pincode"
                placeholder="Pincode"
                value={shippingAddress.pincode}
                onChange={handleAddressChange}
                required
                pattern="[1-9][0-9]{5}"
              />
            </div>

            <div className="total-row">
              <span>Total Amount</span>
              <strong>₹{totalAmount}</strong>
            </div>

            <button className="btn btn-primary checkout-btn" disabled={placing}>
              <PackageCheck size={18} />
              {placing ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </section>
      )}
    </main>
  );
};

export default Cart;