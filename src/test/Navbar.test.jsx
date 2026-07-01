import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { describe, it, expect, vi } from "vitest";
import cartReducer from "../features/cart/cartSlice";
import Navbar from "../components/Navbar";
import { MockAuthProvider } from "./mocks/AuthContext";

vi.mock("../firebase", () => import("./mocks/firebase"));
vi.mock("../context/AuthContext", () => import("./mocks/AuthContext"));

const makeStore = (cartItems = []) =>
  configureStore({
    reducer: { cart: cartReducer },
    preloadedState: { cart: { items: cartItems } },
  });

const renderNavbar = (user = null, cartItems = []) => {
  return render(
    <Provider store={makeStore(cartItems)}>
      <MockAuthProvider user={user}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </MockAuthProvider>
    </Provider>,
  );
};

describe("Navbar", () => {
  it("renders the brand name", () => {
    renderNavbar();
    expect(screen.getByText("FakeStore")).toBeInTheDocument();
  });

  it("shows Login and Register when logged out", () => {
    renderNavbar(null);
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
  });

  it("shows cart count of 0 when cart is empty", () => {
    renderNavbar();
    expect(screen.getByText("Cart (0)")).toBeInTheDocument();
  });

  it("shows correct cart count when items are in cart", () => {
    const cartItems = [
      {
        id: "1",
        title: "Test",
        price: 10,
        count: 3,
        image: "",
        category: "",
        description: "",
        rating: { rate: 4, count: 10 },
      },
    ];
    renderNavbar(null, cartItems);
    expect(screen.getByText("Cart (3)")).toBeInTheDocument();
  });
});
