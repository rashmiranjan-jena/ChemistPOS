import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const getTaxInput = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/purchase-gst-report/`);
    return response?.data;
  } catch (error) {
    console.error("Error fetching Tax input types:", error);
    throw error?.response?.data || error;
  }
};