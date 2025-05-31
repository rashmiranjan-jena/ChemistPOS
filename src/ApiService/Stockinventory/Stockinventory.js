import axios from 'axios';
import Swal from 'sweetalert2';

export const getSupplierInventory = async (supplierId) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}api/supplier-inventory/?supplier_id=${supplierId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching supplier inventory:", error);
    if (error.response) {
      Swal.fire({
        icon: 'error',
        title: 'API Error',
        text: error.response.data?.message || 'An error occurred while fetching the supplier inventory.',
      });
    } else if (error.request) {
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'No response received from the server. Please check your network connection.',
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Unexpected Error',
        text: 'An unexpected error occurred.',
      });
    }
    throw error;
  }
};

// post the data

export const postStockInventoryData = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}api/stock-inventory/`,
      data
    );

    const message = response.data.message || 'Stock Data has been posted successfully.';

    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: message, 
    });

    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong while posting data.',
    });

    throw error;
  }
};


export const fetchStockData= async(id)=>{
   try {
    const response= await axios.get( `${import.meta.env.VITE_API_BASE_URL}api/stock-inventory/?supplier_id=${id}`)
    return response;
   } catch (error) {
     console.log(error)
     throw error;
   }
}