import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

// POST (Create) Threshold

export const createThreshold = async (data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/drug-threshold/`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to submit threshold"
    );
  }
};

export const updateThreshold = async (id, data) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/drug-threshold/?drug_id=${id}/`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to update threshold"
    );
  }
};

export const getThresholdById = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/drug-threshold/?drug_id=${id}`
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to fetch threshold"
    );
  }
};

export const getThresholds = async (
  page = 1,
  pageSize = 10,
  thresholdName = ""
) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/drug-threshold/`, {
      params: {
        page,
        pageSize,
        drug_name: thresholdName || undefined,
      },
    });
    return {
      data: response?.data?.results ?? [],
      total_items: response?.data?.count ?? 0,
    };
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to fetch thresholds"
    );
  }
};

export const deleteThreshold = async (id) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/drug-threshold/`, {
      drug_id: id,
        threshold: 0,
    });
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to delete threshold"
    );
  }
};

export const downloadThresholdsExcel = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/drug-threshold/?download=true`,
      {
        responseType: "blob",
      }
    );

    let filename = "Thresholds.xlsx";
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
