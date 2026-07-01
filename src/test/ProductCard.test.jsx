import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { describe, it, expect, vi } from "vitest";
import cartReducer from "../features/cart/cartSlice";
import ProductCard from "../components/ProductCard";

vi.mock("../firebase", () => import("./mocks/firebase"));

const mockProduct = {
  id: "1",
  title: "Test Product",
  price: 29.99,
  category: "electronics",
  description: "A test product description",
  image: "https://via.placeholder.com/200",
  rating: { rate: 4.5, count: 120 },
};

const makeStore = () => configureStore({ reducer: { cart: cartReducer } });

const renderProductCard = (props = {}) => {
  return render(
    <Provider store={makeStore()}>
      <ProductCard product={mockProduct} {...props} />
    </Provider>,
  );
};

describe("ProductCard", () => {
  it("renders product title", () => {
    renderProductCard();
    expect(screen.getByText("Test Product")).toBeInTheDocument();
  });

  it("renders product price", () => {
    renderProductCard();
    expect(screen.getByText("$29.99")).toBeInTheDocument();
  });

  it("renders product category", () => {
    renderProductCard();
    expect(screen.getByText("electronics")).toBeInTheDocument();
  });

  it("renders Add to Cart button", () => {
    renderProductCard();
    expect(screen.getByText("Add to Cart")).toBeInTheDocument();
  });

  it("renders Edit and Delete buttons when handlers are provided", () => {
    renderProductCard({ onEdit: vi.fn(), onDelete: vi.fn() });
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("does not render Edit/Delete when no handlers provided", () => {
    renderProductCard();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });
});
