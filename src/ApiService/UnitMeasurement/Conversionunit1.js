import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const createConversionUnit = async (conversionData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}api/measurement-to-measurement/`,
      conversionData,
      {
        headers: {
          "Content-Type": "application/json",

        }
      }
    );
    return response.data;
  } catch (error) {
    throw error; 
  }
};


export const getConversionUnit = async () =>{
  try {
     const response = await axios.get(`${API_BASE_URL}api/measurement-to-measurement/`);
     return response;
  } catch (error) {
    throw error;
  }
}

export const deleteConversionUnit = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}api/measurement-to-measurement/?conversion_id=${id}`);
    return response.data; 
  } catch (error) {
    console.error("Error deleting conversion unit:", error);
    throw error; 
  }
};


export const getConversionUnitById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}api/measurement-to-measurement/?conversion_id=${id}`); 
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateConversionUnit = async (id, data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}api/measurement-to-measurement/?conversion_id=${id}`, data); 
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const uploadConversionUnitsExcel = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API_BASE_URL}api/upload-excel/?model=measurement_to_measurement`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};