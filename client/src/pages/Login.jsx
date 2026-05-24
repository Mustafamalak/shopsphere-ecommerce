import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, ShoppingBag } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(formData);
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <main className="page auth-page">
      <section className="auth-card card">
        <div className="auth-brand">
          <div className="auth-icon">
            <ShoppingBag size={30} />
          </div>
          <span>ShopSphere</span>
        </div>

        <h1>Welcome back</h1>
        <p>Login to continue shopping, manage cart and track your orders.</p>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            className="input"
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            className="input"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button className="btn btn-primary auth-submit" disabled={loading}>
            <LogIn size={18} />
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          New here? <Link to="/signup">Create account</Link>
        </div>
      </section>
    </main>
  );
};

export default Login;