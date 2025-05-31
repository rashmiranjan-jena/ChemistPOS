import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const getStockInventoryReport = async (params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stock-inventories/`, {
      params,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch stock inventory records");
  }
};

export const downloadStockInventoryReportExcel = async (params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stock-inventory-report/export`, {
      params,
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Stock_Inventory_Report.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to download Excel file");
  }
};