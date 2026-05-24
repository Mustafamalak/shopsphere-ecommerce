import { useEffect, useState } from "react";
import { PackageCheck } from "lucide-react";
import api from "../api/axios.js";
import "./MyOrders.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders/my-orders");
      setOrders(data.orders || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <main className="page">
      <section className="container orders-head">
        <span className="badge">
          <PackageCheck size={16} />
          My Orders
        </span>
        <h1>Track your purchases</h1>
      </section>

      <section className="container orders-list">
        {loading ? (
          <div className="card order-card">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="card order-card">
            <h3>No orders yet</h3>
            <p>Your placed orders will appear here.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div className="card order-card" key={order._id}>
              <div className="order-top">
                <div>
                  <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
                  <p>{new Date(order.createdAt).toLocaleString()}</p>
                </div>

                <span className={`order-status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-items">
                {order.items.map((item) => (
                  <div className="order-item" key={item.product}>
                    <img src={item.image} alt={item.name} />
                    <div>
                      <strong>{item.name}</strong>
                      <p>
                        ₹{item.price} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-total">
                <span>Total</span>
                <strong>₹{order.totalAmount}</strong>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
};

export default MyOrders;