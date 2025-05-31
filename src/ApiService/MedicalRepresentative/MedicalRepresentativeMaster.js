import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const postMedicalReport = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/medical-reports/`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to submit medical report"
    );
  }
};

export const getMedicalReportById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/medical-reports/${id}/`);
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to fetch medical report"
    );
  }
};

export const updateMedicalReport = async (id, formData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/medical-reports/${id}/`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to update medical report"
    );
  }
};

export const getMedicalReports = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/medical-reports/`);
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to fetch medical reports"
    );
  }
};

//function to delete a medical report
export const deleteMedicalReport = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/medical-reports/${id}/`
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to delete medical report"
    );
  }
};

//function to upload Excel file for medical reports
export const uploadMedicalReportsExcel = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/medical-reports/upload-excel/`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to upload Excel file"
    );
  }
};
