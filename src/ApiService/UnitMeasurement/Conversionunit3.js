import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const postPackagingUnitConversion = async (payload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}api/packaging-to-packaging/`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error posting packaging unit conversion:", error);
    throw error;
  }
};

export const getPackagingUnitConversion = async() =>{
  try {
    const response = await axios.get(`${API_BASE_URL}api/packaging-to-packaging/`);
    return response;
  } catch (error) {
    throw error;
  }
}

export const deletePackagingUnitConversion = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}api/packaging-to-packaging/?packagingConversion_id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting packaging unit conversion:", error);
    throw error;
  }
};

export const uploadPackagingUnitsExcel3 = async (payload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}api/upload-excel/?model=packaging_to_packaging`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading packaging units excel:", error);
    throw error;
  }
};

export const getPackagingUnitConversionById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}api/packaging-to-packaging/?packagingConversion_id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching packaging unit conversion by ID:", error);
    throw error;
  }
};

export const updatePackagingUnitConversion = async (id, payload) => {
  try {
    const response = await axios.put(`${API_BASE_URL}api/packaging-to-packaging/?packagingConversion_id=${id}`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating packaging unit conversion:", error);
    throw error;
  }
};
