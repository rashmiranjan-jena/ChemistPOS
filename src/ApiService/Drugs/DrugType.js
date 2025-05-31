import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const postDrugType = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/drug-type/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to submit drug type"
    );
  }
};

export const getDrugTypes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/drug-type/`);
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to fetch drug types"
    );
  }
};

export const getDrugTypeById = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/drug-type/?drug_type_id=${id}`
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to fetch drug type"
    );
  }
};

export const updateDrugType = async (id, formData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/drug-type/?drug_type_id=${id}`,
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
      error?.response?.data?.message ?? "Failed to update drug type"
    );
  }
};

export const deleteDrugType = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/drug-type/?drug_type_id=${id}`
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to delete drug type"
    );
  }
};

export const uploadDrugTypesExcel = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/upload-drug-type/`,
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


export const downloadDrugTypesExcel = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/download-drug-type/`, {
      responseType: "blob", 
    });

    // Extract filename from Content-Disposition header or use a default
    let filename = "DrugTypes.xlsx";
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
