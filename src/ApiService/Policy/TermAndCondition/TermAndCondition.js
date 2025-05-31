import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL; 

export const submitTermAndCondition = async (data) => {
  try {
    const response = await axios.post(
      `${BASE_URL}api/term-condition-policy/`, 
      data,
      {
        headers: {
          "Content-Type": "application/json",
        
        },
      }
    );
    return response; 
  } catch (error) {
    throw error;
  }
};