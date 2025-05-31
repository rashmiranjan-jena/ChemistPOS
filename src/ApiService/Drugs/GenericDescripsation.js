import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const postGenericDescription = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/generic-description/`,
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
      error?.response?.data?.message ?? "Failed to submit generic description"
    );
  }
};

export const getGenericDescriptions = async (page = 1, pageSize = 10, filterName = "") => {
  try {
    const response = await axios.get(`${API_BASE_URL}/generic-description/`, {
      params: {
        page,
        page_size: pageSize,
        search: filterName || undefined, 
      },
    });
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to fetch generic descriptions"
    );
  }
};


export const getGenericDescriptionById = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/generic-description/?generic_description_id=${id}`
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to fetch generic description"
    );
  }
};

export const updateGenericDescription = async (id, formData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/generic-description/?generic_description_id=${id}`,
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
      error?.response?.data?.message ?? "Failed to update generic description"
    );
  }
};

export const deleteGenericDescription = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/generic-description/?generic_description_id=${id}`
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to delete generic description"
    );
  }
};

export const uploadGenericDescriptionsExcel = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/upload-generic-description/`,
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


export const downloadGenericDescriptionsExcel = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/download-generic-description/`, {
      responseType: "blob", // Important for handling binary data
    });

    // Extract filename from Content-Disposition header or use a default
    let filename = "Generic_Descriptions.xlsx";
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
