import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const createConversionUnit = async (conversionData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}api/measurement-to-packaging/`,
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

export const getConversionUnit2 = async ()=>{
  try {
    const response = await axios.get(`${API_BASE_URL}api/measurement-to-packaging/`);
    return response;
  } catch (error) {
     throw error;
  }
}

export const deleteConversionUnit2 = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}api/measurement-to-packaging/?packagingConversion_id=${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getConversionUnit2ById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}api/measurement-to-packaging/?packagingConversion_id=${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateConversionUnit2 = async (id, unitData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}api/measurement-to-packaging/?packagingConversion_id=${id}`, unitData,
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

export const uploadConversionUnitsExcel2 = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}api/upload-excel/?model=measurement_to_packaging`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};