import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const postDocumentType = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/document-master/`,
      formData
    );
    return response?.data || null;
  } catch (error) {
    console.error(
      "Error in postDocumentType:",
      error?.response?.data || error.message
    );
    throw error?.response?.data || new Error("Failed to post document type");
  }
};

export const getDocumentTypeById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/document-master/?id=${id}`);
    return response?.data || null;
  } catch (error) {
    console.error(
      "Error in getDocumentTypeById:",
      error?.response?.data || error.message
    );
    throw error?.response?.data || new Error("Failed to fetch document type");
  }
};

export const updateDocumentType = async (id, formData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/document-master/?id=${id}`,
      formData
    );
    return response?.data || null;
  } catch (error) {
    console.error(
      "Error in updateDocumentType:",
      error?.response?.data || error.message
    );
    throw error?.response?.data || new Error("Failed to update document type");
  }
}; 


export const getAllDocumentTypes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/document-master/`);
    return response?.data || [];
  } catch (error) {
    console.error("Error in getAllDocumentTypes:", error?.response?.data || error.message);
    throw error?.response?.data || new Error("Failed to fetch document types");
  }
};

export const deleteDocumentType = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/document-master/?id=${id}`);
    return response?.data || null;
  } catch (error) {
    console.error("Error in deleteDocumentType:", error?.response?.data || error.message);
    throw error?.response?.data || new Error("Failed to delete document type");
  }
};