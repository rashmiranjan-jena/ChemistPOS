import axios from "axios";
import Swal from "sweetalert2";
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const getPurchaseRecipt = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/purchase-order/`);
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch purchase entries"
    );
  }
};

// Delete a purchase entry by ID
export const deletePurchaseRecipt = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/purchase-order/?id=${id}`
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to delete purchase entry"
    );
  }
};

export const postPurchaseReceipt = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/purchase-receipt/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response?.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error ||
      "Failed to submit Purchase Receipt information. Please try again.";

    console.log(errorMessage, "errorMessage");
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: errorMessage,
    });

    throw error;
  }
};

export const fetchDrugDataByWithoutPOinEdit = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/purchase-receipt/?pr_id=${id}`
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch purchase entries"
    );
  }
};

// Function to fetch drug data based on PO number
export const fetchDrugDataByPoNo = async (poNo) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/po-details/?po_id=${poNo}`
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch purchase entries"
    );
  }
};

export const getPurchaseEntryDetails = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/purchase-receipt/?id=${id}`
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch purchase entries"
    );
  }
};

export const deleteModalPurchaseRecipt = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/purchase-receipt/?pr_ id=${id}`
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to delete purchase entry"
    );
  }
};

export const getPurchaseEntryDetailsForEdit = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/purchase-receipt/?pr_id=${id}`
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        "Failed to fetch purchase receipt details"
    );
  }
};

// Update purchase receipt by ID
export const updatePurchaseReceipt = async (id, formData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/purchase-receipt/?pr_id=${id}`,
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
      error?.response?.data?.message || "Failed to update purchase receipt"
    );
  }
};

export const updatePurchaseReceiptWithoutPO = async (id, formData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/purchase-receipt/?pr_id=${id}`,
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
      error?.response?.data?.message || "Failed to update purchase receipt"
    );
  }
};

// Without PO
export const getPurchaseReciptWithoutPO = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/purchase-wpo/`);
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch purchase entries"
    );
  }
};

export const deleteWithoutPOEntry = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/purchase-receipt/?pr_id=${id}`
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to delete Without PO entry"
    );
  }
};

export const uploadExcelFile = async (file, supplierId) => {
  try {
    const formData = new FormData();
    formData.append("file ", file);
    formData.append("supplier_id ", supplierId);

    const response = await axios.post(
      `${API_BASE_URL}/verify-drugs/`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading Excel file:", error);
  
    throw error;
  }
};
