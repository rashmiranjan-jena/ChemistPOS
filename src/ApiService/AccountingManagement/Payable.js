import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const getPayable = async (id = "") => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/invoice-summary/${id ? `?supplier_id=${id}` : ""}`
    );
    return response?.data;  
  } catch (error) {
    throw new Error(    
      error?.response?.data?.message ?? "Failed to fetch Payable records"
    );
  }
};

export const getSupplierTotalPaid = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/total-amount/?supplier_id=${id}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to supplier data"
    );
  }
};

export const postPayment = async (paymentData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/supplier-bills/`,
      paymentData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to post payment");
  }
};


export const postsupplierPayment = async (paymentData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/pay-supplier/`,
      paymentData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to post payment");
  }
};
