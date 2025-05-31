import axios from "axios";
import Swal from "sweetalert2";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

// Get the employee details

export const getEmployeeDetails = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/employee-handler/`);
    return response;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'There was an error fetching the employee details.';
    Swal.fire({
      title: "Error",
      text: errorMessage,
      icon: "error",
    });
  }
};


export const deleteEmployee = async (employeeId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/employee-handler/?emp_id=${employeeId}`);
    return response;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'There was an error deleting the employee.';
    Swal.fire({
      title: "Error",
      text: errorMessage,
      icon: "error",
    });
    throw error; // Re-throw to allow caller to handle
  }
};


export const addEmployee = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/employee-handler/`, data, {
      headers: { "Content-Type": "multipart/form-data" }, 
    });
    return response?.data;
  } catch (error) {
    console.error("Error creating employee:", error);
    throw error?.response?.data ?? error;
  }
};

export const getEmployeeById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/employee-handler/?emp_id=${id}`);
    return response?.data;
  } catch (error) {
    console.error("Error fetching employee:", error);
    throw error?.response?.data ?? error;
  }
}

export const updateEmployee = async (id, data) => { 
  try {
    const response = await axios.put(`${API_BASE_URL}/employee-handler/?emp_id=${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" }, 
    });
    return response?.data;
  } catch (error) {
    console.error("Error updating doctor:", error);
    throw error?.response?.data ?? error;
  }
}

export const addEmployeeCompanyDetails = async (data,id) => {    
  try {
    const response = await axios.put(`${API_BASE_URL}/employee-handler/?emp_id=${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" }, 
    });
    return response?.data;
  } catch (error) {
    console.error("Error creating employee:", error);
    throw error?.response?.data ?? error;
  }
}

export const getEmployeeCompanyDetailsById = async (id) => {  
  try {
    const response = await axios.get(`${API_BASE_URL}/employee-handler/?emp_id=${id}`);
    return response?.data;
  } catch (error) {
    console.error("Error fetching employee:", error);
    throw error?.response?.data ?? error;
  }
}   

export const updateEmployeeCompanyDetails = async (id, data) => { 
  try {
    const response = await axios.put(`${API_BASE_URL}/employee-handler/?emp_id=${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" }, 
    });
    return response?.data;
  } catch (error) {
    console.error("Error updating doctor:", error);
    throw error?.response?.data ?? error;
  }
}


// Get all departments
export const getDepartments = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/departments/`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'There was an error fetching departments.';
    Swal.fire({
      title: "Error",
      text: errorMessage,
      icon: "error",
    });
    return [];
  }
};

// Get all designations
export const getDesignations = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/designations/`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'There was an error fetching designations.';
    Swal.fire({
      title: "Error",
      text: errorMessage,
      icon: "error",
    });
    return [];
  }
};

// Get all stores
export const getStores = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/business-store-info/`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'There was an error fetching stores.';
    Swal.fire({
      title: "Error",
      text: errorMessage,
      icon: "error",
    });
    return [];
  }
};


// educational details

export const addEmployeeEducationDetails = async (data,id) => {    
  try {
    const response = await axios.put(`${API_BASE_URL}/employee-handler/?emp_id=${id}`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response?.data;
  } catch (error) {
    console.error("Error creating employee:", error);
    throw error?.response?.data ?? error;
  }
}

export const getEmployeeEducationDetailsById = async (id) => {  
  try {
    const response = await axios.get(`${API_BASE_URL}/employee-handler/?emp_id=${id}`);
    return response?.data;
  } catch (error) {
    console.error("Error fetching employee:", error);
    throw error?.response?.data ?? error;
  }
}   

export const updateEmployeeEducationDetails = async (id, data) => { 
  try {
    const response = await axios.put(`${API_BASE_URL}/employee-handler/?emp_id=${id}`, data, {
       headers: { 'Content-Type': 'application/json' },
    });
    return response?.data;
  } catch (error) {
    console.error("Error updating doctor:", error);
    throw error?.response?.data ?? error;
  }
}

// experience details

export const addEmployeeExperienceDetails = async (data,id) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/employee-handler/?emp_id=${id}`, data, {
       headers: { 'Content-Type': 'application/json' },
    });
    return response?.data;
  } catch (error) {
    console.error("Error creating employee:", error);
    throw error?.response?.data ?? error;
  }
}       

export const getEmployeeExperienceDetailsById = async (id) => {  
  try {
    const response = await axios.get(`${API_BASE_URL}/employee-handler/?emp_id=${id}`);
    return response?.data;
  } catch (error) {
    console.error("Error fetching employee:", error);
    throw error?.response?.data ?? error;
  }
}   

export const updateEmployeeExperienceDetails = async (id, data) => { 
  try {
    const response = await axios.put(`${API_BASE_URL}/employee-handler/?emp_id=${id}`, data, {
       headers: { 'Content-Type': 'application/json' },
    });
    return response?.data;
  } catch (error) {
    console.error("Error updating doctor:", error);
    throw error?.response?.data ?? error;
  }
}