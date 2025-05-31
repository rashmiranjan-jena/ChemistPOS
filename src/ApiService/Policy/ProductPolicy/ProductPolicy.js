import axios from "axios";
import Swal from "sweetalert2";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

// Create Policy
export const createPolicy = async (policyData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/policy-names/`, policyData);
    Swal.fire({
      icon: "success",
      title: "Policy Created",
      text: "The policy has been successfully created.",
    });
    return response.data;
  } catch (error) {
    console.error("Error creating policy:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Something went wrong while creating the policy.",
    });
    throw error;
  }
};

// Get Policies
export const getPolicy = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/policy-names/`);
    return response;
  } catch (error) {
    console.log("Error fetching policies:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Something went wrong while fetching the policies.",
    });
  }
};

// Update Policy Status
export const updatePolicyStatus = async (id, status) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/policy-names/?policyName_id=${id}`, {
      status: status,
    });
    Swal.fire({
      icon: "success",
      title: "Status Updated",
      text: `The policy status has been updated.`,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating policy status:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Something went wrong while updating the policy status.",
    });
    throw error;
  }
};


export const getPolicyById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/policy-names/?policyName_id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching policy by ID:", error);
    throw error;
  }
};

export const updatePolicy = async (id, payload) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/policy-names/?policyName_id=${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error updating policy:", error);
    throw error;
  }
};

export const deletePolicy = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/policy-names/?policyName_id=${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};