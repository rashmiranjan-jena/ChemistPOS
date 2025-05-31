import { put, takeLatest, select } from "redux-saga/effects";
import { addToCart, addToCartFailure } from "../cart/cartSlice";

function* handleAddToCart(action) {
  console.log("handleAddToCart triggered with action:", action);
  try {
    const product = action.payload;
    console.log("Processing product:", product);

    // Check if the item already exists in the cart
    const state = yield select((state) => state.cart);
    const exists = state.cartItems.some(
      (item) =>
        item.id === product.id &&
        item.batch_no === product.batch_no &&
        item.sale_type === product.sale_type
    );

    if (exists) {
      console.log(`Updating item in cart: ${product.name}`, {
        quantity: product.quantity,
        discount: product.discount,
        total_price: product.total_price,
      });
    } else {
      console.log(`Adding new item to cart: ${product.name}`, {
        quantity: product.quantity,
        discount: product.discount,
        total_price: product.total_price,
      });
    }

    // Note: The addToCart action already updates the state in the reducer,
    // so no need to dispatch another action here unless you have additional side effects (e.g., API calls).

    // Example: If you need to make an API call
    // const response = yield call(api.addToCart, product);
    // If the API call succeeds, the state is already updated by the addToCart action.

    console.log("Cart action processed successfully");
  } catch (error) {
    console.error("Error in handleAddToCart:", error);
    yield put(addToCartFailure(error.message));
  }
}

export default function* cartSaga() {
  console.log("cartSaga started");
  yield takeLatest(addToCart.type, handleAddToCart);
}
