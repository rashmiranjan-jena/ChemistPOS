
import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const getDiscounts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/customer-discounts/`);
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to fetch discounts"
    );
  }
};



export const deleteDiscount = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/discounts/${id}`);
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to delete discount"
    );
  }
};

export const uploadDiscountsExcel = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/discounts/upload-excel`,
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