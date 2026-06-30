import { useState } from "react";
import { addProduct, updateProduct } from "../api/products";

const ProductForm = ({ product, onClose }) => {
  const isEditing = Boolean(product);

  const [title, setTitle] = useState(product?.title || "");
  const [price, setPrice] = useState(product?.price || "");
  const [category, setCategory] = useState(product?.category || "");
  const [description, setDescription] = useState(product?.description || "");
  const [image, setImage] = useState(product?.image || "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      title,
      price: Number(price),
      category,
      description,
      image,
      rating: product?.rating || { rate: 0, count: 0 },
    };

    if (isEditing) {
      await updateProduct(product.id, productData);
    } else {
      await addProduct(productData);
    }

    onClose();
  };

  return (
    <div className="form-overlay">
      <div className="auth-form product-form">
        <h2>{isEditing ? "Edit Product" : "Add Product"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
          <input
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
          />
          <div className="form-actions">
            <button type="submit" className="btn">
              {isEditing ? "Save Changes" : "Add Product"}
            </button>
            <button type="button" className="btn-link" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
