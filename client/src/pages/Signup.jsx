import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, ShoppingBag } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import "./Auth.css";

const Signup = () => {
  const navigate = useNavigate();
  const { signup, loading } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(formData.email)) {
  setError("Please enter a valid email address");
  return;
}

if (formData.password.length < 6) {
  setError("Password must be at least 6 characters");
  return;
}
    try {
      await signup(formData);
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed");
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

        <h1>Create account</h1>
        <p>Join ShopSphere and enjoy a clean full-stack shopping experience.</p>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            className="input"
            type="text"
            name="name"
            placeholder="Full name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            className="input"
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
          />

          <input
            className="input"
            type="password"
            name="password"
            placeholder="Password min 6 characters"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />

          <button className="btn btn-primary auth-submit" disabled={loading}>
            <UserPlus size={18} />
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </section>
    </main>
  );
};

export default Signup;