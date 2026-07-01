//integration test

import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import cartReducer from "../features/cart/cartSlice";
import ProductCard from "../components/ProductCard";
import Cart from "../components/Cart";
import { MockAuthProvider } from "./mocks/AuthContext";

vi.mock("../firebase", () => import("./mocks/firebase"));
vi.mock("../context/AuthContext", () => import("./mocks/AuthContext"));
vi.mock("../api/orders", () => ({
  createOrder: vi.fn().mockResolvedValue(),
}));

const makeStore = () => configureStore({ reducer: { cart: cartReducer } });

const mockProduct = {
  id: "1",
  title: "Integration Product",
  price: 49.99,
  category: "electronics",
  description: "Integration test product",
  image: "https://via.placeholder.com/200",
  rating: { rate: 4, count: 50 },
};

describe("Cart Integration", () => {
  it("cart updates when a product is added via Add to Cart button", () => {
    const store = makeStore();

    const { rerender } = render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCard product={mockProduct} />
        </BrowserRouter>
      </Provider>,
    );

    // Cart should start empty
    expect(store.getState().cart.items).toHaveLength(0);

    // Click Add to Cart
    fireEvent.click(screen.getByText("Add to Cart"));

    // Cart should now have 1 item
    expect(store.getState().cart.items).toHaveLength(1);
    expect(store.getState().cart.items[0].title).toBe("Integration Product");
    expect(store.getState().cart.items[0].count).toBe(1);
  });

  it("cart item count increments when same product added twice", () => {
    const store = makeStore();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCard product={mockProduct} />
        </BrowserRouter>
      </Provider>,
    );

    const addButton = screen.getByText("Add to Cart");
    fireEvent.click(addButton);
    fireEvent.click(addButton);

    expect(store.getState().cart.items).toHaveLength(1);
    expect(store.getState().cart.items[0].count).toBe(2);
  });

  it("renders cart items correctly after adding a product", () => {
    const store = makeStore();

    // Pre-load cart with an item
    const { rerender } = render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCard product={mockProduct} />
        </BrowserRouter>
      </Provider>,
    );

    fireEvent.click(screen.getByText("Add to Cart"));

    // Now render the Cart component with the same store
    rerender(
      <Provider store={store}>
        <MockAuthProvider user={{ uid: "test123", email: "test@test.com" }}>
          <BrowserRouter>
            <Cart />
          </BrowserRouter>
        </MockAuthProvider>
      </Provider>,
    );

    expect(screen.getByText("Integration Product")).toBeInTheDocument();
    expect(screen.getByText("$49.99 each")).toBeInTheDocument();
  });
});
