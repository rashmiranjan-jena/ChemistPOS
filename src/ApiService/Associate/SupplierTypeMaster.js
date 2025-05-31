import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const postSupplierType = async (data) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/supplier-type-master/`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response?.data;
  } catch (error) {
    console.error("Error creating supplier type:", error);
    throw error?.response?.data ?? error;
  }
};

export const getSupplierTypes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/supplier-type-master/`);
    return response?.data;
  } catch (error) {
    console.error("Error fetching supplier types:", error);
    throw error?.response?.data ?? error;
  }
};

export const getSupplierTypeById = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/supplier-type-master/?id=${id}`
    );
    return response?.data;
  } catch (error) {
    console.error(`Error fetching supplier type with ID ${id}:`, error);
    throw error?.response?.data ?? error;
  }
};

export const updateSupplierType = async (id, data) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/supplier-type-master/?id=${id}`,
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response?.data;
  } catch (error) {
    console.error(`Error updating supplier type with ID ${id}:`, error);
    throw error?.response?.data ?? error;
  }
};

export const deleteSupplierType = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/supplier-type-master/?id=${id}`
    );
    return response?.data;
  } catch (error) {
    console.error(`Error deleting supplier type with ID ${id}:`, error);
    throw error?.response?.data ?? error;
  }
};

export const uploadSupplierTypesExcel = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/supplier-type-master/upload-excel`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response?.data;
  } catch (error) {
    console.error("Error uploading Excel file:", error);
    throw error?.response?.data ?? error;
  }
};

export const downloadSupplierTypesExcel = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/download-supplier-type/`, {
      responseType: "blob", 
    });

    // Extract filename from Content-Disposition header or use a default
    let filename = "SupplierTypes.xlsx";
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

