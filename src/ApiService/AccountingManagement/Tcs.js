import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const postTcs = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/tcs-report/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to submit TCS");
  }
};

export const getTcsList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tcs-report`);
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to fetch TCS records");
  }
};

export const getTcsById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tcs-report/?id=${id}`);
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to fetch TCS record");
  }
};

export const updateTcs = async (id, formData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/tcs-report/?id=${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to update TCS");
  }
};

export const deleteTcs = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/tcs-report/?id=${id}`);
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to delete TCS");
  }
};

export const uploadTcsExcel = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/tcs-report-upload/`,
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

export const downloadTcsExcel = async (searchQuery = "") => {
  try {
    const response = await axios.get(`${API_BASE_URL}/download-excel-tcs-report`, {
      params: { search: searchQuery }, // Optional: Pass search query for filtering
      responseType: "blob",
    });

    // Extract filename from Content-Disposition header
    let filename = "TCS_Report.xlsx";
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