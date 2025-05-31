import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const getAbha = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/abha-bill-report/`, {
      params: {
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      },
    });
    return response?.data ?? [];
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to fetch Abha details"
    );
  }
};


export const downloadBill = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/abha-bill-report/?download=bill`, {
      params: {
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      },
      responseType: "blob", // Handle binary data for file download
    });
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to download bill");
  }
};

export const downloadAbha = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/abha-bill-report/?download=abha`, {
      params: {
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      },
      responseType: "blob", // Handle binary data for file download
    });
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to download ABHA data");
  }
};