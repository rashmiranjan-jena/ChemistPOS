import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const postDrug = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/drug-master/`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to submit drug");
  }
};

export const getDrug = async (page = 1, pageSize = 10, drug_name="", type="" ) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/drug-master/`, {
      params: {
        page,  
        page_size: pageSize, 
        drug_name: drug_name,
        type: type,
      },
    });
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to fetch drugs");
  }
};

export const getDrugById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/drug-master/?id=${id}`);
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to fetch drug");
  }
};

export const updateDrug = async (id, formData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/drug-master/?id=${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to update drug");
  }
};

export const deleteDrug = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/drug-master/?id=${id}`
    );
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to delete drug");
  }
};


export const uploadExcellDrugs = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/products-data/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to upload Excel file"
    );
  }
};

export const downloadDrugsExcel = async (type = "", startDate = "", endDate = "") => {
  try {
    const params = {};
    if (type) params.type = type;
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const response = await axios.get(`${API_BASE_URL}/products-data/`, {
      params,
      responseType: "blob", 
    });

    // Extract filename from Content-Disposition header or use a default
    let filename = type ? `${type.charAt(0).toUpperCase() + type.slice(1)}Drugs.xlsx` : "Drugs.xlsx";
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

export const getManufacturers = async (
  page = 1,
  pageSize = 10,
  manufacturer_name = ""
) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/manufacturer/`, {
      params: {
        page,
        page_size: pageSize,
        search: manufacturer_name || undefined,
      },
    });
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to fetch manufacturers"
    );
  }
};

export const getGST = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/gst-master/`);
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to fetch GST/HSN codes"
    );
  }
};

export const postManufacturer = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/manufacturer/`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to submit manufacturer"
    );
  }
};

export const getManufacturerById = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/manufacturer/?manufacturer_id=${id}`
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to fetch manufacturer"
    );
  }
};

export const updateManufacturer = async (id, formData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/manufacturer/?manufacturer_id=${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to update manufacturer"
    );
  }
};

export const deleteManufacturer = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/manufacturer/?manufacturer_id=${id}`
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to delete manufacturer"
    );
  }
};

export const uploadManufacturersExcel = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/manufacturers/upload-manufacturer/`,
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


export const downloadManufacturersExcel = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/download-manufacturer/`, {
      responseType: "blob",
    });

    // Extract filename from Content-Disposition header or use a default
    let filename = "Manufacturers.xlsx";
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
// get drugs
export const getAllProducts = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/drug-master/`, {
      params: {
        category_id: id,
      },
    });
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to fetch drugs");
  }
};
// get pos drugs
export const getAllPosProducts = async (selectedCategory,page,search) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pos-drugs/`, {
      params: {
        category_id: selectedCategory,  
        page: page,
        drug_name: search,
      },
    });
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to fetch drugs");
  }
};
