import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const postCategory = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/category/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to submit category");
  }
};

export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/category/`);
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to fetch categories");
  }
};

export const getCategoryById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/category/?category_id=${id}`);
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to fetch category");
  }
};

export const updateCategory = async (id, formData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/category/?category_id=${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to update category");
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/category/?category_id=${id}`);
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to delete category");
  }
};

export const uploadCategoriesExcel = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/upload-category/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to upload Excel file");
  }
};


export const downloadCategoriesExcel = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/download-category/`, {
      responseType: "blob", 
    });

    // Extract filename from Content-Disposition header or use a default
    let filename = "Categories.xlsx";
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