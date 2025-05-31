import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const postProductType = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/product-type/`,
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
      error?.response?.data?.message ?? "Failed to submit product type"
    );
  }
};

export const getProductTypes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/product-type/`);
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to fetch product types"
    );
  }
};

export const getProductTypeById = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/product-type/?product_type_id=${id}`
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to fetch product type"
    );
  }
};

export const updateProductType = async (id, formData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/product-type/?product_type_id=${id}`,
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
      error?.response?.data?.message ?? "Failed to update product type"
    );
  }
};

export const deleteProductType = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/product-type/?product_type_id=${id}`
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to delete product type"
    );
  }
};

export const uploadProductTypesExcel = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/upload-product-type/`,
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


export const downloadProductTypesExcel = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/download-product-type/`, {
      responseType: "blob", // Important for handling binary data
    });

    // Extract filename from Content-Disposition header or use a default
    let filename = "ProductTypes.xlsx";
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