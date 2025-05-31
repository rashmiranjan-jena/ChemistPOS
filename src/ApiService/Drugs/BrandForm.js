import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const postBrand = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/brands/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", 
      },
    });
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to submit brand");
  }
};
 
export const getBrands = async (page = 1, pageSize = 10, brandName = "") => {
  try {
    const response = await axios.get(`${API_BASE_URL}/brands/`, {
      params: {
        page,
        pageSize,
        search: brandName || undefined, 
      },
    });
    return {
      data: response?.data?.data ?? [],
      total_items: response?.data?.total_items ?? 0,
    };
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to fetch brands");
  }
};

export const getBrandById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/brands/?brand_id=${id}`);
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to fetch brand");
  }
};

export const updateBrand = async (id, formData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/brands/?brand_id=${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to update brand");
  }
};

export const deleteBrand = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/brands/?brand_id=${id}`
    );
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to delete brand");
  }
};

export const uploadBrandsExcel = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/upload-brand/`,
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

export const downloadBrandsExcel = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/download-brand/`, {
      responseType: "blob", // Important for handling binary data
    });

    // Extract filename from Content-Disposition header or use a default
    let filename = "Brands.xlsx";
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
