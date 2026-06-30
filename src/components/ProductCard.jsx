import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";

const PLACEHOLDER = "https://via.placeholder.com/200?text=No+Image";

const ProductCard = ({ product, onEdit, onDelete }) => {
  const dispatch = useDispatch();

  return (
    <div className="product-card">
      <img
        src={product.image}
        alt={product.title}
        className="product-image"
        onError={(e) => {
          e.target.src = PLACEHOLDER;
        }}
      />
      <h3 className="product-title">{product.title}</h3>
      <p className="product-category">{product.category}</p>
      <p className="product-price">${product.price}</p>
      <p className="product-rating">
        ⭐ {product.rating?.rate} ({product.rating?.count})
      </p>
      <p className="product-description">{product.description}</p>
      <button className="btn" onClick={() => dispatch(addToCart(product))}>
        Add to Cart
      </button>

      {(onEdit || onDelete) && (
        <div className="card-admin-actions">
          {onEdit && (
            <button className="btn-link" onClick={onEdit}>
              Edit
            </button>
          )}
          {onDelete && (
            <button className="btn-link danger" onClick={onDelete}>
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductCard;
