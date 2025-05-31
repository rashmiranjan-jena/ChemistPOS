
import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const postGST = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/gst-master/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to post GST data");
  }
};


export const getGSTById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/gst-master/?gst_id=${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch GST data");
  }
};

export const getGSTList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/gst-master/`);
    return response?.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch GST list");
  }
};
export const updateGST = async (id, formData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/gst-master/?gst_id=${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update GST data");
  }
};



export const deleteGST = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/gst-master/?gst_id=${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete GST entry");
  }
};

export const uploadGSTExcel = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/gst/upload-excel/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to upload GST Excel file");
  }
};