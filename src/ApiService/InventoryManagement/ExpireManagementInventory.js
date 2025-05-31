import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const ExpireManagementInventory = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/expired-drugs-report/` 
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


export const getExpireManagementInventory = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/return-alert/` 
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
