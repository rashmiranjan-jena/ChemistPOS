import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;
console.log(BASE_URL);

// Post the data
export const postDeal = async (formData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/deals/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// get the data

export const fetchDeals = async () =>{
  try {
     const response = await axios.get(`${BASE_URL}/deals/`)
     return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// status update
export const updateDealStatus = async (dealId, status) => {
  try {
    const response = await axios.put(`${BASE_URL}/deals/?deal_id=${dealId}`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete the data

export const deleteDeal = async (dealId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/deals/?deal_id=${dealId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 

export const getDealByID = async (id) =>{
  try {
     const response = await axios.get(`${BASE_URL}/deals/?deal_id=${id}`)
     return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}


// export const editDealByID = async (id, formData) => {
//   try {
//     const response = await axios.put(
//       `${BASE_URL}/deals/?deal_id=${id}`,
//       formData,
//       {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     throw error.response ? error.response.data : new Error('An error occurred while updating the deal.');
//   }
// };

// export default editDealByID;



export const updateDeal = async (id, formData) => {
  try {
    const response = await axios.put(`${BASE_URL}/deals/?deal_id=${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating deal:", error);
    throw error;
  }
};

