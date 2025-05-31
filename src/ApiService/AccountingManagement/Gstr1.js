import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const getTaxOutputs = async (page = 1, pageSize = 10, customerName = "", invoiceNo = "") => {
  try {
    const params = {
      page,
      page_size: pageSize,
    };
    if (customerName) params.customer_name = customerName;
    if (invoiceNo) params.gst_invoice_no = invoiceNo;

    const response = await axios.get(`${API_BASE_URL}/gstr1-report/`, { params });
    const data = response.data;
    if (!data || typeof data !== "object" || !Array.isArray(data.results)) {
      throw new Error("Invalid response: Expected an object with a results array");
    }
    return data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Failed to fetch tax output data";
    throw new Error(message);
  }
};

export const downloadTaxOutputPdf = async (month) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/gstr1-report/?month=${month}&download=pdf`, {
   
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "application/pdf" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `tax_output_${month}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Failed to download tax output PDF";
    throw new Error(message);
  }
};