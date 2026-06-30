import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const items = useSelector((state) => state.cart.items);
  const totalCount = items.reduce((sum, item) => sum + item.count, 0);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        FakeStore
      </Link>
      <div className="nav-links">
        <Link to="/cart" className="cart-link">
          Cart ({totalCount})
        </Link>
        {currentUser ? (
          <>
            <Link to="/orders">Orders</Link>
            <Link to="/profile">{currentUser.email}</Link>
            <button className="btn-link" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
