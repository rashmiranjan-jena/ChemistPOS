import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const getExpirationReport = async (params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/expired-drugs-report/`, {
      params,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch expiration records");
  }
};

export const downloadExpirationReportExcel = async (params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/expiration-report/export`, {
      params,
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Expiration_Report.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to download Excel file");
  }
};