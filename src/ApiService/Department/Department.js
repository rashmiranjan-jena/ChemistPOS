import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api/departments/`;

// Get the department details

export const getDepartmentDetails = async () => {
  try {
    const response = await axios.get(`${BASE_URL}`,);
    return response;
  } catch (error) {
    const backendMessage = error?.response?.data?.message || error?.response?.data?.error;
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: backendMessage || "Something went wrong!",
    });
  }
};

// Add a new department

export const addDepartment = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}`, data);
    return response;
  } catch (error) {
    const backendMessage = error?.response?.data?.message || error?.response?.data?.error;
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: backendMessage || "Something went wrong!",
    });
  }
};

// Update a department

export const updateDepartment = async (id, data) => {
  try {
    const response = await axios.put(`${BASE_URL}?department_id=${id}`, data);
    return response;
  } catch (error) {
    const backendMessage = error?.response?.data?.message || error?.response?.data?.error;
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: backendMessage || "Something went wrong!",
    });
  }
};


// delete a department

export const deleteDepartment = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}?department_id=${id}`);
    return response;
  } catch (error) {
    const backendMessage = error?.response?.data?.message || error?.response?.data?.error;
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: backendMessage || "Something went wrong!",
    });
  }
};
