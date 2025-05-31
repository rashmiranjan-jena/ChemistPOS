import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const postDisease = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/diseases/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to submit disease");
  }
};

export const getDiseases = async (page = 1, pageSize = 10, diseaseName = "") => {
  try {
    const response = await axios.get(`${API_BASE_URL}/diseases/`, {
      params: {
        page,
        pageSize,
        search: diseaseName || undefined, 
      },
    });
    return {
      data: response?.data?.data ?? [],
      total_items: response?.data?.total_items ?? 0,
    };
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to fetch diseases");
  }
};

export const getDiseaseById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/diseases/?disease_id=${id}`);
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to fetch disease");
  }
};

export const updateDisease = async (id, formData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/diseases/?disease_id=${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to update disease");
  }
};

export const deleteDisease = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/diseases/?disease_id=${id}`);
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to delete disease");
  }
};

export const uploadDiseasesExcel = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/upload-disease/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to upload Excel file");
  }
};


export const downloadDiseasesExcel = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/download-disease/`, {
      responseType: "blob", // Important for handling binary data
    });

    // Extract filename from Content-Disposition header or use a default
    let filename = "Diseases.xlsx";
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