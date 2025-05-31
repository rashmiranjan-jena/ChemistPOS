import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const getlowStockInventory = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/low-stock-drugs/`);
    return response?.data;
  } catch (error) {
    console.error(
      "Error fetching inventory:",
      error?.response?.data?.message || error.message
    );
    throw error;
  }
};

export const downloadLowStockExcel = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/low-stock-drugs/?download=true`,
      {
        responseType: "blob",
      }
    );
    return response;
  } catch (error) {
    throw new Error("Failed to download Excel file: " + error.message);
  }
};
