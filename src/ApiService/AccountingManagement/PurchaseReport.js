import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const getPurchaseReport = async (filters = {}, page = 1, pageSize = 10) => {
  try {
    const query = new URLSearchParams();
    if (filters.start_date) query.append('start_date', filters.start_date);
    if (filters.end_date) query.append('end_date', filters.end_date);
    if (filters.invoice_no) query.append('invoice_no', filters.invoice_no);
    if (filters.supplier_name) query.append('supplier_name', filters.supplier_name);
    query.append('page', page);
    query.append('page_size', pageSize);

    const response = await axios.get(`${API_BASE_URL}/invoice-report/?${query.toString()}`);
    return response?.data;
  } catch (error) {
    console.error("Error fetching Purchase Report:", error);
    throw error?.response?.data || error;
  }
};

export const downloadPurchaseReportExcel = async (filters = {}) => {
  try {
    const query = new URLSearchParams();
    if (filters.start_date) query.append('start_date', filters.start_date);
    if (filters.end_date) query.append('end_date', filters.end_date);
    if (filters.invoice_no) query.append('invoice_no', filters.invoice_no);
    if (filters.supplier_name) query.append('supplier_name', filters.supplier_name);

    const response = await axios.get(`${API_BASE_URL}/invoice-excel-download/`, {
      params: query,
      responseType: "blob",
    });

    // Extract filename from Content-Disposition header
    let filename = "Purchase_Report.xlsx";
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