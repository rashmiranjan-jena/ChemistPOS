import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api/business-social-info/`;
// post the data to backend
export const submitSocialData = async (data) => {
  try {
    const requestBody = {
      social_details: data
    };

    const response = await axios.post(`${BASE_URL}`, requestBody);
    return response;
  } catch (error) {
    console.error("Error submitting social data:", error);
    throw error;
  }
};


// get the data from backend 
export const fetchSocial = async () => {
  try {
    const response = await axios.get(`${BASE_URL}`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching Social:", error);
    throw error;
  }
};

// update the status
export const updateSocialPageStatus = async (id, status) => {
  console.log("id--->",id)
  try {
    const response = await axios.put(`${BASE_URL}?business_social_id=${id}`, {
      status: status,
    });
    return response.data; 
  } catch (error) {
    console.error("Error updating social page status:", error);
    throw error; 
  }
};



export const deleteSocialPage = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}?business_social_id=${id}`);  
    return response; 
  } catch (error) {
    console.error('Error deleting social page:', error);
    throw error;  
  }
};


export const getSocialDataById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}?business_social_id=${id}`);
    return response; 
  } catch (error) {
    console.error("Error fetching Social:", error);
    throw error;
  }
};


export const updateSocialData = async (id, updatedData) => {
  console.log("updatedData--->",updatedData)
  try {
    const response = await axios.put(`${BASE_URL}?business_social_id=${id}`, updatedData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};
