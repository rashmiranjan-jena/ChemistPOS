import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const getSalesHandler = async (
  page = 1,
  pageSize = 10,
  filters = {}
) => {
  try {
    const params = new URLSearchParams({
      page,
      page_size: pageSize,
      ...(filters.customer_name && { customer_name: filters.customer_name }),
      ...(filters.bill_type && { bill_type: filters.bill_type }),
    });

    const response = await axios.get(
      `${API_BASE_URL}/sales-handler/?${params}`
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch sales handler data"
    );
  }
};

export const uploadPrescription = async (orderId, formData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/sales-handler/?order_id=${orderId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response?.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
