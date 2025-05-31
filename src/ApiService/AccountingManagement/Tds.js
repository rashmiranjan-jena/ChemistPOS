import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const postTds = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/tds-report/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to submit TDS");
  }
};

export const getTdsList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tds-report`);
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to fetch TDS records");
  }
};

export const getTdsById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tds-report/?id=${id}`);
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to fetch TDS record");
  }
};

export const updateTds = async (id, formData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/tds-report/?id=${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to update TDS");
  }
};

export const deleteTds = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/tds-report/?id=${id}`);
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to delete TDS");
  }
};

export const uploadTdsExcel = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/tds/upload-excel`,
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
      error?.response?.data?.message ?? "Failed to upload Excel file"
    );
  }
};

export const downloadTdsExcel = async (searchQuery = "") => {
  try {
    const response = await axios.get(`${API_BASE_URL}/download-excel-tds-report`, {
      params: { search: searchQuery }, 
      responseType: "blob",
    });

    // Extract filename from Content-Disposition header
    let filename = "TDS_Report.xlsx";
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

    return { success: true }; // Indicate successful download
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to download Excel file"
    );
  }
};