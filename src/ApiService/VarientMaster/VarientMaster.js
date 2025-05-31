import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Function to fetch variant names
export const fetchVariantNames = async () => {
  try {
    const response = await axios.get(`${BASE_URL}api/varient-name/`);
    const data = response.data;
    const options = data.map((item) => ({
      varient_name_id: item.varient_name_id,
      display_name: item.display_name,
    }));
    return options;
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Failed to fetch variant names";
    console.error("Error fetching variant names:", error);
    Swal.fire("Error", errorMessage, "error");
  }
};

// Function to post variant data
export const postVariantData = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}api/varient-master/`, data);

    const message = response.data.message || "Variant Registered Successfully!";
    Swal.fire("Success", message, "success");
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Error while registering variant. Please try again later.";
    console.error("Error posting data:", error);
    Swal.fire("Error", errorMessage, "error");
  }
};

// Function to get variants data
export const fetchVariants = async () => {
  try {
    const response = await axios.get(`${BASE_URL}api/varient-master/`);
    return response.data; 
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Failed to fetch variants";
    console.error("Error fetching variants:", error);
    Swal.fire("Error", errorMessage, "error");
  }
};

// Delete VariantMaster
export const deleteVariant = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}api/varient-master/?varient_id=${id}`);
    
    if (response.data.message) {
      return response.data;
    } else {
      throw new Error(response.data.error || 'Error deleting variant');
    }
  } catch (error) {
    console.error('Error deleting variant:', error);
    throw new Error(error.response?.data?.error || 'Error deleting variant');
  }
};

// status update
export const updateVariantStatus = async (id, status) => {
  try {
    const response = await axios.put(`${BASE_URL}api/varient-master/?varient_id=${id}`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating variant status:", error);
    throw new Error(error.response?.data?.error || 'Failed to update variant status');
  }
};