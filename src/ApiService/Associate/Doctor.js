import axios from "axios";


const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;
export const addDoctor = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/doctor_handler/`, data, {
      headers: { "Content-Type": "multipart/form-data" }, 
    });
    return response?.data;
  } catch (error) {
    console.error("Error creating doctor:", error);
    throw error?.response?.data ?? error;
  }
};

export const getDoctorById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/doctor_handler/?id=${id}`);
    return response?.data;
  } catch (error) {
    console.error("Error fetching doctor:", error);
    throw error?.response?.data ?? error;
  }
}

export const updateDoctor = async (id, data) => { 
  try {
    const response = await axios.put(`${API_BASE_URL}/doctor_handler/?id=${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" }, 
    });
    return response?.data;
  } catch (error) {
    console.error("Error updating doctor:", error);
    throw error?.response?.data ?? error;
  }
}

export const getDoctorList = async () => { 
  try {
    const response = await axios.get(`${API_BASE_URL}/doctor_handler/`);
    return response?.data;
  } catch (error) {
    console.error("Error fetching doctor list:", error);
    throw error?.response?.data ?? error;
  }
}
