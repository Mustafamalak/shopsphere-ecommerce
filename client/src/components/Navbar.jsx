import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, ShoppingCart, User, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="logo">
          <span className="logo-icon">
            <ShoppingBag size={22} />
          </span>
          <span>ShopSphere</span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">Products</NavLink>
          {user && <NavLink to="/my-orders">My Orders</NavLink>}
          {user?.role === "admin" && (
            <NavLink to="/admin" className="admin-link">
              <ShieldCheck size={16} />
              Admin
            </NavLink>
          )}
        </nav>

        <div className="nav-actions">
          <Link to="/cart" className="cart-btn">
            <ShoppingCart size={20} />
            {totalItems > 0 && <span>{totalItems}</span>}
          </Link>

          {user ? (
            <div className="user-box">
              <div className="user-pill">
                <User size={16} />
                <span>{user.name.split(" ")[0]}</span>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                <LogOut size={17} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary nav-login">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;