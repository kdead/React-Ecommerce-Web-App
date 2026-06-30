import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProducts, deleteProduct } from "../api/products";
import ProductCard from "./ProductCard";
import ProductForm from "./ProductForm";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const [category, setCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  // Derive categories from the products we already have — no separate fetch needed
  const categories = products
    ? [...new Set(products.map((p) => p.category))]
    : [];

  const visibleProducts =
    category === "all"
      ? products
      : products?.filter((p) => p.category === category);

  const handleDelete = async (id) => {
    await deleteProduct(id);
    queryClient.invalidateQueries({ queryKey: ["products"] }); // refetch after delete
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
    queryClient.invalidateQueries({ queryKey: ["products"] }); // refetch after add/edit
  };

  if (isLoading) return <p className="status">Loading products...</p>;
  if (isError)
    return <p className="status">Something went wrong. Please try again.</p>;

  return (
    <div className="home">
      <div className="filter-bar">
        <label htmlFor="category">Category: </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {currentUser && (
          <button className="btn" onClick={() => setShowForm(true)}>
            + Add Product
          </button>
        )}
      </div>

      {showForm && (
        <ProductForm product={editingProduct} onClose={handleFormClose} />
      )}

      <div className="product-grid">
        {visibleProducts?.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={currentUser ? () => handleEdit(product) : null}
            onDelete={currentUser ? () => handleDelete(product.id) : null}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
