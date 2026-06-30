import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const PLACEHOLDER = "https://via.placeholder.com/80?text=No+Image";

const fetchOrder = async (orderId) => {
  const snap = await getDoc(doc(db, "orders", orderId));
  if (!snap.exists()) throw new Error("Order not found");
  return { id: snap.id, ...snap.data() };
};

const OrderDetail = () => {
  const { orderId } = useParams();

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrder(orderId),
  });

  if (isLoading) return <p className="status">Loading order...</p>;
  if (isError) return <p className="status">Order not found.</p>;

  return (
    <div className="cart">
      <Link to="/orders">← Back to order history</Link>
      <h2>Order #{order.id.slice(0, 8)}</h2>
      <p>{order.createdAt?.toDate().toLocaleString()}</p>

      {order.items.map((item) => (
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
            <p>
              ${item.price} × {item.count}
            </p>
            <p>Subtotal: ${(item.price * item.count).toFixed(2)}</p>
          </div>
        </div>
      ))}

      <div className="cart-summary">
        <p>Total: ${order.totalPrice.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default OrderDetail;
