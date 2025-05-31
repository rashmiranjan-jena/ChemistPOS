import axios from "axios";

const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/api`;

export const availabilityInventory = async (inventoryId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/inventory/${inventoryId}`
    );
    return response?.data;
  } catch (error) {
    console.error(
      "Error fetching inventory:",
      error?.response?.data?.message || error.message
    );
    throw error;
  }
};
