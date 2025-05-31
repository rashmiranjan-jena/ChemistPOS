import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const getSupplierWiseInventory = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/supplier-report/`
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


export const getSupplierWiseInventorybyId = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/supplier-report/?supplier_id=${id}`
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
