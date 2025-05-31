import axios from "axios";

// Post the data
export const submitFormData = async (data) => {
  const apiUrl = `${import.meta.env.VITE_API_BASE_URL}api/varient-name/`; 
  try {
    const response = await axios.post(apiUrl, data);
    return response;
  } catch (error) {
    console.error("Error while posting data:", error);
    throw error;
  }
};

// Fetch the data (GET request)
 export const fetchVariantsData = async () => {
  const apiUrl = `${import.meta.env.VITE_API_BASE_URL}api/varient-name/`;
  try {
    const response = await axios.get(apiUrl);
    return response.data;  
  } catch (error) {
    console.error("Error fetching variant data:", error);
    throw error;
  }
};

// Delete the data 
export const deleteVariant = async (id) => {
  const apiUrl = `${import.meta.env.VITE_API_BASE_URL}api/varient-name/?varient_name_id=${id}`;
  try {
    const response = await axios.delete(apiUrl);
    return response;
  } catch (error) {
    console.error("Error while deleting data:", error);
    throw error;
  }
};

// status change function
export const updateVariantStatus = async (id, status) => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}api/varient-name/?varient_name_id=${id}`, { status });
    return response;
  } catch (error) {
    throw error;
  }
};
