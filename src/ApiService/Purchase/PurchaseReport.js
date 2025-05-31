import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const getPurchaseRequestReport = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/purchase-requests/`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch purchase entries"
    );
  }
};