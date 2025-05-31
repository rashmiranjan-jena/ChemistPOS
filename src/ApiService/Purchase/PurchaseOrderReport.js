import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const downloadPurchaseOrderExcel = async (orderId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/purchase-orders/${orderId}/excel`, {
      responseType: "blob", 
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to download Excel file");
  }
};