import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

// Add Seller Type
export const postSeller = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/sellers/`, data, {
      headers: { "Content-Type": "multipart/form-data" }, 
    });
    return response?.data;
  } catch (error) {
    console.error("Error creating seller:", error);
    throw error?.response?.data ?? error;
  }
};


// Get Seller Type by ID
export const getSellerById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sellers/?seller_id=${id}`);
    return response?.data;
  } catch (error) {
    console.error(`Error fetching seller type with ID ${id}:`, error);
    throw error?.response?.data ?? error;
  }
};

// Update Seller Type
export const updateSeller = async (id, data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/sellers/?seller_id=${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response?.data;
  } catch (error) {
    console.error(`Error updating seller with ID ${id}:`, error);
    throw error?.response?.data ?? error;
  }
};



// Get All Seller Types
export const getSellers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sellers/`);
    return response?.data;
  } catch (error) {
    console.error("Error fetching seller types:", error);
    throw error?.response?.data ?? error;
  }
};

// Delete Seller Type
export const deleteSeller = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/sellers/?seller_id=${id}`);
    return response?.data;
  } catch (error) {
    console.error("Error deleting seller type:", error);
    throw error?.response?.data ?? error;
  }
};

// Upload Seller Types via Excel File
export const uploadSellersExcel = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/upload-seller/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response?.data;
  } catch (error) {
    console.error("Error uploading Excel file:", error);
    throw error?.response?.data ?? error;
  }
};

export const downloadSellersExcel = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/download-seller/`, {
      responseType: "blob", 
    });

    // Extract filename from Content-Disposition header or use a default
    let filename = "Sellers.xlsx";
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

