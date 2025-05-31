import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Function to create a new job posting
export const createJob = async (jobData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}api/careers/`, jobData);
    return response.data;  
  } catch (error) {
    throw new Error("Failed to add job details: " + error.message);
  }
};

// Fetch all career listings
export const fetchCareerListings = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}api/careers/`);
    return response.data; 
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch career listings.");
  }
};

// Update career status
export const updateCareerStatus = async (id, status) => {
  try {
    await axios.put(`${API_BASE_URL}api/careers/?career_id=${id}`, { status });
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update career status.");
  }
};

// Delete a job posting by ID
export const deleteJob = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}api/careers/?career_id=${id}`);
    return response.data;  
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete job posting.");
  }
};


// get data by id
export const getJobById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}api/careers/?career_id=${id}`);
    return response; 
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch career listings.");
  }
};

// edit function
export const updateJob = async (id, jobData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}api/careers/?career_id=${id}`, jobData);
    return response; 
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update job details.");
  }
};
