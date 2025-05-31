import axios from "axios";

const API_BASE_URL =  `${import.meta.env.VITE_API_BASE_URL}api`

export const getAgent=async()=>{
  try {
    const response= await axios.get(`${API_BASE_URL}/agent_handler`)
    return  response.data;
  } catch (error) {
     throw error;
  }

}



export const getOrder=async()=>{
  try {
    const response= await axios.get(`${API_BASE_URL}/get-orders/`)
    return  response.data;
  } catch (error) {
     throw error;
  }

}

export const postOrder = async (selectedData) =>{
  try {
    const response= await axios.post(`${API_BASE_URL}/orders-assign/`,selectedData)
    return response;
  } catch (error) {
    console.log(error)
    throw error;
  }
}

