import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;


export const getSalesReport = async (filters = {}, page = 1) => {
  try {
    // Construct query string from filters and page
    const query = new URLSearchParams({
      start_date: filters.startDate || "",
      end_date: filters.endDate || "",
      invoice_no: filters.invoiceNo || "",
      customer: filters.customer || "",
      page: page.toString(),
    }).toString();

    // Append query string to the URL
    const url = `${API_BASE_URL}/sales-handler/?${query}`;
    const response = await axios.get(url);
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to fetch sales report"
    );
  }
};