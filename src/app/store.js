import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

// Persist the cart to sessionStorage on every change
store.subscribe(() => {
  sessionStorage.setItem("cart", JSON.stringify(store.getState().cart.items));
});
