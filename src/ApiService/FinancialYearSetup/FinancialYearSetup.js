import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const postFinancialYearSetup = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/financial-year/`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response?.data;
  } catch (error) {
    console.error('Error posting financial year setup:', error);
    throw error.response?.data || { message: 'Failed to submit financial year setup' };
  }
};

export const getFinancialYearData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fy-summary/`);
    return response?.data;
  } catch (error) {
    console.error('Error fetching financial year data:', error);
    throw error.response?.data || { message: 'Failed to fetch financial year data' };
  }
};


export const getFinancialYearSetups = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/financial-year/`);
    return response?.data;
  } catch (error) {
    console.error('Error fetching financial year data:', error);
    throw error.response?.data || { message: 'Failed to fetch financial year data' };
  }
};