import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const getOrderHistory=async ()=>{
  try {
    const response= await axios.get(`${BASE_URL}/get-orders`);
    return response;
  } catch (error) {
    throw error;
  }
}

export const updateOrderStatus = async (orderId, itemID, status) => {
  console.log("orderId, itemID, status---->",orderId, itemID, status)
  try {
    const response = await axios.post(`${BASE_URL}/update-status/`, {
      order_id: orderId,
      item_code_id: itemID,
      status: status,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
