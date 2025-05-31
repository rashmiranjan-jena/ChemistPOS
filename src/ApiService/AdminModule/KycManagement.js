
import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;


export const postKycDetails = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/kyc-master/`, formData);
    return response?.data || null;
  } catch (error) {
    console.error(
      "Error in postKycDetails:",
      error?.response?.data || error.message
    );
    throw error?.response?.data || new Error("Failed to post KYC details");
  }
};

export const getKycDetailsById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/kyc-master/?id=${id}`);
    return response?.data || null;
  } catch (error) {
    console.error(
      "Error in getKycDetailsById:",
      error?.response?.data || error.message
    );
    throw error?.response?.data || new Error("Failed to fetch KYC details");
  }
};

export const updateKycDetails = async (id, formData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/kyc-master/?id=${id}`, formData);
    return response?.data || null;
  } catch (error) {
    console.error(
      "Error in updateKycDetails:",
      error?.response?.data || error.message
    );
    throw error?.response?.data || new Error("Failed to update KYC details");
  }
};


export const getAllKycDetails = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/kyc-master/`);
    return response?.data || [];
  } catch (error) {
    console.error("Error in getAllKycDetails:", error?.response?.data || error.message);
    throw error?.response?.data || new Error("Failed to fetch KYC details");
  }
};

export const deleteKycDetails = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/kyc-master/?id=${id}`);
    return response?.data || null;
  } catch (error) {
    console.error("Error in deleteKycDetails:", error?.response?.data || error.message);
    throw error?.response?.data || new Error("Failed to delete KYC details");
  }
};