import axios from "axios";
import Swal from "sweetalert2";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

// Post the Bank Info
export const postBankInfo = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/business-bank-info/`, data);
    return response;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      "Failed to submit bank information. Please try again.";
    Swal.fire({
      title: "Error!",
      text: errorMessage,
      icon: "error",
      confirmButtonText: "OK",
    });
}
}

// Get Bank Info
export const getBankInfo = async () => {   
  try {
    const response = await axios.get(`${API_BASE_URL}/business-bank-info/`);
    return response;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      "Failed to fetch bank information. Please try again.";
    Swal.fire({
      title: "Error!",
      text: errorMessage,
      icon: "error",
      confirmButtonText: "OK",
    });

    throw error;
  }
};

export const updateStatus = async (id, status) => {
  const statusToSend = status === true ? true : false;

  try {
    const response = await axios.put(
      `${API_BASE_URL}/business-bank-info/?business_bank_id=${id}`,
      { status: statusToSend }
    );
    Swal.fire({
      title: "Success!",
      text: `Status updated successfully to ${statusToSend ? "Published" : "Unpublished"}.`,
      icon: "success",
      confirmButtonText: "OK",
    });

    return response;
  } catch (error) {
    // Show error message using SweetAlert
    Swal.fire({
      title: "Error!",
      text: "Failed to update the status. Please try again.",
      icon: "error",
      confirmButtonText: "OK",
    });
    console.error("Error updating status:", error);
    throw error;
  }
};

// delete bank info
export const deleteBankInfo = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/business-bank-info/?business_bank_id=${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting bank info:", error);
    Swal.fire({
      title: "Error!",
      text: "Failed to delete the Bankinfo. Please try again.",
      icon: "error",
      confirmButtonText: "OK",
    });
    throw error; 
  }
};

export const getBankInfoById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/business-bank-info/?business_bank_id=${id}`);
    return response;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      "Failed to fetch bank information. Please try again.";
    Swal.fire({
      title: "Error!",
      text: errorMessage,
      icon: "error",
      confirmButtonText: "OK",
    });

    throw error;
  }
};

// edit function

export const updateBankInfo = async (id, formData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/business-bank-info/?business_bank_id=${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("Error updating bank info:", error);
    throw error;
  }
};
