import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

// Fetch customer data with pagination and optional search
export const getCustomers = async (page = 1, pageSize = 10, searchTerm = "") => {
  try {
    const params = {
      page,
      page_size: pageSize,
    };
    if (searchTerm) params.search = searchTerm;

    const response = await axios.get(`${API_BASE_URL}/customer/`, { params });
    const data = response.data;
    if (!data || typeof data !== "object" || !Array.isArray(data.results)) {
      throw new Error(
        "Invalid response: Expected an object with a results array"
      );
    }
    return data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch customer data";
    throw new Error(message);
  }
};


export const getCustomerDetails = async (customerId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/customer/?customer_id=${customerId}`);
    const data = response.data;
    if (!data || typeof data !== "object") {
      throw new Error("Invalid response: Expected an object");
    }
    return data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch customer details";
    throw new Error(message);
  }
}