import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const postGroupCategory = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/group-category/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response?.data;
  } catch (error) {
    if (error?.response) {
      throw new Error(
        error?.response?.data?.message ?? "Failed to submit Group Category"
      );
    } else if (error?.request) {
      throw new Error("Network error. Please check your connection.");
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
};

export const getGroupCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/group-category`);
    return response?.data;
  } catch (error) {
    if (error?.response) {
      throw new Error(
        error?.response?.data?.message ?? "Failed to fetch Group Categories"
      );
    } else if (error?.request) {
      throw new Error("Network error. Please check your connection.");
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
};

export const getGroupCategoryById = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/group-category/?group_category_id=${id}`
    );
    return response?.data;
  } catch (error) {
    if (error?.response) {
      throw new Error(
        error?.response?.data?.message ?? "Failed to fetch Group Category"
      );
    } else if (error?.request) {
      throw new Error("Network error. Please check your connection.");
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
};

export const updateGroupCategory = async (id, formData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/group-category/?group_category_id=${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response?.data;
  } catch (error) {
    if (error?.response) {
      throw new Error(
        error?.response?.data?.message ?? "Failed to update Group Category"
      );
    } else if (error?.request) {
      throw new Error("Network error. Please check your connection.");
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
};

export const deleteGroupCategory = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/group-category/?group_category_id=${id}`
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to delete group category"
    );
  }
};

export const uploadGroupCategoriesExcel = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/upload-group-catagory/`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to upload Excel file"
    );
  }
};


export const downloadGroupCategoriesExcel = async () => {
  try {
    // The axios.get request
    const response = await axios.get(`${API_BASE_URL}/download-group-catagory`, {
      responseType: "blob",
    });

    // Extract filename from Content-Disposition header or use a default
    let filename = "Group_Categories.xlsx";
    const contentDisposition = response.headers["content-disposition"];
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }
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