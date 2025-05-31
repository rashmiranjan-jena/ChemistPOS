import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const getSummaryCart= async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard-stats/`);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to fetch Summary cart");
  }
};