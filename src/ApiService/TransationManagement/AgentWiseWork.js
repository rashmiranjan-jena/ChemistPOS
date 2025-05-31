import axios from "axios";

const API_BASE_URL =  `${import.meta.env.VITE_API_BASE_URL}api`

export const getAgent=async()=>{
  try {
    const response=await axios.get(`${API_BASE_URL}/agent_handler/`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getAgentDetails = async (agentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders-assign/?agent_id=${agentId}`);

    return response.data;
  } catch (error) {
    console.error("Error fetching agent details:", error);
    throw error; 
  }
};



export const updateOrderStatus = async (updates) => {
  console.log(updates);
  try {
    const response = await axios.put(
      `${API_BASE_URL}/orders-assign/`, 
      { UpdateStatus: updates }, 
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false };
  }
};

