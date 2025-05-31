import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const getPackagingUnits = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/packaging-units/`);
    return response?.data;
  } catch (error) {
    console.error("Error fetching packaging units:", error);
    throw error?.response?.data || error;
  }
};

export const deletePackagingUnit = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/packaging-units/${id}`);
    return response?.data;
  } catch (error) {
    console.error("Error deleting packaging unit:", error);
    throw error?.response?.data || error;
  }
};

export const uploadPackagingUnitsExcel = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/packaging-units/upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response?.data;
  } catch (error) {
    console.error("Error uploading packaging units Excel:", error);
    throw error?.response?.data || error;
  }
};

export const postPackagingUnit = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/packaging-units/`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response?.data;
  } catch (error) {
    console.error("Error posting packaging unit:", error);
    throw error?.response?.data || error;
  }
};

export const getPackagingUnitById = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/packaging-units/?id=${id}`
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching packaging unit by ID:", error);
    throw error?.response?.data || error;
  }
};

export const updatePackagingUnit = async (id, formData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/packaging-units/?id=${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response?.data;
  } catch (error) {
    console.error("Error updating packaging unit:", error);
    throw error?.response?.data || error;
  }
};