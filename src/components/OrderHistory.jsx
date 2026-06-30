import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getUserOrders } from "../api/orders";
import { useAuth } from "../context/AuthContext";

const OrderHistory = () => {
  const { currentUser } = useAuth();

  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders", currentUser?.uid],
    queryFn: () => getUserOrders(currentUser.uid),
    enabled: Boolean(currentUser),
  });

  if (!currentUser)
    return <p className="status">Please log in to view your orders.</p>;
  if (isLoading) return <p className="status">Loading your orders...</p>;
  if (isError)
    return <p className="status">Something went wrong loading your orders.</p>;
  if (orders.length === 0)
    return <p className="status">You haven't placed any orders yet.</p>;

  return (
    <div className="cart">
      <h2>Order History</h2>
      {orders.map((order) => (
        <Link to={`/orders/${order.id}`} key={order.id} className="order-row">
          <div>
            <p>
              <strong>Order #{order.id.slice(0, 8)}</strong>
            </p>
            <p>{order.createdAt?.toDate().toLocaleString() || "Just now"}</p>
          </div>
          <p className="order-total">${order.totalPrice.toFixed(2)}</p>
        </Link>
      ))}
    </div>
  );
};

export default OrderHistory;
