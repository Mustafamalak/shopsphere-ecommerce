import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import "./Products.css";

const categories = ["All", ...new Set(products.map((product) => product.category))];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (search.trim()) params.append("search", search.trim());
      if (category !== "All") params.append("category", category);

      const { data } = await api.get(`/products?${params.toString()}`);
      setProducts(data.products || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [search, category]);

  return (
    <main className="page">
      <section className="container products-hero card">
        <span className="badge">
          <SlidersHorizontal size={16} />
          Smart catalog
        </span>
        <h1>Find products that fit your lifestyle.</h1>
        <p>
  Search and filter from {products.length} available products with a smooth shopping flow.
</p>
      </section>

      <section className="container product-tools">
        <div className="search-box">
          <Search size={19} />
          <input
            type="text"
            placeholder="Search sneakers, watch, hoodie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="category-pills">
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? "active" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="container products-grid product-list-grid">
        {loading ? (
          <div className="empty-state card">Loading products...</div>
        ) : products.length > 0 ? (
          products.map((product) => <ProductCard key={product._id} product={product} />)
        ) : (
          <div className="empty-state card">
            <h3>No products found</h3>
            <p>Try another search or category.</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default Products;