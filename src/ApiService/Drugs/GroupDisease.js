import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const postGroupDisease = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/group-disease/`,
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
      error?.response?.data?.message ?? "Failed to submit group disease"
    );
  }
};

export const getGroupDiseases = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/group-disease/`);
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to fetch group diseases"
    );
  }
};

export const getGroupDiseaseById = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/group-disease/?group_disease_id=${id}`
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to fetch group disease"
    );
  }
};

export const updateGroupDisease = async (id, formData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/group-disease/?group_disease_id=${id}`,
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
      error?.response?.data?.message ?? "Failed to update group disease"
    );
  }
};

export const deleteGroupDisease = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/group-disease/?group_disease_id=${id}`
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to delete group disease"
    );
  }
};

export const uploadGroupDiseasesExcel = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/upload-group-disease/`,
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


export const downloadGroupDiseasesExcel = async () => {
  try {
    // The axios.get request
    const response = await axios.get(`${API_BASE_URL}/download-group-disease/`, {
      responseType: "blob", 
    });

    let filename = "Group_Diseases.xlsx";
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