import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const getGoodsData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/gstr2-report/`);
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch invoices"
    );
  }
};``