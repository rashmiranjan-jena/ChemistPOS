import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const getPurchaseEntries = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/purchase-receipt/`);
    return response?.data;
  } catch (error) {  
    throw new Error(
      error?.response?.data?.message || "Failed to fetch purchase entries" 
    );
  }
};


export const deletePurchaseEntry = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/purchase/?id=${id}`
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to delete purchase entry"
    );
  }
};

