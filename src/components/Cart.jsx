import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  incrementItem,
  decrementItem,
  clearCart,
} from "../features/cart/cartSlice";
import { createOrder } from "../api/orders";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const PLACEHOLDER = "https://via.placeholder.com/100?text=No+Image";

const Cart = () => {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const [checkedOut, setCheckedOut] = useState(false);
  const [error, setError] = useState("");

  const totalCount = items.reduce((sum, item) => sum + item.count, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.count,
    0,
  );

  const handleCheckout = async () => {
    if (!currentUser) {
      setError("Please log in to check out.");
      return;
    }
    try {
      await createOrder(currentUser.uid, items, totalPrice);
      dispatch(clearCart());
      setCheckedOut(true);
    } catch (err) {
      setError(err.message);
    }
  };

  if (checkedOut) {
    return (
      <div className="cart">
        <p className="status">
          ✅ Checkout successful! Your cart has been cleared.
        </p>
        <p style={{ textAlign: "center" }}>
          <Link to="/orders">View your order history</Link>
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="cart">
        <p className="status">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {error && <p className="error">{error}</p>}
      {items.map((item) => (
        <div key={item.id} className="cart-item">
          <img
            src={item.image}
            alt={item.title}
            className="cart-image"
            onError={(e) => {
              e.target.src = PLACEHOLDER;
            }}
          />
          <div className="cart-details">
            <h4>{item.title}</h4>
            <p>${item.price} each</p>
            <div className="qty-controls">
              <button onClick={() => dispatch(decrementItem(item.id))}>
                −
              </button>
              <span>{item.count}</span>
              <button onClick={() => dispatch(incrementItem(item.id))}>
                +
              </button>
            </div>
            <p>Subtotal: ${(item.price * item.count).toFixed(2)}</p>
            <button
              className="btn remove"
              onClick={() => dispatch(removeFromCart(item.id))}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="cart-summary">
        <p>Total items: {totalCount}</p>
        <p>Total price: ${totalPrice.toFixed(2)}</p>
        <button className="btn checkout" onClick={handleCheckout}>
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
