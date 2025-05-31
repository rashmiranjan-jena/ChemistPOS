import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const getReceivables = async (filters = {}) => {
  try {
    const query = new URLSearchParams({
      customer_name: filters.customer_name || "",
      invoice_no: filters.order_id || "", 
      due_date: filters.due_date || "",
      payment_status: filters.payment_status || "",
      page: filters.page || 1,
      page_size: filters.page_size || 10,
    }).toString();

    const url = `${API_BASE_URL}/credit-stats/${query ? `?${query}` : ""}`;
    const response = await axios.get(url);
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to fetch receivables"
    );
  }
};

export const getCustomerPaymentDetails = async (customer_id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/customer-due-amt/?id=${customer_id}`
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to fetch payment details"
    );
  }
};

export const submitPayment = async (paymentData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/clear-customer-bill/`,
      paymentData
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to submit payment"
    );
  }
};

export const exportReceivables = async (filters = {}) => {
  try {
    const query = new URLSearchParams({
      start_date: filters.start_date || "",
      end_date: filters.end_date || "",
    }).toString();

    const url = `${API_BASE_URL}/export-receivables/${
      query ? `?${query}` : ""
    }`;
    const response = await axios.get(url, { responseType: "blob" }); 
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to download Excel file"
    );
  }
};
