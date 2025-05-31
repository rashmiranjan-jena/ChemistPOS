import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const fetchInventory = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stock-inventories/`, {
      params: {
        page,    
        limit, 
      },
    });
    return response?.data;
  } catch (error) {
    console.error(
      "Error fetching inventory:",
      error?.response?.data?.message || error.message
    );
    throw error;
  }
};