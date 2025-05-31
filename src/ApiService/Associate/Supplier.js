import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const postSupplier = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/supplier/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response?.data;
  } catch (error) {   
    throw new Error(
      error?.response?.data?.message ?? "Failed to submit supplier"
    );
  }
};

export const getSuppliers = async (page = 1, pageSize = 10, name = "") => {
  try {
    const response = await axios.get(`${API_BASE_URL}/supplier/`, {
      params: {
        page,
        pageSize,   
        search: name || undefined, 
      },
    });
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to fetch suppliers"
    );
  }
};

export const getSupplierById = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/supplier/?supplier_id=${id}`
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to fetch supplier"
    );
  }
};

export const updateSupplier = async (id, formData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/supplier/?supplier_id=${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to update supplier"
    );
  }
};

export const deleteSupplier = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/supplier/?supplier_id=${id}`
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to delete supplier"
    );
  }
};


export const uploadSuppliersExcel = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/upload-supplier/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to upload Excel file");
  }
};

export const downloadSuppliersExcel = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/download-supplier/`, {
      responseType: "blob", // Important for handling binary data
    });

    // Extract filename from Content-Disposition header or use a default
    let filename = "Suppliers.xlsx";
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