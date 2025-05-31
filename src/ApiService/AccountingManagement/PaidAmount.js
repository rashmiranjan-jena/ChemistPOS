import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const getPaidAmounts = async () => {
  try {
  
    const response = await axios.get(`${API_BASE_URL}/supplier-bills/`);
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to fetch Payable records");
  }
};