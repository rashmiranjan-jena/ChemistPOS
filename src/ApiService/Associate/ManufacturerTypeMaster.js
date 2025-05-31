import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const getManufacturerTypes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/manufacturer-type/`);
    return response?.data;
  } catch (error) {
    console.error("Error fetching manufacturer types:", error);
    throw error?.response?.data || error;
  }
};

export const deleteManufacturerType = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/manufacturer-type/?id=${id}`
    );
    return response?.data;
  } catch (error) {
    console.error("Error deleting manufacturer type:", error);
    throw error?.response?.data || error;
  }
};

export const uploadManufacturerTypesExcel = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/upload-manufacturer-type/`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response?.data;
  } catch (error) {
    console.error("Error uploading Excel file:", error);
    throw error?.response?.data || error;
  }
};

export const downloadManufacturerTypesExcel = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/download-manufacturer-type/`,
      {
        responseType: "blob", // Important for handling binary data
      }
    );

    // Extract filename from Content-Disposition header or use a default
    let filename = "ManufacturerTypes.xlsx";
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

export const postManufacturerType = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/manufacturer-type/`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response?.data;
  } catch (error) {
    console.error("Error posting manufacturer type:", error);
    throw error?.response?.data || error;
  }
};

export const getManufacturerTypeById = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/manufacturer-type/?id=${id}`
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching manufacturer type by ID:", error);
    throw error?.response?.data || error;
  }
};

export const updateManufacturerType = async (id, formData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/manufacturer-type/?id=${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response?.data;
  } catch (error) {
    console.error("Error updating manufacturer type:", error);
    throw error?.response?.data || error;
  }
};
