import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const getCustomerAllDeatils = async(id) =>{
   try {
      const response = axios.get(`${BASE_URL}/customer-dashboard/?customer_id=${id}`)
      return response;
   } catch (error) {
    throw error;
   }
}