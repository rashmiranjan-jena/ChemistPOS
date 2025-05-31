import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const postStrength = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/strength/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to submit strength"
    );
  }
};

export const getStrengths = async (page = 1, pageSize = 10, filterName = "") => {
  try {
    const response = await axios.get(`${API_BASE_URL}/strength/`, {
      params: {
        page,
        page_size: pageSize,
        search: filterName || undefined, 
      },
    });
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to fetch strengths"
    );
  }
};

export const getStrengthById = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/strength/?strength_id=${id}`
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to fetch strength"
    );
  }
};

export const updateStrength = async (id, formData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/strength/?strength_id=${id}`,
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
      error?.response?.data?.message ?? "Failed to update strength"
    );
  }
};

export const deleteStrength = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/strength/?strength_id=${id}`
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to delete strength"
    );
  }
};

export const uploadStrengthsExcel = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/upload-strength/`,
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


export const downloadStrengthsExcel = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/download-strength/`, {
      responseType: "blob", // Important for handling binary data
    });

    // Extract filename from Content-Disposition header or use a default
    let filename = "Strengths.xlsx";
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