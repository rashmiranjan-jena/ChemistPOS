import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

// Fetch all sales reports
export const getSalesReports = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sales-reports/`);
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to fetch sales reports");
  }
};