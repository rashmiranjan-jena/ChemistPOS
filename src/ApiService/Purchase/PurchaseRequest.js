import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const postPurchaseRequest = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/purchase-requests/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to save purchase request"
    );
  }
};


export const fetchPurchaseRequestNumber = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/latest-pr`);
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        "Failed to fetch purchase request number"
    );
  }
};

export const fetchEmployees = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/employee-handler/`);
    return Array.isArray(response?.data) ? response.data : [];
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch employees"
    );
  }
};

export const fetchSuppliers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/supplier/`);
    return Array.isArray(response?.data?.data) ? response.data.data : [];
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch suppliers"
    );
  }
};

export const fetchDrugsBySupplier = async (supplier_id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/supplier-drugs/?supplier_id=${supplier_id}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to fetch drugs");
  }
};





export const fetchLowStockDrugs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/low-stock/`);
    return Array.isArray(response?.data) ? response.data : [];
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch employees"
    );
  }
};


export const getPurchaseRequests = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/purchase-requests`);
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch purchase requests"
    );
  }
};

export const deletePurchaseRequest = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/purchase-requests/?id=${id}`);
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to delete purchase request"
    );
  }
};

export const adminLogin = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/admin-login/`, credentials, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {

    throw error.response?.data || { message: 'An error occurred during login' };
  }
};

export const sendPurchaseOrderEmail = async (formData) => {
  try {
    const adminAuth = JSON.parse(localStorage.getItem("adminAuth")) || {};
    const accessToken = adminAuth.access || "";

    const response = await axios.post(`${API_BASE_URL}/purchase-order/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error occurred while sending the email" };
  }
};


export const fetchPurchaseRequestById = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/purchase-requests/?id=${id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ??
        "Failed to fetch purchase request"
    );
  }
};

export const updatePurchaseRequest = async (id, formData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/purchase-requests/?id=${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ??
        "Failed to update purchase request"
    );
  }
};