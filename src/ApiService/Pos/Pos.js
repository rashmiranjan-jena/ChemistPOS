import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;

// get next orderId
export const getNextOrderId = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}api/get-next-orderId/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching next order ID:", error);
    Swal.fire("Error", "Failed to fetch next order ID", "error");
  }
};

// place order
export const placeOrder = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}api/sales-handler/`, formData,{
      headers:{
        "Content-Type":"multipart/form-data"
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error placing order:", error);
    Swal.fire("Error", error.response.data?.error || "Failed to place order", "error");
  }
};      

// get dayclose data
export const getDayCloseData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}api/day-close/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching day close data:", error);
    // Swal.fire("Error", "Failed to fetch day close data", "error");
  }
};

// submit Day close Data
export const submitDayClose = async(data)=>{
   try {
    const response = await axios.post(`${BASE_URL}api/day-close/`,data);
    return response.data;
  } catch (error) {
    console.error("Error fetching day close data:", error);
    Swal.fire("Error", "Failed to fetch day close data", "error");
  }
}