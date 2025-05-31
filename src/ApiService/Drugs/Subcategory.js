import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const postSubCategory = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/subcategory/`,
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
      error?.response?.data?.message ?? "Failed to submit subcategory"
    );
  }
};

export const getSubCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/subcategory/`);
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to fetch subcategories"
    );
  }
};

export const getSubCategoryById = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/subcategory/?sub_category_id=${id}`
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to fetch subcategory"
    );
  }
};

export const updateSubCategory = async (id, formData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/subcategory/?sub_category_id=${id}`,
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
      error?.response?.data?.message ?? "Failed to update subcategory"
    );
  }
};

export const deleteSubCategory = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/subcategory/?sub_category_id=${id}`
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to delete subcategory"
    );
  }
};

export const uploadSubCategoriesExcel = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/upload-sub-category/`,
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


export const downloadSubCategoriesExcel = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/download-sub-category/`, {
      responseType: "blob", // Important for handling binary data
    });

    // Extract filename from Content-Disposition header or use a default
    let filename = "SubCategories.xlsx";
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