import { createSlice } from "@reduxjs/toolkit";

// Load any saved cart from sessionStorage so it survives refreshes
const savedCart = JSON.parse(sessionStorage.getItem("cart")) || [];

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: savedCart, // array of product objects, each with its own `count`
  },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existing = state.items.find((item) => item.id === product.id);
      if (existing) {
        existing.count += 1;
      } else {
        state.items.push({ ...product, count: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    incrementItem: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.count += 1;
    },
    decrementItem: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item && item.count > 1) item.count -= 1;
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementItem,
  decrementItem,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
