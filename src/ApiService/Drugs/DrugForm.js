import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const postDrug = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/drug-form/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to submit drug");
  }
}; 

export const getDrugs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/drug-form/`);
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to fetch drugs");
  }
};

export const getDrugById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/drug-form/?drug_form_id=${id}`);
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to fetch drug");
  }
};

export const updateDrug = async (id, formData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/drug-form/?drug_form_id=${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to update drug");
  }
};

export const deleteDrug = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/drug-form/?drug_form_id=${id}`);
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to delete drug");
  }
};

export const uploadDrugsExcel = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/upload-drug-form/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to upload Excel file");
  }
};


export const downloadDrugsExcel = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/download-drug-form/`, {
      responseType: "blob", // Important for handling binary data
    });

    // Extract filename from Content-Disposition header or use a default
    let filename = "Drugs.xlsx";
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