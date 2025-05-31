import axios from "axios";
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;
// get next order Id
export const getNextOrderIds = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get-next-orderId/`);
    return response;
  } catch (error) {
    console.error("Error fetching order ID:", error);
    throw error;
  }
};

// get customerDetails
export const getCustomerDetails = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/customer/?mob_no=${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching customer details:", error);
    throw error;
  }
};

// hold order
export const holdOrder = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/hold-sales/`, data);
    return response;
  } catch (error) {
    console.error("Error holding order:", error);
    throw error;
  }
};
// retrive order
export const retrieveOrder = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/hold-sales/`);
    return response;
  } catch (error) {
    console.error("Error retrieving order:", error);
    throw error;
  }
};
// delete order
export const deleteOrder = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/hold-sales/?hold_id=${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};