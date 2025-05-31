import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

// Fetch transactions data with pagination
export const fetchTransactions = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/transactions/`, {
      params: {
        page: 1,
        page_size: 10,
        ...params, // Spread params to include page, page_size, start_date, end_date
      },
    });
    return response.data || [];
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};
// Fetch receivables data (placeholder, adjust based on actual API)
export const fetchReceivables = async (page = 1, pageSize = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/receivables/`, {
      params: { page, page_size: pageSize },
    });
    return response?.data || [];
  } catch (error) {
    console.error("Error fetching receivables:", error);
    throw error;
  }
};

// Fetch payables data (placeholder, adjust based on actual API)
export const fetchPayables = async (page = 1, pageSize = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/payables/`, {
      params: { page, page_size: pageSize },
    });
    return response?.data || [];
  } catch (error) {
    console.error("Error fetching payables:", error);
    throw error;
  }
};
