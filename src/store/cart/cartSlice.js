import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.loading = true;
      const newItem = action.payload;
      const existingItemIndex = state.cartItems.findIndex(
        (item) =>
          item.id === newItem.id &&
          item.batch_no === newItem.batch_no &&
          item.sale_type === newItem.sale_type
      );

      if (existingItemIndex !== -1) {
        // Update existing item
        state.cartItems[existingItemIndex] = {
          ...state.cartItems[existingItemIndex],
          quantity: newItem.quantity,
          discount: newItem.discount,
          total_price: newItem.total_price,
        };
      } else {
        // Add new item
        state.cartItems.push(newItem);
      }
      state.loading = false;
    },
    addToCartFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateCartItems: (state, action) => {
      state.cartItems = action.payload;
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) =>
          !(
            item.id === action.payload.id &&
            item.batch_no === action.payload.batch_no &&
            item.sale_type === action.payload.sale_type
          )
      );
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const {
  addToCart,
  addToCartFailure,
  updateCartItems,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
