import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const getMeasurementUnits = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/conversion/`);
    return response?.data;
  } catch (error) {
    console.error("Error fetching measurement units:", error);
    throw error?.response?.data || error;
  }
};

export const getMeasurementUnitById = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/conversion/?id=${id}`
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching measurement unit by ID:", error);
    throw error?.response?.data || error;
  }
};

export const postMeasurementUnit = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/conversion/`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response?.data;
  } catch (error) {
    console.error("Error posting measurement unit:", error);
    throw error?.response?.data || error;
  }
};

export const updateMeasurementUnit = async (id, formData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/conversion/?id=${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response?.data;
  } catch (error) {
    console.error("Error updating measurement unit:", error);
    throw error?.response?.data || error;
  }
};

export const deleteMeasurementUnit = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/conversion/?id=${id}`);
    return response?.data;
  } catch (error) {
    console.error("Error deleting measurement unit:", error);
    throw error?.response?.data || error;
  }
};

export const uploadMeasurementUnitsExcel = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/conversion/upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response?.data;
  } catch (error) {
    console.error("Error uploading measurement units Excel:", error);
    throw error?.response?.data || error;
  }
};


export const getUnitTypes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/unit-types/`);
    return response?.data;
  } catch (error) {
    console.error("Error fetching unit types:", error);
    throw error?.response?.data || error;
  }
};

// Post a new unit type
export const postUnitType = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/unit-types/`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response?.data;
  } catch (error) {
    console.error("Error posting unit type:", error);
    throw error?.response?.data || error;
  }
};