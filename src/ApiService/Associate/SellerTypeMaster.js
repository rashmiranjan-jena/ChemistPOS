import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const postSellerType = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/seller-type/`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response?.data;
  } catch (error) {
    console.error("Error creating seller type:", error);
    throw error?.response?.data ?? error; 
  }
};

export const getSellerTypeById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/seller-type/?id=${id}`);
    return response?.data;
  } catch (error) {
    console.error(`Error fetching seller type with ID ${id}:`, error);
    throw error?.response?.data ?? error;
  }
};

export const updateSellerType = async (id, data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/seller-type/?id=${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response?.data;
  } catch (error) {
    console.error(`Error updating seller type with ID ${id}:`, error);
    throw error?.response?.data ?? error;
  }
};

export const getSellerTypes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/seller-type/`);
    return response?.data;
  } catch (error) {
    console.error("Error fetching seller types:", error);
    throw error?.response?.data ?? error;
  }
};

export const deleteSellerType = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/seller-type/?id=${id}`);
    return response?.data;
  } catch (error) {
    console.error("Error deleting seller type:", error);
    throw error?.response?.data ?? error;
  }
};

export const uploadSellerTypesExcel = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/upload-seller-type/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response?.data;
  } catch (error) {
    console.error("Error uploading Excel file:", error);
    throw error?.response?.data ?? error;
  }
};


export const downloadSellerTypesExcel = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/download-seller-type/`, {
      responseType: "blob", // Important for handling binary data
    });

    // Extract filename from Content-Disposition header or use a default
    let filename = "SellerTypes.xlsx";
    const contentDisposition = response.headers["content-disposition"];
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }

    // Create Blob URL and trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to download Excel file"
    );
  }
};