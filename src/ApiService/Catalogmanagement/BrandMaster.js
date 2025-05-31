import axios from "axios";
import Swal from "sweetalert2";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api/brand-master/`;

export const registerBrand = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.status === 201) {
      Swal.fire({
        title: "Success!",
        text: "Brand has been registered successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: "Unexpected response from the server.",
        icon: "warning",
        confirmButtonText: "OK",
      });
    }

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error submitting form:", error);
    Swal.fire({
      title: "Error!",
      text: "Failed to register the brand. Please try again.",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
};


export const getBrand=async()=>{
   try {
     const response= await axios.get(`${API_BASE_URL}`);
     return response
   } catch (error) {
    Swal.fire({
      title: "Error!",
      text: "Failed to register the brand. Please try again.",
      icon: "error",
      confirmButtonText: "OK",
    });
    throw error;
   }
}



// export const getBrandDetails=async(id)=>{
//   try {
//     const response= await axios.get(`${API_BASE_URL}?brand_id=${id}`);
//     return response
//   } catch (error) {
//    Swal.fire({
//      title: "Error!",
//      text: "Failed to register the brand. Please try again.",
//      icon: "error",
//      confirmButtonText: "OK",
//    });
//    throw error;
//   }
// }

export const updateBrand = async (id, formData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}?brand_id=${id}`, formData);
    return response.data;
  } catch (error) {
    console.error("Error updating brand:", error);
    throw new Error("Failed to update brand");
  }
};
