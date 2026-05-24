import { useEffect, useState } from "react";
import { PackagePlus, ShoppingBag, ClipboardList, Trash2 } from "lucide-react";
import api from "../api/axios.js";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: "",
    rating: 4.5,
    isFeatured: false,
  });

  const fetchAdminData = async () => {
    try {
      const productsRes = await api.get("/products");
      const ordersRes = await api.get("/orders");

      setProducts(productsRes.data.products || []);
      setOrders(ordersRes.data.orders || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setProductForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const createProduct = async (e) => {
    e.preventDefault();

    await api.post("/products", {
      ...productForm,
      price: Number(productForm.price),
      stock: Number(productForm.stock),
      rating: Number(productForm.rating),
    });

    setProductForm({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      stock: "",
      rating: 4.5,
      isFeatured: false,
    });

    fetchAdminData();
  };

  const deleteProduct = async (id) => {
    await api.delete(`/products/${id}`);
    fetchAdminData();
  };

  const updateOrderStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    fetchAdminData();
  };

  return (
    <main className="page">
      <section className="container admin-head">
        <span className="badge">Admin Control</span>
        <h1>Manage ShopSphere</h1>
      </section>

      <section className="container admin-stats">
        <div className="card admin-stat">
          <ShoppingBag size={24} />
          <span>Products</span>
          <strong>{products.length}</strong>
        </div>

        <div className="card admin-stat">
          <ClipboardList size={24} />
          <span>Orders</span>
          <strong>{orders.length}</strong>
        </div>

        <div className="card admin-stat">
          <PackagePlus size={24} />
          <span>Featured</span>
          <strong>{products.filter((p) => p.isFeatured).length}</strong>
        </div>
      </section>

      <section className="container admin-layout">
        <form className="card product-form" onSubmit={createProduct}>
          <h2>Add Product</h2>

          <input
            className="input"
            name="name"
            placeholder="Product name"
            value={productForm.name}
            onChange={handleChange}
            required
          />

          <textarea
            className="input"
            name="description"
            placeholder="Description"
            value={productForm.description}
            onChange={handleChange}
            required
          />

          <div className="form-two">
            <input
              className="input"
              name="price"
              type="number"
              placeholder="Price"
              value={productForm.price}
              onChange={handleChange}
              required
            />

            <input
              className="input"
              name="stock"
              type="number"
              placeholder="Stock"
              value={productForm.stock}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-two">
            <input
              className="input"
              name="category"
              placeholder="Category"
              value={productForm.category}
              onChange={handleChange}
              required
            />

            <input
              className="input"
              name="rating"
              type="number"
              step="0.1"
              placeholder="Rating"
              value={productForm.rating}
              onChange={handleChange}
            />
          </div>

          <input
            className="input"
            name="image"
            placeholder="Image URL"
            value={productForm.image}
            onChange={handleChange}
            required
          />

          <label className="featured-check">
            <input
              type="checkbox"
              name="isFeatured"
              checked={productForm.isFeatured}
              onChange={handleChange}
            />
            Mark as featured product
          </label>

          <button className="btn btn-primary">Add Product</button>
        </form>

        <div className="card admin-products">
          <h2>Products</h2>

          <div className="admin-list">
            {products.map((product) => (
              <div className="admin-product" key={product._id}>
                <img src={product.image} alt={product.name} />

                <div>
                  <strong>{product.name}</strong>
                  <p>₹{product.price} • {product.category}</p>
                </div>

                <button onClick={() => deleteProduct(product._id)}>
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container card admin-orders">
        <h2>Recent Orders</h2>

        <div className="orders-table">
          {orders.map((order) => (
            <div className="admin-order" key={order._id}>
              <div>
                <strong>#{order._id.slice(-6).toUpperCase()}</strong>
                <p>{order.user?.name || "User"} • ₹{order.totalAmount}</p>
              </div>

              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
              >
                <option>Pending</option>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default AdminDashboard;